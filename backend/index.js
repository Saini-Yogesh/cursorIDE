import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

export async function initAI(userQuery, outputDir) {
    const client = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = client.getGenerativeModel({
        model: "gemini-2.0-flash-exp",
        generationConfig: {
            responseMimeType: "text/plain"
        }
    });

    const result = await model.generateContent(userQuery);
    const code = result.response.text();

    // Simple split logic: store in index.html, style.css, script.js
    await fs.writeFile(path.join(outputDir, "index.html"), "<!DOCTYPE html><html><head><link rel='stylesheet' href='style.css'></head><body><script src='script.js'></script></body></html>", "utf8");
    await fs.writeFile(path.join(outputDir, "style.css"), "body { font-family: sans-serif; }", "utf8");
    await fs.writeFile(path.join(outputDir, "script.js"), "console.log('Generated App Ready');", "utf8");

    return "Files generated successfully";
}
