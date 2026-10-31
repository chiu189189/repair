// 全站共用頁尾：條款連結＋商號資料＋商標聲明。五個頁面都讀這支，改這裡就全部一起改。
const SITE = {
  SHOP: "CHIU189 手機維修中心",
  BIZ_NAME: "小邱通訊企業社",   // 商業登記名稱
  TAX_ID: "61065710",                   // 統一編號：填了才會顯示，例如 "12345678"
  EMAIL: "",                    // 公司 email：網域開通後填，例如 "service@chiu189.com.tw"；空白就不顯示
  ADDRESS: "台中市龍井區遠東街189號1樓",
  PHONE: "0905-584-846",
  V: 18,                        // 改版時加一，避免手機看到舊頁面
};
(function(){
  const el = document.getElementById("sitefoot");
  if(!el) return;
  const y = new Date().getFullYear();
  const biz = SITE.BIZ_NAME + (SITE.TAX_ID ? "（統一編號 " + SITE.TAX_ID + "）" : "");
  const v = "?v=" + SITE.V;
  el.innerHTML =
    '<div class="links">' +
      '<a href="about.html' + v + '">關於本店</a>' +
      '<a href="terms.html' + v + '">維修服務條款</a>' +
      '<a href="privacy.html' + v + '">隱私權政策</a>' +
    '</div>' +
    '<p>' + SITE.SHOP + '｜' + biz + '</p>' +
    '<p>' + SITE.ADDRESS + '｜電話 ' + SITE.PHONE + (SITE.EMAIL ? '｜' + SITE.EMAIL : '') + '</p>' +
    '<p>Apple、iPhone、iPad 是 Apple Inc. 在美國及其他國家的註冊商標；其他品牌名稱為各該公司所有。' +
    '本店為獨立維修店，並非 Apple 授權服務供應商，網站上提到的品牌與型號僅用來說明適用機型。</p>' +
    '<p>© ' + y + ' ' + SITE.BIZ_NAME + '</p>';
})();
