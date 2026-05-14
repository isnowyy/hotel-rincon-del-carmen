/**
 * components/hotel-navbar.js
 * Web Component: barra de navegación + modal de autenticación de usuario.
 * Hotel Rincón del Carmen
 */

import { Auth } from '../js/auth.js';

class HotelNavbar extends HTMLElement {
  connectedCallback() {
    const base = this._getBasePath();
    this.innerHTML = `
      <nav class="navbar" id="navbar" role="navigation" aria-label="Navegación principal">
        <div class="navbar__inner">
          <a class="navbar__brand" href="${base}index.html" id="navbar-brand">
            <span class="navbar__logo">🏨</span>
            <span class="navbar__name">Rincón del Carmen</span>
          </a>

          <button class="navbar__toggle" id="navbar-toggle" aria-label="Abrir menú" aria-expanded="false">
            <span class="toggle-bar"></span>
            <span class="toggle-bar"></span>
            <span class="toggle-bar"></span>
          </button>

          <ul class="navbar__links" id="navbar-links" role="list">
            <li><a class="navbar__link" href="${base}index.html"    id="nav-inicio">Inicio</a></li>
            <li><a class="navbar__link" href="${base}reservas.html" id="nav-reservas">Reservas</a></li>
            <li><a class="navbar__link" href="${base}contacto.html" id="nav-contacto">Contacto</a></li>
            <li><a class="navbar__link navbar__link--admin" href="${base}admin/index.html" id="nav-admin">Admin</a></li>
            <li class="navbar__auth-item" id="navbar-auth-item">
              <!-- Se rellena por _renderAuthBtn() -->
            </li>
          </ul>
        </div>
      </nav>

      <!-- Modal de autenticación -->
      <div class="auth-modal" id="auth-modal" role="dialog" aria-modal="true" aria-label="Acceso de usuario" hidden>
        <div class="auth-modal__backdrop" id="auth-backdrop"></div>
        <div class="auth-modal__box">
          <button class="auth-modal__close" id="auth-close" aria-label="Cerrar">&times;</button>

          <!-- Pestañas -->
          <div class="auth-tabs" role="tablist">
            <button class="auth-tab active" id="tab-login" role="tab" aria-selected="true" data-tab="login">Iniciar sesión</button>
            <button class="auth-tab" id="tab-register" role="tab" aria-selected="false" data-tab="register">Crear cuenta</button>
          </div>

          <!-- Panel: Login -->
          <div class="auth-panel" id="panel-login">
            <form id="form-login-user" novalidate>
              <div class="auth-field">
                <label for="login-email">Correo electrónico</label>
                <input type="email" id="login-email" placeholder="tu@correo.com" required />
              </div>
              <div class="auth-field">
                <label for="login-password">Contraseña</label>
                <input type="password" id="login-password" placeholder="••••••••" required />
              </div>
              <div class="auth-error" id="login-error" hidden></div>
              <button type="submit" class="auth-submit" id="btn-login-submit">Ingresar</button>
            </form>
          </div>

          <!-- Panel: Registro -->
          <div class="auth-panel" id="panel-register" hidden>
            <form id="form-register-user" novalidate>
              <div class="auth-field">
                <label for="reg-nombre">Nombre completo</label>
                <input type="text" id="reg-nombre" placeholder="Tu nombre" required />
              </div>
              <div class="auth-field">
                <label for="reg-email">Correo electrónico</label>
                <input type="email" id="reg-email" placeholder="tu@correo.com" required />
              </div>
              <div class="auth-field">
                <label for="reg-password">Contraseña</label>
                <input type="password" id="reg-password" placeholder="Mín. 6 caracteres" required />
              </div>
              <div class="auth-field">
                <label for="reg-password2">Confirmar contraseña</label>
                <input type="password" id="reg-password2" placeholder="Repite tu contraseña" required />
              </div>
              <div class="auth-error" id="register-error" hidden></div>
              <button type="submit" class="auth-submit" id="btn-register-submit">Crear cuenta</button>
            </form>
          </div>
        </div>
      </div>

      <style>
        /* ---- Navbar base ---- */
        .navbar {
          position: fixed; top: 0; left: 0; right: 0;
          z-index: 1000;
          height: var(--navbar-height, 72px);
          background: rgba(15,26,22,0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(200,145,74,0.15);
          transition: background 0.3s, box-shadow 0.3s;
        }
        .navbar.scrolled {
          background: rgba(15,26,22,0.98);
          box-shadow: 0 4px 24px rgba(0,0,0,0.4);
        }
        .navbar__inner {
          max-width: 1200px; margin: 0 auto;
          padding: 0 1.5rem; height: 100%;
          display: flex; align-items: center;
          justify-content: space-between; gap: 1rem;
        }
        .navbar__brand {
          display: flex; align-items: center; gap: 0.5rem;
          text-decoration: none; flex-shrink: 0;
        }
        .navbar__logo { font-size: 1.5rem; }
        .navbar__name {
          font-family: 'Playfair Display', serif;
          font-size: 1.15rem; color: #c8914a; white-space: nowrap;
        }
        .navbar__links {
          display: flex; align-items: center; gap: 0.25rem;
          list-style: none; margin: 0; padding: 0;
        }
        .navbar__link {
          display: block; padding: 0.5rem 1rem;
          color: #f0ebe3; text-decoration: none;
          font-size: 0.9rem; font-weight: 500;
          border-radius: 9999px;
          transition: color 0.2s, background 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .navbar__link:hover, .navbar__link.active {
          color: #c8914a; background: rgba(200,145,74,0.1);
        }
        .navbar__link--admin {
          border: 1px solid rgba(200,145,74,0.4); margin-left: 0.25rem;
        }
        .navbar__link--admin:hover {
          background: rgba(200,145,74,0.15); border-color: #c8914a;
        }

        /* ---- Botón de sesión ---- */
        .navbar__auth-item { margin-left: 0.5rem; }
        .btn-session {
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.45rem 1rem;
          background: linear-gradient(135deg, #c8914a, #a87035);
          color: #0f1a16; border: none; border-radius: 9999px;
          font-family: 'Inter', sans-serif; font-size: 0.85rem;
          font-weight: 600; cursor: pointer;
          transition: all 0.25s; white-space: nowrap;
        }
        .btn-session:hover {
          background: linear-gradient(135deg, #e8b87a, #c8914a);
          box-shadow: 0 0 16px rgba(200,145,74,0.35);
          transform: translateY(-1px);
        }
        .btn-session__avatar {
          width: 26px; height: 26px; border-radius: 50%;
          background: rgba(15,26,22,0.4);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.85rem; flex-shrink: 0;
        }
        /* Dropdown de usuario autenticado */
        .user-menu { position: relative; }
        .user-menu__dropdown {
          position: absolute; top: calc(100% + 10px); right: 0;
          background: #1a2c24;
          border: 1px solid rgba(200,145,74,0.25);
          border-radius: 12px; padding: 0.5rem;
          min-width: 180px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.5);
          opacity: 0; pointer-events: none;
          transform: translateY(-8px);
          transition: opacity 0.2s, transform 0.2s;
          z-index: 200;
        }
        .user-menu.open .user-menu__dropdown {
          opacity: 1; pointer-events: auto; transform: translateY(0);
        }
        .user-menu__name {
          padding: 0.5rem 0.75rem;
          font-size: 0.8rem; color: #9a9a8a;
          border-bottom: 1px solid rgba(200,145,74,0.1);
          margin-bottom: 0.25rem;
        }
        .user-menu__item {
          display: block; width: 100%; text-align: left;
          padding: 0.6rem 0.75rem;
          background: none; border: none;
          color: #f0ebe3; font-size: 0.875rem;
          font-family: 'Inter', sans-serif;
          border-radius: 8px; cursor: pointer;
          transition: background 0.15s, color 0.15s;
          text-decoration: none;
        }
        .user-menu__item:hover { background: rgba(200,145,74,0.1); color: #c8914a; }
        .user-menu__item--danger:hover { background: rgba(224,92,92,0.12); color: #e05c5c; }

        /* ---- Toggle hamburguesa ---- */
        .navbar__toggle {
          display: none; flex-direction: column; gap: 5px;
          background: none; border: none; cursor: pointer; padding: 0.5rem;
        }
        .toggle-bar {
          display: block; width: 22px; height: 2px;
          background: #f0ebe3; border-radius: 2px;
          transition: all 0.3s;
        }

        /* ---- Modal de autenticación ---- */
        .auth-modal {
          position: fixed; inset: 0; z-index: 2000;
          display: flex; align-items: center; justify-content: center;
        }
        .auth-modal[hidden] { display: none; }
        .auth-modal__backdrop {
          position: absolute; inset: 0;
          background: rgba(0,0,0,0.72);
          backdrop-filter: blur(4px);
        }
        .auth-modal__box {
          position: relative; z-index: 1;
          background: #1a2c24;
          border: 1px solid rgba(200,145,74,0.2);
          border-radius: 20px;
          padding: 2rem;
          width: 90%; max-width: 420px;
          box-shadow: 0 8px 48px rgba(0,0,0,0.6);
          animation: authSlideIn 0.3s ease both;
        }
        @keyframes authSlideIn {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .auth-modal__close {
          position: absolute; top: 0.6rem; right: 0.6rem;
          background: rgba(15,26,22,0.6); border: 1px solid rgba(200,145,74,0.15);
          color: #9a9a8a; font-size: 1.1rem; cursor: pointer;
          width: 28px; height: 28px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
          z-index: 10;
        }
        .auth-modal__close:hover { background: rgba(200,145,74,0.15); color: #c8914a; border-color: #c8914a; }

        /* Pestañas */
        .auth-tabs {
          display: flex; gap: 0; margin-bottom: 1.5rem;
          background: rgba(15,26,22,0.5);
          border-radius: 12px; padding: 4px;
        }
        .auth-tab {
          flex: 1; padding: 0.6rem 1rem;
          background: none; border: none;
          color: #9a9a8a; font-family: 'Inter', sans-serif;
          font-size: 0.9rem; font-weight: 500;
          border-radius: 9px; cursor: pointer;
          transition: all 0.2s;
        }
        .auth-tab.active {
          background: #c8914a; color: #0f1a16; font-weight: 600;
        }
        .auth-tab:not(.active):hover { color: #f0ebe3; }

        /* Campos */
        .auth-field { display: flex; flex-direction: column; gap: 4px; margin-bottom: 1rem; }
        .auth-field label {
          font-size: 0.75rem; font-weight: 500;
          color: #9a9a8a; text-transform: uppercase; letter-spacing: 0.05em;
          font-family: 'Inter', sans-serif;
        }
        .auth-field input {
          background: rgba(15,26,22,0.6);
          border: 1px solid rgba(200,145,74,0.2);
          border-radius: 10px; color: #f0ebe3;
          font-family: 'Inter', sans-serif; font-size: 0.95rem;
          padding: 0.65rem 0.9rem;
          transition: border-color 0.2s, box-shadow 0.2s; outline: none;
        }
        .auth-field input:focus {
          border-color: #c8914a;
          box-shadow: 0 0 0 3px rgba(200,145,74,0.15);
        }
        .auth-field input::placeholder { color: #9a9a8a; opacity: 0.6; }

        /* Error */
        .auth-error {
          font-size: 0.82rem; color: #e05c5c;
          background: rgba(224,92,92,0.1);
          border: 1px solid rgba(224,92,92,0.3);
          border-radius: 8px; padding: 0.6rem 0.8rem;
          margin-bottom: 0.75rem;
        }

        /* Botón submit */
        .auth-submit {
          width: 100%; padding: 0.75rem;
          background: linear-gradient(135deg, #c8914a, #a87035);
          color: #0f1a16; border: none; border-radius: 9999px;
          font-family: 'Inter', sans-serif; font-size: 0.95rem;
          font-weight: 600; cursor: pointer;
          transition: all 0.25s; margin-top: 0.25rem;
        }
        .auth-submit:hover {
          background: linear-gradient(135deg, #e8b87a, #c8914a);
          box-shadow: 0 0 20px rgba(200,145,74,0.3);
          transform: translateY(-1px);
        }

        /* Responsive */
        @media (max-width: 640px) {
          .navbar__toggle { display: flex; }
          .navbar__links {
            position: absolute; top: 72px; left: 0; right: 0;
            background: rgba(15,26,22,0.98);
            flex-direction: column; align-items: stretch; gap: 0;
            border-top: 1px solid rgba(200,145,74,0.15);
            border-bottom: 1px solid rgba(200,145,74,0.15);
            max-height: 0; overflow: hidden;
            transition: max-height 0.35s;
          }
          .navbar__links.open { max-height: 400px; }
          .navbar__link { padding: 1rem 1.5rem; border-radius: 0; }
          .navbar__link--admin { border: none; margin: 0; border-top: 1px solid rgba(200,145,74,0.1); }
          .navbar__auth-item { margin: 0; border-top: 1px solid rgba(200,145,74,0.1); }
          .navbar__auth-item .btn-session,
          .navbar__auth-item .user-menu { width: 100%; border-radius: 0; }
          .user-menu__dropdown { position: static; opacity: 1; pointer-events: auto; transform: none; box-shadow: none; border-radius: 0; border: none; background: rgba(15,26,22,0.5); }
        }
      </style>
    `;

    this._initScrollEffect();
    this._initToggle();
    this._markActive();
    this._renderAuthBtn();
    this._initModal();
  }

  /* ---- Helpers ---- */
  _getBasePath() {
    return window.location.pathname.includes('/admin/') ? '../' : '';
  }

  _initScrollEffect() {
    const navbar = this.querySelector('#navbar');
    const fn = () => navbar.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    fn();
  }

  _initToggle() {
    const btn   = this.querySelector('#navbar-toggle');
    const links = this.querySelector('#navbar-links');
    if (!btn || !links) return;
    btn.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
    });
  }

  _markActive() {
    const path = window.location.pathname;
    this.querySelectorAll('.navbar__link').forEach(link => {
      try {
        if (link.href && path.endsWith(new URL(link.href).pathname))
          link.classList.add('active');
      } catch (_) {}
    });
  }

  /* ---- Botón de sesión ---- */
  _renderAuthBtn() {
    const container = this.querySelector('#navbar-auth-item');
    if (!container) return;
    const sesion = Auth.getSession();

    if (sesion) {
      // Usuario autenticado → mostrar nombre + dropdown
      const initials = sesion.nombre.charAt(0).toUpperCase();
      container.innerHTML = `
        <div class="user-menu" id="user-menu">
          <button class="btn-session" id="btn-user-menu" aria-haspopup="true" aria-expanded="false">
            <span class="btn-session__avatar">${initials}</span>
            <span>${sesion.nombre.split(' ')[0]}</span>
            <span style="font-size:0.7rem;opacity:0.8">▾</span>
          </button>
          <div class="user-menu__dropdown" id="user-dropdown" role="menu">
            <p class="user-menu__name">👤 ${sesion.nombre}</p>
            <a class="user-menu__item" href="${this._getBasePath()}reservas.html" id="menu-mis-reservas" role="menuitem">📅 Mis reservas</a>
            <button class="user-menu__item user-menu__item--danger" id="btn-logout-navbar" role="menuitem">🚪 Cerrar sesión</button>
          </div>
        </div>`;

      const menu    = container.querySelector('#user-menu');
      const btnMenu = container.querySelector('#btn-user-menu');
      btnMenu.addEventListener('click', e => {
        e.stopPropagation();
        const open = menu.classList.toggle('open');
        btnMenu.setAttribute('aria-expanded', open);
      });
      document.addEventListener('click', () => menu.classList.remove('open'), { once: false });

      container.querySelector('#btn-logout-navbar').addEventListener('click', () => {
        Auth.logout();
      });
    } else {
      // Sin sesión → botón de login
      container.innerHTML = `
        <button class="btn-session" id="btn-open-auth" aria-haspopup="dialog">
          <span class="btn-session__avatar">👤</span>
          <span>Iniciar sesión</span>
        </button>`;
      container.querySelector('#btn-open-auth').addEventListener('click', () => this._openModal('login'));
    }
  }

  /* ---- Modal de autenticación ---- */
  _initModal() {
    const modal   = this.querySelector('#auth-modal');
    const close   = this.querySelector('#auth-close');
    const backdrop = this.querySelector('#auth-backdrop');

    close.addEventListener('click', () => this._closeModal());
    backdrop.addEventListener('click', () => this._closeModal());
    document.addEventListener('keydown', e => { if (e.key === 'Escape') this._closeModal(); });

    // Pestañas
    this.querySelectorAll('.auth-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.querySelectorAll('.auth-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        const name = tab.dataset.tab;
        this.querySelector('#panel-login').hidden    = (name !== 'login');
        this.querySelector('#panel-register').hidden = (name !== 'register');
      });
    });

    // Formulario Login
    this.querySelector('#form-login-user').addEventListener('submit', e => {
      e.preventDefault();
      const email    = this.querySelector('#login-email').value.trim();
      const password = this.querySelector('#login-password').value;
      const errEl    = this.querySelector('#login-error');
      const submitBtn = this.querySelector('#btn-login-submit');

      if (!email || !password) {
        errEl.textContent = 'Por favor completa todos los campos.'; errEl.hidden = false; return;
      }

      // Estado de carga
      submitBtn.textContent = 'Verificando...';
      submitBtn.disabled = true;

      setTimeout(() => {
        const result = Auth.login(email, password);

        if (!result.success) {
          errEl.textContent = result.error; errEl.hidden = false;
          submitBtn.textContent = 'Ingresar'; submitBtn.disabled = false;
          return;
        }
        if (result.user.rol === 'admin') {
          // Es admin → redirigir al panel directamente (la sesión ya está guardada)
          submitBtn.textContent = '✓ Redirigiendo al panel...';
          submitBtn.style.background = 'linear-gradient(135deg, #5b9bd5, #3a75b0)';
          errEl.hidden = true;
          setTimeout(() => {
            const base = this._getBasePath();
            window.location.href = base + 'admin/index.html';
          }, 700);
          return;
        }

        // Éxito: mostrar bienvenida y redirigir
        submitBtn.textContent = '✓ ¡Bienvenido!';
        submitBtn.style.background = 'linear-gradient(135deg, #4caf7d, #3a8f62)';
        errEl.hidden = true;

        setTimeout(() => {
          this._closeModal();
          const base = this._getBasePath();
          window.location.href = base + 'reservas.html';
        }, 900);
      }, 400);
    });

    // Formulario Registro
    this.querySelector('#form-register-user').addEventListener('submit', e => {
      e.preventDefault();
      const nombre    = this.querySelector('#reg-nombre').value.trim();
      const email     = this.querySelector('#reg-email').value.trim();
      const password  = this.querySelector('#reg-password').value;
      const password2 = this.querySelector('#reg-password2').value;
      const errEl     = this.querySelector('#register-error');
      const submitBtn = this.querySelector('#btn-register-submit');

      if (!nombre || !email || !password) {
        errEl.textContent = 'Por favor completa todos los campos.'; errEl.hidden = false; return;
      }
      if (password !== password2) {
        errEl.textContent = 'Las contraseñas no coinciden.'; errEl.hidden = false; return;
      }

      // Estado de carga
      submitBtn.textContent = 'Creando cuenta...';
      submitBtn.disabled = true;

      setTimeout(() => {
        const result = Auth.register({ nombre, email, password });

        if (!result.success) {
          errEl.textContent = result.error; errEl.hidden = false;
          submitBtn.textContent = 'Crear cuenta'; submitBtn.disabled = false;
          return;
        }

        // Éxito: mostrar confirmación y redirigir
        submitBtn.textContent = '✓ ¡Cuenta creada!';
        submitBtn.style.background = 'linear-gradient(135deg, #4caf7d, #3a8f62)';
        errEl.hidden = true;

        setTimeout(() => {
          this._closeModal();
          const base = this._getBasePath();
          window.location.href = base + 'reservas.html';
        }, 900);
      }, 400);
    });
  }

  _openModal(tab = 'login') {
    const modal = this.querySelector('#auth-modal');
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    // activar pestaña correcta
    this.querySelectorAll('.auth-tab').forEach(t => {
      const active = t.dataset.tab === tab;
      t.classList.toggle('active', active);
      t.setAttribute('aria-selected', active);
    });
    this.querySelector('#panel-login').hidden    = (tab !== 'login');
    this.querySelector('#panel-register').hidden = (tab !== 'register');
    // limpiar errores
    this.querySelectorAll('.auth-error').forEach(el => { el.hidden = true; el.textContent = ''; });
  }

  _closeModal() {
    const modal = this.querySelector('#auth-modal');
    if (modal) { modal.hidden = true; document.body.style.overflow = ''; }
  }
}

customElements.define('hotel-navbar', HotelNavbar);
