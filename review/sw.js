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
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
    for (var i = 0; i < list.length; i++) { if ('navigate' in list[i]) { return list[i].navigate(url).then(function (c) { return c && c.focus(); }); } }
    return self.clients.openWindow(url);
  }));
});
