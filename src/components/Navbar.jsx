import { FaUserPlus, FaPlus, FaSignInAlt, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

const Navbar = ({ setView, isLoggedIn, setIsLoggedIn, user }) => {
  // Extraer el primer nombre si el usuario existe
  const firstName = user?.name ? user.name.split(' ')[0] : '';

  return (
    <nav className="bg-white text-gray-700 text-xs shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <span onClick={() => setView('home')} className="font-bold cursor-pointer text-usac-blue">INICIO</span>
        
        <div className="flex items-center space-x-6">
          {isLoggedIn ? (
            <>
              {/* Nombre del usuario logueado */}
              <div className="flex items-center gap-2 text-usac-blue font-bold border-r border-gray-200 pr-4">
                <FaUserCircle size={16} />
                <span className="uppercase">{firstName}</span>
              </div>

              <button onClick={() => setView('createPost')} className="flex items-center gap-1.5 hover:text-usac-blue">
                <FaPlus /> Publicar
              </button>
              <button onClick={() => setIsLoggedIn(false)} className="flex items-center gap-1.5 text-red-600 hover:text-red-800">
                <FaSignOutAlt /> Salir
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setView('register')} className="flex items-center gap-1.5 hover:text-usac-blue">
                <FaUserPlus /> Registro
              </button>
              <button onClick={() => setView('login')} className="flex items-center gap-1.5 font-bold text-usac-blue">
                <FaSignInAlt /> Iniciar Sesión
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;