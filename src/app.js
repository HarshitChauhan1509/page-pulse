import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import { requestId } from "./middlewares/requestId.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import auditRoutes from "./routes/audit.routes.js";


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

app.use(requestId);

app.use("/api/v1/audit", auditRoutes);



app.use(errorHandler);


export default app;