import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';
import { DatabaseService } from '../database/database.service';
import { createHmac } from 'crypto';

@Injectable()
export class PaymentsService {
  private razorpay: Razorpay;
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private configService: ConfigService,
    private databaseService: DatabaseService,
  ) {
    this.razorpay = new Razorpay({
      key_id: this.configService.get<string>('RAZORPAY_KEY_ID') || 'rzp_test_123',
      key_secret: this.configService.get<string>('RAZORPAY_KEY_SECRET') || 'secret',
    });
  }

  async createOrder(userId: string, plan: 'PRO', amount: number) {
    const options = {
      amount: amount * 100, // amount in paise
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      notes: { userId, plan },
    };

    try {
      const order = await this.razorpay.orders.create(options);

      // Save pending payment record
      await this.databaseService.payment.create({
        data: {
          amount: amount,
          currency: 'INR',
          status: 'created',
          razorpayOrderId: order.id,
          userId: userId
        }
      });

      return order;
    } catch (error) {
      this.logger.error('Error creating Razorpay order', error);
      throw error;
    }
  }

  async verifyPayment(
    userId: string,
    orderId: string,
    paymentId: string,
    signature: string,
  ) {
    const secret = this.configService.get<string>('RAZORPAY_KEY_SECRET') || 'secret';
    const generatedSignature = createHmac('sha256', secret)
      .update(orderId + '|' + paymentId)
      .digest('hex');

    if (generatedSignature === signature) {
      // Payment successful
      await this.databaseService.$transaction([
        // Update Payment Status
        this.databaseService.payment.updateMany({
          where: { razorpayOrderId: orderId },
          data: {
            status: 'paid',
            razorpayPaymentId: paymentId
          }
        }),
        // Upgrade User
        this.databaseService.user.update({
          where: { id: userId },
          data: { plan: 'PRO' }
        })
      ]);
      return { success: true };
    } else {
      throw new Error('Invalid signature');
    }
  }
}
