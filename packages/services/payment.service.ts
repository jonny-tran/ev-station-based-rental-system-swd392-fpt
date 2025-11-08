/**
 * Payment Service
 * Handles all payment-related API calls
 */

import { apiPost } from "../lib/api-client";
import { PaymentMethod } from "../types/payment";

// API Response types
export interface CreatePaymentUrlResponse {
  paymentUrl: string;
  paymentId: number;
}

export interface CreatePaymentUrlRequest {
  inspectionId: string;
  paymentMethod: PaymentMethod;
}

/**
 * Payment Service
 * Service để gọi các API liên quan đến thanh toán
 */
export class PaymentService {
  /**
   * Tạo VNPay payment URL
   * @param inspectionId - ID của vehicle inspection
   * @param paymentMethod - Phương thức thanh toán (chỉ hỗ trợ VNPay)
   * @returns Payment URL và Payment ID
   */
  static async createPaymentUrl(
    inspectionId: string,
    paymentMethod: PaymentMethod = PaymentMethod.VNPay
  ): Promise<CreatePaymentUrlResponse> {
    try {
      const request: CreatePaymentUrlRequest = {
        inspectionId,
        paymentMethod,
      };

      const response = await apiPost<CreatePaymentUrlResponse>(
        "/payment/create-payment-url",
        request
      );

      return response;
    } catch (error) {
      console.error("Error creating payment URL:", error);
      throw error;
    }
  }
}

