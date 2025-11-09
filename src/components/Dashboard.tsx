import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ReportManagement } from './ReportManagement';
import { DashboardStats, Product, Customer, Sale, CompanyInfo, Return, Supplier, SupplierOrder } from '../types';
import { TrendingUp, Users, Package, DollarSign, ShoppingCart, FileText, RotateCcw, Truck, ClipboardList } from 'lucide-react';

interface DashboardProps {
  stats: DashboardStats;
  products: Product[];
  customers: Customer[];
  sales: Sale[];
  companyInfo: CompanyInfo;
  returns: Return[];
  suppliers: Supplier[];
  supplierOrders: SupplierOrder[];
}

export function Dashboard({ stats, products, customers, sales, companyInfo, returns, suppliers, supplierOrders }: DashboardProps) {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportType, setReportType] = useState<'sales' | 'revenue' | 'products' | 'customers' | 'returns' | 'suppliers' | 'supplier-orders' | null>(null);

  const openReport = (type: 'sales' | 'revenue' | 'products' | 'customers' | 'returns' | 'suppliers' | 'supplier-orders') => {
    setReportType(type);
    setIsReportOpen(true);
  };

  const closeReport = () => {
    setIsReportOpen(false);
    setReportType(null);
  };
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-HN', {
      style: 'currency',
      currency: 'HNL',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="space-y-8">
      <div className="text-center bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        <h1 className="text-3xl font-semibold mb-2 flex items-center justify-center gap-3 text-gray-900">
          <FileText className="h-8 w-8 text-blue-500" />
          Gestión de Reportes
        </h1>
        <p className="text-gray-600 text-lg">
          Resumen general de tu sistema de ventas - MINI SUPER ROSITA
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-lift border border-gray-200 shadow-sm bg-white hover:shadow-md transition-all duration-200 group cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-gray-700">Ventas Totales</CardTitle>
            <div className="h-10 w-10 bg-orange-500 rounded-lg flex items-center justify-center group-hover:bg-orange-600 transition-colors">
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-gray-900 mb-2">{stats.totalSales}</div>
            <Button
              onClick={() => openReport('sales')}
              size="sm"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white transition-colors"
            >
              <FileText className="mr-2 h-4 w-4" />
              Ver Reporte
            </Button>
          </CardContent>
        </Card>

        <Card className="hover-lift border border-gray-200 shadow-sm bg-white hover:shadow-md transition-all duration-200 group cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-gray-700">Ingresos Totales</CardTitle>
            <div className="h-10 w-10 bg-green-500 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition-colors">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-gray-900 mb-2">{formatCurrency(stats.totalRevenue)}</div>
            <Button
              onClick={() => openReport('revenue')}
              size="sm"
              className="w-full bg-green-500 hover:bg-green-600 text-white transition-colors"
            >
              <FileText className="mr-2 h-4 w-4" />
              Ver Reporte
            </Button>
          </CardContent>
        </Card>

        <Card className="hover-lift border border-gray-200 shadow-sm bg-white hover:shadow-md transition-all duration-200 group cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-gray-700">Productos</CardTitle>
            <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
              <Package className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-gray-900 mb-2">{stats.totalProducts}</div>
            <Button
              onClick={() => openReport('products')}
              size="sm"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            >
              <FileText className="mr-2 h-4 w-4" />
              Ver Reporte
            </Button>
          </CardContent>
        </Card>

        <Card className="hover-lift border border-gray-200 shadow-sm bg-white hover:shadow-md transition-all duration-200 group cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-gray-700">Clientes</CardTitle>
            <div className="h-10 w-10 bg-purple-500 rounded-lg flex items-center justify-center group-hover:bg-purple-600 transition-colors">
              <Users className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-gray-900 mb-2">{stats.totalCustomers}</div>
            <Button
              onClick={() => openReport('customers')}
              size="sm"
              className="w-full bg-purple-500 hover:bg-purple-600 text-white transition-colors"
            >
              <FileText className="mr-2 h-4 w-4" />
              Ver Reporte
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Sales */}
        <Card className="hover-lift border border-gray-200 shadow-sm bg-white">
          <CardHeader className="bg-white border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-4 w-4 text-white" />
              </div>
              Ventas Recientes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {stats.recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">{sale.customerName}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(sale.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        sale.status === 'completed'
                          ? 'bg-green-500 text-white'
                          : sale.status === 'pending'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-red-500 text-white'
                      }
                    >
                      {sale.status === 'completed'
                        ? 'Completada'
                        : sale.status === 'pending'
                        ? 'Pendiente'
                        : 'Cancelada'}
                    </Badge>
                    <span className="text-sm font-semibold text-gray-900">{formatCurrency(sale.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="hover-lift border border-gray-200 shadow-sm bg-white">
          <CardHeader className="bg-white border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <Package className="h-4 w-4 text-white" />
              </div>
              Productos Más Vendidos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {stats.topProducts.map((product, index) => (
                <div key={product.productId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-white text-sm font-semibold ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 
                      'bg-orange-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.productName}</p>
                      <p className="text-xs text-gray-500">
                        {product.quantity} vendidos
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{formatCurrency(product.revenue)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Nueva sección de reportes adicionales */}
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Reporte de Devoluciones */}
          <Card className="hover-lift border border-gray-200 shadow-sm bg-white hover:shadow-md transition-all duration-200 group cursor-pointer">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-red-600 transition-colors">
                <RotateCcw className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg text-gray-900">Devoluciones</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="space-y-2">
                <div className="text-2xl font-semibold text-gray-900">{returns.length}</div>
                <p className="text-sm text-gray-600">Total de devoluciones</p>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-red-100 text-red-700 text-xs">
                  {returns.filter(r => r.status === 'pending').length} Pendientes
                </Badge>
                <Badge className="bg-green-100 text-green-700 text-xs">
                  {returns.filter(r => r.status === 'processed').length} Procesadas
                </Badge>
              </div>
              <Button
                onClick={() => openReport('returns')}
                className="w-full bg-red-500 hover:bg-red-600 text-white transition-colors"
              >
                <FileText className="mr-2 h-4 w-4" />
                Ver Reporte
              </Button>
            </CardContent>
          </Card>

          {/* Reporte de Proveedores */}
          <Card className="hover-lift border border-gray-200 shadow-sm bg-white hover:shadow-md transition-all duration-200 group cursor-pointer">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-600 transition-colors">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg text-gray-900">Proveedores</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="space-y-2">
                <div className="text-2xl font-semibold text-gray-900">{suppliers.length}</div>
                <p className="text-sm text-gray-600">Proveedores registrados</p>
              </div>
              <div className="text-xs text-gray-500">
                {suppliers.reduce((total, supplier) => total + (supplier.products?.length || 0), 0)} productos suministrados (legacy)
              </div>
              <Button
                onClick={() => openReport('suppliers')}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white transition-colors"
              >
                <FileText className="mr-2 h-4 w-4" />
                Ver Reporte
              </Button>
            </CardContent>
          </Card>

          {/* Reporte de Pedidos a Proveedores */}
          <Card className="hover-lift border border-gray-200 shadow-sm bg-white hover:shadow-md transition-all duration-200 group cursor-pointer">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-indigo-600 transition-colors">
                <ClipboardList className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg text-gray-900">Pedidos a Proveedores</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="space-y-2">
                <div className="text-2xl font-semibold text-gray-900">{supplierOrders.length}</div>
                <p className="text-sm text-gray-600">Órdenes registradas</p>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-yellow-100 text-yellow-700 text-xs">
                  {supplierOrders.filter(o => o.status === 'pending').length} Pendientes
                </Badge>
                <Badge className="bg-green-100 text-green-700 text-xs">
                  {supplierOrders.filter(o => o.status === 'received').length} Recibidas
                </Badge>
              </div>
              <Button
                onClick={() => openReport('supplier-orders')}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
              >
                <FileText className="mr-2 h-4 w-4" />
                Ver Reporte
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <ReportManagement
        products={products}
        customers={customers}
        sales={sales}
        companyInfo={companyInfo}
        returns={returns}
        suppliers={suppliers}
        supplierOrders={supplierOrders}
        isOpen={isReportOpen}
        reportType={reportType}
        onClose={closeReport}
      />
    </div>
  );
}