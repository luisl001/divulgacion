import { FaPlus, FaSignInAlt, FaSignOutAlt, FaUserCircle, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom'; // Importamos useNavigate

const Navbar = ({ isLoggedIn, setIsLoggedIn, user }) => {
  const navigate = useNavigate();

  // Función para cerrar sesión correctamente
  const handleLogout = () => {
    localStorage.removeItem('user'); // Limpiamos los datos del usuario
    setIsLoggedIn(false);            // Actualizamos el estado global
    navigate('/');                   // Redirigimos al inicio
  };

  return (
    <header className="w-full bg-white animate-fadeIn">
      {/* 1. SECCIÓN INSTITUCIONAL */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between border-b-4 border-[#b2945e]">
        
        {/* Lado Izquierdo: Logos y Título */}
        <div className="flex items-center gap-6">
          <img src="https://ik.imagekit.io/yz8emyfji/divusac_posts/logo.png" alt="Logo USAC" className="h-16 object-contain" />
          <div className="h-12 w-[1px] bg-gray-300 hidden md:block"></div>
          <div className="text-[#002d56]">
            <h1 className="text-lg font-black leading-none tracking-tighter uppercase">Facultad de</h1>
            <h2 className="text-3xl font-black leading-tight uppercase italic">Ingeniería</h2>
            <p className="text-[8px] font-bold tracking-widest">UNIVERSIDAD DE SAN CARLOS DE GUATEMALA</p>
            <p className="text-[8px] font-bold tracking-widest">UNIDAD DE DIVULGACION</p>
          </div>
        </div>

        {/* Lado Derecho: Ubicación y Horario */}
        <div className="hidden lg:flex items-center gap-10 text-[#002d56]">
          <div className="flex items-center gap-3">
            <FaMapMarkerAlt className="text-[#b2945e] text-2xl" />
            <div>
              <p className="font-bold text-xs uppercase leading-none mb-1">Ubicación</p>
              <p className="text-[10px] text-gray-500 italic">Edificio T4, Ciudad Universitaria, zona 12</p>
            </div>
          </div>
          <div className="h-10 w-[1px] bg-gray-200"></div>
          <div className="flex items-center gap-3">
            <FaClock className="text-[#b2945e] text-2xl" />
            <div>
              <p className="font-bold text-xs uppercase leading-none mb-1">Horario</p>
              <p className="text-[10px] text-gray-500 italic">Lunes a viernes de 7:00 a 20:00 horas</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. BARRA DE NAVEGACIÓN FUNCIONAL */}
      <nav className="bg-gray-50 text-gray-700 text-[11px] shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link 
              to="/" 
              className="font-black cursor-pointer text-[#002d56] uppercase tracking-widest hover:text-[#b2945e] transition-colors"
            >
              Inicio
            </Link>
          </div>
          <div className="flex items-center gap-8">
          {isLoggedIn ? (
              <>
         
            <Link 
              to="/tutoriales" 
              className="font-black cursor-pointer text-[#002d56] uppercase tracking-widest hover:text-[#b2945e] transition-colors"
            >
              Tutoriales
            </Link>
            </>
            ) : (
              <>
              </>
           )}
          </div>
          <div className="flex items-center gap-8">
      <Link 
        to="/actividades" 
        className="font-black cursor-pointer text-[#002d56] uppercase tracking-widest hover:text-[#b2945e] transition-colors"
      >
        Actividades
      </Link>
         
      </div>

          <div className="flex items-center gap-8">
          <Link 
        to="/contacto" 
        className="font-black cursor-pointer text-[#002d56] uppercase tracking-widest hover:text-[#b2945e] transition-colors"
      >
        Contáctanos
      </Link>
         
          </div>

          
          <div className="flex items-center space-x-6">
            {isLoggedIn ? (
              <>
         
                
                <Link 
  to={`/profile/${user?.username}`} 
  className="flex items-center gap-2 ..."
>
  <FaUserCircle size={16} />
  <span className="uppercase">{user?.name?.split(' ')[0] || 'Usuario'}</span>
</Link>

                <Link to="/create-post" className="flex items-center gap-1.5 font-bold hover:text-[#002d56]">
                  <FaPlus /> PUBLICAR
                </Link>

                <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-1.5 text-red-600 font-bold hover:text-red-800"
                >
                  <FaSignOutAlt /> SALIR
                </button>
              </>
            ) : (
              <>
                {/* Cambiamos setView por Link a la ruta correspondiente */}
                <Link to="/register" className="flex items-center gap-1.5 font-bold hover:text-[#002d56] uppercase">
                  Registro
                </Link>
                <Link to="/login" className="bg-[#002d56] text-white px-4 py-1.5 rounded-sm font-bold flex items-center gap-2 hover:bg-[#b2945e] transition-all shadow-md">
                  <FaSignInAlt /> ACCESO EDITORES
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;