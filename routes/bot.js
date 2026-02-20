const express = require("express");
const router = express.Router();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});


router.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;

        if (!userMessage) {
            return res.status(400).json({ error: "Message missing" });
        }

        ans = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `You are a booking assistant for a travel website similar to Airbnb.
                            Only answer about bookings, places, prices, availability.
                            If unrelated, say: "I can only help with booking information."

                            User: ${userMessage}`,
        });

        const text = ans.text;

        console.log("GEMINI reply:", text);

        res.json({ reply: text });

    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

module.exports = router;