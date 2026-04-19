import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM = `Tu es l'assistant de MindTrade, un outil de psychologie du trading. Tu aides les visiteurs du site à comprendre le produit et à décider si c'est fait pour eux.

À propos de MindTrade :
- C'est un copilote mental pour traders : check-in quotidien, score mental, signal mental, log de trades, rapport hebdomadaire, journal structuré
- Fonctionne pour tous les marchés : Forex, indices, crypto, actions, futures
- Aucune connexion broker nécessaire — saisie manuelle rapide
- Moins de 10 minutes par jour
- Tarifs : Mensuel 39€/mois, Annuel 290€/an (le plus populaire, −38%), Lifetime 597€ (paiement unique, accès à vie)
- Garantie remboursement 14 jours sans question
- Essai gratuit disponible sur /essai-gratuit (check-in mental sans inscription)
- Contact : support@mindtrade.co

Règles :
- Réponds toujours en français
- Sois concis (2-4 phrases max par réponse)
- Si quelqu'un veut acheter, oriente vers /register?plan=annual ou /essai-gratuit
- Ne promets jamais de résultats financiers garantis
- Si tu ne sais pas, dis-le honnêtement`;

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ reply: "Le chat n'est pas encore configuré. Écris-nous à support@mindtrade.co !" });
    }

    const { messages } = await req.json();

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      system: SYSTEM,
      messages,
    });

    const reply = response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("chat error:", err);
    return NextResponse.json({ reply: "Désolé, une erreur s'est produite. Réessaie dans un instant." });
  }
}
