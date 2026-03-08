import { useState } from 'react';

const LoginView = ({ setIsLoggedIn, setView, setUser }) => {
  const [form, setForm] = useState({ username: '', password: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      
      if (response.ok) {
        // Guardamos en el disco local del navegador
        localStorage.setItem('user_session', JSON.stringify(data.user));
        setIsLoggedIn(true);
        setUser(data.user);
        setView('home');
        alert(`Bienvenido, ${data.user.name}`);
      } else {
        alert(data.error || "Credenciales incorrectas");
      }
    } catch (err) {
      alert("Error al conectar con el servidor de Ingeniería");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 shadow-2xl rounded-sm border-t-4 border-usac-gold">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 uppercase tracking-tight">Acceso Administrativo</h2>
      <form className="space-y-4" onSubmit={handleLogin}>
        <input 
          className="w-full p-3 border rounded focus:ring-2 focus:ring-usac-blue outline-none" 
          placeholder="Usuario" 
          onChange={e => setForm({...form, username: e.target.value})} 
          required
        />
        <input 
          className="w-full p-3 border rounded focus:ring-2 focus:ring-usac-blue outline-none" 
          type="password" 
          placeholder="Contraseña" 
          onChange={e => setForm({...form, password: e.target.value})} 
          required
        />
        <button type="submit" className="w-full bg-usac-blue text-white py-3 font-bold hover:bg-blue-900 transition shadow-md">
          ENTRAR
        </button>
      </form>
    </div>
  );
};

export default LoginView;