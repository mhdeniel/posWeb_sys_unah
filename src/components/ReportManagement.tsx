import { useState } from 'react';
import { Product, Customer, Sale, CompanyInfo, Return, Supplier, SupplierOrder } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Separator } from './ui/separator';
import { Printer, Download, FileText, TrendingUp, Package, Users, Calendar, RotateCcw, Truck, ClipboardList } from 'lucide-react';

interface ReportManagementProps {
  products: Product[];
  customers: Customer[];
  sales: Sale[];
  companyInfo: CompanyInfo;
  returns: Return[];
  suppliers: Supplier[];
  supplierOrders: SupplierOrder[];
  isOpen: boolean;
  reportType: 'sales' | 'revenue' | 'products' | 'customers' | 'returns' | 'suppliers' | 'supplier-orders' | null;
  onClose: () => void;
}

export function ReportManagement({
  products,
  customers,
  sales,
  companyInfo,
  returns,
  suppliers,
  supplierOrders,
  isOpen,
  reportType,
  onClose,
}: ReportManagementProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-HN', {
      style: 'currency',
      currency: 'HNL',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (date: Date = new Date()) => {
    return new Intl.DateTimeFormat('es-HN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const formatDateTime = () => {
    return new Intl.DateTimeFormat('es-HN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date());
  };

  const handlePrint = () => {
    window.print();
  };

  const getReportTitle = () => {
    switch (reportType) {
      case 'sales':
        return 'Reporte de Ventas Totales';
      case 'revenue':
        return 'Reporte de Ingresos Totales';
      case 'products':
        return 'Reporte de Inventario de Productos';
      case 'customers':
        return 'Reporte de Base de Clientes';
      case 'returns':
        return 'Reporte de Devoluciones';
      case 'suppliers':
        return 'Reporte de Proveedores';
      case 'supplier-orders':
        return 'Reporte de Pedidos a Proveedores';
      default:
        return 'Reporte';
    }
  };

  const getReportIcon = () => {
    switch (reportType) {
      case 'sales':
        return <TrendingUp className="h-5 w-5" />;
      case 'revenue':
        return <TrendingUp className="h-5 w-5" />;
      case 'products':
        return <Package className="h-5 w-5" />;
      case 'customers':
        return <Users className="h-5 w-5" />;
      case 'returns':
        return <RotateCcw className="h-5 w-5" />;
      case 'suppliers':
        return <Truck className="h-5 w-5" />;
      case 'supplier-orders':
        return <ClipboardList className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const renderReportHeader = () => (
    <div className="print:block hidden">
      <div className="text-center mb-8 pb-6 border-b-2 border-gray-300">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
            {getReportIcon()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{companyInfo.name}</h1>
            <p className="text-gray-600">Sistema de Ventas</p>
          </div>
        </div>
        <div className="space-y-1 text-sm text-gray-600">
          <p><strong>RUC:</strong> {companyInfo.ruc}</p>
          <p><strong>Dirección:</strong> {companyInfo.address}</p>
          <p><strong>Teléfono:</strong> {companyInfo.phone} | <strong>Email:</strong> {companyInfo.email}</p>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{getReportTitle()}</h2>
        <div className="flex justify-between items-center text-sm text-gray-600">
          <p><strong>Fecha de Generación:</strong> {formatDateTime()}</p>
          <p><strong>Página:</strong> 1 de 1</p>
        </div>
      </div>
    </div>
  );

  const renderReportFooter = () => (
    <div className="print:block hidden mt-8 pt-6 border-t border-gray-300">
      <div className="flex justify-between items-center text-xs text-gray-500">
        <p>© 2024 {companyInfo.name} - Todos los derechos reservados</p>
        <p>Generado el {formatDateTime()}</p>
      </div>
    </div>
  );

  const calculateSalesStats = () => {
    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
    const avgSaleValue = totalSales > 0 ? totalRevenue / totalSales : 0;
    const completedSales = sales.filter(sale => sale.status === 'completed').length;
    const pendingSales = sales.filter(sale => sale.status === 'pending').length;

    return {
      totalSales,
      totalRevenue,
      avgSaleValue,
      completedSales,
      pendingSales,
    };
  };

  const calculateProductStats = () => {
    const totalProducts = products.length;
    const totalStockValue = products.reduce((sum, product) => {
      const price = product.precio_venta ?? product.price ?? 0;
      const stock = product.unidades_existencia ?? product.stock ?? 0;
      return sum + (price * stock);
    }, 0);
    const avgPrice = totalProducts > 0 ? products.reduce((sum, product) => {
      const price = product.precio_venta ?? product.price ?? 0;
      return sum + price;
    }, 0) / totalProducts : 0;
    const lowStockProducts = products.filter(product => {
      const stock = product.unidades_existencia ?? product.stock ?? 0;
      return stock <= 10;
    }).length;
    const outOfStockProducts = products.filter(product => {
      const stock = product.unidades_existencia ?? product.stock ?? 0;
      return stock === 0;
    }).length;

    return {
      totalProducts,
      totalStockValue,
      avgPrice,
      lowStockProducts,
      outOfStockProducts,
    };
  };

  const getTopSellingProducts = () => {
    const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {};
    
    sales.forEach(sale => {
      sale.items.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            name: item.productName,
            quantity: 0,
            revenue: 0,
          };
        }
        productSales[item.productId].quantity += item.quantity;
        productSales[item.productId].revenue += item.total;
      });
    });

    return Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
  };

  const renderSalesReport = () => {
    // Calcular totales para el resumen
    const totalSubtotal = sales.reduce((sum, sale) => sum + sale.subtotal, 0);
    const totalExento = sales.reduce((sum, sale) => sum + sale.taxBreakdown.exento, 0);
    const totalExonerado = sales.reduce((sum, sale) => sum + sale.taxBreakdown.gravado15 + sale.taxBreakdown.gravado18, 0);
    const totalISV15 = sales.reduce((sum, sale) => sum + sale.taxBreakdown.isv15, 0);
    const totalISV18 = sales.reduce((sum, sale) => sum + sale.taxBreakdown.isv18, 0);
    const totalGeneral = sales.reduce((sum, sale) => sum + sale.total, 0);

    return (
      <div className="space-y-6">
        {renderReportHeader()}
        
        {/* Tabla de Ventas - Formato Grande para Impresión */}
        <div className="mb-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="text-base">
                  <TableHead className="text-base">FECHA</TableHead>
                  <TableHead className="text-base">CLIENTE</TableHead>
                  <TableHead className="text-base">RTN</TableHead>
                  <TableHead className="text-base">N° FACTURA</TableHead>
                  <TableHead className="text-right text-base">SUBTOTAL</TableHead>
                  <TableHead className="text-right text-base">EXENTO</TableHead>
                  <TableHead className="text-right text-base">EXONERADO</TableHead>
                  <TableHead className="text-right text-base">ISV 15%</TableHead>
                  <TableHead className="text-right text-base">ISV 18%</TableHead>
                  <TableHead className="text-right text-base">TOTAL</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => {
                  const customer = customers.find(c => c.id === sale.customerId);
                  const customerRTN = customer?.rtn || customer?.ruc || 'N/A';
                  const exonerado = sale.taxBreakdown.gravado15 + sale.taxBreakdown.gravado18;
                  
                  return (
                    <TableRow key={sale.id} className="text-base">
                      <TableCell className="text-base">{formatDate(sale.createdAt)}</TableCell>
                      <TableCell className="text-base">{sale.customerName}</TableCell>
                      <TableCell className="font-mono text-base">{customerRTN}</TableCell>
                      <TableCell className="font-mono text-base">{sale.id}</TableCell>
                      <TableCell className="text-right text-base">{formatCurrency(sale.subtotal)}</TableCell>
                      <TableCell className="text-right text-base">{formatCurrency(sale.taxBreakdown.exento)}</TableCell>
                      <TableCell className="text-right text-base">{formatCurrency(exonerado)}</TableCell>
                      <TableCell className="text-right text-base">{formatCurrency(sale.taxBreakdown.isv15)}</TableCell>
                      <TableCell className="text-right text-base">{formatCurrency(sale.taxBreakdown.isv18)}</TableCell>
                      <TableCell className="text-right text-base">{formatCurrency(sale.total)}</TableCell>
                    </TableRow>
                  );
                })}
                
                {/* Fila de Totales */}
                <TableRow className="bg-gray-100">
                  <TableCell colSpan={4} className="text-right text-base"><strong>TOTALES:</strong></TableCell>
                  <TableCell className="text-right text-base"><strong>{formatCurrency(totalSubtotal)}</strong></TableCell>
                  <TableCell className="text-right text-base"><strong>{formatCurrency(totalExento)}</strong></TableCell>
                  <TableCell className="text-right text-base"><strong>{formatCurrency(totalExonerado)}</strong></TableCell>
                  <TableCell className="text-right text-base"><strong>{formatCurrency(totalISV15)}</strong></TableCell>
                  <TableCell className="text-right text-base"><strong>{formatCurrency(totalISV18)}</strong></TableCell>
                  <TableCell className="text-right text-base"><strong>{formatCurrency(totalGeneral)}</strong></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {renderReportFooter()}
      </div>
    );
  };

  const renderRevenueReport = () => {
    const stats = calculateSalesStats();
    const monthlyRevenue = sales.reduce((acc: Record<string, number>, sale) => {
      const month = sale.createdAt.toISOString().slice(0, 7);
      acc[month] = (acc[month] || 0) + sale.total;
      return acc;
    }, {});

    return (
      <div className="space-y-6">
        {renderReportHeader()}
        
        {/* Resumen de Ingresos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 p-6 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-green-800">Ingresos Totales</h3>
            <p className="text-3xl font-bold text-green-900">{formatCurrency(stats.totalRevenue)}</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-blue-800">Ingreso Promedio por Venta</h3>
            <p className="text-3xl font-bold text-blue-900">{formatCurrency(stats.avgSaleValue)}</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-purple-800">Total de Transacciones</h3>
            <p className="text-3xl font-bold text-purple-900">{stats.totalSales}</p>
          </div>
        </div>

        {/* Ingresos por Mes */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Ingresos por Período</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Período</TableHead>
                  <TableHead className="text-right">Ingresos</TableHead>
                  <TableHead className="text-center">Ventas</TableHead>
                  <TableHead className="text-right">Promedio por Venta</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(monthlyRevenue).map(([month, revenue]) => {
                  const monthSales = sales.filter(sale => sale.createdAt.toISOString().slice(0, 7) === month);
                  const avgPerSale = monthSales.length > 0 ? revenue / monthSales.length : 0;
                  return (
                    <TableRow key={month}>
                      <TableCell className="font-medium">{month}</TableCell>
                      <TableCell className="text-right font-semibold">{formatCurrency(revenue)}</TableCell>
                      <TableCell className="text-center">{monthSales.length}</TableCell>
                      <TableCell className="text-right">{formatCurrency(avgPerSale)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        {renderReportFooter()}
      </div>
    );
  };

  const renderProductsReport = () => {
    const stats = calculateProductStats();
    const categorySummary = products.reduce((acc: Record<string, { count: number; value: number; stock: number }>, product) => {
      const category = product.categoria || product.category || 'Sin categoría';
      if (!acc[category]) {
        acc[category] = { count: 0, value: 0, stock: 0 };
      }
      acc[category].count++;
      const price = product.precio_venta ?? product.price ?? 0;
      const stock = product.unidades_existencia ?? product.stock ?? 0;
      acc[category].value += price * stock;
      acc[category].stock += stock;
      return acc;
    }, {});

    return (
      <div className="space-y-6">
        {renderReportHeader()}
        
        {/* Resumen de Inventario */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-blue-800">Total Productos</h3>
            <p className="text-2xl font-bold text-blue-900">{stats.totalProducts}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-green-800">Valor Inventario</h3>
            <p className="text-2xl font-bold text-green-900">{formatCurrency(stats.totalStockValue)}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-purple-800">Precio Promedio</h3>
            <p className="text-2xl font-bold text-purple-900">{formatCurrency(stats.avgPrice)}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-yellow-800">Stock Bajo</h3>
            <p className="text-2xl font-bold text-yellow-900">{stats.lowStockProducts}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-red-800">Sin Stock</h3>
            <p className="text-2xl font-bold text-red-900">{stats.outOfStockProducts}</p>
          </div>
        </div>

        {/* Resumen por Categoría */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Resumen por Categoría</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoría</TableHead>
                  <TableHead className="text-center">Productos</TableHead>
                  <TableHead className="text-center">Stock Total</TableHead>
                  <TableHead className="text-right">Valor Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(categorySummary).map(([category, data]) => (
                  <TableRow key={category}>
                    <TableCell className="font-medium">{category}</TableCell>
                    <TableCell className="text-center">{data.count}</TableCell>
                    <TableCell className="text-center">{data.stock}</TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(data.value)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Detalle de Productos */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Inventario Detallado</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead className="text-center">Stock</TableHead>
                  <TableHead className="text-right">Valor Total</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => {
                  const name = product.nombre || product.name || 'Sin nombre';
                  const category = product.categoria || product.category || 'Sin categoría';
                  const price = product.precio_venta ?? product.price ?? 0;
                  const stock = product.unidades_existencia ?? product.stock ?? 0;
                  
                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-mono">{product.id}</TableCell>
                      <TableCell className="font-medium">{name}</TableCell>
                      <TableCell>{category}</TableCell>
                      <TableCell className="text-right">{formatCurrency(price)}</TableCell>
                      <TableCell className="text-center">{stock}</TableCell>
                      <TableCell className="text-right font-semibold">{formatCurrency(price * stock)}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={
                          stock > 10 ? 'bg-green-500' : 
                          stock > 0 ? 'bg-yellow-500' : 
                          'bg-red-500'
                        }>
                          {stock > 10 ? 'Normal' : stock > 0 ? 'Bajo' : 'Agotado'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        {renderReportFooter()}
      </div>
    );
  };

  const renderCustomersReport = () => {
    const totalCustomers = customers.length;
    const customersWithRuc = customers.filter(customer => customer.rtn || customer.ruc).length;
    const recentCustomers = customers.filter(customer => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return customer.createdAt && customer.createdAt >= thirtyDaysAgo;
    }).length;

    // Calcular ventas por cliente
    const customerSales = customers.map(customer => {
      const customerSalesData = sales.filter(sale => sale.customerId === customer.id);
      const totalSales = customerSalesData.length;
      const totalRevenue = customerSalesData.reduce((sum, sale) => sum + sale.total, 0);
      const lastSale = customerSalesData.length > 0 ? 
        Math.max(...customerSalesData.map(sale => sale.createdAt.getTime())) : null;
      
      return {
        ...customer,
        totalSales,
        totalRevenue,
        lastSale: lastSale ? new Date(lastSale) : null,
      };
    }).sort((a, b) => b.totalRevenue - a.totalRevenue);

    return (
      <div className="space-y-6">
        {renderReportHeader()}
        
        {/* Resumen de Clientes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-blue-800">Total Clientes</h3>
            <p className="text-3xl font-bold text-blue-900">{totalCustomers}</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-green-800">Con RUC/RTN</h3>
            <p className="text-3xl font-bold text-green-900">{customersWithRuc}</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-purple-800">Nuevos (30 días)</h3>
            <p className="text-3xl font-bold text-purple-900">{recentCustomers}</p>
          </div>
        </div>

        {/* Base de Clientes */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Base de Clientes Completa</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>RUC/RTN</TableHead>
                  <TableHead className="text-center">Ventas</TableHead>
                  <TableHead className="text-right">Total Comprado</TableHead>
                  <TableHead>Última Compra</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customerSales.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-mono">{customer.id}</TableCell>
                    <TableCell className="font-medium">{customer.nombre || customer.name || 'Sin nombre'}</TableCell>
                    <TableCell>{customer.telefono || customer.phone || 'N/A'}</TableCell>
                    <TableCell className="text-sm">{customer.correo || customer.email || 'N/A'}</TableCell>
                    <TableCell className="font-mono">{customer.rtn || customer.ruc || 'N/A'}</TableCell>
                    <TableCell className="text-center">{customer.totalSales}</TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(customer.totalRevenue)}</TableCell>
                    <TableCell>
                      {customer.lastSale ? formatDate(customer.lastSale) : 'Sin compras'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Direcciones de Clientes</h3>
          <div className="grid gap-4">
            {customers.map((customer) => (
              <div key={customer.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900">{customer.nombre || customer.name || 'Sin nombre'}</h4>
                    <p className="text-sm text-gray-600">{customer.id}</p>
                  </div>
                  <Badge variant="outline">{customer.rtn || customer.ruc ? 'Empresa' : 'Particular'}</Badge>
                </div>
                <p className="text-sm text-gray-700 mt-2">{customer.direccion || customer.address || 'Sin dirección'}</p>
              </div>
            ))}
          </div>
        </div>

        {renderReportFooter()}
      </div>
    );
  };

  const renderReturnsReport = () => {
    const totalReturns = returns.length;
    const pendingReturns = returns.filter(ret => ret.status === 'pending').length;
    const approvedReturns = returns.filter(ret => ret.status === 'approved').length;
    const processedReturns = returns.filter(ret => ret.status === 'processed').length;
    const rejectedReturns = returns.filter(ret => ret.status === 'rejected').length;
    const totalRefundValue = returns.filter(ret => ret.status === 'processed').reduce((sum, ret) => sum + ret.total, 0);

    return (
      <div className="space-y-6">
        {renderReportHeader()}
        
        {/* Resumen de Devoluciones */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-blue-800">Total Devoluciones</h3>
            <p className="text-2xl font-bold text-blue-900">{totalReturns}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-yellow-800">Pendientes</h3>
            <p className="text-2xl font-bold text-yellow-900">{pendingReturns}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-green-800">Procesadas</h3>
            <p className="text-2xl font-bold text-green-900">{processedReturns}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-red-800">Rechazadas</h3>
            <p className="text-2xl font-bold text-red-900">{rejectedReturns}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-purple-800">Valor Reembolsado</h3>
            <p className="text-2xl font-bold text-purple-900">{formatCurrency(totalRefundValue)}</p>
          </div>
        </div>

        {/* Detalle de Devoluciones */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Historial de Devoluciones</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Devolución</TableHead>
                  <TableHead>ID Venta Original</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead className="text-center">Productos</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {returns.map((returnItem) => (
                  <TableRow key={returnItem.id}>
                    <TableCell className="font-mono">{returnItem.id}</TableCell>
                    <TableCell className="font-mono">{returnItem.saleId}</TableCell>
                    <TableCell>{returnItem.customerName}</TableCell>
                    <TableCell>{formatDate(returnItem.createdAt)}</TableCell>
                    <TableCell className="max-w-xs truncate">{returnItem.reason}</TableCell>
                    <TableCell className="text-center">{returnItem.items.length}</TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(returnItem.total)}</TableCell>
                    <TableCell className="text-center">
                      <Badge className={
                        returnItem.status === 'processed' ? 'bg-green-500' :
                        returnItem.status === 'approved' ? 'bg-blue-500' :
                        returnItem.status === 'pending' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }>
                        {returnItem.status === 'processed' ? 'Procesada' :
                         returnItem.status === 'approved' ? 'Aprobada' :
                         returnItem.status === 'pending' ? 'Pendiente' :
                         'Rechazada'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Productos más devueltos */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Productos con Más Devoluciones</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-center">Cantidad Devuelta</TableHead>
                  <TableHead className="text-right">Valor Devuelto</TableHead>
                  <TableHead>Motivos Principales</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(() => {
                  const productReturns: Record<string, { name: string; quantity: number; value: number; reasons: string[] }> = {};
                  
                  returns.forEach(ret => {
                    ret.items.forEach(item => {
                      if (!productReturns[item.productId]) {
                        productReturns[item.productId] = {
                          name: item.productName,
                          quantity: 0,
                          value: 0,
                          reasons: []
                        };
                      }
                      productReturns[item.productId].quantity += item.quantity;
                      productReturns[item.productId].value += item.total;
                      if (!productReturns[item.productId].reasons.includes(item.reason)) {
                        productReturns[item.productId].reasons.push(item.reason);
                      }
                    });
                  });

                  return Object.values(productReturns)
                    .sort((a, b) => b.quantity - a.quantity)
                    .slice(0, 10);
                })().map((product, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-center">{product.quantity}</TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(product.value)}</TableCell>
                    <TableCell className="text-sm">{product.reasons.slice(0, 2).join(', ')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {renderReportFooter()}
      </div>
    );
  };

  const renderSuppliersReport = () => {
    const totalSuppliers = suppliers.length;
    const totalProductsSupplied = suppliers.reduce((sum, supplier) => sum + (supplier.products?.length || 0), 0);

    return (
      <div className="space-y-6">
        {renderReportHeader()}
        
        {/* Resumen de Proveedores */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-purple-50 p-6 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-purple-800">Total Proveedores</h3>
            <p className="text-3xl font-bold text-purple-900">{totalSuppliers}</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-blue-800">Productos Suministrados</h3>
            <p className="text-3xl font-bold text-blue-900">{totalProductsSupplied}</p>
          </div>
        </div>

        {/* Directorio de Proveedores */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Directorio de Proveedores</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>RTN</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead className="text-center">Productos</TableHead>
                  <TableHead>Fecha Registro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-mono">{supplier.id}</TableCell>
                    <TableCell className="font-medium">{supplier.nombre || supplier.name || 'Sin nombre'}</TableCell>
                    <TableCell>{supplier.rtn || '-'}</TableCell>
                    <TableCell>{supplier.telefono || supplier.phone || '-'}</TableCell>
                    <TableCell className="text-sm">{supplier.correo || supplier.email || '-'}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {[supplier.direccion || supplier.address, supplier.ciudad, supplier.departamento].filter(Boolean).join(', ') || '-'}
                    </TableCell>
                    <TableCell className="text-center">{supplier.products?.length || 0}</TableCell>
                    <TableCell>{supplier.createdAt ? formatDate(supplier.createdAt) : '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Detalle de productos por proveedor */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Productos por Proveedor</h3>
          <div className="space-y-4">
            {suppliers.map((supplier) => (
              <div key={supplier.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{supplier.nombre || supplier.name || 'Sin nombre'}</h4>
                    <p className="text-sm text-gray-600">{supplier.id} {supplier.rtn && `- RTN: ${supplier.rtn}`}</p>
                  </div>
                  <Badge variant="outline">{supplier.products?.length || 0} productos (legacy)</Badge>
                </div>
                <div className="text-sm text-gray-700">
                  <p><strong>Contacto:</strong> {supplier.telefono || supplier.phone || 'N/A'} | {supplier.correo || supplier.email || 'N/A'}</p>
                  <p><strong>Dirección:</strong> {[supplier.direccion || supplier.address, supplier.ciudad, supplier.departamento, supplier.pais].filter(Boolean).join(', ') || 'N/A'}</p>
                  {supplier.products && Array.isArray(supplier.products) && supplier.products.length > 0 && (
                    <div className="mt-2">
                      <strong>Productos Suministrados (Legacy):</strong>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-1">
                        {supplier.products.map((productId) => {
                          const product = products.find(p => p.id === productId);
                          return product ? (
                            <span key={productId} className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {product.name}
                            </span>
                          ) : (
                            <span key={productId} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                              {productId} (No encontrado)
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {renderReportFooter()}
      </div>
    );
  };

  const renderSupplierOrdersReport = () => {
    const totalOrders = supplierOrders.length;
    const pendingOrders = supplierOrders.filter(order => order.status === 'pending').length;
    const sentOrders = supplierOrders.filter(order => order.status === 'sent').length;
    const receivedOrders = supplierOrders.filter(order => order.status === 'received').length;
    const cancelledOrders = supplierOrders.filter(order => order.status === 'cancelled').length;
    const totalOrderValue = supplierOrders.reduce((sum, order) => sum + order.total, 0);

    return (
      <div className="space-y-6">
        {renderReportHeader()}
        
        {/* Resumen de Pedidos */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-blue-800">Total Pedidos</h3>
            <p className="text-2xl font-bold text-blue-900">{totalOrders}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-yellow-800">Pendientes</h3>
            <p className="text-2xl font-bold text-yellow-900">{pendingOrders}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-orange-800">Enviados</h3>
            <p className="text-2xl font-bold text-orange-900">{sentOrders}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-green-800">Recibidos</h3>
            <p className="text-2xl font-bold text-green-900">{receivedOrders}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-red-800">Cancelados</h3>
            <p className="text-2xl font-bold text-red-900">{cancelledOrders}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-purple-800">Valor Total</h3>
            <p className="text-2xl font-bold text-purple-900">{formatCurrency(totalOrderValue)}</p>
          </div>
        </div>

        {/* Historial de Pedidos */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Historial de Pedidos a Proveedores</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Pedido</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Fecha Pedido</TableHead>
                  <TableHead>Entrega Esperada</TableHead>
                  <TableHead className="text-center">Productos</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                  <TableHead>Notas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {supplierOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono">{order.id}</TableCell>
                    <TableCell>{order.supplierName}</TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell>{formatDate(order.expectedDelivery)}</TableCell>
                    <TableCell className="text-center">{order.items.length}</TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(order.total)}</TableCell>
                    <TableCell className="text-center">
                      <Badge className={
                        order.status === 'received' ? 'bg-green-500' :
                        order.status === 'sent' ? 'bg-blue-500' :
                        order.status === 'pending' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }>
                        {order.status === 'received' ? 'Recibido' :
                         order.status === 'sent' ? 'Enviado' :
                         order.status === 'pending' ? 'Pendiente' :
                         'Cancelado'}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{order.notes || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Productos más pedidos */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Productos Más Pedidos</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-center">Cantidad Total Pedida</TableHead>
                  <TableHead className="text-right">Costo Total</TableHead>
                  <TableHead className="text-center">Pedidos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(() => {
                  const productOrders: Record<string, { name: string; quantity: number; cost: number; orders: number }> = {};
                  
                  supplierOrders.forEach(order => {
                    order.items.forEach(item => {
                      if (!productOrders[item.productId]) {
                        productOrders[item.productId] = {
                          name: item.productName,
                          quantity: 0,
                          cost: 0,
                          orders: 0
                        };
                      }
                      productOrders[item.productId].quantity += item.quantity;
                      productOrders[item.productId].cost += item.total;
                      productOrders[item.productId].orders += 1;
                    });
                  });

                  return Object.values(productOrders)
                    .sort((a, b) => b.quantity - a.quantity)
                    .slice(0, 10);
                })().map((product, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-center">{product.quantity}</TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(product.cost)}</TableCell>
                    <TableCell className="text-center">{product.orders}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {renderReportFooter()}
      </div>
    );
  };

  const renderReportContent = () => {
    switch (reportType) {
      case 'sales':
        return renderSalesReport();
      case 'revenue':
        return renderRevenueReport();
      case 'products':
        return renderProductsReport();
      case 'customers':
        return renderCustomersReport();
      case 'returns':
        return renderReturnsReport();
      case 'suppliers':
        return renderSuppliersReport();
      case 'supplier-orders':
        return renderSupplierOrdersReport();
      default:
        return <div>Selecciona un tipo de reporte</div>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[98vw] max-w-[98vw] h-[95vh] max-h-[95vh] p-0 overflow-hidden print:max-w-none print:max-h-none print:overflow-visible">
        <DialogHeader className="p-6 pb-4 border-b bg-white sticky top-0 z-10 print:hidden">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              {getReportIcon()}
              {getReportTitle()}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Vista de reporte para imprimir o exportar
            </DialogDescription>
            <div className="flex gap-2">
              <Button
                onClick={handlePrint}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Printer className="mr-2 h-4 w-4" />
                Imprimir
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open('', '_blank')}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Download className="mr-2 h-4 w-4" />
                Vista Previa
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto p-6 print:p-0 print:text-black">
          {renderReportContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}