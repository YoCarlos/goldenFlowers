/* ============================================================
   GOLDEN FLOWERS BOUTIQUE — Interacciones
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  highlightActiveLink();
  smoothAnchors();
  initCarousel();
  initSaveImage();
  initLoadMore();
});

/* --- Resalta el enlace activo del navbar --- */
function highlightActiveLink() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path) a.classList.add('active');
    if (path === 'coleccion.html' && href === 'catalogo.html') a.classList.add('active');
  });
}

/* --- Suaviza navegación con anchors internos --- */
function smoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length > 1 && document.querySelector(id)) {
        e.preventDefault();
        document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* --- Carrusel de la página de colección --- */
let carouselIndex = 0;
let carouselSlides = [];
let carouselThumbs = [];

function initCarousel() {
  const carousel = document.getElementById('carousel');
  if (!carousel) return;

  carouselSlides = carousel.querySelectorAll('.carousel-slide');
  carouselThumbs = carousel.querySelectorAll('.carousel-thumbs .thumb');
  const total = carouselSlides.length;
  const totalEl = document.getElementById('total');
  if (totalEl) totalEl.textContent = total;

  // Flechas
  carousel.querySelector('.carousel-arrow.prev').addEventListener('click', () => {
    showSlide((carouselIndex - 1 + total) % total);
  });
  carousel.querySelector('.carousel-arrow.next').addEventListener('click', () => {
    showSlide((carouselIndex + 1) % total);
  });

  // Miniaturas
  carouselThumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', () => showSlide(i));
  });

  // Sincroniza miniatura con imagen principal cuando cargan
  carouselThumbs.forEach((thumb, i) => {
    const tImg = thumb.querySelector('img');
    const sImg = carouselSlides[i] && carouselSlides[i].querySelector('img');
    if (tImg && sImg && !tImg.getAttribute('src') && sImg.getAttribute('src')) {
      tImg.src = sImg.src;
    }
  });

  // Soporte teclado
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') showSlide((carouselIndex - 1 + total) % total);
    if (e.key === 'ArrowRight') showSlide((carouselIndex + 1) % total);
  });
}

function showSlide(i) {
  if (!carouselSlides.length) return;
  carouselSlides.forEach(s => s.classList.remove('active'));
  carouselThumbs.forEach(t => t.classList.remove('active'));
  carouselSlides[i].classList.add('active');
  if (carouselThumbs[i]) carouselThumbs[i].classList.add('active');
  carouselIndex = i;
  const cur = document.getElementById('cur');
  if (cur) cur.textContent = i + 1;
}

/* --- Guardar imagen actual del carrusel para enviar al WhatsApp --- */
function initSaveImage() {
  const btn = document.getElementById('saveImage');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    const slide = carouselSlides[carouselIndex];
    if (!slide) return;
    const img = slide.querySelector('img');
    if (!img || !img.src) {
      showToast('Pronto añadiremos las imágenes ✿');
      return;
    }

    const fileName = (img.alt || 'golden-flowers')
      .replace(/[^a-z0-9]+/gi, '-')
      .toLowerCase() + '.jpg';

    try {
      // Intenta descargar via fetch (si la imagen lo permite via CORS)
      const res = await fetch(img.src, { mode: 'cors' });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      triggerDownload(url, fileName);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast('¡Imagen guardada! Envíala a nuestro WhatsApp ✿');
    } catch {
      // Fallback: descarga directa
      triggerDownload(img.src, fileName);
      showToast('¡Imagen guardada! Envíala a nuestro WhatsApp ✿');
    }
  });
}

function triggerDownload(href, fileName) {
  const a = document.createElement('a');
  a.href = href;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/* --- Toast notification --- */
function showToast(msg) {
  let toast = document.getElementById('gf-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'gf-toast';
    toast.style.cssText = `
      position: fixed; bottom: 30px; left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: #4a3b3b; color: white;
      padding: 14px 26px; border-radius: 30px;
      font-family: 'Poppins', sans-serif; font-size: 13px;
      letter-spacing: 0.5px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      z-index: 9999; opacity: 0;
      transition: all 0.4s ease;
      max-width: 90%; text-align: center;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(100px)';
  }, 3200);
}

/* --- "Cargar más" del catálogo (placeholder funcional) --- */
function initLoadMore() {
  const btn = document.querySelector('.load-more');
  if (!btn) return;
  btn.addEventListener('click', () => {
    btn.textContent = 'No hay más colecciones por mostrar';
    btn.disabled = true;
    btn.style.opacity = 0.6;
  });
}
