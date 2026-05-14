/**
 * js/reservas.js
 * Lógica de búsqueda de disponibilidad y gestión de reservas.
 * Hotel Rincón del Carmen
 */

import { Storage } from './storage.js';
import { Auth } from './auth.js';

function generarId() {
  return `res-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function formatPrecio(valor) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(valor);
}

export function buscarDisponibilidad(fechaEntrada, fechaSalida, tipo = '', huespedes = 1) {
  const habitaciones = Storage.get('habitaciones', []);
  const reservas = Storage.get('reservas', []);
  return habitaciones.filter(hab => {
    if (!hab.disponible) return false;
    if (tipo && hab.tipo !== tipo) return false;
    if (hab.capacidad < Number(huespedes)) return false;
    const ocupada = reservas.some(res =>
      res.habitacionId === hab.id && res.estado !== 'cancelada' &&
      fechaEntrada < res.fechaSalida && fechaSalida > res.fechaEntrada
    );
    return !ocupada;
  });
}

export function crearReserva(datos) {
  const sesion = Auth.getSession();
  if (!sesion) return { success: false, error: 'Debes iniciar sesión para reservar.' };

  const { habitacionId, fechaEntrada, fechaSalida, huespedes = 1, comentarios = '' } = datos;
  if (!fechaEntrada || !fechaSalida || fechaEntrada >= fechaSalida)
    return { success: false, error: 'Las fechas no son válidas.' };

  const hab = Storage.findById('habitaciones', habitacionId);
  if (!hab) return { success: false, error: 'Habitación no encontrada.' };

  const noches = Math.round((new Date(fechaSalida) - new Date(fechaEntrada)) / 86400000);
  const reserva = {
    id: generarId(),
    usuarioId: sesion.id,
    usuarioNombre: sesion.nombre,
    usuarioEmail: sesion.email,
    habitacionId,
    habitacionNombre: hab.nombre,
    tipo: hab.tipo,
    fechaEntrada, fechaSalida, noches,
    huespedes: Number(huespedes),
    precioTotal: hab.precio * noches,
    comentarios,
    estado: 'confirmada',
    creadoEn: new Date().toISOString(),
  };
  Storage.push('reservas', reserva);
  return { success: true, reserva };
}

export function cancelarReserva(reservaId) {
  const sesion = Auth.getSession();
  if (!sesion) return { success: false, error: 'No autorizado.' };
  const reserva = Storage.findById('reservas', reservaId);
  if (!reserva) return { success: false, error: 'Reserva no encontrada.' };
  if (reserva.usuarioId !== sesion.id && sesion.rol !== 'admin')
    return { success: false, error: 'Sin permiso.' };
  Storage.updateById('reservas', reservaId, { estado: 'cancelada' });
  return { success: true };
}

export function getMisReservas() {
  const sesion = Auth.getSession();
  if (!sesion) return [];
  return Storage.get('reservas', []).filter(r => r.usuarioId === sesion.id);
}

function renderRoomCard(hab) {
  const card = document.createElement('div');
  card.className = 'room-card animate-fade-in';
  card.setAttribute('data-id', hab.id);
  card.innerHTML = `
    <img class="room-card__image" src="${hab.imagen}" alt="${hab.nombre}" loading="lazy" />
    <div class="room-card__body">
      <p class="room-card__type">${hab.tipo}</p>
      <h3 class="room-card__name">${hab.nombre}</h3>
      <p class="room-card__desc">${hab.descripcion}</p>
      <div class="room-card__footer">
        <div><span class="room-card__price">${formatPrecio(hab.precio)}</span><span> / noche</span></div>
        <button class="btn btn--primary btn--sm" data-reservar="${hab.id}" id="btn-reservar-${hab.id}">Reservar</button>
      </div>
    </div>`;
  return card;
}

function renderMisReservas() {
  const lista = document.getElementById('reservations-list');
  if (!lista) return;
  const reservas = getMisReservas();
  lista.innerHTML = '';
  if (!reservas.length) {
    lista.innerHTML = `<div class="empty-state"><span class="empty-state__icon">📅</span><p>Aún no tienes reservas.</p></div>`;
    return;
  }
  reservas.forEach(res => {
    const item = document.createElement('div');
    item.className = 'reservation-item animate-fade-in';
    item.innerHTML = `
      <div class="reservation-item__info">
        <h4>${res.habitacionNombre}</h4>
        <p class="reservation-item__dates">🗓 ${res.fechaEntrada} → ${res.fechaSalida} | ${res.noches} noche(s) | ${formatPrecio(res.precioTotal)}</p>
      </div>
      <div class="reservation-item__actions">
        <span class="badge badge--${res.estado === 'confirmada' ? 'success' : 'danger'}">${res.estado}</span>
        ${res.estado === 'confirmada' ? `<button class="btn btn--secondary btn--sm" data-cancelar="${res.id}" id="btn-cancelar-${res.id}">Cancelar</button>` : ''}
      </div>`;
    lista.appendChild(item);
  });
  lista.querySelectorAll('[data-cancelar]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('¿Cancelar esta reserva?')) {
        const r = cancelarReserva(btn.dataset.cancelar);
        if (r.success) renderMisReservas(); else alert(r.error);
      }
    });
  });
}

function initReservas() {
  const form = document.getElementById('form-busqueda');
  const grid = document.getElementById('rooms-grid');
  const resultSection = document.getElementById('resultados-disponibilidad');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const fe = document.getElementById('fecha-entrada').value;
      const fs = document.getElementById('fecha-salida').value;
      const tipo = document.getElementById('tipo-habitacion').value;
      const hues = document.getElementById('num-huespedes').value;
      const disponibles = buscarDisponibilidad(fe, fs, tipo, hues);

      grid.innerHTML = '';
      resultSection.hidden = false;

      if (!disponibles.length) {
        grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><span class="empty-state__icon">😔</span><p>Sin disponibilidad para esas fechas.</p></div>`;
        return;
      }
      disponibles.forEach(hab => grid.appendChild(renderRoomCard(hab)));

      grid.querySelectorAll('[data-reservar]').forEach(btn => {
        btn.addEventListener('click', () => {
          const r = crearReserva({ habitacionId: btn.dataset.reservar, fechaEntrada: fe, fechaSalida: fs, huespedes: hues });
          if (r.success) { alert(`✅ Reserva confirmada! ID: ${r.reserva.id}`); renderMisReservas(); }
          else alert(`❌ ${r.error}`);
        });
      });
    });
  }
  renderMisReservas();
}

document.addEventListener('DOMContentLoaded', initReservas);
