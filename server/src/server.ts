import cors from "cors";
import "dotenv/config";
import express, { type ErrorRequestHandler } from "express";
import { migrate, seed } from "./db.js";
import { bookSpecsRouter, booksRouter, templatesRouter } from "./domains/books.js";
import { ordersRouter } from "./domains/orders.js";
import { petsRouter } from "./domains/pets.js";
import { recordsRouter } from "./domains/records.js";
import { fail, ok } from "./response.js";
import { uploadRoot } from "./uploads.js";

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadRoot));

migrate();
seed();

app.get("/api/health", (_req, res) => {
  ok(res, "Success", { ok: true, service: "sweetpet" });
});

app.use("/api/pets", petsRouter);
app.use("/api/records", recordsRouter);
app.use("/api/books", booksRouter);
app.use("/api/book-specs", bookSpecsRouter);
app.use("/api/templates", templatesRouter);
app.use("/api/orders", ordersRouter);

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  fail(res, 400, error.message || "request failed");
};

app.use(errorHandler);

app.listen(port, "0.0.0.0", () => {
  console.log(`sweetpet api listening on ${port}`);
});
