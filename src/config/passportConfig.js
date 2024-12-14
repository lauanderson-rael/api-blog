import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import conectarAoBanco from './dbConfig.js';
import { conexao } from './dbConfig.js';
dotenv.config();

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET, // Coloque sua chave secreta aqui
};

export function configurePassport(passport) {
    passport.use(
        new JwtStrategy(options, async (jwt_payload, done) => {
            console.log('Payload JWT recebido:', jwt_payload);
            try {
                // const client = new MongoClient(process.env.STRING_CONEXAO);
                // await client.connect();
                const db = conexao
                const usuario = await db.collection('usuarios').findOne({ _id: jwt_payload.sub });

                if (usuario) {
                    return done(null, usuario);
                } else {
                    return done(null, false);
                }
            } catch (error) {
                return done(error, false);
            }
        })
    );
}
