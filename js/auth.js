/**
 * js/auth.js
 * Gestión de autenticación: login, registro y sesión activa.
 * Hotel Rincón del Carmen
 */

import { Storage } from './storage.js';

const SESSION_KEY = 'sesion_activa';

export const Auth = {
  /**
   * Intenta autenticar al usuario con email y contraseña.
   * @param {string} email
   * @param {string} password
   * @returns {{ success: boolean, user?: Object, error?: string }}
   */
  login(email, password) {
    const usuarios = Storage.get('usuarios', []);
    const usuario = usuarios.find(
      u => u.email === email.trim().toLowerCase() && u.password === password
    );

    if (!usuario) {
      return { success: false, error: 'Credenciales incorrectas. Verifica tu correo y contraseña.' };
    }

    // Guardar sesión (sin la contraseña)
    const { password: _, ...sesion } = usuario;
    Storage.set(SESSION_KEY, { ...sesion, loginAt: new Date().toISOString() });

    return { success: true, user: sesion };
  },

  /**
   * Registra un nuevo usuario con rol 'cliente'.
   * @param {{ nombre: string, email: string, password: string }} datos
   * @returns {{ success: boolean, user?: Object, error?: string }}
   */
  register({ nombre, email, password }) {
    const usuarios = Storage.get('usuarios', []);
    const existe = usuarios.some(u => u.email === email.trim().toLowerCase());

    if (existe) {
      return { success: false, error: 'Ya existe una cuenta con este correo electrónico.' };
    }

    if (password.length < 6) {
      return { success: false, error: 'La contraseña debe tener al menos 6 caracteres.' };
    }

    const nuevoUsuario = {
      id: `usr-${Date.now()}`,
      nombre: nombre.trim(),
      email: email.trim().toLowerCase(),
      password,
      rol: 'cliente',
      createdAt: new Date().toISOString(),
    };

    Storage.push('usuarios', nuevoUsuario);

    const { password: _, ...sesion } = nuevoUsuario;
    Storage.set(SESSION_KEY, { ...sesion, loginAt: new Date().toISOString() });

    return { success: true, user: sesion };
  },

  /**
   * Cierra la sesión activa.
   */
  logout() {
    Storage.remove(SESSION_KEY);
    if (window.location.pathname.includes('/admin/')) {
      window.location.href = '../index.html';
    } else {
      // Recargar la página actual para que la navbar refleje el cierre de sesión
      window.location.reload();
    }
  },

  /**
   * Retorna el usuario de la sesión activa, o null si no hay sesión.
   * @returns {Object|null}
   */
  getSession() {
    return Storage.get(SESSION_KEY);
  },

  /**
   * Verifica si hay una sesión activa.
   * @returns {boolean}
   */
  isLoggedIn() {
    return this.getSession() !== null;
  },

  /**
   * Verifica si el usuario activo tiene rol de administrador.
   * @returns {boolean}
   */
  isAdmin() {
    const session = this.getSession();
    return session?.rol === 'admin';
  },

  /**
   * Protege una página: redirige si no hay sesión o si no es admin.
   * @param {{ requireAdmin?: boolean, redirectTo?: string }} opciones
   */
  requireAuth({ requireAdmin = false, redirectTo = '../index.html' } = {}) {
    if (!this.isLoggedIn()) {
      window.location.href = redirectTo;
      return;
    }
    if (requireAdmin && !this.isAdmin()) {
      window.location.href = redirectTo;
    }
  },
};

// Auto-inicialización: exponer en window para uso desde HTML no-module si es necesario
window.Auth = Auth;
