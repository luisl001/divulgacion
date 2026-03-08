// En tu index.js (Backend)
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';

const app = express();

app.use(cors()); 
app.use(express.json()); // Permite recibir JSON en el body de las peticiones

app.use('/api', authRoutes);

app.listen(3000, () => console.log("Servidor escuchando en el puerto 3000"));