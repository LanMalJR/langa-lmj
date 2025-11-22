// Cloudflare Web Analytics (Beacon)
(function () {
  var s = document.createElement('script');
  s.defer = true;
  s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  s.setAttribute('data-cf-beacon', JSON.stringify({ token: '6d48e372329e4f1a94a66953153556fa' }));
  document.head.appendChild(s);
})();
