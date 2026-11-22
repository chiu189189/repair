#!/usr/bin/env python3
"""每天把 Google 試算表的公開價目同步成網站備份檔（prices.csv、recycle.csv）。2026-11-19
由 GitHub Actions（.github/workflows/sync-prices.yml）每天跑；網頁會先秀這份備份，所以要跟試算表一致。
用法：python3 tools/sync_prices.py            下載並更新（有問題的那份不動、結束碼 1）
      python3 tools/sync_prices.py --check 檔案 種類   只檢查本機某份 CSV（測試用；種類 = prices 或 recycle）
安全檢查（不過就不覆蓋，網站維持舊備份）：
  1. 第一行欄位開頭跟現在的備份一樣（防 Google 回錯誤網頁；後面多欄可以）
  2. 筆數至少現在的 80%（防試算表被清空、只抓到一半）
  3. 維修價目的價格欄只能是整數（100～99999，2026-11-22 起公開完整價格）或不含數字的文字（檢測後報價 / 現場報價），防抓到亂掉的資料
"""
import csv, io, os, re, sys, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTGj8-fekjCYagdyOKo_9zq9WXo_cX-8iAeTjBWY9at2QyX4w_nfxDGUFlYPUyb36yHmqvnDuGQfCDN/pub?single=true&output=csv&gid="
SOURCES = {"prices": ("prices.csv", BASE + "1683786510"), "recycle": ("recycle.csv", BASE + "151823069")}


def problems(text, kind, old_text):
    """回傳問題清單；空的＝可以用"""
    out = []
    if text.lstrip().lower().startswith(("<!doctype", "<html")):
        return ["拿到的是網頁不是 CSV"]
    rows = list(csv.reader(io.StringIO(text)))
    old = list(csv.reader(io.StringIO(old_text))) if old_text else []
    if not rows:
        return ["內容是空的"]
    if old and rows[0][:len(old[0])] != old[0]:   # 試算表後面多欄（例：回收的「鎖定」）沒關係，網頁只讀前幾欄
        out.append(f"欄位不一樣：{rows[0][:5]}")
    if old and len(rows) < len(old) * 0.8:
        out.append(f"筆數 {len(rows) - 1} 比現在 {len(old) - 1} 少太多")
    if len(rows) < 3:
        out.append("筆數太少")
    if kind == "prices":
        def ok(p):
            p = p.strip()
            if re.fullmatch(r"\d+", p):
                return 100 <= int(p) <= 99999
            return p != "" and not re.search(r"\d", p)
        bad = [r[3] for r in rows[1:] if len(r) > 3 and not ok(r[3])]
        if bad:
            out.append(f"價格欄格式不對 {len(bad)} 筆（例：{bad[0]!r}），疑似資料亂掉")
    return out


def main():
    if sys.argv[1:2] == ["--check"]:
        path, kind = sys.argv[2], sys.argv[3]
        old = os.path.join(ROOT, SOURCES[kind][0])
        p = problems(open(path, encoding="utf-8").read(), kind, open(old, encoding="utf-8").read() if os.path.exists(old) else "")
        print("OK" if not p else "BAD " + "；".join(p))
        sys.exit(0 if not p else 1)
    fail = False
    for kind, (name, url) in SOURCES.items():
        path = os.path.join(ROOT, name)
        try:
            raw = urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "price-sync"}), timeout=60).read()
            text = raw.decode("utf-8")
        except Exception as e:
            print(f"❌ {name} 下載失敗：{e}"); fail = True; continue
        old = open(path, encoding="utf-8", newline="").read() if os.path.exists(path) else ""
        p = problems(text, kind, old)
        if p:
            print(f"❌ {name} 不更新：" + "；".join(p)); fail = True; continue
        if text == old:
            print(f"＝ {name} 沒變"); continue
        with open(path, "w", encoding="utf-8", newline="") as f:
            f.write(text)
        print(f"✅ {name} 已更新（{text.count(chr(10))} 行）")
    sys.exit(1 if fail else 0)


if __name__ == "__main__":
    main()
