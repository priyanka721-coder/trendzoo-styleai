/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { products } from './src/data';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API: Health probe
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Lazy-loaded Gemini AI client instance wrapper
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    // Graceful fallback logger, no crash on startup
    console.warn("[Gemini] GEMINI_API_KEY is not configured yet. The Trendzz AI chatbot will operate in Smart Offline Rule-based mode.");
    return null;
  }

  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

// Helper function to extract relevant products for local keyword grounding to lower token footprint
function getRelevantProducts(userMessage: string): any[] {
  // Always include the 12 handcrafted base products as the main featured set
  const baseIds = new Set(["prod-01", "prod-02", "prod-03", "prod-04", "prod-05", "prod-06", "prod-07", "prod-08", "prod-09", "prod-10", "prod-11", "prod-12"]);
  const featured = products.filter(p => baseIds.has(p.id));

  // Extract keywords to match from user's message
  const query = (userMessage || "").toLowerCase();
  const words = query.split(/\s+/).filter(w => w.length > 3);

  if (words.length === 0) {
    return featured;
  }

  const matched = products.filter(p => {
    if (baseIds.has(p.id)) return false; // skip if already featured
    return words.some(word =>
      p.title.toLowerCase().includes(word) ||
      p.category.toLowerCase().includes(word) ||
      p.description.toLowerCase().includes(word)
    );
  });

  // Limit dynamic matches to top 10 products to avoid inflating token counts
  return [...featured, ...matched.slice(0, 10)];
}

// Optimized mapped representation that strips bulky fields (Unsplash image URLs, specs, etc.)
function cleanProductsForAi(productList: any[]): any[] {
  return productList.map(p => ({
    id: p.id,
    title: p.title,
    category: p.category,
    price: p.price,
    discountPrice: p.discountPrice,
    description: p.description,
    rating: p.rating,
    stock: p.stock,
    colors: p.colors || [],
    sizes: p.sizes || []
  }));
}

// Uniform offline rule-based fallback response
function getFallbackAnswering(message: string): { text: string; recommendedIds: string[] } {
  const msgLower = message.toLowerCase();
  let replyText = "";
  let recommendedIds: string[] = [];

  if (msgLower.includes('earbud') || msgLower.includes('sound') || msgLower.includes('audio') || msgLower.includes('music') || msgLower.includes('headphone') || msgLower.includes('speaker')) {
    replyText = "I found our high-fidelity **AeroPro Transparent Earbuds** [[prod-01]] and **SonicWave Gaming Headphones** [[prod-10]]! They offer premium immersive acoustics perfect for styling up your street aesthetic.";
    recommendedIds = ["prod-01", "prod-10"];
  } else if (msgLower.includes('coat') || msgLower.includes('jacket') || msgLower.includes('hoodie') || msgLower.includes('fashion') || msgLower.includes('clothing') || msgLower.includes('wear') || msgLower.includes('style') || msgLower.includes('shirt')) {
    replyText = "For dynamic high-fashion technical street apparel, I highly recommend checking out our water-resistant **Apex H-90 Carbon Techwear Hoodie** [[prod-03]] and **Futura Techwear Anorak Jacket** [[prod-08]]! These pieces offer pristine structural protection alongside deep utilitarian aesthetics.";
    recommendedIds = ["prod-03", "prod-08"];
  } else if (msgLower.includes('shoe') || msgLower.includes('sneaker') || msgLower.includes('footwear') || msgLower.includes('kick') || msgLower.includes('boot')) {
    replyText = "Take a stride into futuristic speed! Our **Velocity-9 Air Kushioned Sneakers** [[prod-04]] offer beautiful dynamic spring back and pressurized nitrogen-mesh structures to elevate your running loops.";
    recommendedIds = ["prod-04"];
  } else if (msgLower.includes('gadget') || msgLower.includes('projector') || msgLower.includes('lamp') || msgLower.includes('watch') || msgLower.includes('clock') || msgLower.includes('smart') || msgLower.includes('device')) {
    replyText = "Step up your active workspace! I suggest our health-tracking **Chronos Active Smartwatch Ultra** [[prod-02]] or the **VividLux Smart HD Pocket Projector** [[prod-09]] for cinematic lounge nights anywhere.";
    recommendedIds = ["prod-02", "prod-09"];
  } else if (msgLower.includes('wallet') || msgLower.includes('backpack') || msgLower.includes('bag') || msgLower.includes('accessory') || msgLower.includes('sunglass')) {
    replyText = "Store your daily gear safely with our heavy-duty ballistic **AeroPack 25L Commuter Backpack** [[prod-05]] or look extremely stylish in our sleek wrap-around **Futurism Cyber Glass Sunglasses** [[prod-11]]!";
    recommendedIds = ["prod-05", "prod-11"];
  } else {
    replyText = "Hello! I am your AI Stylist. I can recommend premium products from our catalog tailored to your active wardrobe, tech setups, or gaming lounges. Try asking me for 'cool techwear', 'esports gadgets', or 'rugged items'!";
    recommendedIds = ["prod-01", "prod-02", "prod-04"];
  }

  return { text: replyText, recommendedIds };
}

// API: Server-side Gemini AI Shopping Assistant chatbot proxy
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message payload is required' });
    }

    const ai = getAiClient();
    
    // Check if offline/disabled key or rate-limited fallback is triggered
    if (!ai) {
      const fallback = getFallbackAnswering(message);
      return res.json({
        text: fallback.text + "\n\n*(Tone note: Running in smart high-speed localized mode. Connect your GEMINI_API_KEY to unlock advanced conversational features!)*",
        recommendedIds: fallback.recommendedIds,
        isFallback: true
      });
    }

    // Select only products related to the user's intent to conserve tokens
    const selectedMatches = getRelevantProducts(message);
    const cleanedMatches = cleanProductsForAi(selectedMatches);

    // System instruction injected with the *relevant* subset of the Trendzz catalog
    const systemInstruction = `You are the exclusive Trendzz AI Shopping Assistant, a highly fashionable, futuristic personal stylist and active gadget guide.
Your style: futuristic, smart, friendly, witty, uses bold text, bullet points where applicable, and speaks directly to fashion-forward Gen Z audiences.
Trendzz Store Product Catalog in stock (filtered relevant items):
${JSON.stringify(cleanedMatches, null, 2)}

Your Core Guidelines:
1. Recommend actual real products from the catalog listed above matching high-street style trends, active gadgets, gaming, techwear, or lifestyle requests.
2. IMPORTANT formatting rule: When recommending a product, ALWAYS mention its exact ID wrapped inside double brackets: e.g. [[prod-01]], [[prod-04]]. The frontend reads these brackets to display dynamic cards.
3. Suggest fashion and gadgets according to requested aesthetics (e.g. Techwear, Minimalist, Cyberpunk, Gorpcore, Active, Gamer, Dorm-room, Workstation).
4. If a user asks a question about Trendzz policies (shipping, returns), refer to this: We offer free express shipping on orders over $50, 30-day free returns/exchanges, secure encrypted checkout, 2-year warranty on electronics, and 12-hour dispatch.
5. If the user talks about completely irrelevant things, politely guide them back into shopping or styling.
6. Keep answers concise (ideally under 130 words). Never invent products not listed in the provided catalog database. If the user asks for other catalog products not in the subset, invite them to use the catalog page Style Filters.`;

    // Assemble dialogue flow for Gemini call
    const chatParts: any[] = [];
    
    // Feed history context
    if (history && Array.isArray(history)) {
      history.forEach((h: any) => {
        chatParts.push({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        });
      });
    }
    
    // Add current prompt
    chatParts.push({
      role: 'user',
      parts: [{ text: message }]
    });

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: chatParts,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.8,
          topP: 0.95
        }
      });

      const reply = response.text || "I was unable to query suggestions. How else can I style your daily look?";
      
      // Parse recommended IDs from text matching [[prod-XX]] or [[gen-XX]]
      const matches = reply.match(/\[\[(prod-\d+|gen-[a-z0-9\-]+)\]\]/g);
      const recommendedIds = matches ? matches.map(m => m.replace('[[', '').replace(']]', '')) : [];

      return res.json({
        text: reply,
        recommendedIds: recommendedIds,
        isFallback: false
      });
    } catch (genAiError: any) {
      // Graceful error logging (e.g., if quota is exceeded / rate limited / 429)
      console.warn("[Gemini API Dispatch Quota or Network Trigger - Switching to Backup Mode]:", genAiError.message);
      
      const fallback = getFallbackAnswering(message);
      return res.json({
        text: fallback.text + "\n\n*(Ayer! Connect traffic has surged! I've loaded your immediate styling recommendations below via our offline memory engine.)*",
        recommendedIds: fallback.recommendedIds,
        isFallback: true
      });
    }
  } catch (error: any) {
    console.error("[Gemini AI Router Error]", error);
    try {
      const fallback = getFallbackAnswering(req.body.message || "");
      return res.json({
        text: fallback.text + "\n\n*(Trendzz system limits: Navigating via offline backup engine.)*",
        recommendedIds: fallback.recommendedIds,
        isFallback: true
      });
    } catch {
      return res.status(500).json({ 
        error: "AI recommendation channel is currently experiencing heavy weather.", 
        details: error.message 
      });
    }
  }
});

// API: Server-side Gemini AI Visual Outfit Scanner
app.post('/api/scan-outfit', async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Image payload is required' });
    }

    const ai = getAiClient();
    
    // In case there is no API key configured, use our styled default capsule outfits matching presets
    if (!ai) {
      return res.json({
        insights: "Analyzing your photograph's aesthetic profile, we curated an active, technical capsule outfit. By layering a structured utility hoodie with responsive running shoes and cyber accessories, we achieve full-spectrum street performance.",
        recommendedIds: ["prod-03", "prod-04", "prod-11"],
        isFallback: true
      });
    }

    // Clean and select our products catalog list to provide to Gemini
    const cleanCatalog = cleanProductsForAi(products);

    const imagePart = {
      inlineData: {
        mimeType: "image/jpeg",
        data: image
      }
    };

    const textPart = {
      text: `Analyze this person's clothing style, background, age/gender vibes, posture, colors, and aesthetics in the photo.
Select a complete set of 2 to 4 matching product items from our Trendzz Catalog that would look fantastic and coordinate optimally as a styled outfit.
The recommended products MUST be chosen from this catalog list of real IDs:
${JSON.stringify(cleanCatalog, null, 2)}`
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction: "You are an elite high-fashion consultant and celebrity personal stylist scanner. You speak with high expertise and recommend actual products from the active catalog.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            insights: {
              type: Type.STRING,
              description: "A summary explaining in detail (about 80 to 120 words) which aesthetics from the photo inspired your curated Trendzz outfit choices, and why this exact complete bundle fits them perfectly."
            },
            recommendedIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Array of matching product ID strings from the provided catalog (e.g. ['prod-01', 'prod-02']) that form a complete styled package."
            }
          },
          required: ["insights", "recommendedIds"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({
      insights: parsed.insights || "This set blends functional wear and tech aesthetics to elevate your wardrobe.",
      recommendedIds: parsed.recommendedIds || ["prod-03", "prod-04"],
      isFallback: false
    });

  } catch (error: any) {
    console.error("[Couture Scanner API Dispatch Error]", error);
    return res.json({
      insights: "We analyzed your street outfit and selected our flagship water-resistant hoodie alongside high-acceleration runner shoes to match your active urban style.",
      recommendedIds: ["prod-03", "prod-04", "prod-11"],
      isFallback: true
    });
  }
});

// Configure Vite or Static File Serving depending on Environment
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("[Server] Launching Express + Vite Hybrid Dev Server...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("[Server] Launching Production Standalone File Server...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Trendzz Fullstack Server] App listening on http://localhost:${PORT}`);
  });
}

startServer();
