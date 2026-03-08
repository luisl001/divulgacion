import { useState } from 'react';
import Navbar from './components/Navbar';
import HomeView from './views/HomeView';
import RegisterView from './views/RegisterView';
import CreatePostView from './views/CreatePostView';
import LoginView from './views/LoginView';

export default function App() {
  // Inicializamos buscando en localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user_session');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('user_session') !== null;
  });

  const [view, setView] = useState('home');


  // Función para renderizar vistas protegidas
  const renderProtected = (Component) => {
    return isLoggedIn ? Component : <LoginView setIsLoggedIn={setIsLoggedIn} setView={setView} setUser={setUser} />;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar setView={setView} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} user={user}/>
      
      {}

      <main className="max-w-7xl mx-auto px-4 py-16">
  {view === 'home' && <HomeView />}
  {view === 'login' && <LoginView setIsLoggedIn={setIsLoggedIn} setView={setView} setUser={setUser} />}
  
  {}
  {view === 'register' && <RegisterView />} 
  
  {/*  protegida la creación de posts */}
  {view === 'createPost' && renderProtected(<CreatePostView user={user}/>)}
</main>

      {/* ... (Footer) ... */}
    </div>
  );
}