import OpenAI from 'openai';

const OPENAI_API_KEY = '***'; // Move to environment variables
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export async function generateProfileSummaries(responses: any) {
    try {
        const prompt = `Summarize each response in 1-8 words:

Location: "${responses.location.answer}"
Hobbies: "${responses.hobbies.answer}"
Music: "${responses.music.answer}"
Entertainment: "${responses.entertainment.answer}"
Travel: "${responses.travel.answer}"
Goals: "${responses.aspirations.answer}"

Return ONLY a JSON object in this exact format:
{
    "location": "brief summary",
    "hobbies": "brief summary",
    "music": "brief summary",
    "entertainment": "brief summary",
    "travel": "brief summary",
    "goals": "brief summary"
}`;

        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are a profile summarizer. Create concise, accurate summaries.'
                },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 200
        });

        const summaryContent = completion.choices[0].message.content;
        if (!summaryContent) {
            throw new Error('No content received from OpenAI');
        }
        const summaries = JSON.parse(summaryContent);
        
        return {
            ...summaries,
            isVisible: true  // Add visibility flag
        };
    } catch (error) {
        console.error('Error generating summaries:', error);
        throw error;
    }
}