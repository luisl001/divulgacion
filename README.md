# 🏛️ Sistema de Divulgación 

Plataforma integral para la gestión, publicación y difusión de noticias, eventos y avisos. Este proyecto sigue una arquitectura Full-Stack moderna priorizando la seguridad y la escalabilidad.

## 📑 Cambios Recientes (Marzo 2026)

### **Backend (Node.js + Express)**
* **Seguridad de Credenciales**: Implementación de **Bcrypt** para el hashing de contraseñas, garantizando que la información sensible de los editores nunca se almacene en texto plano.
* **Módulo de Autenticación**: 
    * `POST /api/register`: Registro de nuevos editores con validación de existencia previa (username/email).
    * `POST /api/login`: Validación de credenciales contra hashes almacenados y retorno de perfil de usuario.
* **Persistencia de Datos**: Conectividad robusta con **MySQL (XAMPP)** mediante `mysql2/promise` y gestión de variables de entorno con `dotenv`.
* **Arquitectura Modular**: Configuración completa de **ES Modules** (`type: module`) y enrutamiento organizado en la carpeta `/routes`.

### **Frontend (React + Vite)**
* **Persistencia de Sesión**: Integración de `localStorage` para mantener al usuario logueado tras recargar el navegador.
* **Identidad Visual**: Interfaz adaptada utilizando **Tailwind CSS**.
* **Navegación Inteligente**: 
    * La `Navbar` ahora muestra dinámicamente el nombre del usuario logueado.
    * Implementación de lógica de "Rutas Protegidas" para restringir el acceso a la creación de contenido.
* **Modularización de Vistas**: Separación del código en vistas independientes (`HomeView`, `LoginView`, `RegisterView`, `CreatePostView`) para facilitar el mantenimiento en la rama `developer`.

---

## 🛠️ Tecnologías Utilizadas

| Capa | Tecnologías |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, React Icons |
| **Backend** | Node.js, Express, Bcrypt, Dotenv |
| **Base de Datos** | MySQL |