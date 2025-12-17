import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { AiService } from '../ai/ai.service';
import { Prisma } from '@repo/database';

@Injectable()
export class DocumentsService {
    constructor(
        private prisma: DatabaseService,
        private aiService: AiService,
    ) { }

    async create(userId: string, title: string) {
        return this.prisma.document.create({
            data: {
                title,
                type: 'PRD',
                userId,
                content: {
                    history: [], // Initialize empty history
                    status: 'draft'
                },
            },
        });
    }

    async findAll(userId: string) {
        return this.prisma.document.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
        });
    }

    async findOne(id: string, userId: string) {
        const doc = await this.prisma.document.findUnique({
            where: { id },
        });
        if (!doc || doc.userId !== userId) {
            throw new NotFoundException('Document not found');
        }
        return doc;
    }

    async submitAnswer(id: string, userId: string, answer: string) {
        const doc = await this.findOne(id, userId);

        // safe cast since we know structure
        const content = doc.content as any;
        const history = content.history || [];

        // Get last question (if any) to pair with this answer
        // For MVP, we assume the frontend sends the answer to the *last generated* question.
        // In a real robust app, we'd pass the questionId too.

        // Wait, we need to know what question this answer is for.
        // Let's assume the history is [ {q: "...", a: "..."} ].
        // We actually need the 'pending' question stored.
        // For MVP simplicity: We will just append the answer to the history structure concept.
        // Let's change history to be just Q/A pairs.

        // Actually, let's call AI to get the *next* question based on history + new answer.

        // Update history with the NEW answer
        // We need to know what the previous question was.
        // Let's assume the client sends { questionId, answer }.
        // But for now, let's trust the sequence.

        // Let's just store the conversation.
        // We need the *previous* question text to pair with this answer.
        // Since we don't store "pending question" in DB yet, let's just use the AI service to continue the flow.
        // Simple approach: The history objects will be { question: string, answer: string }.
        // When a user answers, they are answering the *last* question AI gave.

        // Fetch the last question generated (we need to store it!).
        // For MVP, let's add `currentQuestion` to content.

        const currentQuestion = content.currentQuestion;

        const newHistory = [
            ...history,
            { question: currentQuestion?.text || 'Start', answer }
        ];

        // Generate NEXT
        const nextQuestion = await this.aiService.generateNextQuestion(newHistory);

        // Update Doc
        await this.prisma.document.update({
            where: { id },
            data: {
                content: {
                    ...content,
                    history: newHistory,
                    currentQuestion: nextQuestion,
                    status: nextQuestion ? 'in_progress' : 'complete'
                }
            }
        });

        return nextQuestion;
    }

    async startSession(id: string, userId: string) {
        // Initialize the first question
        const doc = await this.findOne(id, userId);
        const content = doc.content as any;

        if (content.currentQuestion) return content.currentQuestion;

        const firstQuestion = await this.aiService.generateNextQuestion([]);

        await this.prisma.document.update({
            where: { id },
            data: {
                content: {
                    ...content,
                    currentQuestion: firstQuestion
                }
            }
        });

        return firstQuestion;
    }
}
