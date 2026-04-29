import cors from "cors";
import "dotenv/config";
import express, { type ErrorRequestHandler } from "express";
import { migrate, seed } from "./db.js";
import { booksRouter } from "./domains/books/books.router.js";
import { ordersRouter } from "./domains/orders/orders.router.js";
import { petsRouter } from "./domains/pets/pets.router.js";
import { recordsRouter } from "./domains/records/records.router.js";
import { fail, ok } from "./response.js";
import { uploadRoot } from "./uploads.js";

const port = Number(process.env.PORT ?? 4000);

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use("/uploads", express.static(uploadRoot));

  app.get("/api/health", (_req, res) => {
    ok(res, "Success", { ok: true, service: "sweetpet" });
  });

  app.use("/api/pets", petsRouter);
  app.use("/api/records", recordsRouter);
  app.use("/api/books", booksRouter);
  app.use("/api/orders", ordersRouter);

  app.use("/api", (req, res) => {
    fail(res, 404, `API 경로를 찾을 수 없습니다: ${req.path}`);
  });

  const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
    fail(res, 400, error.message || "request failed");
  };

  app.use(errorHandler);

  return app;
}

export function startServer() {
  migrate();
  seed();

  const app = createApp();
  return app.listen(port, "0.0.0.0", () => {
    console.log(`sweetpet api listening on ${port}`);
  });
}

if (process.env.NODE_ENV !== "test") {
  startServer();
}
