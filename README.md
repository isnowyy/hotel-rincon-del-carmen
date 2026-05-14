# 🏨 Hotel Rincón del Carmen

> Sistema web de gestión hotelera con reservas en línea, autenticación de usuarios y panel de administración. Construido con HTML, CSS y JavaScript puro usando Web Components y localStorage.

---

## 📋 Tabla de contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Tecnologías utilizadas](#-tecnologías-utilizadas)
- [Instalación y uso](#-instalación-y-uso)
- [Credenciales por defecto](#-credenciales-por-defecto)
- [Arquitectura](#-arquitectura)
- [Páginas del sistema](#-páginas-del-sistema)
- [Web Components](#-web-components)
- [Módulos JavaScript](#-módulos-javascript)
- [Diseño y estilos](#-diseño-y-estilos)
- [Capturas de pantalla](#-capturas-de-pantalla)

---

## 📖 Descripción

**Hotel Rincón del Carmen** es una aplicación web completa para la gestión de un hotel boutique. Permite a los usuarios consultar disponibilidad, realizar reservas y gestionar su cuenta. Los administradores cuentan con un panel dedicado para monitorear reservas, habitaciones, usuarios y mensajes de contacto.

El sistema funciona íntegramente en el navegador sin necesidad de servidor backend, utilizando `localStorage` como capa de persistencia de datos.

---

## ✨ Características

### Para usuarios
- 🔍 Búsqueda de disponibilidad por fechas, tipo de habitación y número de huéspedes
- 🛏️ Visualización de habitaciones disponibles con imágenes y precios
- 📅 Creación y cancelación de reservas
- 👤 Registro e inicio de sesión con cuenta personal
- 📩 Formulario de contacto con validación

### Para administradores
- 📊 Dashboard con estadísticas en tiempo real
- 📅 Gestión completa de reservas (ver, cancelar)
- 🛏️ Visualización del inventario de habitaciones
- 👤 Listado de usuarios registrados
- ✉️ Bandeja de mensajes de contacto
- 🔐 Acceso exclusivo mediante credenciales de administrador

### Técnicas
- 🧩 Web Components reutilizables (navbar, footer, carousel, modal)
- 🎨 Diseño dark mode con paleta dorada elegante
- 📱 Totalmente responsive (mobile-first)
- ♿ Atributos de accesibilidad (ARIA) en todos los elementos interactivos
- ⚡ Módulos ES6 nativos (sin bundler)
- 💾 Persistencia de datos con `localStorage`

---

## 📁 Estructura del proyecto

```
hotel-rincon-del-carmen/
│
├── index.html                  # Landing page
├── reservas.html               # Consulta de disponibilidad y reservas
├── contacto.html               # Ubicación y formulario de contacto
│
├── admin/
│   └── index.html              # Panel de administración
│
├── css/
│   ├── main.css                # Variables globales, reset, utilidades
│   ├── landing.css             # Estilos de la landing page
│   ├── reservas.css            # Estilos de la página de reservas
│   ├── contacto.css            # Estilos de la página de contacto
│   └── admin.css               # Estilos del panel admin
│
├── js/
│   ├── app.js                  # Punto de entrada y seed de datos
│   ├── storage.js              # Abstracción sobre localStorage
│   ├── auth.js                 # Autenticación y gestión de sesión
│   ├── reservas.js             # Lógica de reservas
│   ├── admin.js                # Lógica del panel admin
│   └── contacto.js             # Lógica del formulario de contacto
│
└── components/
    ├── hotel-navbar.js         # Web Component: navegación + auth modal
    └── hotel-components.js     # Web Components: footer, carousel, modal
```

---

## 🛠️ Tecnologías utilizadas

| Tecnología | Uso |
|-----------|-----|
| **HTML5** | Estructura semántica y accesible |
| **CSS3** | Variables CSS, Grid, Flexbox, animaciones |
| **JavaScript ES6+** | Módulos, clases, async/await, Web Components |
| **Web Components** | Componentes reutilizables nativos del navegador |
| **localStorage** | Persistencia de datos sin backend |
| **Google Fonts** | Tipografías *Playfair Display* e *Inter* |

---

## 🚀 Instalación y uso

### Opción 1: Live Server (recomendado para VS Code)

1. Clona o descarga el repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd hotel-rincon-del-carmen
   ```

2. Instala la extensión **Live Server** en VS Code.

3. Haz clic derecho sobre `index.html` → **"Open with Live Server"**.

4. El proyecto abrirá en `http://127.0.0.1:5500`.

### Opción 2: Servidor Python

```bash
cd hotel-rincon-del-carmen
python3 -m http.server 8080
```
Luego abre `http://localhost:8080` en tu navegador.

### Opción 3: Node.js con `serve`

```bash
npx serve hotel-rincon-del-carmen
```

> ⚠️ **Importante:** El proyecto usa módulos ES6 (`import`/`export`), por lo que **no puede abrirse directamente como archivo** (`file://`). Se requiere un servidor local.

---

## 🔐 Credenciales por defecto

Las credenciales se crean automáticamente en el primer inicio de la aplicación mediante la función `seedData()` en `js/app.js`.

### Administrador

| Campo | Valor |
|-------|-------|
| **Email** | `admin@hotelrincondelcarmen.com` |
| **Contraseña** | `admin1234` |
| **Acceso** | `/admin/index.html` |

### Usuario de prueba

Los usuarios normales pueden **crear su propia cuenta** desde el botón **"Iniciar sesión"** en la barra de navegación → pestaña **"Crear cuenta"**.

> 💡 **Tip:** Si los datos no cargan, abre las DevTools del navegador → pestaña **Application** → **Local Storage** → selecciona el origen → **Clear All** → recarga la página.

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                      VISTA (HTML)                        │
│   index.html  reservas.html  contacto.html  admin/       │
└────────────────────────┬────────────────────────────────┘
                         │ importa
┌────────────────────────▼────────────────────────────────┐
│               WEB COMPONENTS (components/)               │
│        hotel-navbar.js      hotel-components.js          │
└────────────────────────┬────────────────────────────────┘
                         │ importa
┌────────────────────────▼────────────────────────────────┐
│                  LÓGICA (js/)                            │
│   app.js   auth.js   reservas.js   admin.js   contacto.js│
└────────────────────────┬────────────────────────────────┘
                         │ usa
┌────────────────────────▼────────────────────────────────┐
│               CAPA DE DATOS (js/storage.js)              │
│                     localStorage                         │
└─────────────────────────────────────────────────────────┘
```

### Claves de localStorage

| Clave | Descripción |
|-------|------------|
| `habitaciones` | Array de habitaciones disponibles |
| `reservas` | Array de todas las reservas realizadas |
| `usuarios` | Array de usuarios registrados |
| `mensajes` | Array de mensajes del formulario de contacto |
| `sesion_activa` | Objeto del usuario con sesión activa |

---

## 📄 Páginas del sistema

### `index.html` — Landing Page
- Hero con imagen de fondo y llamado a la acción
- Sección "Sobre nosotros"
- Carousel de habitaciones destacadas (`<hotel-carousel>`)
- Grid de servicios del hotel

### `reservas.html` — Reservas
- Formulario de búsqueda por fecha, tipo y huéspedes
- Grid de tarjetas de habitaciones disponibles
- Listado de reservas del usuario autenticado con opción de cancelar

### `contacto.html` — Contacto
- Formulario de contacto con validación
- Panel de información (dirección, teléfono, email, horarios)
- Mapa embebido de Google Maps

### `admin/index.html` — Panel Admin
- Pantalla de login exclusiva para administradores
- Dashboard con 4 tarjetas de estadísticas
- Navegación por secciones: Dashboard, Reservas, Habitaciones, Usuarios, Contactos

---

## 🧩 Web Components

### `<hotel-navbar>`
Barra de navegación fija con:
- Efecto glassmorphism al hacer scroll
- Menú hamburguesa responsive
- Botón de sesión (login / usuario autenticado con dropdown)
- Modal de autenticación con pestañas (Iniciar sesión / Crear cuenta)
- Marcado automático del enlace activo según la URL

### `<hotel-footer>`
Pie de página con marca, navegación secundaria e información de contacto.

### `<hotel-carousel>`
Carousel de habitaciones con:
- Autoplay cada 4.5 segundos
- Botones de navegación anterior/siguiente
- Puntos indicadores de posición

### `<hotel-modal>`
Modal accesible y reutilizable con:
- Métodos públicos `open(html)` y `close()`
- Cierre con tecla Escape y clic en backdrop

---

## 📦 Módulos JavaScript

### `storage.js` — Capa de datos
API sobre `localStorage` con operaciones CRUD:
```js
Storage.get(key, defaultValue)
Storage.set(key, value)
Storage.remove(key)
Storage.push(key, item)           // Agrega a un array
Storage.updateById(key, id, data) // Actualiza por id
Storage.removeById(key, id)       // Elimina por id
Storage.findById(key, id)         // Busca por id
```

### `auth.js` — Autenticación
```js
Auth.login(email, password)       // → { success, user?, error? }
Auth.register({ nombre, email, password }) // → { success, user?, error? }
Auth.logout()
Auth.getSession()                 // → usuario | null
Auth.isLoggedIn()                 // → boolean
Auth.isAdmin()                    // → boolean
Auth.requireAuth({ requireAdmin }) // Protege rutas
```

### `reservas.js` — Reservas
```js
buscarDisponibilidad(fe, fs, tipo, huespedes) // → habitaciones[]
crearReserva(datos)              // → { success, reserva?, error? }
cancelarReserva(reservaId)       // → { success, error? }
getMisReservas()                 // → reservas del usuario activo
```

---

## 🎨 Diseño y estilos

El sistema de diseño se define en `css/main.css` mediante variables CSS:

```css
/* Colores */
--color-primary:    #c8914a;   /* Dorado cálido */
--color-secondary:  #2c4a3e;   /* Verde oscuro */
--color-bg:         #0f1a16;   /* Fondo principal */
--color-surface:    #1a2c24;   /* Superficie de tarjetas */

/* Tipografía */
--font-serif: 'Playfair Display', serif;  /* Títulos */
--font-sans:  'Inter', system-ui;         /* Cuerpo */
```

### Decisiones de diseño
- **Dark mode por defecto** con colores cálidos para transmitir calidez hotelera
- **Glassmorphism** en la navbar (blur + transparencia)
- **Micro-animaciones** en hover de tarjetas y transiciones de sección
- **Responsive** con breakpoints en 640px y 900px

---

## 📸 Capturas de pantalla

| Página | Descripción |
|--------|-------------|
| Landing | Hero oscuro con carousel de habitaciones y grid de servicios |
| Reservas | Formulario de búsqueda + tarjetas de habitaciones |
| Contacto | Layout dos columnas con formulario y mapa |
| Admin Login | Pantalla de acceso con gradiente oscuro |
| Admin Panel | Sidebar + dashboard con estadísticas y tablas |

---

## 👨‍💻 Autor

Desarrollado como proyecto académico de JavaScript.

**Hotel Rincón del Carmen** — Sistema de gestión hotelera frontend  
Año: 2026

---

## 📝 Licencia

Este proyecto es de uso académico y educativo.
