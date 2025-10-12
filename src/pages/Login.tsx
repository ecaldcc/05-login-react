import { useState, useContext, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

// Interfaz para definir la estructura de los datos del formulario de registro
interface RegisterFormData {
  nombre: string;
  dpi: string;
  email: string;
  password: string;
}

// Interfaz para definir la estructura de los datos del formulario de login
interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  // Hook de React Router para navegar entre paginas
  const navigate = useNavigate();
  
  // Contexto global para manejar el usuario autenticado
  const { setUser } = useContext(UserContext);
  
  // Estado para controlar si estamos en modo login o registro
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Estado para almacenar los datos del formulario de registro
  const [registerData, setRegisterData] = useState<RegisterFormData>({
    nombre: '',
    dpi: '',
    email: '',
    password: ''
  });

  // Estado para almacenar los datos del formulario de login
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  // Estado para almacenar los mensajes de error
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Estado para controlar cuando se esta enviando el formulario
  const [loading, setLoading] = useState(false);
  
  // Estado para mostrar mensaje de exito
  const [successMessage, setSuccessMessage] = useState('');

  // Funcion para validar que el DPI tenga exactamente 13 digitos
  const validateDPI = (dpi: string): boolean => {
    return /^\d{13}$/.test(dpi);
  };

  // Funcion para validar el formato del email
  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Funcion que maneja el envio del formulario de registro
  const handleRegisterSubmit = async (e: FormEvent) => {
    // Prevenir el comportamiento por defecto del formulario
    e.preventDefault();
    
    // Limpiar errores y mensajes previos
    setErrors({});
    setSuccessMessage('');
    setLoading(true);

    // Objeto para almacenar los nuevos errores de validacion
    const newErrors: Record<string, string> = {};

    // Validar que el nombre no este vacio
    if (!registerData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    // Validar que el DPI tenga el formato correcto
    if (!registerData.dpi || !validateDPI(registerData.dpi)) {
      newErrors.dpi = 'El DPI debe tener exactamente 13 digitos';
    }

    // Validar que el email tenga el formato correcto
    if (!registerData.email || !validateEmail(registerData.email)) {
      newErrors.email = 'Ingrese un correo electronico valido';
    }

    // Validar que la contrasena tenga al menos 6 caracteres
    if (!registerData.password || registerData.password.length < 6) {
      newErrors.password = 'La contrasena debe tener al menos 6 caracteres';
    }

    // Si hay errores, mostrarlos y detener el envio
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      // Hacer peticion POST al endpoint de registro
      // VITE_API_URL debe estar configurado en las variables de entorno
      const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Convertir el objeto de datos a JSON
        body: JSON.stringify(registerData),
      });

      // Parsear la respuesta del servidor
      const data = await response.json();

      // Si el registro fue exitoso
      if (response.ok) {
        setSuccessMessage('Registro exitoso! Ahora puedes iniciar sesion.');
        
        // Limpiar el formulario
        setRegisterData({
          nombre: '',
          dpi: '',
          email: '',
          password: ''
        });
        
        // Cambiar a modo login despues de 2 segundos
        setTimeout(() => {
          setMode('login');
          setSuccessMessage('');
        }, 2000);
      } else {
        // Si hubo un error, mostrarlo
        setErrors({ general: data.message || 'Error al registrarse' });
      }
    } catch (error) {
      // Manejar errores de conexion
      setErrors({ general: 'Error de conexion con el servidor' });
    } finally {
      // Siempre desactivar el estado de carga
      setLoading(false);
    }
  };

  // Funcion que maneja el envio del formulario de login
  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const newErrors: Record<string, string> = {};

    // Validar email
    if (!loginData.email || !validateEmail(loginData.email)) {
      newErrors.email = 'Ingrese un correo electronico valido';
    }

    // Validar que la contrasena no este vacia
    if (!loginData.password) {
      newErrors.password = 'La contrasena es requerida';
    }

    // Si hay errores, mostrarlos y detener el envio
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      // IMPORTANTE: Usar el endpoint /login (no /register)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      // Si el login fue exitoso
      if (response.ok) {
        // Guardar el usuario en el contexto global
        setUser(data.user);
        // Navegar al dashboard
        navigate('/dashboard');
      } else {
        // Mostrar error si las credenciales son incorrectas
        setErrors({ general: data.message || 'Credenciales incorrectas' });
      }
    } catch (error) {
      setErrors({ general: 'Error de conexion con el servidor' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            {/* Header del formulario que cambia segun el modo */}
            <div className="card-header bg-primary text-white text-center">
              <h3>{mode === 'login' ? 'Iniciar Sesion' : 'Registro de Usuario'}</h3>
            </div>
            
            <div className="card-body">
              {/* Tabs para cambiar entre login y registro */}
              <ul className="nav nav-tabs mb-4">
                <li className="nav-item w-50">
                  <button
                    className={`nav-link w-100 ${mode === 'login' ? 'active' : ''}`}
                    onClick={() => {
                      setMode('login');
                      setErrors({});
                      setSuccessMessage('');
                    }}
                  >
                    Iniciar Sesion
                  </button>
                </li>
                <li className="nav-item w-50">
                  <button
                    className={`nav-link w-100 ${mode === 'register' ? 'active' : ''}`}
                    onClick={() => {
                      setMode('register');
                      setErrors({});
                      setSuccessMessage('');
                    }}
                  >
                    Registrarse
                  </button>
                </li>
              </ul>

              {/* Mostrar mensaje de error general si existe */}
              {errors.general && (
                <div className="alert alert-danger" role="alert">
                  {errors.general}
                </div>
              )}
              
              {/* Mostrar mensaje de exito si existe */}
              {successMessage && (
                <div className="alert alert-success" role="alert">
                  {successMessage}
                </div>
              )}

              {/* Formulario de registro - se muestra solo si mode es 'register' */}
              {mode === 'register' && (
                <form onSubmit={handleRegisterSubmit}>
                  {/* Campo Nombre */}
                  <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre Completo *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                      id="nombre"
                      value={registerData.nombre}
                      onChange={(e) => setRegisterData({ ...registerData, nombre: e.target.value })}
                      placeholder="Ingrese su nombre completo"
                    />
                    {errors.nombre && (
                      <div className="invalid-feedback">{errors.nombre}</div>
                    )}
                  </div>

                  {/* Campo DPI */}
                  <div className="mb-3">
                    <label htmlFor="dpi" className="form-label">DPI *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.dpi ? 'is-invalid' : ''}`}
                      id="dpi"
                      value={registerData.dpi}
                      onChange={(e) => setRegisterData({ ...registerData, dpi: e.target.value })}
                      placeholder="13 digitos"
                      maxLength={13}
                    />
                    {errors.dpi && (
                      <div className="invalid-feedback">{errors.dpi}</div>
                    )}
                  </div>

                  {/* Campo Email */}
                  <div className="mb-3">
                    <label htmlFor="register-email" className="form-label">Email *</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      id="register-email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      placeholder="correo@ejemplo.com"
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  {/* Campo Contrasena */}
                  <div className="mb-3">
                    <label htmlFor="register-password" className="form-label">Contrasena *</label>
                    <input
                      type="password"
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      id="register-password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      placeholder="Minimo 6 caracteres"
                    />
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                  </div>

                  {/* Boton de envio */}
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? 'Registrando...' : 'Registrarse'}
                  </button>
                </form>
              )}

              {/* Formulario de login - se muestra solo si mode es 'login' */}
              {mode === 'login' && (
                <form onSubmit={handleLoginSubmit}>
                  {/* Campo Email */}
                  <div className="mb-3">
                    <label htmlFor="login-email" className="form-label">Email *</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      id="login-email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      placeholder="correo@ejemplo.com"
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  {/* Campo Contrasena */}
                  <div className="mb-3">
                    <label htmlFor="login-password" className="form-label">Contrasena *</label>
                    <input
                      type="password"
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      id="login-password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      placeholder="Ingrese su contrasena"
                    />
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                  </div>

                  {/* Boton de envio */}
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? 'Ingresando...' : 'Iniciar Sesion'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;