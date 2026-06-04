import { useState } from 'react';
import Navbar from './components/Navbar';
import HomeView from './views/HomeView';
import RegisterView from './views/RegisterView';
import CreatePostView from './views/CreatePostView';
import LoginView from './views/LoginView';
import Profile from './views/Profile';
import ViewPost from './views/ViewPost';
import { Routes, Route, Navigate } from 'react-router-dom';
import Tutorial from './views/Tutoriales';
import Contact from './views/Contact';
import Footer from './components/Footer';
import Actividades from './views/Actividades';
export default function App() {
  // Inicializamos buscando en localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user_session');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('user_session') !== null;
  });
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* El Navbar se mantiene fijo arriba */}
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} user={user}/>
      
      <main className="max-w-7xl mx-auto px-4 py-16">
        <Routes>
          <Route path="/" element={<HomeView  isLoggedIn={isLoggedIn} />} />
          <Route path="/register" element={<RegisterView />} />
          <Route path="/login" element={<LoginView setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
          <Route path="/tutoriales" element={<Tutorial />} />

          {/* Ruta Protegida de Perfil */}
          <Route 
  path="/profile/:username" 
  element={isLoggedIn ? <Profile user={user} /> : <Navigate to="/login" />} 
/>
          {/* Ruta Protegida de Creación */}
          <Route 
            path="/create-post" 
            element={isLoggedIn ? <CreatePostView user={user}/> : <Navigate to="/login" />} 
          />
         <Route path="/contacto" element={<Contact />} />
         <Route path="/actividades" element={<Actividades />} />
          <Route path="/post/:id" element={<ViewPost isLoggedIn={isLoggedIn} />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}