// À placer dans : api/generate.js (à la racine du projet)
// Fonction serverless Vercel — appelle l'API Anthropic (Claude)
// Clé API sur : https://console.anthropic.com

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  // Clé à définir dans Vercel : Settings > Environment Variables > ANTHROPIC_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { messages, max_tokens = 5000 } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Paramètre 'messages' manquant" });
  }

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens,
      messages,
    });

    return res.status(200).json(response);

  } catch (err) {
    console.error("Erreur API Anthropic :", err);
    return res.status(500).json({ error: err.message || "Erreur serveur" });
  }
}
