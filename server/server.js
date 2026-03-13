import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";




const app = express();
app.use(cors());
app.use(express.json());


const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


app.post("/summarize", async (req, res) => {
  try {
    const { text } = req.body;


    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You optimize this code for AIO (AI Optimization) for better AI crawling and indexing.",
        },
        {
          role: "user",
          content: `Optimize this code for better AI crawling and indexing:\n\n${text}`,
        },
      ],
    });


    const summary = response.choices[0].message.content;


    res.json({ summary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});


app.listen(5000, () => {
  console.log("Server running on port 5000");
});
