import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) { }

    @Post()
    create(@Request() req: any, @Body('title') title: string) {
        return this.documentsService.create(req.user.userId, title);
    }

    @Get()
    findAll(@Request() req: any) {
        return this.documentsService.findAll(req.user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Request() req: any) {
        return this.documentsService.findOne(id, req.user.userId);
    }

    @Post(':id/start')
    start(@Param('id') id: string, @Request() req: any) {
        return this.documentsService.startSession(id, req.user.userId);
    }

    @Post(':id/answer')
    answer(
        @Param('id') id: string,
        @Request() req: any,
        @Body('answer') answer: string,
    ) {
        return this.documentsService.submitAnswer(id, req.user.userId, answer);
    }
}
