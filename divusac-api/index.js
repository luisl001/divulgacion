
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Increase the limit for JSON bodies (base64 strings)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(cors()); 
app.use(express.json()); // Permite recibir JSON en el body de las peticiones

app.use('/api', authRoutes);

app.listen(3000, () => console.log("Servidor escuchando en el puerto 3000"));
