// Destacar link ativo
document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar .nav-links a').forEach(link => {
    if (link.getAttribute('href') === page) {
      const strong = document.createElement('strong');
      strong.textContent = link.textContent;
      link.replaceWith(strong);
    }
  });

  // FastClick / envio de chat
  const sendBtn = document.getElementById('send-btn');
  if (sendBtn) {
    sendBtn.addEventListener('touchend', e => { e.preventDefault(); handleSend(); });
    sendBtn.addEventListener('click', handleSend);
  }

  // Fade-in (Intersection Observer)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // Lazy-loading
  document.querySelectorAll('img').forEach(img => img.loading = 'lazy');

  // Swipe para limpar chat
  const chatWindow = document.getElementById('chat-window');
  let xStart = null;
  if (chatWindow) {
    chatWindow.addEventListener('touchstart', e => xStart = e.touches[0].clientX);
    chatWindow.addEventListener('touchend', e => {
      if (xStart - e.changedTouches[0].clientX > 100) chatWindow.innerHTML = '';
      xStart = null;
    });
  }

  // Debounce resize
  function debounce(fn, wait) {
    let timeout;
    return (...args) => { clearTimeout(timeout); timeout = setTimeout(() => fn.apply(this, args), wait); };
  }
  window.addEventListener('resize', debounce(() => {}, 150));

  // Orientation change
  window.addEventListener('orientationchange', () => document.body.classList.toggle('landscape', window.matchMedia('(orientation: landscape)').matches));

  // Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
  }
});

// Função de envio de chat
function handleSend() {
  const input = document.getElementById('user-input');
  if (!input || !input.value.trim()) return;
  const p = document.createElement('p');
  p.textContent = input.value.trim();
  document.getElementById('chat-window').appendChild(p);
  input.value = '';
  if (navigator.vibrate) navigator.vibrate(50);
}