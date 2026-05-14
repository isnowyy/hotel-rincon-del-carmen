/**
 * components/hotel-components.js
 * Web Components: Footer, Carousel y Modal.
 * Hotel Rincón del Carmen
 */

// ============================================================
// HOTEL-FOOTER
// ============================================================
class HotelFooter extends HTMLElement {
  connectedCallback() {
    const base = window.location.pathname.includes('/admin/') ? '../' : '';
    this.innerHTML = `
      <footer class="footer" id="footer" role="contentinfo">
        <div class="footer__inner">
          <div class="footer__brand">
            <span class="footer__logo">🏨</span>
            <span class="footer__name">Rincón del Carmen</span>
            <p class="footer__tagline">Tu descanso perfecto nos espera.</p>
          </div>
          <nav class="footer__nav" aria-label="Navegación pie de página">
            <h3 class="footer__nav-title">Páginas</h3>
            <ul>
              <li><a href="${base}index.html"    id="footer-inicio">Inicio</a></li>
              <li><a href="${base}reservas.html" id="footer-reservas">Reservas</a></li>
              <li><a href="${base}contacto.html" id="footer-contacto">Contacto</a></li>
            </ul>
          </nav>
          <div class="footer__contact">
            <h3 class="footer__nav-title">Contacto</h3>
            <p>📍 Calle del Carmen #12-34</p>
            <p>📞 <a href="tel:+573001234567">+57 300 123 4567</a></p>
            <p>✉️ <a href="mailto:info@hotelrincondelcarmen.com">info@hotelrincondelcarmen.com</a></p>
          </div>
        </div>
        <div class="footer__bottom">
          <p>© ${new Date().getFullYear()} Hotel Rincón del Carmen. Todos los derechos reservados.</p>
        </div>
      </footer>
      <style>
        .footer {
          background: #0a1410;
          border-top: 1px solid rgba(200,145,74,0.15);
          margin-top: 4rem;
          font-family: 'Inter', system-ui, sans-serif;
        }
        .footer__inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 3rem 1.5rem;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 2rem;
        }
        .footer__logo { font-size: 2rem; display: block; margin-bottom: 0.5rem; }
        .footer__name {
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem;
          color: #c8914a;
          display: block;
          margin-bottom: 0.5rem;
        }
        .footer__tagline { color: #9a9a8a; font-size: 0.875rem; }
        .footer__nav-title {
          color: #c8914a;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 1rem;
          font-family: 'Inter', sans-serif;
        }
        .footer__nav ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; }
        .footer__nav a,
        .footer__contact a { color: #9a9a8a; text-decoration: none; font-size: 0.875rem; transition: color 0.2s; }
        .footer__nav a:hover,
        .footer__contact a:hover { color: #c8914a; }
        .footer__contact p { color: #9a9a8a; font-size: 0.875rem; margin-bottom: 0.5rem; }
        .footer__bottom {
          border-top: 1px solid rgba(200,145,74,0.1);
          text-align: center;
          padding: 1.25rem;
          font-size: 0.75rem;
          color: #6a6a5a;
        }
        @media (max-width: 640px) {
          .footer__inner { grid-template-columns: 1fr; }
        }
      </style>
    `;
  }
}
customElements.define('hotel-footer', HotelFooter);


// ============================================================
// HOTEL-CAROUSEL
// ============================================================
class HotelCarousel extends HTMLElement {
  connectedCallback() {
    const slides = [
      { img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80', titulo: 'Habitación Sencilla', desc: 'Confort y tranquilidad para el viajero solo.' },
      { img: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&q=80', titulo: 'Habitación Doble Deluxe', desc: 'Espacio y elegancia para dos.' },
      { img: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80', titulo: 'Suite Presidencial', desc: 'El lujo en su máxima expresión.' },
    ];

    this.innerHTML = `
      <div class="carousel" id="hotel-carousel" role="region" aria-label="Habitaciones destacadas">
        <div class="carousel__track" id="carousel-track">
          ${slides.map((s, i) => `
            <div class="carousel__slide" role="group" aria-label="Diapositiva ${i+1} de ${slides.length}">
              <img src="${s.img}" alt="${s.titulo}" class="carousel__img" loading="lazy" />
              <div class="carousel__caption">
                <h3 class="carousel__title">${s.titulo}</h3>
                <p class="carousel__desc">${s.desc}</p>
                <a href="reservas.html" class="btn btn--primary btn--sm" id="carousel-btn-${i}">Ver disponibilidad</a>
              </div>
            </div>`).join('')}
        </div>
        <button class="carousel__btn carousel__btn--prev" id="carousel-prev" aria-label="Anterior">&#8592;</button>
        <button class="carousel__btn carousel__btn--next" id="carousel-next" aria-label="Siguiente">&#8594;</button>
        <div class="carousel__dots" id="carousel-dots" role="tablist">
          ${slides.map((_, i) => `<button class="carousel__dot${i===0?' active':''}" role="tab" aria-label="Ir a diapositiva ${i+1}" data-index="${i}" id="dot-${i}"></button>`).join('')}
        </div>
      </div>
      <style>
        .carousel { position: relative; overflow: hidden; border-radius: 16px; }
        .carousel__track { display: flex; transition: transform 0.5s ease; }
        .carousel__slide { min-width: 100%; position: relative; }
        .carousel__img { width: 100%; height: 420px; object-fit: cover; display: block; }
        .carousel__caption {
          position: absolute; bottom: 0; left: 0; right: 0;
          background: linear-gradient(0deg, rgba(10,20,16,0.92) 0%, transparent 100%);
          padding: 2rem;
        }
        .carousel__title { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: #f0ebe3; margin-bottom: 0.5rem; }
        .carousel__desc  { color: #9a9a8a; font-size: 0.9rem; margin-bottom: 1rem; font-family: 'Inter', sans-serif; }
        .carousel__btn {
          position: absolute; top: 50%; transform: translateY(-50%);
          background: rgba(200,145,74,0.8); color: #fff;
          border: none; width: 44px; height: 44px; border-radius: 50%;
          font-size: 1.1rem; cursor: pointer;
          transition: background 0.2s;
          display: flex; align-items: center; justify-content: center;
        }
        .carousel__btn:hover { background: #c8914a; }
        .carousel__btn--prev { left: 1rem; }
        .carousel__btn--next { right: 1rem; }
        .carousel__dots { position: absolute; bottom: 1rem; right: 1rem; display: flex; gap: 6px; }
        .carousel__dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: rgba(255,255,255,0.4); border: none; cursor: pointer;
          transition: background 0.2s, transform 0.2s;
        }
        .carousel__dot.active { background: #c8914a; transform: scale(1.3); }
      </style>
    `;

    let current = 0;
    const track = this.querySelector('#carousel-track');
    const dots   = this.querySelectorAll('.carousel__dot');
    const total  = slides.length;

    const goTo = idx => {
      current = (idx + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    };

    this.querySelector('#carousel-prev').addEventListener('click', () => goTo(current - 1));
    this.querySelector('#carousel-next').addEventListener('click', () => goTo(current + 1));
    dots.forEach(dot => dot.addEventListener('click', () => goTo(Number(dot.dataset.index))));

    // Autoplay
    setInterval(() => goTo(current + 1), 4500);
  }
}
customElements.define('hotel-carousel', HotelCarousel);


// ============================================================
// HOTEL-MODAL
// ============================================================
class HotelModal extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="hmodal" id="hmodal" role="dialog" aria-modal="true" aria-hidden="true" style="display:none">
        <div class="hmodal__backdrop" id="hmodal-backdrop"></div>
        <div class="hmodal__box">
          <button class="hmodal__close" id="hmodal-close" aria-label="Cerrar">&times;</button>
          <div class="hmodal__content" id="hmodal-content"></div>
        </div>
      </div>
      <style>
        .hmodal {
          position: fixed; inset: 0; z-index: 2000;
          display: flex; align-items: center; justify-content: center;
        }
        .hmodal__backdrop {
          position: absolute; inset: 0;
          background: rgba(0,0,0,0.7); backdrop-filter: blur(4px);
        }
        .hmodal__box {
          position: relative; z-index: 1;
          background: #1a2c24;
          border: 1px solid rgba(200,145,74,0.25);
          border-radius: 16px;
          padding: 2rem;
          max-width: 500px; width: 90%;
          box-shadow: 0 8px 40px rgba(0,0,0,0.5);
          animation: fadeIn 0.3s ease both;
        }
        .hmodal__close {
          position: absolute; top: 1rem; right: 1rem;
          background: none; border: none;
          color: #9a9a8a; font-size: 1.5rem; cursor: pointer;
          transition: color 0.2s;
        }
        .hmodal__close:hover { color: #c8914a; }
      </style>
    `;

    this.querySelector('#hmodal-close').addEventListener('click', () => this.close());
    this.querySelector('#hmodal-backdrop').addEventListener('click', () => this.close());
  }

  /** Abre el modal con el HTML dado como contenido */
  open(htmlContent) {
    const modal = this.querySelector('#hmodal');
    const content = this.querySelector('#hmodal-content');
    content.innerHTML = htmlContent;
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  /** Cierra el modal */
  close() {
    const modal = this.querySelector('#hmodal');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}
customElements.define('hotel-modal', HotelModal);
