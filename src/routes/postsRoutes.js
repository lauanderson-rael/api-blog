// import express from 'express'
// import multer from 'multer';
// import cors from 'cors'
// import jwt from 'jsonwebtoken';
// import { verificarUsuario } from '../config/dbConfig.js';
// import { atualizarNovoPost, deletarPostPorId, listarPosts, postarNovoPost, uploadImagem } from '../controllers/postsController.js';

// // avisar que vamos receber requisicoes de uma link externo
// const corsOptions = {
//     origin: "*", // Permite qualquer origem
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     optionsSuccessStatus: 200 // Corrigido o typo de "optiosSuccessStatus" para "optionsSuccessStatus"
// }

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/');

//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname);
//     }
// })

// const upload = multer({ dest: './uploads', storage })

// const routes = (app) => {
//     app.use(express.json())
//     app.use(cors(corsOptions))
//     app.use(express.urlencoded({ extended: true})) // interpretar formularios
//     app.use('/uploads', express.static('uploads'))

//     app.get("/posts", listarPosts);
//     app.post("/posts", postarNovoPost)
//     app.post("/upload", upload.single("imagem"), uploadImagem)

//     app.put("/upload/:id", atualizarNovoPost)

//     app.delete("/delete/:id", deletarPostPorId)

//     app.post('/login', async (req, res) => {
//         const { username, password } = req.body;
    
//         try {
//             const usuario = await verificarUsuario(username, password);
    
//             if (!usuario) {
//                 return res.status(401).json({ message: 'Autenticação falhou' });
//             }
    
//             // Gera o token JWT
//             const payload = { sub: usuario._id, name: usuario.username };
//             const token = jwt.sign(payload, 'your_secret_key', { expiresIn: '1h' });
    
//             return res.json({ token: `Bearer ${token}` });
//         } catch (err) {
//             return res.status(500).json({ message: 'Erro interno no servidor' });
//         }
//     });
// }

// export default routes;

import express from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { configurePassport } from '../config/passportConfig.js';
import multer from 'multer';
import cors from 'cors';
import { atualizarNovoPost, deletarPostPorId, listarPosts, postarNovoPost, uploadImagem, verificarUsuario} from '../controllers/postsController.js';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ dest: './uploads', storage });

const routes = (app) => {
    app.use(express.json());
    app.use(cors());
    app.use(express.urlencoded({ extended: true }));
    app.use('/uploads', express.static('uploads'));

    // Configura o Passport
    configurePassport(passport);
    app.use(passport.initialize());

    app.get("/posts", listarPosts);
    app.post("/posts", passport.authenticate('jwt', { session: false }), postarNovoPost); // Protegendo a rota
    app.post("/upload", upload.single("imagem"),passport.authenticate('jwt', { session: false }), uploadImagem);
    app.put("/upload/:id", passport.authenticate('jwt', { session: false }), atualizarNovoPost); // Protegendo a rota
    app.delete("/delete/:id", passport.authenticate('jwt', { session: false }), deletarPostPorId); // Protegendo a rota

    app.post('/login', async (req, res) => {
        const { username, password } = req.body;
        try {
            const usuario = await verificarUsuario(username, password);
            if (!usuario) {
                return res.status(401).json({ message: 'Autenticação falhou' });
            }
            // Gera o token JWT
            const payload = { sub: usuario._id, name: usuario.username };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    
            // Verifica se o token foi gerado corretamente
            console.log("Token gerado:", token);
    
            return res.json({ token: `Bearer ${token}` });
        } catch (err) {
            console.error("Erro ao gerar token:", err);
            return res.status(500).json({ message: 'Erro interno no servidor' });
        }
    });
};

export default routes;
