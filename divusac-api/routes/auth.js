import express from 'express';
import bcrypt from 'bcrypt';
import db from '../db.js'; 
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import ImageKit from 'imagekit';
const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT // Ejemplo: https://ik.imagekit.io/tu_id
});
// --- RUTA DE REGISTRO ---
router.post('/register', async (req, res) => {
    const { name, username, email, password, isadmin } = req.body;
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        // Ajustado para incluir profile_pic por defecto si lo agregaste a la tabla
        const query = `INSERT INTO users (name, username, email, password, isadmin) VALUES (?, ?, ?, ?, ?)`;
        await db.execute(query, [name, username, email, hashedPassword, isadmin || 0]);
        res.status(201).json({ message: "Usuario creado con éxito" });
    } catch (error) {
        console.error("Error en registro:", error);
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
                name: user.name,
                username: user.username,
                email: user.email,
                isadmin: user.isadmin,
                profile_pic: user.profile_pic // IMPORTANTE: Para tu Profile.jsx
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Error en el login" });
    }
});
router.post('/post', async (req, res) => {
    const { postitle, content, image_data, user_id, category_id } = req.body;

    try {
        // subimos a la nube
        const uploadResponse = await imagekit.upload({
            file: image_data, // El base64 que viene del canvas
            fileName: `banner_${Date.now()}.png`,
            folder: "/divusac_posts"
        });

        const imageUrl = uploadResponse.url; // Esta es la URL que guardas en Railway
        const [result] = await db.execute(
            "INSERT INTO post (postitle, content, user_id, category_id, image_ref) VALUES (?, ?, ?, ?, ?)",
            [postitle, content, user_id, category_id, imageUrl] // Guardamos la URL, no el nombre de archivo local
        );

        res.status(200).json({ message: "Post creado", postId: result.insertId });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error al subir a la nube" });
    }
});
// --- RUTA DE CREAR POST local---
/*
router.post('/post', async (req, res) => {
    const { postitle, content, image_data, user_id, category_id } = req.body;

    try {
        const fileName = `banner_${Date.now()}.png`;
        const uploadPath = path.join(__dirname, '..', 'uploads'); 
        const filePath = path.join(uploadPath, fileName);
      
        await fs.mkdir(uploadPath, { recursive: true });

        if (!image_data) {
            return res.status(400).json({ error: "No se recibió la imagen del banner" });
        }

        const base64Data = image_data.replace(/^data:image\/png;base64,/, "");
        await fs.writeFile(filePath, base64Data, 'base64');
  

        const [result] = await db.execute(
            "INSERT INTO post (postitle, content, user_id, category_id, image_ref) VALUES (?, ?, ?, ?, ?)",
            [postitle, content, user_id, category_id, fileName]
        );
        res.status(200).json({ 
            message: "Post creado", 
            postId: result.insertId 
        });
    } catch (error) {
        console.error("Error procesando el post:", error);
        res.status(500).json({ error: "Error interno al guardar el post" });
    }
});

*/
// --- RUTA PARA GUARDAR METADATOS DEL CANVAS ---
router.post('/saveposdetails', async (req, res) => {
    const { post_id, title_data, content_data, notes_data, notes_text, nameofplantilla, background_data } = req.body;
    try {
        // Usamos INSERT ... ON DUPLICATE KEY UPDATE para no duplicar filas si ya existe el post_id
        const query = `
            INSERT INTO post_saved (post_id, title_data, content_data, notes_data, notes_text, nameofplantilla, background_data)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            title_data = VALUES(title_data), content_data = VALUES(content_data), 
            notes_data = VALUES(notes_data), notes_text = VALUES(notes_text), 
            nameofplantilla = VALUES(nameofplantilla), background_data = VALUES(background_data)`;
        console.log(query)
        await db.execute(query, [
            post_id, 
            JSON.stringify(title_data), 
            JSON.stringify(content_data), 
            JSON.stringify(notes_data), 
            JSON.stringify(notes_text), 
            nameofplantilla, 
            JSON.stringify(background_data)
        ]);
        res.status(200).json({ message: "Plano guardado con éxito" });
    } catch (error) {
        res.status(500).json({ error: "Error al guardar detalles" });
    }
});
// --- RUTA PARA RECUPERAR DETALLES (EDIT MODE) ---
router.get('/post-details/:postId', async (req, res) => {
    try {
        const query = `
            SELECT p.postitle, p.content, p.category_id,p.image_ref,p.date_created,u.name AS author_name, 
            u.username AS author_user, ps.* FROM post p
            JOIN users u ON p.user_id = u.id
            LEFT JOIN category c ON p.category_id = c.id
            LEFT JOIN post_saved ps ON p.id = ps.post_id
            WHERE p.id = ?`;
        
        const [rows] = await db.execute(query, [req.params.postId]);
        
        if (rows.length === 0) return res.status(404).json({ error: "Post no encontrado" });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al recuperar detalles" });
    }
});
// --- RUTA: EDITAR POST EXISTENTE (IMAGEKIT) ---
router.post('/editpost', async (req, res) => {
    const { postitle, content, image_data, category_id, postid } = req.body;

    try {
        let finalImageUrl = null;

        // 1. Verificamos si se envió una nueva imagen (base64)
        if (image_data && image_data.includes("base64")) {
            
            // Subimos la nueva imagen a ImageKit
            const uploadResponse = await imagekit.upload({
                file: image_data, // El string base64 del frontend
                fileName: `edit_${postid}_${Date.now()}.png`,
                folder: "/divusac_posts",
                useUniqueFileName: true
            });

            finalImageUrl = uploadResponse.url; // Obtenemos la URL de la nueva imagen
        }

        // 2. Ejecutamos el UPDATE en la base de datos
        let query;
        let queryParams;

        if (finalImageUrl) {
            // Si hubo imagen nueva, actualizamos todo incluyendo image_ref
            query = "UPDATE post SET postitle = ?, content = ?, category_id = ?, image_ref = ? WHERE id = ?";
            queryParams = [postitle, content, category_id, finalImageUrl, postid];
        } else {
            // Si el usuario no cambió la imagen, solo actualizamos los textos
            query = "UPDATE post SET postitle = ?, content = ?, category_id = ? WHERE id = ?";
            queryParams = [postitle, content, category_id, postid];
        }

        await db.execute(query, queryParams);

        res.status(200).json({ 
            message: "Post actualizado correctamente", 
            postId: postid,
            newUrl: finalImageUrl 
        });

    } catch (error) {
        console.error("Error al editar post:", error);
        res.status(500).json({ error: "Error interno al procesar la edición" });
    }
});

// --- RUTA: EDITAR POST EXISTENTE (local)---
/*
router.post('/editpost', async (req, res) => {
    const { postitle, content, image_data, category_id, postid } = req.body;
    try {
        const fileName = `banner_edit_${Date.now()}.png`;
        const uploadPath = path.join(__dirname, '..', 'uploads');
        const filePath = path.join(uploadPath, fileName);
        
        const base64Data = image_data.replace(/^data:image\/png;base64,/, "");
        await fs.writeFile(filePath, base64Data, 'base64');

        // SQL UPDATE corregido
        const query = "UPDATE post SET postitle = ?, content = ?, category_id = ?, image_ref = ? WHERE id = ?";
        await db.execute(query, [postitle, content, category_id, fileName, postid]);

        res.status(200).json({ message: "Post actualizado", postId: postid });
    } catch (error) {
        res.status(500).json({ error: "Error al editar post" });
    }
});
*/
// --- RUTA: OBTENER DATOS DE USUARIO POR USERNAME ---

router.get('/users/:username', async (req, res) => {
    const { username } = req.params;
    try {
        // Seleccionamos los datos necesarios
        const query = 'SELECT id, name, username, email, isadmin, profile_pic FROM users WHERE username = ?';
        const [rows] = await db.execute(query, [username]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // Devolvemos el primer (y único) resultado
        res.json(rows[0]);
    } catch (error) {
        console.error("Error al obtener usuario por username:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// --- RUTA: ELIMINAR POST ---
router.delete('/post/:id', async (req, res) => {
    const postId = req.params.id;

    try {
        // 1. (Opcional) Obtener el nombre de la imagen para borrarla del disco
        /*const [rows] = await db.execute("SELECT image_ref FROM post WHERE id = ?", [postId]);
        
        if (rows.length > 0 && rows[0].image_ref) {
            const imagePath = path.join(__dirname, '..', 'uploads', rows[0].image_ref);
            // Intentamos borrar el archivo físico (si falla no detenemos el proceso)
            fs.unlink(imagePath).catch(err => console.error("No se pudo borrar el archivo físico:", err));
        }
*/
        // 2. Eliminar de la base de datos
        // ON DELETE CASCADE en  tabla 'post_saved', 
        // al borrar el post se borrarán automáticamente sus detalles.
        const [result] = await db.execute("DELETE FROM post WHERE id = ?", [postId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "El post no existe" });
        }

        res.json({ message: "Post eliminado con éxito" });
    } catch (error) {
        console.error("Error al eliminar post:", error);
        res.status(500).json({ error: "Error interno al eliminar el post" });
    }
});
// --- RUTA DE POSTS POR USUARIO (CORREGIDA) ---
// Nota: Si este router se usa como app.use('/api', router), la URL final será /api/posts/user/:userId
router.get('/posts/user/:userId', async (req, res) => {
    const userId = req.params.userId;
    // FIX: Cambiado a tabla 'post' y columna 'image_ref' para coincidir con el resto
    const query = "SELECT id, postitle, image_ref, date_created FROM post WHERE user_id = ? ORDER BY date_created DESC";
    
    try {
        const [results] = await db.execute(query, [userId]);
        res.json(results);
    } catch (error) {
        console.error("Error obteniendo posts del usuario:", error);
        res.status(500).json({ error: "No se pudieron cargar tus publicaciones" });
    }
});

// --- RUTA DE CATEGORÍAS ---
router.get('/categories', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM category ORDER BY name ASC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener categorías" });
    }
});
// --- RUTA: BUSCAR POSTS ---
router.get('/posts/search', async (req, res) => {
    const { term } = req.query;
    try {
        const query = `
            SELECT p.*, u.username AS author, c.name AS category_name 
            FROM post p
            JOIN users u ON p.user_id = u.id
            JOIN category c ON p.category_id = c.id
            WHERE p.postitle LIKE ? OR p.content LIKE ?
            ORDER BY p.date_created DESC
        `;
        const [rows] = await db.execute(query, [`%${term}%`, `%${term}%`]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error en la búsqueda" });
    }
});
// --- RUTA DE TODOS LOS POSTS (INICIO) ---
router.get('/posts', async (req, res) => {
    try {
        const query = `
            SELECT 
                p.id, 
                p.postitle, 
                p.content, 
                p.date_created,
                u.username AS author,
                u.name AS Autorname,
                c.name AS category_name,
                p.image_ref
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