import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post('order')
    createOrder(@Request() req: any) {
        // Hardcoded plan amount for MVP: ₹1499
        return this.paymentsService.createOrder(req.user.userId, 'PRO', 1499);
    }

    @Post('verify')
    verifyPayment(
        @Request() req: any,
        @Body('razorpay_order_id') orderId: string,
        @Body('razorpay_payment_id') paymentId: string,
        @Body('razorpay_signature') signature: string,
    ) {
        return this.paymentsService.verifyPayment(
            req.user.userId,
            orderId,
            paymentId,
            signature,
        );
    }
}
