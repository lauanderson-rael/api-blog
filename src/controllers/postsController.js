import { getTodosPosts, criarPost, atualizarPost, deletarPost } from "../models/postsModel.js"
import fs from 'fs'
//import gerarDescricaoComGemini from "../services/geminiService.js"
import conectarAoBanco from "../config/dbConfig.js"
import bcrypt from 'bcryptjs'; 

export async function listarPosts(req, res) {
    const posts = await getTodosPosts()
    res.status(200).json(posts)
}
/// new
export async function verificarUsuario(username, password) {
    const db = await conectarAoBanco();
    const usuarios = db.collection('usuarios');
    console.log("Buscando usuário:", username); // Adicione isto para verificar se o username está correto
    const usuario = await usuarios.findOne({ username });

    if (!usuario) {
        console.log("Usuário não encontrado!"); // Adicione para verificar se o usuário foi encontrado
        return null;
    }

    const isPasswordValid = await bcrypt.compare(password, usuario.password);
    console.log("Validação da senha:", isPasswordValid); // Adicione para verificar se a senha está correta
    if (isPasswordValid) {
        return usuario;
    } else {
        return null;
    }
}

/// new


export async function postarNovoPost(req, res) {
    const novopost = req.body;
    try {
        const postCriado = await criarPost(novopost)
        res.status(200).json(postCriado)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ "Erro": "Falha na requisição!" })
    }
}



export async function uploadImagem(req, res) {
    const id = req.params.id
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const novopost = {
        titulo: "",
        descricao: "",
        imgUrl: baseUrl + "/" + "???" + ".png",
        alt: "",
        link: ""
    }

    try {
        const postCriado = await criarPost(novopost)
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`
        fs.renameSync(req.file.path, imagemAtualizada)
        res.status(200).json(postCriado)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ "Erro": "Falha na requisição!" })
    }
}



export async function atualizarNovoPost(req, res) {
    const id = req.params.id
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const urlImagem = `${baseUrl}/${id}.png`

    try {
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`)
        const post = {
            imgUrl: urlImagem,
            descricao: req.body.descricao,
            titulo: req.body.titulo,
            link: req.body.link,
            alt: req.body.alt
        }

        const postCriado = await atualizarPost(id, post)
        res.status(200).json(postCriado)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ "Erro": "Falha na requisição!" })
    }
}



export async function deletarPostPorId(req, res) {
    const id = req.params.id;
    try {
        const resultado = await deletarPost(id);
        if (resultado.deletedCount === 0) {
            return res.status(404).json({ mensagem: 'Post não encontrado!' });
        }
        res.status(200).json({ mensagem: 'Post deletado com sucesso!' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ "Erro": "Falha na requisição!" });
    }
}
