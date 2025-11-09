import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Product, Customer, SaleItem, Sale, TaxBreakdown, Category } from '../types';
import { calculateTaxBreakdown, getTaxCategoryLabel, getTaxCategoryBadgeColor, getTotalTaxAmount, getSubtotalAmount, getTaxCategoryFromImpuesto } from '../utils/taxCalculations';
import { Plus, Minus, ShoppingCart, Search, X, CheckCircle } from 'lucide-react';
import { mockCategories } from '../data/mockData';

interface NewSaleProps {
  products: Product[];
  customers: Customer[];
  onAddSale: (sale: { customerId: string; customerName: string; items: SaleItem[]; subtotal: number; taxBreakdown: TaxBreakdown; total: number; status: 'completed' }) => void;
}

export function NewSale({
  products,
  customers,
  onAddSale,
}: NewSaleProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('Consumidor Final');
  const [customerRTN, setCustomerRTN] = useState<string>('');
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);
  const [lastCreatedSale, setLastCreatedSale] = useState<Sale | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-HN', {
      style: 'currency',
      currency: 'HNL',
    }).format(amount);
  };

  const addProductToSale = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = saleItems.find(item => item.productId === productId);
    
    if (existingItem) {
      setSaleItems(prev => 
        prev.map(item => 
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
            : item
        )
      );
    } else {
      // Usar el campo correcto de impuesto y convertirlo a taxCategory
      const productTaxCategory = product.taxCategory || getTaxCategoryFromImpuesto(product.impuesto ?? 0.15);
      const productPrice = product.price || product.precio_venta;
      
      setSaleItems(prev => [...prev, {
        productId: product.id,
        productName: product.name || product.nombre,
        quantity: 1,
        price: productPrice,
        total: productPrice,
        taxCategory: productTaxCategory,
      }]);
    }
  };

  const updateItemQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setSaleItems(prev => prev.filter(item => item.productId !== productId));
    } else {
      setSaleItems(prev =>
        prev.map(item =>
          item.productId === productId
            ? { ...item, quantity: newQuantity, total: newQuantity * item.price }
            : item
        )
      );
    }
  };

  const removeItemFromCart = (productId: string) => {
    setSaleItems(prev => prev.filter(item => item.productId !== productId));
  };

  const calculateTotals = () => {
    const taxBreakdown = calculateTaxBreakdown(saleItems);
    const subtotal = getSubtotalAmount(taxBreakdown);
    const totalTax = getTotalTaxAmount(taxBreakdown);
    const total = subtotal + totalTax;
    return { subtotal, taxBreakdown, totalTax, total };
  };

  const handleCreateSale = () => {
    if (!customerName || saleItems.length === 0) return;

    const { subtotal, taxBreakdown, total } = calculateTotals();

    // Buscar el cliente o usar "Consumidor Final"
    let customerId = 'CONSUMIDOR-FINAL';
    let finalCustomerName = customerName;
    
    const existingCustomer = customers.find(c => 
      (c.nombre || c.name)?.toLowerCase() === customerName.toLowerCase()
    );
    if (existingCustomer) {
      customerId = existingCustomer.id;
      finalCustomerName = existingCustomer.nombre || existingCustomer.name || customerName;
    }

    const newSale = {
      customerId,
      customerName: finalCustomerName,
      items: saleItems,
      subtotal,
      taxBreakdown,
      total,
      status: 'completed' as const,
    };

    onAddSale(newSale);
    setShowSuccessDialog(true);
    
    // Limpiar formulario
    setCustomerName('Consumidor Final');
    setCustomerRTN('');
    setSaleItems([]);
    setSearchQuery('');
  };

  const resetNewSale = () => {
    setCustomerName('Consumidor Final');
    setCustomerRTN('');
    setSaleItems([]);
    setSearchQuery('');
    setSelectedCategory('');
  };

  // Filtrar productos por categoría seleccionada y búsqueda
  const filteredProducts = products.filter(product => {
    const productName = (product.name || product.nombre || '').toLowerCase();
    const productReferencia = (product.referencia || '').toLowerCase();
    const productBarcode = (product.barcode || product.codigo || '').toLowerCase();
    const productCategory = product.category || product.categoria || '';
    const searchLower = searchQuery.toLowerCase();
    
    const matchesSearch = 
      productName.includes(searchLower) ||
      productReferencia.includes(searchLower) ||
      productBarcode.includes(searchLower);
    
    const matchesCategory = !selectedCategory || productCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const { subtotal, taxBreakdown, totalTax, total } = calculateTotals();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="text-center bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-2xl flex items-center justify-center gap-3">
          <ShoppingCart className="h-7 w-7" />
          Nueva Venta
        </h1>
        <p className="text-blue-100">
          MINI SUPER ROSITA - Sistema de Punto de Venta
        </p>
      </div>

      {/* Top Section: Cart + Customer Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Section - Takes 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-t-xl">
            <h2 className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Carrito de Compras
            </h2>
          </div>
          
          <div className="p-4">
            {saleItems.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <ShoppingCart className="h-16 w-16 mx-auto mb-3 opacity-30" />
                <p>El carrito está vacío</p>
                <p className="text-sm">Agrega productos para comenzar la venta</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-2 pb-2 border-b-2 border-gray-300">
                  <div className="col-span-2 text-center">CANT.</div>
                  <div className="col-span-5">DESCRIPCIÓN</div>
                  <div className="col-span-2 text-right">PRECIO</div>
                  <div className="col-span-2 text-right">IMPORTE</div>
                  <div className="col-span-1"></div>
                </div>

                {/* Table Rows */}
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {saleItems.map(item => (
                    <div key={item.productId} className="grid grid-cols-12 gap-2 items-center py-2 border-b border-gray-100">
                      <div className="col-span-2 flex items-center justify-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateItemQuantity(item.productId, item.quantity - 1)}
                          className="h-6 w-6 p-0 hover:bg-red-100"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateItemQuantity(item.productId, item.quantity + 1)}
                          className="h-6 w-6 p-0 hover:bg-green-100"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="col-span-5">
                        <div className="text-sm">{item.productName}</div>
                        <Badge className={`text-xs ${getTaxCategoryBadgeColor(item.taxCategory)}`}>
                          {getTaxCategoryLabel(item.taxCategory)}
                        </Badge>
                      </div>
                      <div className="col-span-2 text-right text-sm">
                        {formatCurrency(item.price)}
                      </div>
                      <div className="col-span-2 text-right">
                        {formatCurrency(item.total)}
                      </div>
                      <div className="col-span-1 flex justify-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeItemFromCart(item.productId)}
                          className="h-6 w-6 p-0 hover:bg-red-100"
                        >
                          <X className="h-3 w-3 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <Separator className="my-3" />
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  {taxBreakdown.isv15 > 0 && (
                    <div className="flex justify-between text-gray-700">
                      <span>ISV 15%:</span>
                      <span>{formatCurrency(taxBreakdown.isv15)}</span>
                    </div>
                  )}
                  {taxBreakdown.isv18 > 0 && (
                    <div className="flex justify-between text-gray-700">
                      <span>ISV 18%:</span>
                      <span>{formatCurrency(taxBreakdown.isv18)}</span>
                    </div>
                  )}
                  <Separator className="my-2" />
                  <div className="flex justify-between text-xl text-blue-800">
                    <span>Total:</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Customer Info Section - Takes 1 column */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-t-xl">
            <h2 className="flex items-center gap-2">
              👤 Información del Cliente
            </h2>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <Label>Nombre del Cliente *</Label>
              <Input
                placeholder="Escribe el nombre del cliente..."
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="bg-white border-gray-300 focus:border-green-400 focus:ring-green-400/20"
              />
            </div>

            <div className="space-y-2">
              <Label>RTN del Cliente</Label>
              <Input
                placeholder="RTN (opcional)..."
                value={customerRTN}
                onChange={(e) => setCustomerRTN(e.target.value)}
                className="bg-white border-gray-300 focus:border-green-400 focus:ring-green-400/20"
              />
            </div>

            <Separator className="my-4" />

            <div className="space-y-3">
              <Button
                onClick={handleCreateSale}
                disabled={!customerName || saleItems.length === 0}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Finalizar Venta
              </Button>
              
              <Button
                variant="outline"
                onClick={resetNewSale}
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                🗑️ Limpiar Todo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <Label className="mb-2 block text-gray-700">Buscar Producto</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Busca productos por nombre, referencia o código de barras..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-gray-300 focus:border-blue-400 focus:ring-blue-400/20"
          />
          {searchQuery && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Bottom Section: Categories (Left) + Products (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Section - Left */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-t-xl">
            <h2>📂 Categorías</h2>
          </div>
          
          <div className="p-3 space-y-1 max-h-96 overflow-y-auto">
            <Button
              variant={selectedCategory === '' ? 'default' : 'ghost'}
              className={`w-full justify-start text-left ${
                selectedCategory === '' 
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => setSelectedCategory('')}
            >
              Todas las Categorías
            </Button>
            
            {mockCategories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.nombre ? 'default' : 'ghost'}
                className={`w-full justify-start text-left ${
                  selectedCategory === category.nombre 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => setSelectedCategory(category.nombre)}
              >
                {category.nombre}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Section - Right */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-t-xl">
            <h2 className="flex items-center gap-2">
              📦 Productos Disponibles
              <span className="text-sm text-orange-100">
                ({filteredProducts.length} productos)
              </span>
            </h2>
          </div>
          
          <div className="p-4">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p>No se encontraron productos</p>
                <p className="text-sm">Intenta con otra búsqueda o categoría</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                {filteredProducts.map(product => {
                  const productName = product.name || product.nombre;
                  const productPrice = product.price || product.precio_venta;
                  const productStock = product.stock ?? product.unidades_existencia ?? 0;
                  const productTaxCategory = product.taxCategory || getTaxCategoryFromImpuesto(product.impuesto ?? 0.15);

                  return (
                    <div 
                      key={product.id} 
                      className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all duration-200 hover:border-blue-300"
                    >
                      <div className="flex flex-col h-full">
                        <div className="flex-1">
                          <h3 className="text-sm text-gray-800 mb-2">{productName}</h3>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-green-600">{formatCurrency(productPrice)}</span>
                              <Badge className={`text-xs ${getTaxCategoryBadgeColor(productTaxCategory)}`}>
                                {getTaxCategoryLabel(productTaxCategory)}
                              </Badge>
                            </div>
                            <div>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                productStock > 10 ? 'bg-green-100 text-green-700' :
                                productStock > 0 ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                Stock: {productStock}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => addProductToSale(product.id)}
                          disabled={productStock === 0}
                          className="w-full mt-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Agregar
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              ¡Venta Creada Exitosamente!
            </DialogTitle>
            <DialogDescription>
              La venta ha sido registrada en el sistema
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-gray-600">
                La venta ha sido registrada correctamente en el sistema.
              </p>
            </div>

            {lastCreatedSale && (
              <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Venta #:</span>
                  <span>{lastCreatedSale.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Cliente:</span>
                  <span>{lastCreatedSale.customerName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total:</span>
                  <span>{formatCurrency(lastCreatedSale.total)}</span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowSuccessDialog(false)}
                className="flex-1"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}