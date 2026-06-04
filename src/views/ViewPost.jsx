import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaFacebook, FaWhatsapp, FaDownload, FaArrowLeft } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { ENDPOINTS } from '../config/apiConfig.js';

const ViewPost = ({ isLoggedIn }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        // Usamos la ruta de detalles que ya tienes en el backend
        fetch(ENDPOINTS.API_BASE_URL + `/api/post-details/${id}`)
            .then(res => res.json())
            .then(data => {
                setPost(data);
                console.log(data)
                setLoading(false);
            })
            .catch(err => {
                console.error("Error al cargar el post:", err);
                setLoading(false);
            });
    }, [id]);

    const handleDownload = async (imageUrl, title) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${title.replace(/\s+/g, '_')}_banner.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            alert("Error al descargar");
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const d = new Date(dateString);
        return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    };

    if (loading) return <div className="p-20 text-center font-black text-gray-200 text-4xl uppercase">Cargando...</div>;
    if (!post) return <div className="p-20 text-center text-gray-500">Post no encontrado</div>;

    return (
        <div className="max-w-5xl mx-auto p-6 animate-fadeIn">
            {/* Botón Volver */}
            <button 
                onClick={() => navigate(-1)} 
                className="flex items-center gap-2 text-gray-400 hover:text-blue-900 mb-6 transition-colors font-bold text-xs uppercase"
            >
                <FaArrowLeft /> Volver
            </button>

            <div className="bg-white border rounded-sm shadow-sm p-8">
                {/* Título Principal */}
                <h1 className="text-3xl font-black text-blue-900 uppercase italic mb-6 leading-tight border-b-4 border-usac-gold pb-2 inline-block">
                    {post.postitle}
                </h1>

                {/* Imagen del Banner */}
                <div className="relative overflow-hidden bg-gray-50 border rounded-sm flex items-center justify-center mb-6" style={{ minHeight: '450px' }}>
                    <img                   

                      //  src={ENDPOINTS.API_BASE_URL + `/uploads/${post.image_ref}`} 
                        src={post.image_ref} 
                        alt={post.postitle}
                        className="max-w-full h-auto shadow-2xl"
                    />
                </div>

                {/* Info Metadata */}
                <p className="mt-6 text-[11px] text-gray-600 italic">
                publicado por: <span className="font-bold text-gray-800">{post.author_user}</span> ({post.author_name}) en {formatDate(post.date_created)} 
                {post.category_name && (
                    <> en categoria: <span className="text-blue-700 font-semibold">{post.category_name}</span></>
                )}
                </p>
                {/* Barra de Herramientas (Compartir + Descargar) */}
                <div className="mt-6 border-t pt-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest block mb-2">Compartir Publicación</span>
                        <div className="flex gap-2">
                            <a 
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} 
                                target="_blank" rel="noopener noreferrer"
                                className="w-10 h-10 flex items-center justify-center bg-[#1877F2] text-white rounded-sm hover:opacity-80 transition-opacity"
                            >
                                <FaFacebook size={20} />
                            </a>
                            <a 
                                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`} 
                                target="_blank" rel="noopener noreferrer"
                                className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-sm hover:opacity-80 transition-opacity"
                            >
                                <FaXTwitter size={20} />
                            </a>
                            <a 
                                href={`https://wa.me/?text=${encodeURIComponent(post.postitle + " " + window.location.href)}`} 
                                target="_blank" rel="noopener noreferrer"
                                className="w-10 h-10 flex items-center justify-center bg-[#25D366] text-white rounded-sm hover:opacity-80 transition-opacity"
                            >
                                <FaWhatsapp size={22} />
                            </a>
                        </div>
                    </div>
                    {/* Botón de Correo Electrónico */}
                    <a 
                    href={`mailto:?subject=${encodeURIComponent(post.postitle)}&body=${encodeURIComponent("Mira esta noticia de la USAC: " + window.location.href)}`} 
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

                    
                  {isLoggedIn ? (
              <>
                    <button
            
                      onClick={() => handleDownload(
                        post.image_ref, 
                        post.postitle
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
    );
};

export default ViewPost;