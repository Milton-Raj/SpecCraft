import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Role } from '@repo/database';

@Injectable()
export class AdminService {
    constructor(private readonly databaseService: DatabaseService) { }

    // --- Users ---
    async findAllUsers() {
        return this.databaseService.user.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                plan: true,
                isVerified: true,
                createdAt: true
            }
        });
    }

    async createUser(data: any) {
        // In a real app, you would hash password here.
        // For MVP, if no password provided, set detailed default
        return this.databaseService.user.create({
            data: {
                ...data,
                password: data.password || 'TemporaryPass123!', // Ensure this is hashed in User Service or middleware
                isVerified: true
            }
        });
    }

    async updateUser(id: string, data: any) {
        return this.databaseService.user.update({
            where: { id },
            data,
        });
    }

    async updateUserRole(id: string, role: string) {
        return this.databaseService.user.update({
            where: { id },
            data: { role: role as any },
        });
    }

    async deleteUser(id: string) {
        return this.databaseService.user.delete({ where: { id } });
    }

    // --- Documents ---
    async findAllDocuments() {
        return this.databaseService.document.findMany({
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true, email: true } } }
        });
    }

    async deleteDocument(id: string) {
        return this.databaseService.document.delete({ where: { id } });
    }

    // --- Templates ---
    async findAllTemplates() {
        return this.databaseService.template.findMany({ orderBy: { createdAt: 'desc' } });
    }

    async createTemplate(data: any) {
        return this.databaseService.template.create({ data });
    }

    async updateTemplate(id: string, data: any) {
        return this.databaseService.template.update({ where: { id }, data });
    }

    async deleteTemplate(id: string) {
        return this.databaseService.template.delete({ where: { id } });
    }

    // --- Plans ---
    async findAllPlans() {
        return this.databaseService.pricingPlan.findMany({ orderBy: { price: 'asc' } });
    }

    async createPlan(data: any) {
        return this.databaseService.pricingPlan.create({ data });
    }

    async updatePlan(id: string, data: any) {
        return this.databaseService.pricingPlan.update({ where: { id }, data });
    }

    async togglePlanStatus(id: string) {
        const plan = await this.databaseService.pricingPlan.findUnique({ where: { id } });
        if (!plan) throw new NotFoundException('Plan not found');
        return this.databaseService.pricingPlan.update({
            where: { id },
            data: { isActive: !plan.isActive }
        });
    }

    // --- Stats ---
    async getStats() {
        const [users, docs, plans, revenue] = await Promise.all([
            this.databaseService.user.count(),
            this.databaseService.document.count(),
            this.databaseService.pricingPlan.count(),
            this.databaseService.user.count({ where: { plan: 'PRO' } }).then(n => n * 29) // Mock revenue
        ]);

        return { users, documents: docs, plans, revenue };
    }

    // --- Banking ---
    async getBankAccounts() {
        return this.databaseService.bankAccount.findMany({ orderBy: { createdAt: 'desc' } });
    }

    async addBankAccount(data: any) {
        return this.databaseService.bankAccount.create({ data });
    }

    async deleteBankAccount(id: string) {
        return this.databaseService.bankAccount.delete({ where: { id } });
    }

    // --- Settings ---
    async changePassword(userId: string, newPass: string) {
        // In real app, hash newPass here!
        return this.databaseService.user.update({
            where: { id: userId },
            data: { password: newPass }
        });
    }
}
