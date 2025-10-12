const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors({
  origin: ['login-frontend-react.netlify.app', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Arreglo en memoria para almacenar usuarios
let usuarios = [];

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de Registro y Login',
    endpoints: {
      register: 'POST /register',
      login: 'POST /login',
      users: 'GET /users'
    }
  });
});

// Ruta de registro
app.post('/register', (req, res) => {
  const { nombre, dpi, email, password } = req.body;

  // Validaciones basicas
  if (!nombre || !dpi || !email || !password) {
    return res.status(400).json({ 
      message: 'Todos los campos son requeridos' 
    });
  }

  // Validar que el DPI tenga 13 numeros
  if (!/^\d{13}$/.test(dpi)) {
    return res.status(400).json({ 
      message: 'El DPI debe tener exactamente 13 digitos' 
    });
  }

  // Validar formato de email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ 
      message: 'El formato del email no es valido' 
    });
  }

  // Verificar si el email ya esta registrado
  const usuarioExistente = usuarios.find(u => u.email === email);
  if (usuarioExistente) {
    return res.status(409).json({ 
      message: 'El email ya está registrado' 
    });
  }

  // Verificar si el DPI ya esta registrado
  const dpiExistente = usuarios.find(u => u.dpi === dpi);
  if (dpiExistente) {
    return res.status(409).json({ 
      message: 'El DPI ya esta registrado' 
    });
  }

  // Crear nuevo usuario
  const nuevoUsuario = {
    id: usuarios.length + 1,
    nombre,
    dpi,
    email,
    password, // En produccion, esto debería estar oculto /hash
    fechaRegistro: new Date().toISOString()
  };

  usuarios.push(nuevoUsuario);

  console.log(`Nuevo usuario registrado: ${nombre} (${email})`);

  res.status(201).json({ 
    message: 'Usuario registrado exitosamente',
    user: {
      id: nuevoUsuario.id,
      nombre: nuevoUsuario.nombre,
      email: nuevoUsuario.email,
      dpi: nuevoUsuario.dpi
    }
  });
});

// Ruta de login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Validaciones basicas
  if (!email || !password) {
    return res.status(400).json({ 
      message: 'Email y contraseña son requeridos' 
    });
  }

  // Buscar usuario por email
  const usuario = usuarios.find(u => u.email === email);

  if (!usuario) {
    return res.status(401).json({ 
      message: 'Credenciales incorrectas' 
    });
  }

  // Verificar contraseña
  if (usuario.password !== password) {
    return res.status(401).json({ 
      message: 'Credenciales incorrectas' 
    });
  }

  console.log(`Usuario autenticado: ${usuario.nombre} (${usuario.email})`);

  // Login exitoso
  res.json({ 
    message: 'Login exitoso',
    user: {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      dpi: usuario.dpi
    }
  });
});

// Ruta para ver todos los usuarios (solo para pruebas)
app.get('/users', (req, res) => {
  // Devolver usuarios sin las contraseñas
  const usuariosSinPassword = usuarios.map(u => ({
    id: u.id,
    nombre: u.nombre,
    email: u.email,
    dpi: u.dpi,
    fechaRegistro: u.fechaRegistro
  }));

  res.json({ 
    total: usuarios.length,
    usuarios: usuariosSinPassword 
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Error interno del servidor' 
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n Servidor Express corriendo en http://localhost:${PORT}`);
  console.log(` Endpoints disponibles:`);
  console.log(`   - GET  http://localhost:${PORT}/`);
  console.log(`   - POST http://localhost:${PORT}/register`);
  console.log(`   - POST http://localhost:${PORT}/login`);
  console.log(`   - GET  http://localhost:${PORT}/users\n`);
});