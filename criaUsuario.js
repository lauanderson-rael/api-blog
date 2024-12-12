import bcrypt from 'bcryptjs';
import conectarAoBanco from './src/config/dbConfig.js';
import 'dotenv/config'; // Carregar variáveis de ambiente

// Função para criar um novo usuário
async function criarUsuario(username, password) {
    try {
        const db = await conectarAoBanco();  // Conecta ao banco de dados
        const usuarios = db.collection('usuarios');  // Seleciona a coleção 'usuarios'

        // Verifica se o usuário já existe
        const usuarioExistente = await usuarios.findOne({ username });
        if (usuarioExistente) {
            console.log('Usuário já existe!');
            return;
        }

        // Criptografa a senha antes de salvar
        const salt = await bcrypt.genSalt(10);  // Gera um "sal" para aumentar a segurança
        const senhaCriptografada = await bcrypt.hash(password, salt);  // Criptografa a senha

        // Cria o objeto do usuário
        const novoUsuario = {
            username,
            password: senhaCriptografada,  // Salva a senha criptografada
        };

        // Insere o novo usuário no banco de dados
        const resultado = await usuarios.insertOne(novoUsuario);
        console.log('Usuário criado com sucesso!', resultado.insertedId);
    } catch (erro) {
        console.error('Erro ao criar usuário:', erro);
    }
}

// Chamando a função para criar um novo usuário
// Exemplo de uso:
criarUsuario('lau', 'Rael003*');
