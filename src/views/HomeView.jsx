import { useState, useEffect } from 'react';
import CarouselContainer from '../components/CarouselContainer';

const HomeView = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.log("Error al cargar posts:", err));
  }, []);

  return (
    <div className="grid md:grid-cols-2 gap-x-12 gap-y-10 items-start">
      <CarouselContainer title="Últimas Noticias">
        {posts.length > 0 ? posts.map(post => (
          <div key={post.id} className="space-y-4 animate-fadeIn">
            <h4 className="text-2xl font-bold text-gray-800">{post.postitle}</h4>
            <div className="bg-blue-50 p-4 border-l-4 border-usac-blue">
              <p className="text-gray-700 line-clamp-6">{post.content}</p>
            </div>
            <div className="flex justify-between text-xs text-gray-500 italic">
              <span>Categoría: {post.category_name || 'General'}</span>
              <span>Autor: {post.Autorname}</span>
              <span>Fecha: {new Date(post.date_created).toLocaleDateString()}</span>
            </div>
          </div>
        )) : (
          <div className="text-center text-gray-400 mt-20 italic">No hay publicaciones recientes...</div>
        )}
      </CarouselContainer>

      <div className="bg-usac-blue text-white p-8 rounded-sm shadow-2xl h-full">
        <h3 className="text-4xl font-black border-b border-white/30 pb-4">Marzo <span className="font-light text-xl">2026</span></h3>
        <ul className="mt-6 space-y-4 text-sm opacity-90">
          <li>• Proyecto Divulgación: Fase III Backend en curso</li>
          <li>• Inicio de semestre: Facultad de Ingeniería</li>
          <li>• Conferencia: Innovación Tecnológica 360</li>
        </ul>
      </div>
    </div>
  );
};

export default HomeView;