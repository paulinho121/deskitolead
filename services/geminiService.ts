
import { GoogleGenAI, Type } from "@google/genai";

const getApiKey = () => {
  return localStorage.getItem('gemini_api_key') || process.env.GEMINI_API_KEY || process.env.API_KEY || '';
};

export const analyzeLeadWebsite = async (leadName: string, website: string, industry: string) => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  
  // Since we can't actually scrape live URLs here without a proxy/backend, 
  // we simulate the "content" of the website being passed to Gemini.
  // In a real app, you'd fetch the HTML, strip tags, and send text.
  
  const prompt = `Analyze this B2B company and provide strategic sales insights. 
  Company Name: ${leadName}
  Website: ${website}
  Industry: ${industry}
  
  Task: 
  1. Identify 3 main products or services.
  2. Estimate their target audience.
  3. Suggest a personalized cold email opening line.
  4. Identify potential pain points based on their industry.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Unable to generate AI insights at this time.";
  }
};

export const generateLeadScore = async (leadData: any) => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Score this B2B lead from 0 to 100 based on potential value. Return JSON only.
    Data: ${JSON.stringify(leadData)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          reason: { type: Type.STRING }
        },
        required: ["score", "reason"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};
