import express from 'express';
import bcrypt from 'bcrypt';
import db from '../db.js'; // Verifica que la ruta a db.js sea correcta desde la carpeta routes

const router = express.Router();

// --- RUTA DE REGISTRO ---
router.post('/register', async (req, res) => {
    const { name, username, email, password, isadmin } = req.body;
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const query = `INSERT INTO users (name, username, email, password, isadmin) VALUES (?, ?, ?, ?, ?)`;
        await db.execute(query, [name, username, email, hashedPassword, isadmin || 0]);
        res.status(201).json({ message: "Usuario creado con éxito" });
    } catch (error) {
        res.status(500).json({ error: "Error en el registro" });
    }
});

// --- RUTA DE LOGIN ---
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length === 0) return res.status(401).json({ error: "Usuario no encontrado" });
        
        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Clave incorrecta" });

        res.json({
            message: "Login exitoso",
            user: {
                id: user.id,
                name: user.name,         // 
                username: user.username, // 
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Error en el login" });
    }
});

// En routes/auth.js o routes/posts.js
router.post('/post', async (req, res) => {
    const { postitle, content, labels, category_id, user_id, username } = req.body;

    // Log para auditoría interna de la facultad
    console.log(`Intento de publicación por: ${username} (ID: ${user_id})`);

    try {
        const query = `
            INSERT INTO post (postitle, content, labels, user_id, category_id, date_created) 
            VALUES (?, ?, ?, ?, ?, NOW())
        `;
        
        const [result] = await db.execute(query, [
            postitle, 
            content, 
            labels || '', 
            user_id, 
            category_id
        ]);

        res.status(201).json({ 
            message: "Post creado exitosamente", 
            postId: result.insertId 
        });
    } catch (error) {
        console.error("Error al insertar post:", error);
        res.status(500).json({ error: "No se pudo guardar la noticia en la base de datos" });
    }
});

// Ruta para obtener todos los posts (para el carrusel de INICIO)
router.get('/posts', async (req, res) => {
    try {
        const query = `
            SELECT 
                p.id, 
                p.postitle, 
                p.content, 
                p.labels, 
                p.date_created,
                u.username AS author,
                u.name AS Autorname,
                c.name AS category_name
            FROM post p
            JOIN users u ON p.user_id = u.id
            JOIN category c ON p.category_id = c.id
            ORDER BY p.date_created DESC
        `;
        
        const [rows] = await db.execute(query);
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener posts:", error);
        res.status(500).json({ error: "No se pudieron cargar las noticias" });
    }
});

export default router;