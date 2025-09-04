import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import archiver from "archiver";
import { initAI } from "./aiGenerator.js"; // <-- renamed your index.js

const app = express();
app.use(cors());
app.use(bodyParser.json());

// New generate endpoint: streams zip directly
app.post("/generate", async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt required" });

    try {
        const project = await initAI(prompt);

        res.attachment(`${project.projectName || "project"}.zip`);
        const archive = archiver("zip", { zlib: { level: 9 } });
        archive.pipe(res);

        // Put everything inside "projectName/" folder
        project.files.forEach((file) => {
            archive.append(file.content, { name: `${project.projectName}/${file.path}` });
        });

        await archive.finalize();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Generation failed" });
    }
});


app.get("/", (req, res) => {
    res.json({ Program: "Hello World!" });
});

app.listen(3000, () =>
    console.log("🚀 Backend running at http://localhost:3000")
);
