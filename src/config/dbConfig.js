import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';

let conexao;

async function conectarAoBanco() {
    if (!conexao) {
        const client = new MongoClient(process.env.STRING_CONEXAO);
        await client.connect();
        conexao = client.db('imersao-instabytes'); // Definindo o banco de dados
    }
    console.log("conectado ao banco")
    return conexao; // Retorna a conexão ao banco de dados
}

export async function verificarUsuario(username, password) {
    const db = await conectarAoBanco(); // Aguardando a conexão com o banco
    const usuarios = db.collection('usuarios'); // Defina a coleção de usuários
    const usuario = await usuarios.findOne({ username }); // Encontrando o usuário

    if (!usuario) return null;

    const isPasswordValid = await bcrypt.compare(password, usuario.password); // Verificando a senha
    if (isPasswordValid) {
        return usuario; // Retorna o usuário se a senha for válida
    } else {
        return null;
    }
}

export default conectarAoBanco; // Exportando a função de conexão
