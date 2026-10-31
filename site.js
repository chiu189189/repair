// 全站共用頁尾：店名→商號→聯絡→條款連結→商標聲明→版權。五個頁面都讀這支，改這裡就全部一起改。
const SITE = {
  SHOP: "CHIU189 手機維修中心",
  BIZ_NAME: "小邱通訊企業社",   // 商業登記名稱
  TAX_ID: "61065710",           // 統一編號：填了才會顯示
  EMAIL: "",                    // 公司 email：網域開通後填，例如 "service@chiu189.com.tw"；空白就不顯示
  ADDRESS: "台中市龍井區遠東街189號1樓",
  PHONE: "0905-584-846",
  V: 20,                        // 改版時加一，避免手機看到舊頁面
};
(function(){
  const el = document.getElementById("sitefoot");
  if(!el) return;

  const css = `
  .sitefoot{margin-top:16px;padding:18px 16px 16px;border-radius:14px;background:var(--card);border:1px solid var(--line);
    font-size:13px;color:var(--muted);line-height:1.6}
  .sitefoot .sf-name{font-weight:700;font-size:15px;color:var(--accent)}
  .sitefoot .sf-line{margin:3px 0 0}
  .sitefoot .sf-line a{color:var(--ink);text-decoration:none}
  .sitefoot .sf-links{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0 0;padding:14px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
  .sitefoot.compact .sf-links{margin:0;padding:0 0 14px;border-top:0}
  .sitefoot .sf-links a{padding:6px 14px;border-radius:999px;border:1px solid var(--line);background:var(--bg);color:var(--ink);text-decoration:none;font-size:13px}
  .sitefoot .sf-tm{margin:12px 0 0;font-size:12px;line-height:1.7}
  .sitefoot .sf-copy{margin:8px 0 0;font-size:12px}`;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  const v = "?v=" + SITE.V;
  const tel = SITE.PHONE.replace(/[^\d+]/g, "");
  const biz = SITE.BIZ_NAME + (SITE.TAX_ID ? "・統一編號 " + SITE.TAX_ID : "");
  const links =
    '<nav class="sf-links">' +
      '<a href="about.html' + v + '">關於本店</a>' +
      '<a href="terms.html' + v + '">維修服務條款</a>' +
      '<a href="privacy.html' + v + '">隱私權政策</a>' +
    '</nav>';
  const tail =
    '<p class="sf-tm">Apple、iPhone、iPad 是 Apple Inc. 在美國及其他國家的註冊商標，其他品牌名稱為各該公司所有。' +
    '本店為獨立維修店，並非 Apple 授權服務供應商；網站上的品牌與型號僅用來說明適用機型。</p>' +
    '<p class="sf-copy">© ' + new Date().getFullYear() + ' ' + SITE.BIZ_NAME + '</p>';

  // 維修價目、舊機回收上面已經有地址電話卡片 → 這裡只放連結、商號、聲明，不重複
  if(document.getElementById("foot")){
    el.classList.add("compact");
    el.innerHTML = links + '<p class="sf-line" style="margin-top:12px">' + biz + '</p>' + tail;
    return;
  }
  el.innerHTML =
    '<div class="sf-name">' + SITE.SHOP + '</div>' +
    '<p class="sf-line">' + biz + '</p>' +
    '<p class="sf-line">' + SITE.ADDRESS + '</p>' +
    '<p class="sf-line">電話 <a href="tel:' + tel + '">' + SITE.PHONE + '</a>' +
      (SITE.EMAIL ? '｜<a href="mailto:' + SITE.EMAIL + '">' + SITE.EMAIL + '</a>' : '') + '</p>' +
    links + tail;
})();
