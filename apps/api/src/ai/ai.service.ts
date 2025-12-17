import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

export interface Question {
    id: string;
    text: string;
    type: 'text' | 'choice' | 'multi-choice';
    options?: string[];
}

@Injectable()
export class AiService {
    private openai: OpenAI | null = null;
    private readonly logger = new Logger(AiService.name);

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('OPENAI_API_KEY');
        if (apiKey) {
            this.openai = new OpenAI({ apiKey });
        } else {
            this.logger.warn('OPENAI_API_KEY not found. Running in MOCK mode.');
        }
    }

    async generateNextQuestion(
        history: { question: string; answer: string }[],
    ): Promise<Question | null> {
        if (!this.openai) {
            return this.mockGenerateQuestion(history);
        }

        try {
            const completion = await this.openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert Product Manager assistant. Your goal is to gather requirements for a PRD.
            Ask ONE clear question at a time.
            Return the response in JSON format with "text" (the question), "type" (text, choice, multi-choice), and optional "options" array.
            If you have enough information, return null.`,
                    },
                    ...history.flatMap((h) => [
                        { role: 'assistant' as const, content: h.question },
                        { role: 'user' as const, content: h.answer },
                    ]),
                ],
                model: 'gpt-3.5-turbo',
                response_format: { type: 'json_object' },
            });

            const content = completion.choices[0].message.content;
            if (!content) return null;
            return JSON.parse(content);
        } catch (error) {
            this.logger.error('OpenAI API call failed', error);
            return this.mockGenerateQuestion(history);
        }
    }

    private mockGenerateQuestion(
        history: { question: string; answer: string }[],
    ): Question | null {
        const count = history.length;
        if (count === 0) {
            return {
                id: 'q1',
                text: 'What is the name of your product?',
                type: 'text',
            };
        }
        if (count === 1) {
            return {
                id: 'q2',
                text: 'Is this B2B or B2C?',
                type: 'choice',
                options: ['B2B', 'B2C', 'Both'],
            };
        }
        if (count === 2) {
            return {
                id: 'q3',
                text: 'What are the core features?',
                type: 'multi-choice',
                options: ['Auth', 'Dashboard', 'Payments', 'Admin Panel'],
            };
        }
        // Finish after 3 questions in mock mode
        return null;
    }
}
