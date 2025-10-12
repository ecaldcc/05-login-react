import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Dashboard = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-12">
          <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
            <div className="container-fluid">
              <span className="navbar-brand">Sistema de Votación</span>
              <div className="d-flex align-items-center">
                <span className="text-white me-3">
                  Bienvenido, {user.nombre}
                </span>
                <button 
                  className="btn btn-light btn-sm"
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </nav>

          <div className="card shadow">
            <div className="card-header bg-success text-white">
              <h4>Información del Usuario</h4>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <h6 className="text-muted">Nombre:</h6>
                  <p className="fs-5">{user.nombre}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <h6 className="text-muted">Email:</h6>
                  <p className="fs-5">{user.email}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <h6 className="text-muted">DPI:</h6>
                  <p className="fs-5">{user.dpi}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="alert alert-info mt-4" role="alert">
            <h5 className="alert-heading">¡Sesión activa!</h5>
            <p>Has iniciado sesión correctamente. La información del usuario se está gestionando mediante Context de React.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;