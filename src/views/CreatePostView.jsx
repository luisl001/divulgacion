import { useState, useEffect } from 'react';

const CreatePostView = ({ user }) => {
  const [post, setPost] = useState({ 
    postitle: '', 
    content: '', 
    labels: '', 
    category_id: 1, // 1 es el ID de la categoría 'Default' que insertamos en MySQL
    user_id: user?.id 
  });

  const [categories, setCategories] = useState([]);

  // Cargar categorías disponibles (Opcional: puedes dejarlo estático si prefieres)
  useEffect(() => {
    fetch('http://localhost:3000/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => setCategories([{ id: 1, name: 'Default' }]));
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    
    // Incluimos explícitamente el username en el cuerpo de la petición
    const postData = { 
      ...post, 
      user_id: user?.id,
      username: user?.username // Enviamos el username solicitado
    };

    try {
      const response = await fetch('http://localhost:3000/api/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });
      
      if (response.ok) {
        alert(`¡Noticia publicada con éxito por ${user?.username}!`);
      }
    } catch (err) { 
      alert("Error al conectar con el servidor de la Unidad de Divulgación"); 
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 shadow-2xl rounded-sm border-t-4 border-usac-blue">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-usac-gold">Crear Nueva Divulgación</h2>
        <span className="text-[10px] bg-blue-50 px-2 py-1 rounded text-usac-blue font-bold uppercase">
          EDITOR: {user?.name || 'Sin sesión'}
        </span>
      </div>
      
      <form className="space-y-4" onSubmit={handlePost}>
        <input 
          className="w-full p-3 border rounded font-bold focus:ring-2 focus:ring-usac-blue outline-none" 
          placeholder="Título de la Noticia" 
          onChange={e => setPost({...post, postitle: e.target.value})} 
          required
        />

     

        <textarea 
          className="w-full p-3 border rounded h-48 focus:ring-2 focus:ring-usac-blue outline-none" 
          placeholder="Contenido del artículo (soporta hasta 16MB)..." 
          onChange={e => setPost({...post, content: e.target.value})}
          required
        ></textarea>
   {/* Dropdown de Categorías */}
   <div className="flex flex-col space-y-1">
          <label className="text-[10px] font-bold text-gray-400">CATEGORÍA</label>
          <select 
            className="w-full p-3 border rounded bg-gray-50 text-gray-700 outline-none focus:ring-2 focus:ring-usac-blue"
            value={post.category_id}
            onChange={e => setPost({...post, category_id: e.target.value})}
          >
            <option value="1">Default</option>
            {categories.filter(c => c.id !== 1).map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <input 
          className="w-full p-3 border rounded focus:ring-2 focus:ring-usac-blue outline-none" 
          placeholder="Etiquetas (ej. Votaciones, Conferencias, USAC)" 
          onChange={e => setPost({...post, labels: e.target.value})} 
        />


        <button type="submit" className="w-full bg-usac-gold text-white py-4 font-black text-xl hover:bg-yellow-700 transition shadow-lg uppercase tracking-widest">
          PUBLICAR AHORA
        </button>
      </form>
    </div>
  );
};

export default CreatePostView;