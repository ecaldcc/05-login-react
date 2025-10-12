import { useState, useContext, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

interface RegisterFormData {
  nombre: string;
  dpi: string;
  email: string;
  password: string;
}

interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  const [registerData, setRegisterData] = useState<RegisterFormData>({
    nombre: '',
    dpi: '',
    email: '',
    password: ''
  });

  const [loginData, setLoginData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateDPI = (dpi: string): boolean => {
    return /^\d{13}$/.test(dpi);
  };

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');
    setLoading(true);

    const newErrors: Record<string, string> = {};

    if (!registerData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!registerData.dpi || !validateDPI(registerData.dpi)) {
      newErrors.dpi = 'El DPI debe tener exactamente 13 dígitos';
    }

    if (!registerData.email || !validateEmail(registerData.email)) {
      newErrors.email = 'Ingrese un correo electrónico válido';
    }

    if (!registerData.password || registerData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      console.log('🔵 API URL:', import.meta.env.VITE_API_URL);
      console.log('🔵 Datos de registro que se envían:', registerData);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      console.log('🔵 Response status:', response.status);
      const data = await response.json();
      console.log('🔵 Response data:', data);

      if (response.ok) {
        setSuccessMessage('¡Registro exitoso! Ahora puedes iniciar sesión.');
        setRegisterData({
          nombre: '',
          dpi: '',
          email: '',
          password: ''
        });
        setTimeout(() => {
          setMode('login');
          setSuccessMessage('');
        }, 2000);
      } else {
        setErrors({ general: data.message || 'Error al registrarse' });
      }
    } catch (error) {
      console.error('❌ Error en registro:', error);
      setErrors({ general: 'Error de conexión con el servidor' });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const newErrors: Record<string, string> = {};

    if (!loginData.email || !validateEmail(loginData.email)) {
      newErrors.email = 'Ingrese un correo electrónico válido';
    }

    if (!loginData.password) {
      newErrors.password = 'La contraseña es requerida';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      console.log('🟢 API URL:', import.meta.env.VITE_API_URL);
      console.log('🟢 Datos de login que se envían:', loginData);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      console.log('🟢 Response status:', response.status);
      const data = await response.json();
      console.log('🟢 Response data:', data);

      if (response.ok) {
        setUser(data.user);
        navigate('/dashboard');
      } else {
        setErrors({ general: data.message || 'Credenciales incorrectas' });
      }
    } catch (error) {
      console.error('❌ Error en login:', error);
      setErrors({ general: 'Error de conexión con el servidor' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header bg-primary text-white text-center">
              <h3>{mode === 'login' ? 'Iniciar Sesión' : 'Registro de Usuario'}</h3>
            </div>
            <div className="card-body">
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
                    Iniciar Sesión
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

              {errors.general && (
                <div className="alert alert-danger" role="alert">
                  {errors.general}
                </div>
              )}
              
              {successMessage && (
                <div className="alert alert-success" role="alert">
                  {successMessage}
                </div>
              )}

              {mode === 'register' && (
                <form onSubmit={handleRegisterSubmit}>
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

                  <div className="mb-3">
                    <label htmlFor="dpi" className="form-label">DPI *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.dpi ? 'is-invalid' : ''}`}
                      id="dpi"
                      value={registerData.dpi}
                      onChange={(e) => setRegisterData({ ...registerData, dpi: e.target.value })}
                      placeholder="13 dígitos"
                      maxLength={13}
                    />
                    {errors.dpi && (
                      <div className="invalid-feedback">{errors.dpi}</div>
                    )}
                  </div>

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

                  <div className="mb-3">
                    <label htmlFor="register-password" className="form-label">Contraseña *</label>
                    <input
                      type="password"
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      id="register-password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      placeholder="Mínimo 6 caracteres"
                    />
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? 'Registrando...' : 'Registrarse'}
                  </button>
                </form>
              )}

              {mode === 'login' && (
                <form onSubmit={handleLoginSubmit}>
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

                  <div className="mb-3">
                    <label htmlFor="login-password" className="form-label">Contraseña *</label>
                    <input
                      type="password"
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      id="login-password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      placeholder="Ingrese su contraseña"
                    />
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? 'Ingresando...' : 'Iniciar Sesión'}
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