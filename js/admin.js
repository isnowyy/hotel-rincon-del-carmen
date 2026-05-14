/**
 * js/admin.js
 * Lógica del panel de administración.
 */

import { Storage } from './storage.js';
import { Auth } from './auth.js';

const fmt = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });
const fmtDate = iso => (iso ? iso.slice(0, 10) : '—');

const SECCIONES = ['sec-dashboard', 'sec-reservas', 'sec-habitaciones', 'sec-usuarios', 'sec-contactos'];

// ── Mostrar pantalla de login o panel ──────────────────────────
function mostrarLogin() {
  document.getElementById('admin-login-screen').style.display = 'flex';
  document.getElementById('admin-app').style.display          = 'none';
}

function mostrarPanel(usuario) {
  document.getElementById('admin-login-screen').style.display = 'none';
  document.getElementById('admin-app').style.display          = 'flex';

  const topUser  = document.getElementById('admin-username-top');
  const sideUser = document.getElementById('sidebar-user-info');
  if (topUser)  topUser.textContent  = '👤 ' + usuario.nombre;
  if (sideUser) sideUser.textContent = usuario.email;

  navegarA('sec-dashboard');
}

// ── Navegación por secciones ───────────────────────────────────
function navegarA(seccionId) {
  SECCIONES.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  const target = document.getElementById(seccionId);
  if (target) {
    target.style.display = 'block';
    target.style.animation = 'none';
    requestAnimationFrame(() => { target.style.animation = 'fadeInSection 0.3s ease both'; });
  }

  document.querySelectorAll('.sidebar-link').forEach(link =>
    link.classList.toggle('active', link.dataset.section === seccionId)
  );

  const activeLink = document.querySelector(`[data-section="${seccionId}"]`);
  const titleEl = document.getElementById('topbar-title');
  if (activeLink && titleEl)
    titleEl.textContent = activeLink.querySelector('span')?.textContent.trim() || 'Panel';

  const renders = {
    'sec-dashboard':    () => { actualizarStats(); renderDash(); },
    'sec-reservas':     renderReservas,
    'sec-habitaciones': renderHabitaciones,
    'sec-usuarios':     renderUsuarios,
    'sec-contactos':    renderContactos,
  };
  renders[seccionId]?.();
}

// ── Stats ──────────────────────────────────────────────────────
function actualizarStats() {
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('total-reservas',     Storage.get('reservas', []).length);
  set('total-habitaciones', Storage.get('habitaciones', []).length);
  set('total-usuarios',     Storage.get('usuarios', []).length);
  set('total-mensajes',     Storage.get('mensajes', []).length);
}

// ── Tablas ─────────────────────────────────────────────────────
function filaVacia(cols, msg) {
  return `<tr><td colspan="${cols}" class="table-empty">${msg}</td></tr>`;
}

function renderDash() {
  const tbody = document.getElementById('tbody-reservas-dash');
  if (!tbody) return;
  const reservas = Storage.get('reservas', []).slice().reverse().slice(0, 5);
  tbody.innerHTML = reservas.length
    ? reservas.map(r => `<tr>
        <td>${r.usuarioNombre}</td><td>${r.habitacionNombre}</td>
        <td>${r.fechaEntrada}</td><td>${r.fechaSalida}</td>
        <td><span class="badge badge--${r.estado === 'confirmada' ? 'success' : 'danger'}">${r.estado}</span></td>
      </tr>`).join('')
    : filaVacia(5, 'Sin reservas aún.');
}

function renderReservas() {
  const tbody = document.getElementById('tbody-reservas');
  if (!tbody) return;
  const reservas = Storage.get('reservas', []).slice().reverse();
  if (!reservas.length) { tbody.innerHTML = filaVacia(9, 'Sin reservas.'); return; }
  tbody.innerHTML = reservas.map(r => `
    <tr>
      <td class="id-cell" title="${r.id}">${r.id.slice(0,10)}…</td>
      <td>${r.usuarioNombre}<br/><small class="text-muted">${r.usuarioEmail}</small></td>
      <td>${r.habitacionNombre}</td><td>${r.fechaEntrada}</td><td>${r.fechaSalida}</td>
      <td>${r.noches}</td><td>${fmt.format(r.precioTotal)}</td>
      <td><span class="badge badge--${r.estado === 'confirmada' ? 'success' : 'danger'}">${r.estado}</span></td>
      <td>${r.estado === 'confirmada'
        ? `<button class="btn btn--danger btn--sm" data-cancelar="${r.id}">Cancelar</button>` : '—'}</td>
    </tr>`).join('');

  tbody.querySelectorAll('[data-cancelar]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('¿Cancelar esta reserva?')) {
        Storage.updateById('reservas', btn.dataset.cancelar, { estado: 'cancelada' });
        renderReservas(); actualizarStats();
      }
    });
  });
}

function renderHabitaciones() {
  const tbody = document.getElementById('tbody-habitaciones');
  if (!tbody) return;
  const habs = Storage.get('habitaciones', []);
  tbody.innerHTML = habs.length
    ? habs.map(h => `<tr>
        <td>${h.nombre}</td>
        <td><span class="badge badge--info">${h.tipo}</span></td>
        <td>${h.capacidad} persona(s)</td>
        <td>${fmt.format(h.precio)}</td>
        <td><span class="badge badge--${h.disponible ? 'success' : 'danger'}">${h.disponible ? 'Disponible' : 'No disponible'}</span></td>
      </tr>`).join('')
    : filaVacia(5, 'Sin habitaciones.');
}

function renderUsuarios() {
  const tbody = document.getElementById('tbody-usuarios');
  if (!tbody) return;
  const usuarios = Storage.get('usuarios', []);
  tbody.innerHTML = usuarios.length
    ? usuarios.map(u => `<tr>
        <td>${u.nombre}</td><td>${u.email}</td>
        <td><span class="badge badge--${u.rol === 'admin' ? 'warning' : 'info'}">${u.rol}</span></td>
        <td>${fmtDate(u.createdAt)}</td>
      </tr>`).join('')
    : filaVacia(4, 'Sin usuarios.');
}

function renderContactos() {
  const tbody = document.getElementById('tbody-contactos');
  if (!tbody) return;
  const mensajes = Storage.get('mensajes', []).slice().reverse();
  tbody.innerHTML = mensajes.length
    ? mensajes.map(m => `<tr>
        <td>${m.nombre}</td><td>${m.email}</td><td>${m.asunto}</td>
        <td>${fmtDate(m.creadoEn)}</td>
        <td><span class="badge badge--${m.estado === 'nuevo' ? 'info' : 'success'}">${m.estado}</span></td>
      </tr>`).join('')
    : filaVacia(5, 'Sin mensajes.');
}

// ── Inicialización ─────────────────────────────────────────────
function initAdmin() {
  // Estado inicial: ocultar ambas vistas con style.display
  document.getElementById('admin-login-screen').style.display = 'flex';
  document.getElementById('admin-app').style.display          = 'none';

  // Si ya hay sesión de admin → ir directo al panel
  if (Auth.isAdmin()) {
    mostrarPanel(Auth.getSession());
    return;
  }

  // Formulario de login
  const form = document.getElementById('form-login-admin');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const email    = document.getElementById('admin-email').value.trim();
    const password = document.getElementById('admin-password').value;
    const errorEl  = document.getElementById('login-error');
    const btnLogin = document.getElementById('btn-login-admin');

    errorEl.hidden = true;
    btnLogin.textContent = 'Verificando...';
    btnLogin.disabled = true;

    try {
      const result = Auth.login(email, password);

      if (!result.success) {
        errorEl.textContent = result.error;
        errorEl.hidden = false;
        btnLogin.textContent = 'Ingresar al panel';
        btnLogin.disabled = false;
        return;
      }
      if (result.user.rol !== 'admin') {
        Auth.logout();
        errorEl.textContent = 'Esta cuenta no tiene privilegios de administrador.';
        errorEl.hidden = false;
        btnLogin.textContent = 'Ingresar al panel';
        btnLogin.disabled = false;
        return;
      }

      btnLogin.textContent = '✓ Acceso concedido';
      btnLogin.style.background = 'linear-gradient(135deg, #4caf7d, #3a8f62)';
      setTimeout(() => mostrarPanel(result.user), 600);

    } catch (err) {
      errorEl.textContent = 'Error inesperado: ' + err.message;
      errorEl.hidden = false;
      btnLogin.textContent = 'Ingresar al panel';
      btnLogin.disabled = false;
    }
  });

  // Cerrar sesión
  document.getElementById('btn-logout')?.addEventListener('click', () => {
    if (confirm('¿Cerrar sesión?')) Auth.logout();
  });

  // Sidebar toggle móvil
  document.getElementById('btn-toggle-sidebar')?.addEventListener('click', () => {
    document.getElementById('admin-sidebar')?.classList.toggle('open');
  });

  // Navegación sidebar
  document.querySelectorAll('.sidebar-link[data-section]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      navegarA(link.dataset.section);
      document.getElementById('admin-sidebar')?.classList.remove('open');
    });
  });
}

document.addEventListener('DOMContentLoaded', initAdmin);
