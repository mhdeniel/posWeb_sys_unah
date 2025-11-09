import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { ProductManagement } from './components/ProductManagement';
import { CustomerManagement } from './components/CustomerManagement';
import { NewSale } from './components/NewSale';
import { SalesList } from './components/SalesList';
import { DevolucionesManagement } from './components/DevolucionesManagement';
import { SupplierOrderManagement } from './components/SupplierOrderManagement';
import { NewSupplierOrder } from './components/NewSupplierOrder';
import { TopNavigation } from './components/TopNavigation';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import { Product, Customer, Sale, Return, Supplier, SupplierOrder, DashboardStats, CompanyInfo, Category } from './types';
import { mockProducts, mockCustomers, mockSales, mockReturns, mockSuppliers, mockSupplierOrders, mockDashboardStats, mockCompanyInfo, mockCategories } from './data/mockData';
import { BarChart3, Package, Users, ShoppingCart, RotateCcw, Truck, List, PackagePlus } from 'lucide-react';

type ActiveView = 'dashboard' | 'products' | 'customers' | 'new-sale' | 'sales-list' | 'returns' | 'suppliers' | 'new-order';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [sales, setSales] = useState<Sale[]>(mockSales);
  const [returns, setReturns] = useState<Return[]>(mockReturns);
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [supplierOrders, setSupplierOrders] = useState<SupplierOrder[]>(mockSupplierOrders);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>(mockDashboardStats);
  const [companyInfo] = useState<CompanyInfo>(mockCompanyInfo);
  const [categories, setCategories] = useState<Category[]>(mockCategories);

  // Product handlers
  const handleAddProduct = (productData: Omit<Product, 'id'>) => {
    // Generar ID único para producto
    const getNextProductId = () => {
      const existingIds = products.map(p => p.id).filter(id => id.startsWith('PROD-'));
      const numbers = existingIds.map(id => parseInt(id.split('-')[1])).filter(n => !isNaN(n));
      const nextNumber = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
      return `PROD-${nextNumber.toString().padStart(3, '0')}`;
    };

    const newProduct: Product = {
      ...productData,
      id: getNextProductId(),
    };
    setProducts(prev => [...prev, newProduct]);
    updateDashboardStats();
  };

  const handleUpdateProduct = (id: string, productData: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...productData } : p));
    updateDashboardStats();
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    updateDashboardStats();
  };

  // Category handlers
  const handleAddCategory = (categoryData: Omit<Category, 'id'>) => {
    // Generar ID único para categoría
    const getNextCategoryId = () => {
      const existingIds = categories.map(c => c.id).filter(id => id.startsWith('CAT-'));
      const numbers = existingIds.map(id => parseInt(id.split('-')[1])).filter(n => !isNaN(n));
      const nextNumber = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
      return `CAT-${nextNumber.toString().padStart(3, '0')}`;
    };

    const newCategory: Category = {
      ...categoryData,
      id: getNextCategoryId(),
    };
    setCategories(prev => [...prev, newCategory]);
  };

  // Customer handlers
  const handleAddCustomer = (customerData: Omit<Customer, 'id'>) => {
    // Generar ID único para cliente
    const getNextCustomerId = () => {
      const existingIds = customers.map(c => c.id).filter(id => id.startsWith('CUST-'));
      const numbers = existingIds.map(id => parseInt(id.split('-')[1])).filter(n => !isNaN(n));
      const nextNumber = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
      return `CUST-${nextNumber.toString().padStart(3, '0')}`;
    };

    const newCustomer: Customer = {
      ...customerData,
      id: getNextCustomerId(),
      visible: customerData.visible !== undefined ? customerData.visible : true,
    };
    setCustomers(prev => [...prev, newCustomer]);
    updateDashboardStats();
  };

  const handleUpdateCustomer = (id: string, customerData: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...customerData } : c));
    updateDashboardStats();
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    updateDashboardStats();
  };

  // Sales handlers
  const handleAddSale = (saleData: Omit<Sale, 'id' | 'createdAt'>) => {
    // Generar ID único para venta
    const getNextSaleId = () => {
      const existingIds = sales.map(s => s.id).filter(id => id.startsWith('SALE-'));
      const numbers = existingIds.map(id => parseInt(id.split('-')[1])).filter(n => !isNaN(n));
      const nextNumber = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
      return `SALE-${nextNumber.toString().padStart(3, '0')}`;
    };

    const newSale: Sale = {
      ...saleData,
      id: getNextSaleId(),
      createdAt: new Date(),
    };
    setSales(prev => [...prev, newSale]);
    
    // Update product stock - usar unidades_existencia con fallback a stock
    saleData.items.forEach(item => {
      setProducts(prev => prev.map(p => {
        if (p.id === item.productId) {
          const currentStock = p.unidades_existencia ?? p.stock ?? 0;
          return {
            ...p,
            unidades_existencia: Math.max(0, currentStock - item.quantity),
            stock: Math.max(0, currentStock - item.quantity), // Legacy
          };
        }
        return p;
      }));
    });
    
    updateDashboardStats();
  };

  const handleDeleteSale = (id: string) => {
    setSales(prev => prev.filter(s => s.id !== id));
    updateDashboardStats();
  };

  // Return handlers
  const handleAddReturn = (returnData: Omit<Return, 'id' | 'createdAt'>) => {
    // Generar ID único para devolución
    const getNextReturnId = () => {
      const existingIds = returns.map(r => r.id).filter(id => id.startsWith('RET-'));
      const numbers = existingIds.map(id => parseInt(id.split('-')[1])).filter(n => !isNaN(n));
      const nextNumber = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
      return `RET-${nextNumber.toString().padStart(3, '0')}`;
    };

    const newReturn: Return = {
      ...returnData,
      id: getNextReturnId(),
      createdAt: new Date(),
    };
    setReturns(prev => [...prev, newReturn]);
  };

  const handleUpdateReturn = (id: string, returnData: Partial<Return>) => {
    setReturns(prev => prev.map(r => r.id === id ? { ...r, ...returnData } : r));
    
    // Si la devolución es aprobada o procesada, devolver stock
    if (returnData.status === 'processed') {
      const returnItem = returns.find(r => r.id === id);
      if (returnItem) {
        returnItem.items.forEach(item => {
          setProducts(prev => prev.map(p => {
            if (p.id === item.productId) {
              const currentStock = p.unidades_existencia ?? p.stock ?? 0;
              return {
                ...p,
                unidades_existencia: currentStock + item.quantity,
                stock: currentStock + item.quantity, // Legacy
              };
            }
            return p;
          }));
        });
      }
    }
  };

  const handleDeleteReturn = (id: string) => {
    setReturns(prev => prev.filter(r => r.id !== id));
  };

  // Supplier handlers
  const handleAddSupplier = (supplierData: Omit<Supplier, 'id'>) => {
    // Generar ID único para proveedor
    const getNextSupplierId = () => {
      const existingIds = suppliers.map(s => s.id).filter(id => id.startsWith('SUPP-'));
      const numbers = existingIds.map(id => parseInt(id.split('-')[1])).filter(n => !isNaN(n));
      const nextNumber = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
      return `SUPP-${nextNumber.toString().padStart(3, '0')}`;
    };

    const newSupplier: Supplier = {
      ...supplierData,
      id: getNextSupplierId(),
      visible: supplierData.visible !== undefined ? supplierData.visible : true,
    };
    setSuppliers(prev => [...prev, newSupplier]);
  };

  const handleUpdateSupplier = (id: string, supplierData: Partial<Supplier>) => {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, ...supplierData } : s));
  };

  const handleDeleteSupplier = (id: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
  };

  // Supplier Order handlers
  const handleAddSupplierOrder = (orderData: Omit<SupplierOrder, 'id' | 'createdAt'>) => {
    // Generar ID único para pedido a proveedor
    const getNextOrderId = () => {
      const existingIds = supplierOrders.map(o => o.id).filter(id => id.startsWith('ORD-'));
      const numbers = existingIds.map(id => parseInt(id.split('-')[1])).filter(n => !isNaN(n));
      const nextNumber = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
      return `ORD-${nextNumber.toString().padStart(3, '0')}`;
    };

    const newOrder: SupplierOrder = {
      ...orderData,
      id: getNextOrderId(),
      createdAt: new Date(),
    };
    setSupplierOrders(prev => [...prev, newOrder]);
  };

  const handleUpdateSupplierOrder = (id: string, orderData: Partial<SupplierOrder>) => {
    setSupplierOrders(prev => prev.map(o => o.id === id ? { ...o, ...orderData } : o));
    
    // Si el pedido es marcado como recibido, actualizar stock de productos
    if (orderData.status === 'received') {
      const order = supplierOrders.find(o => o.id === id);
      if (order) {
        order.items.forEach(item => {
          setProducts(prev => prev.map(p => {
            if (p.id === item.productId) {
              const currentStock = p.unidades_existencia ?? p.stock ?? 0;
              return {
                ...p,
                unidades_existencia: currentStock + item.quantity,
                stock: currentStock + item.quantity, // Legacy
              };
            }
            return p;
          }));
        });
      }
    }
  };

  const handleDeleteSupplierOrder = (id: string) => {
    setSupplierOrders(prev => prev.filter(o => o.id !== id));
  };

  const updateDashboardStats = () => {
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
    const recentSales = sales.slice(-5);
    
    // Calculate top products
    const productSales: Record<string, { quantity: number; revenue: number; name: string }> = {};
    sales.forEach(sale => {
      sale.items.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            quantity: 0,
            revenue: 0,
            name: item.productName,
          };
        }
        productSales[item.productId].quantity += item.quantity;
        productSales[item.productId].revenue += item.total;
      });
    });
    
    const topProducts = Object.entries(productSales)
      .map(([productId, data]) => ({
        productId,
        productName: data.name,
        quantity: data.quantity,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 3);

    setDashboardStats({
      totalSales: sales.length,
      totalRevenue,
      totalProducts: products.length,
      totalCustomers: customers.length,
      recentSales,
      topProducts,
    });
  };

  const menuItems = [
    {
      title: 'Nueva Venta',
      icon: ShoppingCart,
      view: 'new-sale' as const,
    },
    {
      title: 'Nuevo Pedido',
      icon: PackagePlus,
      view: 'new-order' as const,
    },
    {
      title: 'Clientes',
      icon: Users,
      view: 'customers' as const,
    },
    {
      title: 'Proveedores',
      icon: Truck,
      view: 'suppliers' as const,
    },
    {
      title: 'Productos',
      icon: Package,
      view: 'products' as const,
    },
    {
      title: 'Lista de Ventas',
      icon: List,
      view: 'sales-list' as const,
    },
    {
      title: 'Devoluciones',
      icon: RotateCcw,
      view: 'returns' as const,
    },
    {
      title: 'Reportes',
      icon: BarChart3,
      view: 'dashboard' as const,
    },
  ];

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <Dashboard 
            stats={dashboardStats} 
            products={products}
            customers={customers}
            sales={sales}
            companyInfo={companyInfo}
            returns={returns}
            suppliers={suppliers}
            supplierOrders={supplierOrders}
          />
        );
      case 'products':
        return (
          <ProductManagement
            products={products}
            suppliers={suppliers}
            categories={categories}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onAddCategory={handleAddCategory}
          />
        );
      case 'customers':
        return (
          <CustomerManagement
            customers={customers}
            onAddCustomer={handleAddCustomer}
            onUpdateCustomer={handleUpdateCustomer}
            onDeleteCustomer={handleDeleteCustomer}
          />
        );
      case 'new-sale':
        return (
          <NewSale
            products={products}
            customers={customers}
            onAddSale={handleAddSale}
          />
        );
      case 'sales-list':
        return (
          <SalesList
            sales={sales}
            customers={customers}
            onDeleteSale={handleDeleteSale}
          />
        );
      case 'returns':
        return (
          <DevolucionesManagement
            returns={returns}
            sales={sales}
            products={products}
            customers={customers}
            onAddReturn={handleAddReturn}
            onUpdateReturn={handleUpdateReturn}
            onDeleteReturn={handleDeleteReturn}
          />
        );
      case 'new-order':
        return (
          <NewSupplierOrder
            products={products}
            suppliers={suppliers}
            onAddSupplierOrder={handleAddSupplierOrder}
          />
        );
      case 'suppliers':
        return (
          <SupplierOrderManagement
            suppliers={suppliers}
            supplierOrders={supplierOrders}
            products={products}
            onAddSupplier={handleAddSupplier}
            onUpdateSupplier={handleUpdateSupplier}
            onDeleteSupplier={handleDeleteSupplier}
            onAddSupplierOrder={handleAddSupplierOrder}
            onUpdateSupplierOrder={handleUpdateSupplierOrder}
            onDeleteSupplierOrder={handleDeleteSupplierOrder}
          />
        );
      default:
        return (
          <Dashboard 
            stats={dashboardStats} 
            products={products}
            customers={customers}
            sales={sales}
            companyInfo={companyInfo}
            returns={returns}
            suppliers={suppliers}
            supplierOrders={supplierOrders}
          />
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar className="sidebar bg-blue-500">
          <SidebarContent className="bg-blue-500">
            <SidebarGroup>
              <div className="px-4 py-6 bg-blue-600 mx-2 mt-2 rounded-xl border border-blue-400 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <ShoppingCart className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">MINI SUPER ROSITA</h2>
                    <p className="text-sm text-blue-100">Sistema de Ventas</p>
                  </div>
                </div>
              </div>
              <SidebarGroupContent className="px-3 mt-6">
                <SidebarMenu className="space-y-2">
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.view}>
                      <SidebarMenuButton
                        onClick={() => setActiveView(item.view)}
                        isActive={activeView === item.view}
                        className={`transition-all duration-300 rounded-xl px-4 py-3 text-base ${
                          activeView === item.view 
                            ? 'bg-white text-blue-600 shadow-lg scale-105' 
                            : 'hover:bg-blue-400 text-white hover:shadow-md hover:scale-102'
                        }`}
                      >
                        <item.icon className="h-5 w-5 mr-1" />
                        <span className="tracking-wide">{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="border-b bg-white px-4 py-3 flex items-center gap-2 shadow-sm">
            <SidebarTrigger className="hover:bg-gray-100 text-gray-700 transition-colors duration-200 rounded-lg" />
            <div className="flex-1" />
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Sistema Activo
            </div>
          </header>

          <TopNavigation 
            activeView={activeView}
            onViewChange={setActiveView}
            menuItems={menuItems}
          />

          <main className="flex-1 overflow-auto p-6 animate-fade-in">
            <div className="max-w-7xl mx-auto">
              {renderActiveView()}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}