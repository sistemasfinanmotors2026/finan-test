// lib/utils.ts
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(amount);
};