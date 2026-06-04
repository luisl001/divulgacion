import { useState } from 'react';
import { ENDPOINTS } from '../config/apiConfig.js';

const RegisterView = () => {
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', isadmin: 0 });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(ENDPOINTS.API_BASE_URL + '/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (response.ok) alert("Usuario registrado con éxito");
    } catch (err) { alert("Error en el registro"); }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 shadow-2xl rounded-sm border-t-4 border-usac-blue">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Registro de Editor</h2>
      <form className="space-y-4" onSubmit={handleRegister}>
        <input className="w-full p-3 border rounded" placeholder="Nombre Completo" onChange={e => setForm({...form, name: e.target.value})} />
        <input className="w-full p-3 border rounded" placeholder="Usuario" onChange={e => setForm({...form, username: e.target.value})} />
        <input className="w-full p-3 border rounded" type="email" placeholder="Correo Institucional" onChange={e => setForm({...form, email: e.target.value})} />
        <input className="w-full p-3 border rounded" type="password" placeholder="Contraseña" onChange={e => setForm({...form, password: e.target.value})} />
        <button type="submit" className="w-full bg-blue-900 text-white py-3 font-bold hover:bg-blue-500 transition shadow-md">REGISTRAR</button>
      </form>
    </div>
  );
};

export default RegisterView;