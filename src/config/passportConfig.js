import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import conectarAoBanco from './dbConfig.js';
dotenv.config();

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET, // Coloque sua chave secreta aqui
};

export function configurePassport(passport) {
    passport.use(
        new JwtStrategy(options, async (jwt_payload, done) => {
            try {
                // const client = new MongoClient(process.env.STRING_CONEXAO);
                // await client.connect();
                const db = await conectarAoBanco();
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


// import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
// import dotenv from 'dotenv';
// import conectarAoBanco from './dbConfig.js'; // Importar a conexão reutilizável
// dotenv.config();

// const options = {
//     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//     secretOrKey: process.env.JWT_SECRET,
// };

// export function configurePassport(passport) {
//     passport.use(
//         new JwtStrategy(options, async (jwt_payload, done) => {
//             try {
//                 const db = await conectarAoBanco(); // Usar a função de conexão reutilizável
//                 const usuario = await db.collection('usuarios').findOne({ _id: jwt_payload.sub });

//                 if (usuario) {
//                     return done(null, usuario);
//                 } else {
//                     return done(null, false);
//                 }
//             } catch (error) {
//                 return done(error, false);
//             }
//         })
//     );
// }
