
import express, { Router } from "express";
import serverless from "serverless-http";
import { handler as app } from "../../app.js"; // Mettez à jour le chemin selon la structure de votre projet

const api = express();

const router = Router();
router.get("/hello", (req, res) => res.send("Hello World!"));

api.use("/api/", app);

export const handler = serverless(api);
