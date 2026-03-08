import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const CarouselContainer = ({ title, children }) => {
  return (
    <div className="mb-12">
      {}
      <h3 className="text-xl font-bold text-usac-blue border-b-2 border-usac-gold mb-6 inline-block uppercase tracking-wider">
        {title}
      </h3>
      
      <div className="relative group">
        {/* Botón de Navegación Izquierdo */}
        <button className="absolute left-[-25px] top-1/2 -translate-y-1/2 bg-white/90 p-2.5 rounded-full shadow-lg z-10 text-usac-blue hover:bg-usac-blue hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 border border-gray-100">
          <FaChevronLeft size={18} />
        </button>
        
        {/* Área de Contenido Principal */}
        <div className="bg-white p-8 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] border border-gray-100 rounded-sm min-h-[450px] flex flex-col justify-center">
          {children}
        </div>

        {/* Botón de Navegación Derecho */}
        <button className="absolute right-[-25px] top-1/2 -translate-y-1/2 bg-white/90 p-2.5 rounded-full shadow-lg z-10 text-usac-blue hover:bg-usac-blue hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 border border-gray-100">
          <FaChevronRight size={18} />
        </button>
      </div>
      
      {}
      <div className="flex justify-center mt-4 space-x-2">
        <div className="h-1 w-8 bg-usac-blue rounded-full"></div>
        <div className="h-1 w-2 bg-gray-300 rounded-full"></div>
        <div className="h-1 w-2 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  );
};

export default CarouselContainer;