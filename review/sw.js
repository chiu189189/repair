// CHIU189 秘書：審稿／排程通知（2026-11-05）
self.addEventListener('install', function (e) { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('push', function (e) {
  var d = {}; try { d = e.data.json(); } catch (x) { d = { title: 'CHIU189 秘書', body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || 'CHIU189 秘書', {
    body: d.body || '', icon: 'icon.png', badge: 'icon.png', tag: d.tag || ('chiu189-' + Date.now()), data: { url: d.url || './' } }));
});
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || './';
  // 2026-11-21：iPhone 主畫面版點通知常常只把審稿頁叫到前面、不換頁 → 先記下要開的網址，審稿頁一回到前面就自己跳過去
  var same = url.indexOf(self.location.origin) === 0;
  e.waitUntil((same ? caches.open('pending').then(function (c) {
    return c.put('pending-open', new Response(JSON.stringify({ url: url, t: Date.now() })));
  }).catch(function () {}) : Promise.resolve()).then(function () {
    return self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  }).then(function (list) {
    if (!list.length) return self.clients.openWindow(url);
    var w = list[0];
    if (same) { try { w.postMessage({ open: url }); } catch (x) {} }
    return w.focus().catch(function () {}).then(function () {
      if (same && 'navigate' in w) return w.navigate(url).catch(function () {});
    });
  }));
});
