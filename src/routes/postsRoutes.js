
import express from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { configurePassport } from '../config/passportConfig.js';
import multer from 'multer';
import cors from 'cors';
import { atualizarNovoPost, deletarPostPorId, listarPosts, postarNovoPost, uploadImagem, verificarUsuario } from '../controllers/postsController.js';

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
    app.post("/posts", postarNovoPost); // Protegendo a rota
    app.post("/upload", upload.single("imagem"), uploadImagem);
    app.put("/upload/:id", atualizarNovoPost); // Protegendo a rota
    app.delete("/delete/:id", deletarPostPorId); // Protegendo a rota

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
            console.log("Token gerado com sucesso");
            return res.json({ token: `Bearer ${token}` });

        } catch (err) {
            console.error("Erro ao gerar token:", err);
            return res.status(500).json({ message: 'Erro interno no servidor' });
        }
    });
};

export default routes;



// passport.authenticate('jwt', { session: false }),
// passport.authenticate('jwt', { session: false }),
// passport.authenticate('jwt', { session: false }),
// passport.authenticate('jwt', { session: false }),
