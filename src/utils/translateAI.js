import axios from 'axios';

export const translateArticles = async (articles, targetLanguage) => {
    if (!articles || articles.length === 0 || targetLanguage === 'en') return articles;
    
    const aiApiKey = import.meta.env.VITE_SMRY_KEY;
    if (!aiApiKey) return articles;

    const payload = articles.map(a => ({
        title: a.title || "",
        description: a.description || ""
    }));

    const prompt = `Translate the following JSON array of news articles into the language code '${targetLanguage}'. 
Return ONLY the translated JSON array as a raw JSON string without any markdown formatting like \`\`\`json. Do not include anything else.
Here is the JSON:
${JSON.stringify(payload)}`;

    try {
        const aiRes = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${aiApiKey}`,
            { contents: [{ role: "user", parts: [{ text: prompt }] }] },
            { headers: { "Content-Type": "application/json" } }
        );

        let aiText = aiRes.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        aiText = aiText.trim();
        if (aiText.startsWith("```json")) {
            aiText = aiText.replace(/```json/g, "").replace(/```/g, "").trim();
        }

        const translated = JSON.parse(aiText);
        
        return articles.map((article, idx) => ({
            ...article,
            title: translated[idx]?.title || article.title,
            description: translated[idx]?.description || article.description
        }));
    } catch (err) {
        console.error("AI Translation failed:", err);
        return articles;
    }
};

export const translateHeadlines = async (headlines, targetLanguage) => {
    if (!headlines || headlines.length === 0 || targetLanguage === 'en') return headlines;
    
    const aiApiKey = import.meta.env.VITE_SMRY_KEY;
    if (!aiApiKey) return headlines;

    const prompt = `Translate the following JSON array of strings into the language code '${targetLanguage}'. 
Return ONLY the translated JSON array as a raw JSON string without any markdown formatting.
${JSON.stringify(headlines)}`;

    try {
        const aiRes = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${aiApiKey}`,
            { contents: [{ role: "user", parts: [{ text: prompt }] }] },
            { headers: { "Content-Type": "application/json" } }
        );

        let aiText = aiRes.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        aiText = aiText.trim();
        if (aiText.startsWith("```json")) {
            aiText = aiText.replace(/```json/g, "").replace(/```/g, "").trim();
        }

        const translated = JSON.parse(aiText);
        return translated;
    } catch (err) {
        console.error("AI Translation failed:", err);
        return headlines;
    }
};
