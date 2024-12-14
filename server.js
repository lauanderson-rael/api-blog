import express from "express";
import routes from "./src/routes/postsRoutes.js";
import conectarAoBanco from "./src/config/dbConfig.js";

const app = express();
app.use(express.static("uploads")) // tudo que tiver nessa pasta, sera acessado
routes(app)

app.listen(process.env.PORT, () => {
    console.log("servidor rodando!")
    conectarAoBanco()
});
