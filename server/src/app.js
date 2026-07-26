import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import { requestId } from "./middlewares/requestId.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import limiter from "./middlewares/rateLimiter.js";
import auditRoutes from "./routes/audit.routes.js";
import httpLogger from "./config/httpLogger.js";


const app = express();

app.use(
    helmet({
        contentSecurityPolicy: false
    })
);
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(limiter);
app.use(requestId);
app.use(httpLogger);

app.get("/health", async (req, res) => {

    res.json({

        success: true,

        uptime: process.uptime(),

        timestamp: new Date().toISOString(),

        memory: process.memoryUsage(),

        status: "healthy"

    });

});

app.use("/api/v1/audit", auditRoutes);



app.use(errorHandler);



export default app;
