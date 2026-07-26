import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import "./config/redis.js";
import logger from "./config/logger.js";

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

async function shutdown(signal) {
  logger.info(`${signal} received.`);

  server.close(() => {
    logger.info("Server stopped.");
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));