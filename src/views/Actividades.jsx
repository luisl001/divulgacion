import { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight, FaPlay, FaPause } from 'react-icons/fa';

/* Keyframes for the radiation / ripple rings */
const radiationStyles = `
  @keyframes radiateRing {
    0%   { transform: scale(1);   opacity: 0.5; }
    100% { transform: scale(2.1); opacity: 0;   }
  }
  .ring-1 { animation: radiateRing 3.2s ease-out infinite; animation-delay: 0s;    }
  .ring-2 { animation: radiateRing 3.2s ease-out infinite; animation-delay: 1.05s; }
  .ring-3 { animation: radiateRing 3.2s ease-out infinite; animation-delay: 2.1s;  }

  /* Egg shape: taller than wide, softer at top, rounder at bottom */
  .egg-frame {
    border-radius: 50% 50% 50% 50% / 42% 42% 58% 58%;
    overflow: hidden;
  }
  .egg-ring {
    border-radius: 50% 50% 50% 50% / 42% 42% 58% 58%;
  }
`;

const Actividades = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timeoutRef = useRef(null);

  const slides = [
    {
      id: 1,
      tag: "Slide 1",
      title: "UNIDAD DE DIVULGACION",
      description:
        "La Unidad de Divulgación e Información Académica de la Facultad de Ingeniería de la Universidad de San Carlos de Guatemala es un departamento encargado de comunicar y difundir las actividades académicas, científicas y culturales que se realizan dentro de la facultad. Esta unidad pertenece al área administrativa y de comunicación institucional de la Facultad de Ingeniería y tiene como objetivo mantener informada a la comunidad universitaria sobre eventos, proyectos, investigaciones y actividades desarrolladas por estudiantes, docentes y autoridades. Su labor es importante porque permite fortalecer la imagen institucional y promover el trabajo académico de la facultad.",
      image: "/divulg.jpg",
      bgClass: "from-[#5D8ABA] to-[#90B6DE]",
    },
    {
      id: 2,
      tag: "Slide 2",
      title: "FUNCIONES Y OBJETIVOS",
      description:
        "Entre las principales funciones de esta unidad se encuentra la cobertura de eventos académicos, conferencias, congresos, ferias científicas, graduaciones y actividades estudiantiles. Según documentos oficiales de la facultad, la Unidad de Difusión e Información Académica realiza producciones visuales, fotografías, publicaciones y material informativo para divulgar las actividades de las diferentes escuelas y departamentos de Ingeniería. También colabora en la difusión de información institucional mediante medios digitales, páginas web, periódicos universitarios y redes sociales.",
      image: "/cuphand.jpg",
      bgClass: "from-[#5D8ABA] to-[#90B6DE]",
    },
    {
      id: 3,
      tag: "Slide 3",
      title: "PROMOCION DE LA INVESTIGACION",
      description:
        "Otro aspecto importante es que la unidad apoya la promoción de investigaciones científicas y publicaciones académicas. La Facultad de Ingeniería cuenta con diversas revistas, periódicos digitales y repositorios donde se publican investigaciones relacionadas con ingeniería civil, mecánica, sistemas, recursos hídricos y otras áreas técnicas. La divulgación de estos trabajos permite que estudiantes, docentes e investigadores compartan conocimientos con la comunidad universitaria y con la sociedad guatemalteca. Además, la unidad contribuye a fortalecer la comunicación entre las distintas escuelas de ingeniería y la población estudiantil.",
      image: "/graduation.jpg",
      bgClass: "from-[#5D8ABA] to-[#90B6DE]",
    },
  ];

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      resetTimeout();
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === slides.length - 1 ? 0 : prevIndex + 1
        );
      }, 10000);
    }
    return () => resetTimeout();
  }, [currentIndex, isPlaying]);

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-fadeIn">
      <style>{radiationStyles}</style>

      {/* Encabezado Institucional */}
      <div className="mb-10 border-b-2 border-gray-100 pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-[#002d56] uppercase tracking-tight">
            Actividades y Gestión
          </h2>
          <div className="h-1 w-20 bg-[#5D8ABA] mt-2"></div>
        </div>

        <button
          onClick={togglePlay}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all shadow-sm ${
            isPlaying ? 'bg-blue-100 text-blue-700' : 'bg-blue-200 text-blue-800'
          }`}
        >
          {isPlaying ? (
            <>
              <FaPause className="animate-pulse" /> Auto Reproducción Activa
            </>
          ) : (
            <>
              <FaPlay /> Presentación Estática (Play)
            </>
          )}
        </button>
      </div>

      {/* CONTENEDOR DEL CARRUSEL GRÁFICO */}
      {/* CORRECCIÓN: Eliminado min-h rígido.  */}
      <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-[#5D8ABA] to-[#2a5f9e] text-white flex items-center">

        {/* Abstract background decorations */}
        <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[60%] bg-white/10 rounded-full blur-3xl transform rotate-45 pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[50%] bg-black/20 rounded-3xl transform rotate-12 pointer-events-none"></div>

        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
      
            className={`w-full px-6 md:px-14 pt-12 pb-32 grid grid-cols-1 md:grid-cols-12 gap-6 items-center transition-all duration-500 ease-in-out bg-gradient-to-br ${slide.bgClass} ${
              index === currentIndex
                ? 'relative opacity-100 pointer-events-auto z-10 block'
                : 'absolute inset-0 opacity-0 pointer-events-none z-0 invisible'
            }`}
          >
            {/* ── IMAGE SIDE ── */}
            <div className="md:col-span-5 flex flex-col items-center justify-center relative">
              <div className="relative flex items-center justify-center" style={{ padding: '3.5rem' }}>
                {/* Egg radiation rings */}
                <div className="ring-1 absolute border-2 border-white/35" style={{ inset: '-10px', borderRadius: '50% 50% 50% 50% / 42% 42% 58% 58%' }} />
                <div className="ring-2 absolute border-2 border-white/35" style={{ inset: '-10px', borderRadius: '50% 50% 50% 50% / 42% 42% 58% 58%' }} />
                <div className="ring-3 absolute border-2 border-white/35" style={{ inset: '-10px', borderRadius: '50% 50% 50% 50% / 42% 42% 58% 58%' }} />

                {/* Glow halo */}
                <div className="absolute inset-0 bg-white/15 blur-xl" style={{ borderRadius: '50% 50% 50% 50% / 42% 42% 58% 58%' }} />

                {/* Image */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="relative z-10 border-[3px] border-white/30 shadow-2xl object-cover"
                  style={{
                    width: '280px',
                    height: '350px',
                    borderRadius: '50% 50% 50% 50% / 42% 42% 58% 58%',
                  }}
                />
              </div>
            </div>

            {/* ── TEXT SIDE ── */}
            {/* CORRECCIÓN: Se agrega max-w-2xl para contener el ancho en pantallas grandes y asegurar legibilidad */}
            <div className="md:col-span-7 text-center md:text-left space-y-4 pb-4 max-w-2xl">
              <span className="bg-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full backdrop-blur-sm">
                {slide.tag}
              </span>
              <h3 className="text-4xl md:text-5xl font-black tracking-tight leading-tight uppercase font-serif drop-shadow-md">
                {slide.title.split(' ')[0]}{' '}
                <span className="text-blue-100 block md:inline">
                  {slide.title.split(' ').slice(1).join(' ')}
                </span>
              </h3>
              <p className="text-sm md:text-base text-white/95 leading-relaxed font-normal">
                {slide.description}
              </p>
            </div>
          </div>
        ))}

        {/* CONTROLES DE NAVEGACIÓN */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-6 bg-black/30 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 shadow-lg">
          <button
            onClick={handlePrev}
            className="hover:scale-125 text-white/70 hover:text-white transition-all p-1"
            title="Anterior"
          >
            <FaChevronLeft size={18} />
          </button>

          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentIndex(i);
                }}
                className={`h-2 transition-all duration-500 rounded-full ${
                  i === currentIndex
                    ? 'w-8 bg-white'
                    : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="hover:scale-125 text-white/70 hover:text-white transition-all p-1"
            title="Siguiente"
          >
            <FaChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Actividades;