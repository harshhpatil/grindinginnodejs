import "dotenv/config"
import Groq from "groq-sdk";
import readline from "readline/promises";

// initializing the client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// creating the readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

// creating the start function
async function start() {
    console.log("starting the groq....");

    try {
        while (true) {
            const ques = await rl.question("what do you wanna ask..??")

            const chatCompletion = await groq.chat.completions.create({
                "messages": [{ "role": "user", "content": ques }],
                "model": "llama-3.3-70b-versatile",
                "temperature": 0.7,
                "max_tokens": 1024,
                "stream": true
            })

            process.stdout.write("Response: ")

            for await (const chunk of chatCompletion) {
                process.stdout.write(chunk.choices[0]?.delta?.content || "");
            }
        }

    } catch (err) {
        console.log(err)
        process.exit(1);
    }
}

start();