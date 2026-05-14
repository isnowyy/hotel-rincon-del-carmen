/**
 * js/app.js
 * Punto de entrada principal.
 * Importa los módulos necesarios y ejecuta el seed de datos iniciales.
 * Hotel Rincón del Carmen
 */

import { Storage } from './storage.js';

/**
 * Seed de datos iniciales (habitaciones y admin por defecto).
 * Solo se ejecuta si localStorage está vacío.
 */
function seedData() {
  // Habitaciones de ejemplo
  if (!Storage.get('habitaciones')) {
    const habitaciones = [
      {
        id: 'hab-001',
        tipo: 'sencilla',
        nombre: 'Habitación Sencilla Estándar',
        descripcion: 'Acogedora habitación individual con cama queen, baño privado y vista al jardín.',
        precio: 120000,
        capacidad: 1,
        imagen: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
        disponible: true,
      },
      {
        id: 'hab-002',
        tipo: 'doble',
        nombre: 'Habitación Doble Deluxe',
        descripcion: 'Espaciosa habitación con dos camas dobles, zona de estar y balcón privado.',
        precio: 200000,
        capacidad: 2,
        imagen: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=600&q=80',
        disponible: true,
      },
      {
        id: 'hab-003',
        tipo: 'suite',
        nombre: 'Suite Presidencial',
        descripcion: 'Lujo y confort en su máxima expresión. Sala de estar, jacuzzi y vista panorámica.',
        precio: 450000,
        capacidad: 4,
        imagen: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80',
        disponible: true,
      },
    ];
    Storage.set('habitaciones', habitaciones);
  }

  // Usuario administrador por defecto
  if (!Storage.get('usuarios')) {
    const usuarios = [
      {
        id: 'usr-admin-001',
        nombre: 'Administrador',
        email: 'admin@hotelrincondelcarmen.com',
        password: 'admin1234', // En producción usar hashing
        rol: 'admin',
        createdAt: new Date().toISOString(),
      },
    ];
    Storage.set('usuarios', usuarios);
  }

  // Reservas iniciales vacías
  if (!Storage.get('reservas')) {
    Storage.set('reservas', []);
  }

  // Mensajes de contacto iniciales vacíos
  if (!Storage.get('mensajes')) {
    Storage.set('mensajes', []);
  }
}

/**
 * Inicializa la aplicación cuando el DOM está listo.
 */
function init() {
  seedData();
  console.log('🏨 Hotel Rincón del Carmen — App inicializada.');
}

document.addEventListener('DOMContentLoaded', init);
