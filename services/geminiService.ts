// Client-side API proxy service for Gemini AI features.
// Keeps API keys safe on the server side and avoids CORS issues.

export const enhanceTextWithAI = async (prompt: string, textToEnhance: string): Promise<string> => {
  if (!textToEnhance.trim()) {
    return "";
  }

  try {
    const response = await fetch("/api/enhance-text", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt, textToEnhance })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP error ${response.status}`);
    }

    const data = await response.json();
    return data.text || "";
  } catch (error) {
    console.error("Error enhancing text with AI:", error);
    return "Error generating text. Please try again.";
  }
};

export const parseResumePdf = async (base64Pdf: string): Promise<any> => {
  try {
    const response = await fetch("/api/parse-resume", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ base64Pdf })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP error ${response.status}`);
    }

    const parsed = await response.json();
    
    // Add unique IDs to parsed sections to support standard key indexing
    if (parsed.experience && Array.isArray(parsed.experience)) {
      parsed.experience = parsed.experience.map((exp: any) => ({
        ...exp,
        id: exp.id || crypto.randomUUID()
      }));
    } else {
      parsed.experience = [];
    }
    
    if (parsed.education && Array.isArray(parsed.education)) {
      parsed.education = parsed.education.map((edu: any) => ({
        ...edu,
        id: edu.id || crypto.randomUUID()
      }));
    } else {
      parsed.education = [];
    }
    
    if (parsed.languages && Array.isArray(parsed.languages)) {
      parsed.languages = parsed.languages.map((lang: any) => ({
        ...lang,
        id: lang.id || crypto.randomUUID()
      }));
    } else {
      parsed.languages = [];
    }
    
    if (parsed.customSections && Array.isArray(parsed.customSections)) {
      parsed.customSections = parsed.customSections.map((sec: any) => ({
        ...sec,
        id: sec.id || crypto.randomUUID()
      }));
    } else {
      parsed.customSections = [];
    }

    return parsed;
  } catch (error) {
    console.error("Error parsing resume PDF with Gemini:", error);
    throw error;
  }
};
