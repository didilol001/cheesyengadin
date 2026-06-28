/* Cheesy Engadin – Cookie / Consent Management
   Speichert die Wahl in localStorage. Externe Dienste (Google Maps,
   SnapWidget/Instagram) werden erst nach Zustimmung geladen. */
(function () {
  var KEY = 'ce_cookie_consent';

  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function loadEmbeds() {
    // iframes / Elemente mit data-consent-src aktivieren
    document.querySelectorAll('[data-consent-src]').forEach(function (el) {
      if (!el.getAttribute('src')) el.setAttribute('src', el.getAttribute('data-consent-src'));
      el.style.display = '';
    });
    // Platzhalter ausblenden
    document.querySelectorAll('.consent-placeholder').forEach(function (p) { p.style.display = 'none'; });
    // gesperrte Scripts (type="text/plain") nachladen
    document.querySelectorAll('script[type="text/plain"][data-consent-script]').forEach(function (s) {
      var ns = document.createElement('script');
      ns.src = s.getAttribute('data-consent-script');
      ns.async = true;
      s.parentNode.insertBefore(ns, s);
      s.removeAttribute('data-consent-script');
    });
  }

  function hide() { var b = document.getElementById('cookieBanner'); if (b) b.style.display = 'none'; }
  function show() { var b = document.getElementById('cookieBanner'); if (b) b.style.display = 'block'; }
  function accept() { set('all'); loadEmbeds(); hide(); }
  function reject() { set('necessary'); hide(); }

  document.addEventListener('DOMContentLoaded', function () {
    var c = get();
    if (c === 'all') { loadEmbeds(); hide(); }
    else if (c === 'necessary') { hide(); }
    else { show(); }

    var a = document.getElementById('cookieAccept'); if (a) a.addEventListener('click', accept);
    var r = document.getElementById('cookieReject'); if (r) r.addEventListener('click', reject);
    document.querySelectorAll('.consent-load-btn').forEach(function (b) { b.addEventListener('click', accept); });

    // "Cookie-Einstellungen" im Footer öffnet den Banner erneut
    document.querySelectorAll('[data-cookie-settings]').forEach(function (l) {
      l.addEventListener('click', function (e) {
        e.preventDefault();
        try { localStorage.removeItem(KEY); } catch (err) {}
        show();
      });
    });
  });
})();
