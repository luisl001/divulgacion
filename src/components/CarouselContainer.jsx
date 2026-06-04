import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const CarouselContainer = ({ title, children, onNext, onPrev }) => {
  return (
    <div className="mb-12">
      <h3 className="text-xl font-bold text-usac-blue border-b-2 border-usac-gold mb-6 inline-block uppercase tracking-wider italic">
        {title}
      </h3>
      
      <div className="relative group">
        {/* Botón Izquierdo: Ahora ejecuta onPrev */}
        <button 
          onClick={onPrev}
          className="absolute left-[-25px] top-1/2 -translate-y-1/2 bg-white/90 p-2.5 rounded-full shadow-lg z-10 text-usac-blue hover:bg-usac-blue hover:text-white transition-all duration-300 opacity-100 group-hover:opacity-100 border border-gray-100"
        >
          <FaChevronLeft size={18} />
        </button>
        
        <div className="bg-white p-4 shadow-2xl border border-gray-100 rounded-sm min-h-[450px] flex flex-col justify-center">
          {children}
        </div>

        {/* Botón Derecho: Ahora ejecuta onNext */}
        <button 
          onClick={onNext}
          className="absolute right-[-25px] top-1/2 -translate-y-1/2 bg-white/90 p-2.5 rounded-full shadow-lg z-10 text-usac-blue hover:bg-usac-blue hover:text-white transition-all duration-300 opacity-100 group-hover:opacity-100 border border-gray-100"
        >
          <FaChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default CarouselContainer;