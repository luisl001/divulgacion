import { FaMapMarkerAlt, FaClock, FaPhoneAlt, FaEnvelope, FaBuilding } from 'react-icons/fa';

const Contact = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-fadeIn">
      {/* Encabezado Principal Estilizado */}
      <div className="mb-10 border-b-2 border-gray-100 pb-4">
        <h2 className="text-3xl font-black text-[#002d56] uppercase tracking-tight">
          Contáctanos
        </h2>
        <div className="h-1 w-20 bg-[#b2945e] mt-2"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* COLUMNA IZQUIERDA: Tarjetas de Información Dinámica (5 Columnas en LG) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Tarjeta de Ubicación */}
          <div className="bg-white p-5 rounded-sm shadow-md border-l-4 border-[#002d56] hover:shadow-lg transition-all">
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-blue-50 text-[#002d56] rounded-sm">
                <FaMapMarkerAlt size={20} />
              </div>
              <div>
                <h4 className="font-black text-sm text-[#002d56] uppercase tracking-wider mb-1">Dirección</h4>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  Edificio T-4, Facultad de Ingeniería.<br />
                  Ciudad Universitaria, Universidad de San Carlos de Guatemala, Campus Universitario, zona 12.
                </p>
              </div>
            </div>
          </div>

          {/* Tarjeta de Horarios */}
          <div className="bg-white p-5 rounded-sm shadow-md border-l-4 border-[#b2945e] hover:shadow-lg transition-all">
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-amber-50 text-[#b2945e] rounded-sm">
                <FaClock size={20} />
              </div>
              <div>
                <h4 className="font-black text-sm text-[#002d56] uppercase tracking-wider mb-1">Horarios de Oficina</h4>
                <p className="text-xs text-gray-600 leading-relaxed font-bold">
                  7:00 a 20:00 horas
                </p>
                <p className="text-[10px] text-gray-400 italic mt-0.5">De lunes a viernes</p>
              </div>
            </div>
          </div>

          {/* Tarjeta de Central Telefónica */}
          <div className="bg-white p-5 rounded-sm shadow-md border-l-4 border-[#002d56] hover:shadow-lg transition-all">
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-blue-50 text-[#002d56] rounded-sm">
                <FaPhoneAlt size={20} />
              </div>
              <div>
                <h4 className="font-black text-sm text-[#002d56] uppercase tracking-wider mb-1">Telefax / Planta</h4>
                <p className="text-xs text-gray-700 font-bold leading-relaxed tracking-wide">
                4212-000000
                </p>
                
              </div>
            </div>
          </div>

          {/* Tarjeta de Correo Electrónico */}
          <div className="bg-white p-5 rounded-sm shadow-md border-l-4 border-[#b2945e] hover:shadow-lg transition-all">
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-amber-50 text-[#b2945e] rounded-sm">
                <FaEnvelope size={20} />
              </div>
              <div>
                <h4 className="font-black text-sm text-[#002d56] uppercase tracking-wider mb-1">Correo Institucional</h4>
                <a 
                  href="mailto:ectafide_m3@usac.edu.gt" 
                  className="text-xs text-blue-800 font-bold hover:underline break-all"
                >
                 difusion@ingenieria.usac.edu.gt
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* COLUMNA DERECHA: Imagen Profesional Estilizada (7 Columnas en LG) */}
        <div className="lg:col-span-7 h-full">
          <div className="relative bg-white p-2 rounded-sm shadow-xl border border-gray-100 group overflow-hidden">
            <div className="absolute top-4 left-4 z-10 bg-[#002d56] text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-sm flex items-center gap-1.5 shadow-md">
              <FaBuilding /> Instalaciones
            </div>
            <img 
              src="https://ik.imagekit.io/yz8emyfji/divusac_posts/764d8.png" // 
              alt="Edificio T3 USAC" 
              className="w-full h-[380px] object-cover rounded-sm group-hover:scale-105 transition-transform duration-500"
              onError={(e) => e.target.src = 'https://via.placeholder.com/800x450?text=Edificio+M-3+Facultad+de+Ingenier%C3%ADa'}
            />
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;