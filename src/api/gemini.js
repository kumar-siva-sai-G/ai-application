export async function getAIResponse(userQuery, file) {
    // IMPORTANT: PASTE YOUR GOOGLE AI API KEY HERE
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const systemPrompt = `You are a helpful AI assistant. Your goal is to provide accurate and relevant information to the user.

You can respond in several ways:
- If the user asks a question, provide a clear and concise answer.
- If the user asks for code, you MUST provide a code block in the requested language.
- If the user's query is best answered with a list of resources (e.g., books, articles, tutorials), you can provide recommendations.
- You can also generate prompts for images and videos if the user's query suggests it.

Please adhere to the following rules:
- When asked for code, prioritize generating the code over providing recommendations.
- Use the codeBlock field in the response for code.
- Use the recommendations field for books, articles, etc.
- Use the answer field for plain text answers.
- Use imagePrompt or videoPrompt for multimedia generation prompts.`;
    const parts = [];
    if(userQuery) parts.push({ text: userQuery });
    if(file) parts.push({ inlineData: { mimeType: file.mimeType, data: file.data } });
    
    const payload = {
        contents: [{ parts }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: { type: "OBJECT", properties: { recommendations: { type: "ARRAY", items: { type: "OBJECT", properties: { title: { type: "STRING" }, type: { type: "STRING" }, reason: { type: "STRING" } } } }, answer: { type: "STRING" }, imagePrompt: { type: "STRING" }, videoPrompt: { type: "STRING" }, codeBlock: { type: "OBJECT", properties: { language: { type: "STRING" }, code: { type: "STRING" } } } } }
        }
    };
            
    const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!response.ok) throw new Error(`API call failed: ${response.status}`);
    const result = await response.json();
    if (result.error && result.error.message.includes('API key not valid')) throw new Error('API key not valid');
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Invalid response from text AI.");
    return JSON.parse(text);
}

export async function generateImageFromPrompt(prompt) {
    if (!prompt) {
        throw new Error("Image generation prompt is empty or invalid.");
    }
    try {
        // Use free Picsum API for random images
        const apiUrl = `https://picsum.photos/1024/1024?random=${Math.random()}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Image fetch failed (${response.status})`);
        }
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        // If fetch fails, return null to show prompt instead
        console.warn("Image fetch failed:", error);
        return null;
    }
}