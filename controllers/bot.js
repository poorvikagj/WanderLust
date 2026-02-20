const Listing = require("../models/listing");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

module.exports.msg = async (req, res) => {
    try {
        const userMessage = req.body.message;

        if (!userMessage) {
            return res.status(400).json({ error: "Message missing" });
        }
        let listings = await Listing.find({})
        ans = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: `You are a booking assistant for a travel website similar to Airbnb.
                            Only answer about bookings, places, prices, availability.
                            If unrelated, say: "I can only help with booking information."
                            These are the listings available right now : ${listings}.
                            Give the reply in a clean formatted way and be polite
                            User: ${userMessage}`,
        });

        const text = ans.text;

        console.log("GEMINI reply:", text);

        res.json({ reply: text });

    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
}

