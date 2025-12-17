import { Controller, Get, Param, Patch, Post, Delete, Body, UseGuards, ForbiddenException, Request } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '@repo/database';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    // --- Users ---
    @Get('users')
    getUsers() { return this.adminService.findAllUsers(); }

    @Post('users')
    createUser(@Body() data: any) { return this.adminService.createUser(data); }

    @Patch('users/:id')
    updateUser(@Param('id') id: string, @Body() data: any) { return this.adminService.updateUser(id, data); }

    @Patch('users/:id/role')
    updateRole(@Param('id') id: string, @Body('role') role: string) {
        return this.adminService.updateUserRole(id, role);
    }

    @Delete('users/:id')
    deleteUser(@Param('id') id: string) { return this.adminService.deleteUser(id); }

    // --- Documents ---
    @Get('documents')
    getDocuments() { return this.adminService.findAllDocuments(); }

    @Delete('documents/:id')
    deleteDocument(@Param('id') id: string) { return this.adminService.deleteDocument(id); }

    // --- Templates ---
    @Get('templates')
    getTemplates() { return this.adminService.findAllTemplates(); }

    @Post('templates')
    createTemplate(@Body() data: any) { return this.adminService.createTemplate(data); }

    @Patch('templates/:id')
    updateTemplate(@Param('id') id: string, @Body() data: any) { return this.adminService.updateTemplate(id, data); }

    @Delete('templates/:id')
    deleteTemplate(@Param('id') id: string) { return this.adminService.deleteTemplate(id); }

    // --- Plans ---
    @Get('plans')
    getPlans() { return this.adminService.findAllPlans(); }

    @Post('plans')
    createPlan(@Body() data: any) { return this.adminService.createPlan(data); }

    @Patch('plans/:id')
    updatePlan(@Param('id') id: string, @Body() data: any) { return this.adminService.updatePlan(id, data); }

    @Patch('plans/:id/toggle')
    togglePlan(@Param('id') id: string) { return this.adminService.togglePlanStatus(id); }

    // --- Stats ---
    @Get('stats')
    getStats() { return this.adminService.getStats(); }

    // --- Banking ---
    @Get('banking')
    getBankAccounts() { return this.adminService.getBankAccounts(); }

    @Post('banking')
    addBankAccount(@Body() data: any) { return this.adminService.addBankAccount(data); }

    @Delete('banking/:id')
    deleteBankAccount(@Param('id') id: string) { return this.adminService.deleteBankAccount(id); }

    // --- Settings ---
    @Post('change-password')
    changePassword(@Body() body: any) {
        // body: { userId, newPassword }
        return this.adminService.changePassword(body.userId, body.newPassword);
    }
}
