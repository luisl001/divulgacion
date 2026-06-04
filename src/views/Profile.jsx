import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useParams, useNavigate, Link } from 'react-router-dom'; 
import { ENDPOINTS } from '../config/apiConfig.js';

const Profile = ({ user: loggedInUser }) => {
  const { username } = useParams(); // Obtenemos el username de la URL
  const [profileOwner, setProfileOwner] = useState(null); 
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  // ESTADOS DE PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const navigate = useNavigate();


  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        // 1. Buscamos los datos del usuario por su username 
        const userRes = await fetch(ENDPOINTS.API_BASE_URL + `/api/users/${username}`);
        const userData = await userRes.json();

        if (userData.error) throw new Error(userData.error);

        setProfileOwner(userData);

        // 2. Buscamos los posts de ese usuario usando su ID
        const postsRes = await fetch(ENDPOINTS.API_BASE_URL + `/api/posts/user/${userData.id}`);
        const postsData = await postsRes.json();
        setUserPosts(postsData);
      } catch (err) {
        console.error("Error cargando perfil:", err);
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchProfileData();
  }, [username]);

  // Lógica de Permisos: 

  const canEditOrDelete = loggedInUser?.username === username || loggedInUser?.isadmin === 1;

  // LÓGICA DE PAGINACIÓN (Slice)
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = userPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(userPosts.length / postsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = async (postId) => {
    if (!window.confirm("¿Estás seguro de eliminar esta publicación?")) return;
    try {
      const res = await fetch(ENDPOINTS.API_BASE_URL + `/api/post/${postId}`, { method: 'DELETE' });
      if (res.ok) {
        setUserPosts(userPosts.filter(p => p.id !== postId));
        alert("Post eliminado.");
      }
    } catch (err) { alert("Error al eliminar"); }
  };

  return (
    <div className="max-w-6xl mx-auto p-10 min-h-screen bg-white shadow-sm border-x">
      

      <header className="flex flex-col md:flex-row justify-between items-start border-b pb-8 mb-10 gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-blue-900 uppercase italic tracking-tighter">
          {profileOwner?.name || 'Cargando...'}
          </h1>
          <p className="text-gray-500 font-bold">{profileOwner?.email}</p>
          <div className="inline-block px-4 py-1 bg-blue-900 text-white rounded-sm text-[10px] font-black uppercase tracking-widest">
            {profileOwner?.isadmin === 1 ? 'ADMINISTRADOR / EDITOR' : 'USUARIO NORMAL'}
          </div>
        </div>

        <div className="w-32 h-32 rounded-lg border-4 border-gray-100 overflow-hidden shadow-xl">
          <img 
            src={ENDPOINTS.API_BASE_URL + `/uploads/avatars/${profileOwner?.profile_pic || 'default.png'}`} 
            className="w-full h-full object-cover"
            onError={(e) => e.target.src = ''}
          />
        </div>
      </header>

      {/* SECCIÓN POSTS CREADOS */}
      <section className="space-y-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-black text-gray-400 uppercase italic tracking-widest">Post Creados</h2>
          <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-bold">
            Total: {userPosts.length}
          </span>
        </div>

        {loading ? (
          <p className="text-center py-20 font-black text-gray-200 uppercase tracking-tighter text-4xl">Cargando...</p>
        ) : userPosts.length > 0 ? (
          <div className="overflow-hidden rounded-sm border border-gray-100 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Banner</th>
                  <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Título</th>
                  <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Fecha</th>
                  <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {currentPosts.map(post => (
                  <tr key={post.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="p-4">
                      <div className="w-20 h-10 bg-gray-200 rounded-sm overflow-hidden border">
                        <img 
                          src={post.image_ref}                
                         //   src={ENDPOINTS.API_BASE_URL + `/uploads/${post.image_ref}`} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    </td>

                    <td className="p-4">
                      <Link to={`/post/${post.id}`} className="group">
                          <p className="font-bold text-blue-900 uppercase text-sm truncate max-w-xs group-hover:text-blue-600 transition-colors underline-offset-4 group-hover:underline">
                              {post.postitle}
                          </p>
                      </Link>
                    </td>



                    <td className="p-4">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">
                        {new Date(post.date_created).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                    {canEditOrDelete && (
                      <div className="flex justify-end gap-2">
                        <button 
                            onClick={() => navigate(`/create-post?edit=${post.id}`)}
                            className="p-2 text-gray-400 hover:text-blue-900 transition-colors"
                            >
                            <FaEdit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(post.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <FaTrash size={16} />
                        </button>

                      </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>


   


            {/* CONTROLES DE PAGINACIÓN (Solo si hay más de 10) */}
            {userPosts.length > postsPerPage && (
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <p className="text-[10px] font-black text-gray-400 uppercase">
                  Página {currentPage} de {totalPages}
                </p>
                <div className="flex gap-1">
                  <button 
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 border rounded-sm transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'bg-white hover:bg-blue-900 hover:text-white border-gray-200'}`}
                  >
                    <FaChevronLeft size={10} />
                  </button>
                  
                  <button 
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 border rounded-sm transition-all ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'bg-white hover:bg-blue-900 hover:text-white border-gray-200'}`}
                  >
                    <FaChevronRight size={10} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-sm">
            <p className="text-gray-300 font-black italic uppercase tracking-widest text-sm">No hay divulgaciones registradas</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Profile;