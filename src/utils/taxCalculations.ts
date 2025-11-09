import { SaleItem, TaxBreakdown, TaxCategory } from '../types';

// Convierte de número de impuesto (0, 0.15, 0.18) a categoría de impuesto
export const getTaxCategoryFromImpuesto = (impuesto: number): TaxCategory => {
  if (impuesto === 0) return 'exento';
  if (impuesto === 0.15) return 'isv15';
  if (impuesto === 0.18) return 'isv18';
  // Por defecto, si el impuesto es otro valor, usar isv15
  return impuesto > 0.16 ? 'isv18' : impuesto > 0 ? 'isv15' : 'exento';
};

export const getTaxCategoryLabel = (taxCategory: TaxCategory): string => {
  switch (taxCategory) {
    case 'exento':
      return 'Exonerado (0%)';
    case 'isv15':
      return 'ISV 15%';
    case 'isv18':
      return 'ISV 18% (Alcohol)';
    default:
      return 'Sin categoría';
  }
};

export const getTaxCategoryBadgeColor = (taxCategory: TaxCategory): string => {
  switch (taxCategory) {
    case 'exento':
      return 'bg-green-100 text-green-800';
    case 'isv15':
      return 'bg-blue-100 text-blue-800';
    case 'isv18':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const calculateTaxBreakdown = (items: SaleItem[]): TaxBreakdown => {
  const breakdown: TaxBreakdown = {
    exento: 0,
    gravado15: 0,
    gravado18: 0,
    isv15: 0,
    isv18: 0,
  };

  items.forEach(item => {
    const itemTotal = item.total;
    
    switch (item.taxCategory) {
      case 'exento':
        breakdown.exento += itemTotal;
        break;
      case 'isv15':
        // Para ISV 15%, el monto gravado es el total sin impuesto
        const gravado15 = itemTotal / 1.15;
        breakdown.gravado15 += gravado15;
        breakdown.isv15 += itemTotal - gravado15;
        break;
      case 'isv18':
        // Para ISV 18%, el monto gravado es el total sin impuesto
        const gravado18 = itemTotal / 1.18;
        breakdown.gravado18 += gravado18;
        breakdown.isv18 += itemTotal - gravado18;
        break;
    }
  });

  // Redondear a 2 decimales
  Object.keys(breakdown).forEach(key => {
    breakdown[key as keyof TaxBreakdown] = Math.round(breakdown[key as keyof TaxBreakdown] * 100) / 100;
  });

  return breakdown;
};

export const calculateItemPriceWithTax = (basePrice: number, taxCategory: TaxCategory): number => {
  switch (taxCategory) {
    case 'exento':
      return basePrice;
    case 'isv15':
      return basePrice * 1.15;
    case 'isv18':
      return basePrice * 1.18;
    default:
      return basePrice;
  }
};

export const calculateItemPriceWithoutTax = (priceWithTax: number, taxCategory: TaxCategory): number => {
  switch (taxCategory) {
    case 'exento':
      return priceWithTax;
    case 'isv15':
      return priceWithTax / 1.15;
    case 'isv18':
      return priceWithTax / 1.18;
    default:
      return priceWithTax;
  }
};

export const getTotalTaxAmount = (taxBreakdown: TaxBreakdown): number => {
  return taxBreakdown.isv15 + taxBreakdown.isv18;
};

export const getSubtotalAmount = (taxBreakdown: TaxBreakdown): number => {
  return taxBreakdown.exento + taxBreakdown.gravado15 + taxBreakdown.gravado18;
};

export const formatTaxSummary = (taxBreakdown: TaxBreakdown): string => {
  const lines: string[] = [];
  
  if (taxBreakdown.exento > 0) {
    lines.push(`Exonerado: L ${taxBreakdown.exento.toFixed(2)}`);
  }
  if (taxBreakdown.gravado15 > 0) {
    lines.push(`Gravado 15%: L ${taxBreakdown.gravado15.toFixed(2)}`);
  }
  if (taxBreakdown.gravado18 > 0) {
    lines.push(`Gravado 18%: L ${taxBreakdown.gravado18.toFixed(2)}`);
  }
  if (taxBreakdown.isv15 > 0) {
    lines.push(`ISV 15%: L ${taxBreakdown.isv15.toFixed(2)}`);
  }
  if (taxBreakdown.isv18 > 0) {
    lines.push(`ISV 18%: L ${taxBreakdown.isv18.toFixed(2)}`);
  }
  
  return lines.join(' | ');
};