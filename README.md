# Sistema de Registro y Login (React + Express)

Este proyecto es una aplicacion que implementa un **sistema de registro y autenticacion de usuarios**, compuesto por:

- **Frontend:** React + Context API  
- **Backend:** Node.js con Express  
- **Base de datos:** Arreglo en memoria (solo para pruebas)

---

## Caracteristicas

- Registro de nuevos usuarios con validaciones:
  - Todos los campos son requeridos.
  - El **DPI** debe tener exactamente 13 dígitos.
  - El **email** debe tener formato válido.
  - Evita registros duplicados (por email o DPI).
- Inicio de sesión con verificación de credenciales.
- Mantenimiento de sesión de usuario en el frontend usando Context API.
- API REST con endpoints básicos para registro, login y listado de usuarios.


Endpoints del Backend
🔹 GET /

Muestra información general de la API y los endpoints disponibles.

🔹 POST /register

Registra un nuevo usuario.

Body JSON:

{
  "nombre": "Daniel Pérez",
  "dpi": "1234567890123",
  "email": "daniel@example.com",
  "password": "123456"
}


Respuestas:

201: Usuario registrado exitosamente

400: Campos faltantes o formato inválido

409: Email o DPI ya registrado

## Desarrolladores
Edwar Daniel Calderon Cinco 9490-20-26601
Henry David Cabrera Virual 9490-20-6611


