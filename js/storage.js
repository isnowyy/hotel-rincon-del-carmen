/**
 * js/storage.js
 * Capa de abstracción sobre localStorage.
 * Todos los módulos deben acceder al almacenamiento a través de este módulo.
 * Hotel Rincón del Carmen
 */

export const Storage = {
  /**
   * Guarda un valor en localStorage bajo la clave dada.
   * @param {string} key - Clave de almacenamiento.
   * @param {*} value - Valor a guardar (se serializa a JSON automáticamente).
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`[Storage] Error al guardar "${key}":`, e);
    }
  },

  /**
   * Recupera un valor de localStorage.
   * @param {string} key - Clave de almacenamiento.
   * @param {*} defaultValue - Valor por defecto si la clave no existe.
   * @returns {*} El valor deserializado, o defaultValue si no se encuentra.
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error(`[Storage] Error al leer "${key}":`, e);
      return defaultValue;
    }
  },

  /**
   * Elimina una clave de localStorage.
   * @param {string} key - Clave a eliminar.
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`[Storage] Error al eliminar "${key}":`, e);
    }
  },

  /**
   * Limpia todo el localStorage del dominio.
   */
  clear() {
    try {
      localStorage.clear();
    } catch (e) {
      console.error('[Storage] Error al limpiar localStorage:', e);
    }
  },

  /**
   * Verifica si una clave existe en localStorage.
   * @param {string} key
   * @returns {boolean}
   */
  has(key) {
    return localStorage.getItem(key) !== null;
  },

  // ---- Helpers para colecciones (arrays) ----

  /**
   * Agrega un elemento a un array almacenado.
   * @param {string} key - Clave del array.
   * @param {Object} item - Elemento a agregar.
   */
  push(key, item) {
    const arr = this.get(key, []);
    arr.push(item);
    this.set(key, arr);
  },

  /**
   * Actualiza un elemento en un array por su campo `id`.
   * @param {string} key - Clave del array.
   * @param {string} id - ID del elemento a actualizar.
   * @param {Object} updates - Campos a actualizar.
   * @returns {boolean} true si se encontró y actualizó, false si no.
   */
  updateById(key, id, updates) {
    const arr = this.get(key, []);
    const idx = arr.findIndex(item => item.id === id);
    if (idx === -1) return false;
    arr[idx] = { ...arr[idx], ...updates };
    this.set(key, arr);
    return true;
  },

  /**
   * Elimina un elemento de un array por su campo `id`.
   * @param {string} key - Clave del array.
   * @param {string} id - ID del elemento a eliminar.
   * @returns {boolean} true si se eliminó, false si no se encontró.
   */
  removeById(key, id) {
    const arr = this.get(key, []);
    const filtered = arr.filter(item => item.id !== id);
    if (filtered.length === arr.length) return false;
    this.set(key, filtered);
    return true;
  },

  /**
   * Busca un elemento en un array por su campo `id`.
   * @param {string} key - Clave del array.
   * @param {string} id - ID del elemento a buscar.
   * @returns {Object|null}
   */
  findById(key, id) {
    const arr = this.get(key, []);
    return arr.find(item => item.id === id) || null;
  },
};
