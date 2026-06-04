import { useState, useEffect } from 'react';
import CarouselContainer from '../components/CarouselContainer';
import { Link } from 'react-router-dom';
import { ENDPOINTS } from '../config/apiConfig.js';
import { useLocation } from 'react-router-dom'; 
import { FaWifi, FaFacebook, FaInstagram, FaWhatsapp, FaTwitter, FaDownload,FaCheckCircle , FaSearch} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6'; // Para el nuevo logo de X
const HomeView = ({ isLoggedIn }) => {
  const user = JSON.parse(localStorage.getItem('user_session')); // Cambiado 'user' por 'user_session'
  const [posts, setPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasError, setHasError] = useState(false); // Estado para detectar caída de DB
// ESTADOS PARA BÚSQUEDA Y PAGINACIÓN
const [searchTerm, setSearchTerm] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const postsPerPage = 5;
const location = useLocation();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Si venimos de CreatePost con el estado de éxito
    if (location.state?.success) {
      setShowPopup(true);

      // Limpiamos el estado para que no vuelva a salir si el usuario refresca (F5)
      window.history.replaceState({}, document.title);

      // Auto-cerrar después de 4 segundos
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [location]);
// Carga inicial (Últimos posts)
const fetchPosts = async (url = ENDPOINTS.API_BASE_URL + '/api/posts') => {
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (Array.isArray(data)) {
      setPosts(data);
      setCurrentPage(1); // Resetear a página 1 al buscar
      setCurrentIndex(0); // Resetear slider al primer resultado
      setHasError(false);
    }
  } catch (err) {
    setHasError(true);
  }
};

useEffect(() => { fetchPosts(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      fetchPosts(); // Si está vacío, carga los normales
    } else {
      fetchPosts(ENDPOINTS.API_BASE_URL + `/api/posts/search?term=${searchTerm}`);
    }
  };
// LÓGICA DE PAGINACIÓN
const indexOfLastPost = currentPage * postsPerPage;
const indexOfFirstPost = indexOfLastPost - postsPerPage;
const currentDisplayedPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
const totalPages = Math.min(Math.ceil(posts.length / postsPerPage), 5); // Máximo 5 pestañas

  useEffect(() => {
    fetch(ENDPOINTS.API_BASE_URL + '/api/posts')
      .then(res => {
        if (!res.ok) throw new Error('Error en el servidor');
        return res.json();
      })
      .then(data => {
        // Validamos que la data sea realmente un array antes de guardarla
        if (Array.isArray(data)) {
          setPosts(data);
          setHasError(false);
        } else {
          throw new Error('Formato de datos inválido');
        }
      })
      .catch(err => {
        console.error("Error de conexión:", err);
        setHasError(true);
        setPosts([]); // Limpiamos posts para evitar el error de .slice
      });
  }, []);
  const handleDownload = async (imageUrl, title) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // Nombre del archivo basado en el título del post
      link.download = `${title.replace(/\s+/g, '_')}_banner.png`; 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar la imagen:", error);
      alert("No se pudo descargar la imagen.");
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  };

  const handleNext = () => posts.length > 0 && setCurrentIndex((prev) => (prev + 1) % posts.length);
  const handlePrev = () => posts.length > 0 && setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);


  return (
  <div className="flex flex-col lg:flex-row gap-8 items-start animate-fadeIn">
      
      {showPopup && (
        <div className="fixed bottom-10 right-10 z-50 animate-bounceIn">
          <div className="bg-green-600 text-white px-8 py-4 rounded-sm shadow-2xl flex items-center gap-4 border-l-8 border-green-800">
            <FaCheckCircle size={24} />
            <div>
              <p className="font-black uppercase tracking-tighter text-lg leading-none">Éxito</p>
              <p className="text-xs font-bold italic opacity-90">Publicado correctamente</p>
            </div>
            <button 
              onClick={() => setShowPopup(false)}
              className="ml-4 hover:scale-110 transition-transform font-black"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      {/* Columna Izquierda: Banner */}
      <div className="lg:w-2/3 w-full">
        <CarouselContainer 
          title="Noticias Destacadas" 
          onNext={handleNext} 
          onPrev={handlePrev}
        >
          {hasError ? (
            <div className="h-[450px] flex flex-col items-center justify-center bg-gray-50 text-gray-400 p-10 text-center border-2 border-dashed rounded-sm">
              <FaWifi className="text-4xl mb-4 opacity-20" />
              <p className="italic font-bold uppercase text-xs tracking-widest">Sin conexión al servidor de base de datos</p>
              <p className="text-[10px] mt-2">Por favor, verifica que el servicio de MySQL esté activo.</p>
            </div>
          ) : posts.length > 0 ? (
            <div className="flex flex-col">
               <div className="-m-4 relative overflow-hidden bg-white h-[450px] flex items-center justify-center">


                <img 
                // src={ENDPOINTS.API_BASE_URL + `/uploads/${posts[currentIndex]?.image_ref}`} 
                  src={posts[currentIndex]?.image_ref} 
                  alt={posts[currentIndex]?.postitle}
                  className="w-full h-full object-contain"
                  onError={(e) => e.target.src = 'https://via.placeholder.com/800x450?text=Banner+no+disponible'}
                />
              </div>
              {/* DESCRIPCIÓN REQUERIDA DEBAJO DEL POST PRINCIPAL */}

              <p className="mt-6 text-[11px] text-gray-600 italic">
              publicado por: 
              <Link 
                to={`/profile/${posts[currentIndex]?.author}`} 
                className="font-bold text-gray-800 hover:text-blue-600 underline ml-1"
              >
                {posts[currentIndex]?.author}
              </Link> 
               en {formatDate(posts[currentIndex]?.date_created)} ...
            </p>



              {/* BARRA DE COMPARTIR */}
              <div className="mt-4 border-t pt-4">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest block mb-2">compartir post</span>
                <div className="flex gap-2">
                  {/* Facebook */}
                  <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-[#1877F2] text-white rounded-sm hover:opacity-80 transition-opacity"
                  >
                    <FaFacebook size={20} />
                  </a>

                  {/*  */}
                

                  {/* X (Twitter) */}
                  <a 
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(posts[currentIndex]?.postitle)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-sm hover:opacity-80 transition-opacity"
                  >
                    <FaXTwitter size={20} />
                  </a>

                  {/* WhatsApp */}
                  <a 
                    href={`https://wa.me/?text=${encodeURIComponent(posts[currentIndex]?.postitle + " " + window.location.href)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-[#25D366] text-white rounded-sm hover:opacity-80 transition-opacity"
                  >
                    <FaWhatsapp size={22} />
                  </a>
                   {/* Botón de Correo Electrónico */}
                   <a 
                    href={`mailto:?subject=${encodeURIComponent(posts[currentIndex]?.postitle)}&body=${encodeURIComponent("Mira esta noticia de la USAC: " + window.location.href)}`} 
                    className="w-10 h-10 flex items-center justify-center bg-[#EA4335] text-white rounded-sm hover:opacity-80 transition-opacity"
                    title="Enviar por Correo"
                  >
                    <svg 
                      stroke="currentColor" 
                      fill="currentColor" 
                      strokeWidth="0" 
                      viewBox="0 0 512 512" 
                      height="22" 
                      width="22" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"></path>
                    </svg>
                  </a>

                             {/* BOTÓN DE DESCARGA:*/}
     
                    
                             {isLoggedIn ? (
              <>
                    <button
                            
                            onClick={() => handleDownload(
                              posts[currentIndex]?.image_ref, 
                              posts[currentIndex]?.postitle
                            )}


                      className="flex items-center gap-2 px-4 h-10 bg-gray-800 text-white rounded-sm hover:bg-gray-700 transition-colors text-[10px] font-bold uppercase"
                      title="Descargar Banner"
                    >
                      <FaDownload size={16} />
                      Descargar Imagen
                    </button>
                    </>
            ) : (
              <>
              </>
           )}
                </div>
              </div>


 



            </div>
          ) : (
            <div className="h-[450px] flex items-center justify-center italic text-gray-400">
              Cargando noticias de la Facultad...
            </div>
          )}
        </CarouselContainer>
      </div>

{/* COLUMNA DERECHA: BUSCADOR Y LISTA */}
<div className="lg:w-1/3 w-full space-y-6">
        
        {/* BUSCADOR */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <input 
            type="text"
            className="flex-1 border-2 border-gray-200 p-2 text-xs focus:border-usac-blue outline-none uppercase font-bold"
            placeholder="Buscar post..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="bg-black text-white px-4 py-2 text-[10px] font-black uppercase hover:bg-gray-800 transition-all flex items-center gap-2">
            <FaSearch /> buscar post
          </button>
        </form>

        <h3 className="text-xl font-bold text-gray-800 border-b-2 border-usac-blue pb-2 mb-4 uppercase italic">
          {searchTerm ? 'Resultados de búsqueda' : 'Últimas Divulgaciones'}
        </h3>
        
        <div className="space-y-4">
          {currentDisplayedPosts.map((post, index) => (
            <div 
              key={post.id} 
              onClick={() => setCurrentIndex(indexOfFirstPost + index)}
              className={`flex gap-4 p-3 rounded-sm shadow-md transition-all border-l-4 cursor-pointer ${
                currentIndex === (indexOfFirstPost + index) ? 'border-usac-gold bg-blue-50' : 'border-transparent bg-white hover:bg-gray-50'
              }`}
            >
             {/* <img src={ENDPOINTS.API_BASE_URL + `/uploads/${post.image_ref}`} className="w-20 h-20 object-cover" />*/}
              <img src={post.image_ref} className="w-20 h-20 object-cover" />
              <div>
                <h5 className="text-xs font-bold text-usac-blue uppercase line-clamp-1">{post.postitle}</h5>
                <p className="text-[10px] text-gray-500 line-clamp-1 italic">{post.content}</p>
                <p className="text-[8px] text-gray-400 mt-2">Por: {post.author} | {post.category_name}</p>
              </div>
            </div>
          ))}
        </div>

        {/* NAVEGACIÓN POR PÁGINAS (1 | 2 | 3 | 4 | 5) */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-4 mt-6 border-t pt-4">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`text-sm font-black transition-colors ${
                  currentPage === i + 1 ? 'text-usac-blue scale-125' : 'text-gray-300 hover:text-gray-600'
                }`}
              >
                {i + 1} {i + 1 < totalPages && <span className="ml-4 text-gray-200">|</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


export default HomeView;