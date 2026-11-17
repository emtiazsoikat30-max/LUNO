export const INSIDE_DHAKA_DELIVERY_BDT = 70;
export const OUTSIDE_DHAKA_DELIVERY_BDT = 130;

export type OrderPricing = {
  productSubtotalBdt: number;
  deliveryChargeBdt: number;
  discountBdt: number;
  totalPayableBdt: number;
  deliveryArea: "inside_dhaka" | "outside_dhaka";
};

export function deliveryAreaForDistrict(districtEnglishName: string) {
  return districtEnglishName.trim().toLocaleLowerCase() === "dhaka" ? "inside_dhaka" as const : "outside_dhaka" as const;
}

export function calculateOrderPricing(unitPriceBdt: number, quantity: number, districtEnglishName: string): OrderPricing {
  const deliveryArea = deliveryAreaForDistrict(districtEnglishName);
  const productSubtotalBdt = unitPriceBdt * quantity;
  const deliveryChargeBdt = deliveryArea === "inside_dhaka" ? INSIDE_DHAKA_DELIVERY_BDT : OUTSIDE_DHAKA_DELIVERY_BDT;
  const discountBdt = 0;
  return { productSubtotalBdt, deliveryChargeBdt, discountBdt, totalPayableBdt: productSubtotalBdt + deliveryChargeBdt - discountBdt, deliveryArea };
}
