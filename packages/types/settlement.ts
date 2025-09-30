export type ExtraChargeCategory =
  | "OverMileage"
  | "Overtime"
  | "BatteryDeficit"
  | "CleaningFee"
  | "DamageFee"
  | "WrongLocation"
  | "MissingAccessories"
  | "Other";

export interface ExtraChargeItem {
  id: string;
  category: ExtraChargeCategory;
  label: string; // ví dụ: "Over-mileage", "Battery deficit"
  detail?: string; // mô tả chi tiết cho UI
  quantity: number; // ví dụ: 25 (km), 30 (%), 1 (flat)
  unitPrice: number; // đơn giá VND
  amount: number; // = quantity * unitPrice (hoặc flat)
}

export interface SettlementInput {
  // dữ liệu so sánh check-in vs check-out
  odoStart?: number;
  odoEnd?: number;
  batteryStart?: number; // %
  batteryEnd?: number; // %
  contractEndTime?: string; // ISO
  actualReturnTime?: string; // ISO
  // flag/phụ phí khác
  isDirty?: boolean; // cleaning fee
  damageNotes?: string;
  wrongLocation?: boolean;
  missingAccessories?: string[]; // danh sách phụ kiện thiếu
}

export interface SettlementConfig {
  allowanceKm: number; // km cho phép
  unitPricePerKm: number; // VND/km
  timeUnitMinutes: number; // đơn vị block thời gian
  unitPricePerTimeUnit: number; // VND per block
  unitPricePerBatteryPercent: number; // VND / %
  cleaningFlatFee: number; // VND
  wrongLocationFlatFee: number; // VND
  accessoriesPriceMap?: Record<string, number>; // phụ kiện -> giá
}

export interface SettlementResult {
  items: ExtraChargeItem[];
  subtotal: number;
}
