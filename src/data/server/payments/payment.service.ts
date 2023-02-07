import { Injectable } from '@nestjs/common';
import { Payment, Prisma } from '@prisma/client';
import { StripeService } from '../../stripe.service';
import Stripe from 'stripe';

import { PrismaService } from '../../prisma.service';
import { UserService } from '../users/user.service';

@Injectable()
export class PaymentService {
  private stripe = StripeService.getInstance();

  constructor(private prisma: PrismaService, private user: UserService) {}

  // Returns Stripe client secret that is used to confirm payment
  // on the frontend with the Stripe element.
  async createPaymentIntent(data: Prisma.PaymentCreateInput): Promise<string> {
    const stripeAccountId = await this.createStripeCustomer({
      id: data.user.connect.id,
    });

    // Create a payment with Stripe
    const paymentIntent: Stripe.PaymentIntent =
      await this.stripe.paymentIntents.create({
        amount: data.amount,
        currency: 'USD',
        customer: stripeAccountId,
      });

    console.log('this.prisma.payment', this.prisma.payment.create({ data }));

    this.prisma.payment.create({
      data,
    });

    return paymentIntent.client_secret;
  }

  // Save StripeCustomerId to the user
  async createStripeCustomer(
    userWhereInput: Prisma.UserWhereUniqueInput,
  ): Promise<string> {
    const stripeCustomer: Stripe.Customer =
      await this.stripe.customers.create();

    this.user.update(
      { id: userWhereInput.id },
      { stripeAccountId: stripeCustomer.id },
    );

    return stripeCustomer.id;
  }

  async findOneWhere(data: Prisma.PaymentWhereInput): Promise<Payment | null> {
    return await this.prisma.payment.findFirstOrThrow({
      where: data,
    });
  }
}
