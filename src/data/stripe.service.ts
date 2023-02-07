import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private static instance: Stripe;

  private constructor() {
    StripeService.instance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
    });
  }

  static getInstance() {
    if (!StripeService.instance) {
      new StripeService();
    }

    return StripeService.instance;
  }
}
