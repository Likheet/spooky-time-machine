import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Coordinates, TimeSelection } from '../types';

export class TextGeneratorService {
    private genAI: GoogleGenerativeAI | null = null;
    private model: any = null;

    constructor(apiKey?: string) {
        const key = apiKey || (import.meta.env?.VITE_GEMINI_API_KEY as string);
        if (key) {
            this.setApiKey(key);
        }
    }

    setApiKey(apiKey: string) {
        if (!apiKey) {
            this.genAI = null;
            this.model = null;
            return;
        }
        this.genAI = new GoogleGenerativeAI(apiKey);
        // Use specific version of gemini-1.5-flash for stability
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    }

    async generateSpookyStory(location: Coordinates, time: TimeSelection): Promise<{ title: string; story: string }> {
        if (!this.model) {
            throw new Error('Gemini API key not configured. Please add your key in settings.');
        }

        const locationName = location.name || `Latitude ${location.latitude.toFixed(2)}, Longitude ${location.longitude.toFixed(2)}`;

        const prompt = `Write a short, spooky title and an atmospheric background story (max 80 words) for a historical scene in ${locationName} during ${time.displayName}. 
    The story should be eerie, mysterious, and fit a Halloween theme. 
    Focus on the shadows, the unknown, and the supernatural vibes of that specific time and place.
    
    Format the output exactly like this:
    TITLE: [Insert Spooky Title Here]
    STORY: [Insert Story Here]`;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Parse title and story
            const titleMatch = text.match(/TITLE:\s*(.+)(?:\n|$)/);
            const storyMatch = text.match(/STORY:\s*(.+)(?:\n|$)/s); // s flag for dotAll if story spans lines? Actually match until end

            let title = titleMatch ? titleMatch[1].trim() : 'The Haunting of ' + locationName;
            let story = storyMatch ? storyMatch[1].trim() : text.replace(/TITLE:.*?\n/, '').trim();

            // Fallback if parsing fails but we have text
            if (!story && text) story = text;

            return { title, story };
        } catch (error) {
            console.error('Gemini generation error:', error);
            throw error;
        }
    }
}

export const textGeneratorService = new TextGeneratorService();
