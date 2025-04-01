import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());

app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = ['https://popcity.cloud', 'https://www.popcity.cloud','http://127.0.0.1:5173','http://localhost:5173'];
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    // origin: '*', // Permite todas as origens (para dev)
    methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,  // Habilita cookies e cabeçalhos de autenticação
}));

app.use("/api", chatRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

