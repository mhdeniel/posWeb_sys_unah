export type TaxCategory = 'exento' | 'isv15' | 'isv18';

export interface Category {
  id: string;
  nombre: string;
  descripcion?: string;
}

export interface Product {
  id: string;
  referencia: string; // Código de referencia del producto
  codigo: string; // Código de barras o código interno
  nombre: string;
  precio_compra: number;
  precio_venta: number;
  categoria: string;
  impuesto: number; // Tasa de impuesto como número (0, 0.15, 0.18)
  unidades_existencia: number;
  proveedor?: string; // ID del proveedor
  // Campos legacy para compatibilidad temporal
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: string;
  taxCategory?: TaxCategory;
  barcode?: string;
  image?: string;
  createdAt?: Date;
}

export interface Customer {
  id: string;
  clave_busqueda: string; // Campo obligatorio para búsqueda rápida
  rtn?: string; // RTN opcional
  nombre: string;
  direccion?: string;
  codigo_postal?: string;
  ciudad?: string;
  departamento?: string;
  pais?: string;
  correo?: string;
  telefono?: string;
  visible?: boolean; // Campo para soft delete
  // Campos legacy para compatibilidad temporal
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  ruc?: string;
  createdAt?: Date;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  taxCategory: TaxCategory;
}

export interface TaxBreakdown {
  exento: number;
  gravado15: number;
  gravado18: number;
  isv15: number;
  isv18: number;
}

export interface Sale {
  id: string;
  customerId: string;
  customerName: string;
  items: SaleItem[];
  subtotal: number;
  taxBreakdown: TaxBreakdown;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface Receipt {
  id: string;
  saleId: string;
  type: 'boleta' | 'factura';
  series: string;
  number: string;
  customerName: string;
  customerAddress: string;
  customerRuc?: string;
  items: SaleItem[];
  subtotal: number;
  taxBreakdown: TaxBreakdown;
  total: number;
  createdAt: Date;
}

export interface CompanyInfo {
  name: string;
  ruc: string;
  address: string;
  phone: string;
  email: string;
}

export interface ReturnItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  taxCategory: TaxCategory;
  reason: string;
}

export interface Return {
  id: string;
  saleId: string;
  customerId: string;
  customerName: string;
  items: ReturnItem[];
  subtotal: number;
  taxBreakdown: TaxBreakdown;
  total: number;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  reason: string;
  createdAt: Date;
  processedAt?: Date;
}

export interface Supplier {
  id: string;
  clave_busqueda: string; // Campo obligatorio para búsqueda rápida
  rtn?: string; // RTN opcional
  nombre: string;
  direccion?: string;
  codigo_postal?: string;
  ciudad?: string;
  departamento?: string;
  pais?: string;
  correo?: string;
  telefono?: string;
  visible?: boolean; // Campo para soft delete
  // Campos legacy para compatibilidad temporal
  name?: string;
  contact?: string;
  phone?: string;
  email?: string;
  address?: string;
  products?: string[]; // Array de IDs de productos que suministra
  createdAt?: Date;
}

export interface SupplierOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitCost: number;
  total: number;
}

export interface SupplierOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  items: SupplierOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'sent' | 'received' | 'cancelled';
  expectedDelivery: Date;
  notes?: string;
  createdAt: Date;
  receivedAt?: Date;
}

export interface DashboardStats {
  totalSales: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  recentSales: Sale[];
  topProducts: Array<{
    productId: string;
    productName: string;
    quantity: number;
    revenue: number;
  }>;
}