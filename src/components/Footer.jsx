import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebookF, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  return (
  
    <footer className="bg-[#DAE6F5] text-[#003366] py-10 border-t-4 border-[#9C8107] mt-auto">
      <div className="max-w-screen-2xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* SECCIÓN LOGOS */}
        <div className="flex items-center gap-6 border-r-0 md:border-r border-blue-400 pr-0 md:pr-8">
          <div className="flex items-center gap-4">
            
            {/* Ajuste de contenedor de imagen y texto inferior */}
            <div className="text-right border-r pr-4 border-blue-400">
              <img 
                src="https://ik.imagekit.io/yz8emyfji/divusac_posts/difusion.png" 
                alt="Logo UDIA" 
                // 2. Ajustado a h-16 para que quepa bien en el borde
                className="h-16 w-auto object-contain mb-1" 
              />
              <p className="text-[10px] uppercase font-black tracking-widest opacity-80">
                Facultad de Ingeniería
              </p>
            </div>

            <div className="text-left">
              <p className="text-[9px] uppercase font-bold leading-tight opacity-70">
                Universidad de San Carlos
              </p>
              <p className="text-[9px] uppercase font-bold leading-tight opacity-70">
                de Guatemala
              </p>
            </div>
            
          </div>
        </div>

        {/* SECCIÓN CONTACTO */}
        <div className="flex-1 flex flex-col gap-3 text-[15px] font-medium">
          <div className="flex items-start gap-3">
            <FaMapMarkerAlt className="mt-1 opacity-60" />
            <p className="opacity-90">
              Ciudad Universitaria, zona 12, Edificio T-4, Facultad de Ingeniería.<br/>
              Guatemala, Centroamérica.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <FaPhone className="opacity-60" />
            <p className="font-bold opacity-90">PBX: (+502) 4212-00000</p>
          </div>

          <div className="flex items-center gap-3">
            <FaEnvelope className="opacity-60" />
            <div className="flex flex-col">
              {/* Cambiado hover:text-blue-400 a hover:text-blue-800 para contraste */}
              <a href="mailto:difusion@ingenieria.usac.edu.gt" className="hover:text-blue-800 transition-colors underline">
                difusion@ingenieria.usac.edu.gt
              </a>
            </div>
          </div>
        </div>

        {/* REDES SOCIALES */}
        <div className="flex flex-col items-center md:items-end gap-4 border-l-0 md:border-l border-blue-400 pl-0 md:pl-8">
          <div className="flex gap-6">
            <a href="https://facebook.com" target="_blank" className="hover:scale-110 transition-all text-[#003366]">
              <FaFacebookF size={22} />
            </a>
            <a href="https://x.com" target="_blank" className="hover:scale-110 transition-all text-[#003366]">
              <FaXTwitter size={22} />
            </a>
            <a href="https://youtube.com" target="_blank" className="hover:scale-110 transition-all text-[#003366]">
              <FaYoutube size={22} />
            </a>
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">
            © {new Date().getFullYear()} DIVUSAC - Ingeniería USAC
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;