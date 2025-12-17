
import { Controller, Get } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('plans')
export class PlansController {
    constructor(private readonly adminService: AdminService) { }

    @Get()
    getPlans() {
        return this.adminService.findAllPlans();
    }
}
