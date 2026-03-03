import { useState } from 'react';
import { FaFacebook, FaInstagram, FaYoutube, FaChevronLeft, FaChevronRight, FaStar } from 'react-icons/fa';

// Componente para la barra de navegación superior (simulando imagen 7)
const Navbar = () => {
  const menuItems = ['ADMINISTRACIÓN', 'INGENIERIA', 'DISEÑO GRÁFICO', 'POSTGRADOS', 'INVESTIGACIÓN', 'BIBLIOTECA'];
  return (
    <nav className="bg-white text-gray-700 text-xs shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex space-x-6">
          {menuItems.map((item) => (
            <div key={item} className="flex items-center cursor-pointer hover:text-usac-blue">
              {item} <span className="text-[10px] ml-1">▼</span>
            </div>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          <FaFacebook className="text-gray-500 cursor-pointer hover:text-usac-blue" size={18} />
          <FaInstagram className="text-gray-500 cursor-pointer hover:text-usac-blue" size={18} />
          <FaYoutube className="text-gray-500 cursor-pointer hover:text-usac-blue" size={18} />
        </div>
      </div>
    </nav>
  );
};

// Componente para el contenedor de carrusel simulado (con flechas)
const CarouselContainer = ({ children }) => {
  return (
    <div className="relative group">
      {/* Botón izquierdo */}
      <button className="absolute left-[-20px] top-1/2 -translate-y-1/2 bg-white/70 p-1.5 rounded-full shadow-md z-10 text-gray-600 group-hover:scale-110 transition">
        <FaChevronLeft size={16} />
      </button>
      
      {/* Contenido del carrusel */}
      <div className="bg-white p-6 shadow-xl border border-gray-100 rounded-sm">
        {children}
      </div>

      {/* Botón derecho */}
      <button className="absolute right-[-20px] top-1/2 -translate-y-1/2 bg-white/70 p-1.5 rounded-full shadow-md z-10 text-gray-600 group-hover:scale-110 transition">
        <FaChevronRight size={16} />
      </button>
    </div>
  );
};

function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      {/* Franja Azul Oscura (Referencia imagen 7) */}
      <div className="bg-usac-blue h-12 w-full mt-1"></div>

      {/* Sección Título de Investigación */}
      <header className="bg-gray-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl font-bold">Revista de investigación: <span className="font-light">Avance</span></h1>
        </div>
      </header>
      <h1 className="text-5xl font-bold text-red-600 bg-yellow-200">
  ¿Tailwind funciona?
</h1>
      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Botón central destacado */}
        <div className="flex justify-center mb-16">
          <button className="flex items-center space-x-3 bg-white border border-gray-300 px-10 py-4 rounded-sm shadow-sm hover:shadow-md transition">
            <span className="text-xl text-gray-800 font-medium">Lee la publicación más reciente</span>
            <FaStar className="text-gray-400" size={20} />
          </button>
        </div>

        {/* Sección de Información Destacada (Grid 2 columnas) */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center text-usac-gold mb-8">Información destacada</h2>
          
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-10 items-start">
            
            {/* Columna Izquierda (Documento) */}
            <CarouselContainer>
              <div className="space-y-4">
                <p className="text-sm font-light text-gray-600">Clic en la imagen para ampliarla</p>
                <div className="flex justify-end">
                  <img src="/logo-usac.png" alt="Logo USAC" className="h-16" /> {/* Reemplazar con logo real */}
                </div>
                {/* Imagen del documento simulada */}
                <div className="border border-gray-200 p-4">
                  <img src="/documento-ejemplo.png" alt="Solicitud de certificados" className="w-full object-contain" />
                </div>
              </div>
            </CarouselContainer>

            {/* Columna Derecha (Calendario) */}
            <CarouselContainer>
              <div className="space-y-6">
                {/* Encabezado del calendario (simulando imagen 7) */}
                <div className="bg-usac-blue text-white p-6 rounded-t-sm">
                  <h3 className="text-6xl font-black">Enero <span className="font-light text-xl">2026</span></h3>
                  <p className="text-2xl mt-2">Calendario de actividades</p>
                </div>
                {/* Contenido del calendario simulado */}
                <div className="p-4 bg-blue-50/50 space-y-3">
                  <p className="text-xl font-semibold text-gray-700">Del 09 al 16</p>
                  <p className="text-sm text-gray-600">Listado de actividades simulado...</p>
                  <img src="/calendario-ejemplo.png" alt="Detalle calendario" className="w-full" />
                </div>
              </div>
            </CarouselContainer>

          </div>
        </div>
      </main>

      {/* Footer simulado */}
      <footer className="border-t border-gray-200 mt-20 py-10 bg-white text-center">
        <div className="max-w-7xl mx-auto px-4 text-xs space-y-4 text-gray-600">
          <p>Guatemala, 12 de enero de 2024</p>
          <p className="italic">"Id y enseñad a todos"</p>
          <p>www.divusac.edu.gt</p>
        </div>
      </footer>
    </div>
  );
}

export default App;