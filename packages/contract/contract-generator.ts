import { ContractData } from "./contract-types";

export class ContractGenerator {
  private template: string;

  constructor(template: string) {
    this.template = template;
  }

  /**
   * Generate contract HTML from template and data
   */
  generateContract(data: ContractData): string {
    let contractHtml = this.template;

    // Replace all placeholders with actual data
    const replacements: Record<string, string> = {
      "[RENTER_NAME]": data.renterName,
      "[RENTER_ID]": data.renterId,
      "[RENTER_PHONE]": data.renterPhone,
      "[RENTER_EMAIL]": data.renterEmail,
      "[LICENSE_PLATE]": data.licensePlate,
      "[VEHICLE_MODEL]": data.vehicleModel,
      "[BATTERY_CAPACITY]": data.batteryCapacity.toString(),
      "[CURRENT_ODO]": data.currentOdo.toString(),
      "[START_DATE]": this.formatDate(data.startDate),
      "[END_DATE]": this.formatDate(data.endDate),
      "[PICKUP_LOCATION]": data.pickupLocation,
      "[RETURN_LOCATION]": data.returnLocation,
      "[TOTAL_PRICE]": this.formatCurrency(data.totalPrice),
      "[CONTRACT_ID]": data.contractId,
      "[CONTRACT_CREATED_DATE]": this.formatDate(data.contractCreatedDate),
      "[STAFF_NAME]": data.staffName,
      "[SIGN_DATE_RENTER]": data.signDateRenter
        ? this.formatDate(data.signDateRenter)
        : "Chưa ký",
      "[SIGN_DATE_STAFF]": data.signDateStaff
        ? this.formatDate(data.signDateStaff)
        : "Chưa ký",
    };

    // Replace placeholders
    Object.entries(replacements).forEach(([placeholder, value]) => {
      const safePattern = new RegExp(this.escapeRegExp(placeholder), "g");
      contractHtml = contractHtml.replace(safePattern, value ?? "");
    });

    // Handle signature placeholders
    contractHtml = this.handleSignaturePlaceholders(contractHtml, data);

    return contractHtml;
  }

  /**
   * Escape special characters for RegExp from a literal string
   */
  private escapeRegExp(input: string): string {
    return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /**
   * Handle signature placeholders
   */
  private handleSignaturePlaceholders(
    html: string,
    data: ContractData
  ): string {
    // Replace renter signature
    if (data.renterSignature) {
      html = html.replace(
        "<<SIGN_RENTER>>",
        '<div class="signature-done">Đã ký</div>'
      );
    } else {
      html = html.replace(
        "<<SIGN_RENTER>>",
        '<div class="signature-placeholder">Chưa ký</div>'
      );
    }

    // Replace staff signature
    if (data.staffSignature) {
      html = html.replace(
        "<<SIGN_STAFF>>",
        '<div class="signature-done">Đã ký</div>'
      );
    } else {
      html = html.replace(
        "<<SIGN_STAFF>>",
        '<div class="signature-placeholder">Chưa ký</div>'
      );
    }

    return html;
  }

  /**
   * Format date to Vietnamese format
   */
  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  /**
   * Format currency to Vietnamese format
   */
  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }

  /**
   * Extract placeholders from template
   */
  static extractPlaceholders(template: string): string[] {
    const placeholderRegex = /\[([A-Z_]+)\]/g;
    const signatureRegex = /<<SIGN_([A-Z_]+)>>/g;

    const placeholders: string[] = [];
    let match;

    // Extract [PLACEHOLDER] format
    while ((match = placeholderRegex.exec(template)) !== null) {
      placeholders.push(match[0]);
    }

    // Extract <<SIGN_PLACEHOLDER>> format
    while ((match = signatureRegex.exec(template)) !== null) {
      placeholders.push(match[0]);
    }

    return [...new Set(placeholders)]; // Remove duplicates
  }

  /**
   * Validate template has required placeholders
   */
  static validateTemplate(template: string): {
    isValid: boolean;
    missingPlaceholders: string[];
  } {
    const requiredPlaceholders = [
      "[RENTER_NAME]",
      "[RENTER_ID]",
      "[LICENSE_PLATE]",
      "[VEHICLE_MODEL]",
      "[START_DATE]",
      "[TOTAL_PRICE]",
      "<<SIGN_RENTER>>",
      "<<SIGN_STAFF>>",
    ];

    const existingPlaceholders = this.extractPlaceholders(template);
    const missingPlaceholders = requiredPlaceholders.filter(
      (placeholder) => !existingPlaceholders.includes(placeholder)
    );

    return {
      isValid: missingPlaceholders.length === 0,
      missingPlaceholders,
    };
  }
}
