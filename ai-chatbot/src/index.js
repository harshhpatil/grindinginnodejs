// importing the enviroment variables
import "dotenv/config";

// importing the required libraries
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "../public");


app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(publicDir));

app.get("/", (_req, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
});

app.post("/api/chat", async (req, res) => {
    const userMessage = req.body?.message;
    const chatHistory = Array.isArray(req.body?.history) ? req.body.history : [];

    if (!process.env.GROQ_API_KEY) {
        return res.status(500).json({ error: "Missing GROQ_API_KEY in environment variables." });
    }

    if (!userMessage || typeof userMessage !== "string") {
        return res.status(400).json({ error: "A valid message string is required." });
    }

    const sanitizedHistory = chatHistory
        .filter((item) => item && (item.role === "user" || item.role === "assistant") && typeof item.content === "string")
        .slice(-12);

    try{
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: GROQ_MODEL,
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant. Keep replies clear, concise, and friendly."
                    },
                    ...sanitizedHistory,
                    { role: "user", content: userMessage }
                ]
            }),
            signal: AbortSignal.timeout(20000)
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                error: data?.error?.message || "Groq API request failed."
            });
        }

        res.json({ response: data?.choices?.[0]?.message?.content ?? "" });

    } catch (err) {
        console.error("Error processing chat message:", err);
        const isTimeout =
            err?.name === "TimeoutError" ||
            err?.cause?.code === "UND_ERR_CONNECT_TIMEOUT";

        res.status(500).json({
            error: isTimeout
                ? "Could not connect to Groq API (connection timed out). Check network, VPN/firewall, or DNS."
                : "An error occurred while processing the chat message."
        });
    }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
