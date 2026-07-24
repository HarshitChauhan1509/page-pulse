import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

app.get("/health", (req, res) => {
    res.json({
        success: true,
        status: "OK"
    });
});

export default app;