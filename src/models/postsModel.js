import 'dotenv/config';
import { ObjectId } from 'mongodb';
import conectarAoBanco from '../config/dbConfig.js'; // Conectando ao banco

let conexao;

async function getConexao() {
    if (!conexao) {
        conexao = await conectarAoBanco(); // Estabelecendo a conexão
    }
    return conexao; // Retorna a conexão estabelecida
}

export async function getTodosPosts() {
    const db = await getConexao(); // Obtendo a conexão ao banco
    const colecao = db.collection("posts"); // Acessando a coleção "posts"
    return colecao.find().toArray(); // Retorna todos os posts
}

export async function criarPost(novoPost) {
    const db = await getConexao(); // Obtendo a conexão ao banco
    const colecao = db.collection("posts"); // Acessando a coleção "posts"
    return colecao.insertOne(novoPost); // Inserindo um novo post
}

export async function atualizarPost(id, novoPost) {
    const db = await getConexao(); // Obtendo a conexão ao banco
    const colecao = db.collection("posts"); // Acessando a coleção "posts"
    const obgID = ObjectId.createFromHexString(id); // Convertendo ID para o formato do MongoDB
    return colecao.updateOne({ _id: new ObjectId(obgID) }, { $set: novoPost }); // Atualizando o post
}

export async function deletarPost(id) {
    const db = await getConexao(); // Obtendo a conexão ao banco
    const colecao = db.collection("posts"); // Acessando a coleção "posts"
    const objID = ObjectId.createFromHexString(id); // Convertendo ID para o formato do MongoDB
    return colecao.deleteOne({ _id: objID }); // Deletando o post
}
