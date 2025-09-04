import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import archiver from "archiver";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import { initAI } from "./index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/downloads", express.static(path.join(__dirname, "downloads")));

app.post("/generate", async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt required" });

    const id = uuidv4();
    const projectDir = path.join(__dirname, "downloads", id);
    fs.mkdirSync(projectDir, { recursive: true });

    try {
        await initAI(prompt, projectDir);

        const zipPath = path.join(__dirname, "downloads", `${id}.zip`);
        const output = fs.createWriteStream(zipPath);
        const archive = archiver("zip", { zlib: { level: 9 } });

        archive.pipe(output);
        archive.directory(projectDir, false);
        await archive.finalize();

        return res.json({ downloadUrl: `/downloads/${id}.zip` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Generation failed" });
    }
});

app.listen(3000, () => console.log("🚀 Backend running at http://localhost:3000"));
