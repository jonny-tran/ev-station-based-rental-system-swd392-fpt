import {
  SettlementConfig,
  SettlementInput,
  SettlementResult,
  ExtraChargeItem,
} from "../types/settlement";

function ceilDiv(a: number, b: number): number {
  if (b === 0) return 0;
  return Math.ceil(a / b);
}

export function computeSettlement(
  input: SettlementInput,
  config: SettlementConfig
): SettlementResult {
  const items: ExtraChargeItem[] = [];

  // 1) Over-mileage
  if (typeof input.odoStart === "number" && typeof input.odoEnd === "number") {
    const actualKm = Math.max(0, input.odoEnd - input.odoStart);
    const extraKm = Math.max(0, actualKm - (config.allowanceKm || 0));
    if (extraKm > 0 && config.unitPricePerKm > 0) {
      const amount = extraKm * config.unitPricePerKm;
      items.push({
        id: `over-mileage`,
        category: "OverMileage",
        label: "Over-mileage",
        detail: `${extraKm} km vượt × ${config.unitPricePerKm.toLocaleString("vi-VN")}đ/km`,
        quantity: extraKm,
        unitPrice: config.unitPricePerKm,
        amount,
      });
    }
  }

  // 2) Overtime
  if (input.contractEndTime && input.actualReturnTime) {
    const endAt = new Date(input.contractEndTime).getTime();
    const backAt = new Date(input.actualReturnTime).getTime();
    const extraMs = Math.max(0, backAt - endAt);
    if (
      extraMs > 0 &&
      config.timeUnitMinutes > 0 &&
      config.unitPricePerTimeUnit > 0
    ) {
      const extraMinutes = Math.ceil(extraMs / 60000);
      const blocks = ceilDiv(extraMinutes, config.timeUnitMinutes);
      const amount = blocks * config.unitPricePerTimeUnit;
      items.push({
        id: `overtime`,
        category: "Overtime",
        label: "Overtime",
        detail: `${blocks} block × ${config.unitPricePerTimeUnit.toLocaleString("vi-VN")}đ (đ.vị ${config.timeUnitMinutes} phút)`,
        quantity: blocks,
        unitPrice: config.unitPricePerTimeUnit,
        amount,
      });
    }
  }

  // 3) Battery/Fuel deficit
  if (
    typeof input.batteryStart === "number" &&
    typeof input.batteryEnd === "number"
  ) {
    const deficit = Math.max(0, input.batteryStart - input.batteryEnd);
    if (deficit > 0 && config.unitPricePerBatteryPercent > 0) {
      const amount = deficit * config.unitPricePerBatteryPercent;
      items.push({
        id: `battery-deficit`,
        category: "BatteryDeficit",
        label: "Battery deficit",
        detail: `Thiếu ${deficit}% × ${config.unitPricePerBatteryPercent.toLocaleString("vi-VN")}đ/%`,
        quantity: deficit,
        unitPrice: config.unitPricePerBatteryPercent,
        amount,
      });
    }
  }

  // 4) Cleaning Fee
  if (input.isDirty && config.cleaningFlatFee > 0) {
    items.push({
      id: `cleaning-fee`,
      category: "CleaningFee",
      label: "Cleaning fee",
      detail: `Xe bẩn (flat fee)`,
      quantity: 1,
      unitPrice: config.cleaningFlatFee,
      amount: config.cleaningFlatFee,
    });
  }

  // 5) Damage Fee (manual)
  if (input.damageNotes && input.damageNotes.trim().length > 0) {
    // Để đơn giản trong mock: không tự định giá, amount = 0 để staff nhập tay ở UI khác
    items.push({
      id: `damage-fee`,
      category: "DamageFee",
      label: "Damage fee",
      detail: input.damageNotes,
      quantity: 1,
      unitPrice: 0,
      amount: 0,
    });
  }

  // 6) Wrong Location
  if (input.wrongLocation && config.wrongLocationFlatFee > 0) {
    items.push({
      id: `wrong-location`,
      category: "WrongLocation",
      label: "Wrong location return",
      detail: `Trả sai điểm (flat fee)`,
      quantity: 1,
      unitPrice: config.wrongLocationFlatFee,
      amount: config.wrongLocationFlatFee,
    });
  }

  // 7) Missing accessories
  if (input.missingAccessories && input.missingAccessories.length > 0) {
    const priceMap = input.missingAccessories.reduce<Record<string, number>>(
      (acc, name) => {
        const price = config.accessoriesPriceMap?.[name] ?? 0;
        acc[name] = price;
        return acc;
      },
      {}
    );
    for (const [name, price] of Object.entries(priceMap)) {
      if (price > 0) {
        items.push({
          id: `missing-${name}`,
          category: "MissingAccessories",
          label: `Missing: ${name}`,
          detail: `Thiếu phụ kiện: ${name}`,
          quantity: 1,
          unitPrice: price,
          amount: price,
        });
      } else {
        items.push({
          id: `missing-${name}`,
          category: "MissingAccessories",
          label: `Missing: ${name}`,
          detail: `Thiếu phụ kiện: ${name} (chưa có bảng giá)`,
          quantity: 1,
          unitPrice: 0,
          amount: 0,
        });
      }
    }
  }

  const subtotal = items.reduce((sum, it) => sum + (it.amount || 0), 0);
  return { items, subtotal };
}
