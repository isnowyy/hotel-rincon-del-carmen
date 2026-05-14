/**
 * js/contacto.js
 * Lógica del formulario de contacto.
 * Hotel Rincón del Carmen
 */

import { Storage } from './storage.js';

function generarId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function mostrarFeedback(tipo, mensaje) {
  const el = document.getElementById('feedback-contacto');
  if (!el) return;
  el.textContent = mensaje;
  el.className = `form-feedback ${tipo}`;
  el.hidden = false;
  setTimeout(() => { el.hidden = true; }, 5000);
}

function initContacto() {
  const form = document.getElementById('form-contacto');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const nombre  = document.getElementById('nombre').value.trim();
    const email   = document.getElementById('email').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const asunto  = document.getElementById('asunto').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();

    if (!nombre || !email || !asunto || !mensaje) {
      mostrarFeedback('error', 'Por favor completa todos los campos obligatorios.');
      return;
    }

    const msgObj = {
      id: generarId(),
      nombre, email, telefono, asunto, mensaje,
      estado: 'nuevo',
      creadoEn: new Date().toISOString(),
    };

    Storage.push('mensajes', msgObj);
    form.reset();
    mostrarFeedback('success', '✅ ¡Mensaje enviado! Nos pondremos en contacto contigo pronto.');
  });
}

document.addEventListener('DOMContentLoaded', initContacto);
