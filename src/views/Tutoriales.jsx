import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useParams, useNavigate, Link } from 'react-router-dom'; 
import { ENDPOINTS } from '../config/apiConfig.js';

const Tutorial = ({ user: loggedInUser }) => {
  const { username } = useParams(); // Obtenemos el username de la URL
  const [profileOwner, setProfileOwner] = useState(null); 
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  // ESTADOS DE PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const navigate = useNavigate();
  const videoUrl = "https://www.youtube.com/watch?v=20fL394KlQg";
  
  const videoUrl2 = "https://www.youtube.com/watch?v=vaKk2tfcolE";
  const videoUrl3 = "https://www.youtube.com/watch?v=-Mw6cwPKvSE";

  

  return (
    <div className="max-w-6xl mx-auto p-10 min-h-screen bg-white shadow-sm border-x">
            <h3 className="text-xl font-bold text-gray-800 border-b-2 border-usac-blue pb-2 mb-4 uppercase italic">
         TUTORIALES
        </h3>

        <div style={styles.container}>
        <table >
        <tr>
            <td >  <table style={styles.table}>
        <tbody>
          {/* First Row - Title */}
          <tr>
            <td style={styles.titleCell}>
              <div style={styles.titleText}>
                tutorial 1:Crear post divulgacion 1
              </div>
            </td>
          </tr>
          
          {/* Second Row - YouTube Link */}
          <tr>
            <td style={styles.linkCell}>
              <a 
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.link}
              >
                Ver tutorial 
              </a>
            </td>
          </tr>
        </tbody>
      </table>

            </td>
          </tr>
          <tr>
            <td >
      <table style={styles.table}>
        <tbody>
          {/* First Row - Title */}
          <tr>
            <td style={styles.titleCell}>
              <div style={styles.titleText}>
                tutorial 2:Crear post divulgación plantillas y backgrounds
              </div>
            </td>
          </tr>
          
          {/* Second Row - YouTube Link */}
          <tr>
            <td style={styles.linkCell}>
              <a 
                href={videoUrl2}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.link}
              >
                Ver tutorial
              </a>
            </td>
          </tr>
        </tbody>
      </table>

            </td>
          </tr>
          <tr>
            <td >
      <table style={styles.table}>
        <tbody>
          {/* First Row - Title */}
          <tr>
            <td style={styles.titleCell}>
              <div style={styles.titleText}>
                tutorial 3:Crear divulgación con fondo propio e imágenes bullets
              </div>
            </td>
          </tr>
          
          {/* Second Row - YouTube Link */}
          <tr>
            <td style={styles.linkCell}>
              <a 
                href={videoUrl3}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.link}
              >
                Ver tutorial
              </a>
            </td>
          </tr>
        </tbody>
      </table>

            </td>
          </tr>

        </table>
    
    </div>


    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    fontFamily: "'Comic Neue', 'Comic Sans MS', 'Chalkboard SE', cursive",
    backgroundColor: '#f5f5f5',
    padding: '20px',

    // --- CHANGED/ADDED LINES FOR BACKGROUND IMAGE ---
    backgroundImage: "url('/background.jpg')", 
    backgroundSize: 'cover',        // Makes sure the image covers the entire container space
    backgroundPosition: 'center',    // Centers the image
    backgroundRepeat: 'no-repeat',  // Prevents the image from repeating like a tile
  },
  table: {
    width: '100%',
    maxWidth: '600px',
    borderCollapse: 'collapse',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  titleCell: {
    backgroundColor: '#2196F3', // Professional blue
    padding: '20px',
    textAlign: 'center',
    border: 'none'
  },
  titleText: {
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
    fontFamily: "'Comic Neue', 'Comic Sans MS', 'Chalkboard SE', cursive",
    letterSpacing: '0.5px'
  },
  linkCell: {
    backgroundColor: 'white',
    padding: '20px',
    textAlign: 'center',
    border: '1px solid #e0e0e0',
    borderTop: 'none'
  },
  link: {
    color: '#1976D2', // Professional blue
    textDecoration: 'none',
    fontSize: '16px',
    fontFamily: 'Arial, sans-serif',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  }
};

// Add hover effect for the link (using CSS)
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  a:hover {
    color: #0D47A1 !important;
    text-decoration: underline !important;
  }
`;
document.head.appendChild(styleSheet);


export default Tutorial;