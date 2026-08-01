import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

// Lazy initialization helper for Gemini client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured on the server. Please add your GEMINI_API_KEY to Vercel Environment Variables.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// Configure JSON body limits to support large base64 PDFs
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// 1. API: Enhance Text with AI
app.post("/api/enhance-text", async (req, res) => {
  const { prompt, textToEnhance } = req.body;
  if (!textToEnhance || !textToEnhance.trim()) {
    return res.json({ text: "" });
  }

  const fullPrompt = `${prompt}:\n\n"${textToEnhance}"`;

  try {
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: fullPrompt,
    });
    res.json({ text: response.text || "" });
  } catch (error: any) {
    console.error("Error in /api/enhance-text:", error);
    res.status(500).json({ error: error.message || "Failed to enhance text" });
  }
});

// 2. API: Parse Resume PDF
app.post("/api/parse-resume", async (req, res) => {
  const { base64Pdf } = req.body;
  if (!base64Pdf) {
    return res.status(400).json({ error: "No PDF data provided" });
  }

  try {
    const cleanBase64 = base64Pdf.replace(/\s/g, '');
    console.log("[parse-resume] Received base64 length:", base64Pdf.length, "cleaned length:", cleanBase64.length);
    console.log("[parse-resume] Base64 start:", cleanBase64.substring(0, 100));
    
    try {
      const buffer = Buffer.from(cleanBase64, 'base64');
      console.log("[parse-resume] Decoded buffer length:", buffer.length);
      console.log("[parse-resume] Decoded PDF header (ASCII):", buffer.toString('ascii', 0, Math.min(20, buffer.length)));
      console.log("[parse-resume] Decoded PDF header (HEX):", buffer.toString('hex', 0, Math.min(10, buffer.length)));
    } catch (e: any) {
      console.error("[parse-resume] Failed to inspect PDF buffer:", e);
    }

    const prompt = `You are an expert resume parser. Analyze the attached PDF resume and extract all relevant information.
You must structure the output as a single JSON object matching the following TypeScript interface schema:

{
  "personalDetails": {
    "fullName": string,
    "jobTitle": string,
    "email": string,
    "phone": string,
    "address": string,
    "linkedin": string
  },
  "summary": string,
  "experience": [
    {
      "jobTitle": string,
      "company": string,
      "startDate": string (format: YYYY-MM or YYYY),
      "endDate": string (format: YYYY-MM, YYYY, or "Present"),
      "description": string (bullet points starting with "•" separated by newlines)
    }
  ],
  "education": [
    {
      "degree": string,
      "school": string,
      "startDate": string (format: YYYY-MM or YYYY),
      "endDate": string (format: YYYY-MM or YYYY)
    }
  ],
  "skills": string (comma-separated list of skills, e.g., "React, TypeScript, Node.js"),
  "languages": [
    {
      "name": string,
      "proficiency": string
    }
  ],
  "customSections": []
}

Rules:
1. Try to extract as much information as possible from the PDF.
2. If any fields are not found in the PDF, use an empty string or empty array as appropriate. Do not invent details not present.
3. Ensure dates are cleaned up as much as possible.
4. For the experience description, maintain bullet-pointed lists formatting them with '• ' at the start of each bullet point.
5. Provide ONLY valid JSON. No markdown wrapping (like \`\`\`json ... \`\`\`), no extra text outside the JSON.`;

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: "application/pdf"
            }
          },
          {
            text: prompt
          }
        ]
      },
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text from Gemini");
    }

    const parsed = JSON.parse(text);
    res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/parse-resume:", error);
    res.status(500).json({ error: error.message || "Failed to parse resume PDF" });
  }
});

export default app;

// Setup Vite middleware or static serving for standard Node server environment
if (!process.env.VERCEL) {
  async function setupVite() {
    if (process.env.NODE_ENV !== "production") {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*all', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }

  setupVite();
}
