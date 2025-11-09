import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Separator } from './ui/separator';
import { Return, Sale, Product, Customer, ReturnItem, SaleItem } from '../types';
import { calculateTaxBreakdown, getTotalTaxAmount, getSubtotalAmount } from '../utils/taxCalculations';
import { Plus, Minus, RotateCcw, Eye, CheckCircle, XCircle, Clock, Trash2 } from 'lucide-react';

interface DevolucionesManagementProps {
  returns: Return[];
  sales: Sale[];
  products: Product[];
  customers: Customer[];
  onAddReturn: (returnData: Omit<Return, 'id' | 'createdAt'>) => void;
  onUpdateReturn: (id: string, returnData: Partial<Return>) => void;
  onDeleteReturn: (id: string) => void;
}

export function DevolucionesManagement({
  returns,
  sales,
  products,
  customers,
  onAddReturn,
  onUpdateReturn,
  onDeleteReturn,
}: DevolucionesManagementProps) {
  const [isNewReturnDialogOpen, setIsNewReturnDialogOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<string>('');
  const [returnItems, setReturnItems] = useState<ReturnItem[]>([]);
  const [returnReason, setReturnReason] = useState('');
  const [viewingReturn, setViewingReturn] = useState<Return | null>(null);
  const [deletingReturnId, setDeletingReturnId] = useState<string | null>(null);

  // Filtrar ventas completadas
  const completedSales = sales.filter(sale => sale.status === 'completed');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-HN', {
      style: 'currency',
      currency: 'HNL',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-HN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusBadge = (status: Return['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pendiente</Badge>;
      case 'approved':
        return <Badge variant="default"><CheckCircle className="w-3 h-3 mr-1" />Aprobada</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rechazada</Badge>;
      case 'processed':
        return <Badge variant="outline"><CheckCircle className="w-3 h-3 mr-1" />Procesada</Badge>;
      default:
        return <Badge variant="secondary">Desconocido</Badge>;
    }
  };

  const addItemToReturn = (saleItem: any, reason: string) => {
    const existingItem = returnItems.find(item => item.productId === saleItem.productId);
    
    if (existingItem) {
      setReturnItems(prev => 
        prev.map(item => 
          item.productId === saleItem.productId
            ? { ...item, quantity: Math.min(item.quantity + 1, saleItem.quantity), total: Math.min(item.quantity + 1, saleItem.quantity) * item.price }
            : item
        )
      );
    } else {
      setReturnItems(prev => [...prev, {
        productId: saleItem.productId,
        productName: saleItem.productName,
        quantity: 1,
        price: saleItem.price,
        total: saleItem.price,
        taxCategory: saleItem.taxCategory,
        reason,
      }]);
    }
  };

  const updateItemQuantity = (productId: string, newQuantity: number, maxQuantity: number) => {
    if (newQuantity <= 0) {
      setReturnItems(prev => prev.filter(item => item.productId !== productId));
    } else {
      const finalQuantity = Math.min(newQuantity, maxQuantity);
      setReturnItems(prev =>
        prev.map(item =>
          item.productId === productId
            ? { ...item, quantity: finalQuantity, total: finalQuantity * item.price }
            : item
        )
      );
    }
  };

  const calculateTotals = () => {
    // Convertir returnItems a SaleItems para usar calculateTaxBreakdown
    const saleItems: SaleItem[] = returnItems.map(item => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      price: item.price,
      total: item.total,
      taxCategory: item.taxCategory,
    }));
    
    const taxBreakdown = calculateTaxBreakdown(saleItems);
    const subtotal = getSubtotalAmount(taxBreakdown);
    const totalTax = getTotalTaxAmount(taxBreakdown);
    const total = subtotal + totalTax;
    
    return { subtotal, taxBreakdown, total };
  };

  const handleCreateReturn = () => {
    if (!selectedSale || returnItems.length === 0 || !returnReason.trim()) return;

    const sale = completedSales.find(s => s.id === selectedSale);
    const customer = customers.find(c => c.id === sale?.customerId);
    
    if (!sale || !customer) return;

    const { subtotal, taxBreakdown, total } = calculateTotals();

    const newReturn: Omit<Return, 'id' | 'createdAt'> = {
      saleId: sale.id,
      customerId: customer.id,
      customerName: customer.nombre || customer.name || 'Cliente',
      items: returnItems,
      subtotal,
      taxBreakdown,
      total,
      status: 'pending',
      reason: returnReason,
    };

    onAddReturn(newReturn);
    setIsNewReturnDialogOpen(false);
    setSelectedSale('');
    setReturnItems([]);
    setReturnReason('');
  };

  const handleUpdateReturnStatus = (returnId: string, newStatus: Return['status']) => {
    const updateData: Partial<Return> = { status: newStatus };
    if (newStatus === 'processed' || newStatus === 'approved') {
      updateData.processedAt = new Date();
    }
    onUpdateReturn(returnId, updateData);
  };

  const resetNewReturn = () => {
    setSelectedSale('');
    setReturnItems([]);
    setReturnReason('');
  };

  const selectedSaleData = completedSales.find(s => s.id === selectedSale);

  return (
    <div className="space-y-8">
      <div className="text-center bg-gradient-to-r from-red-500 to-pink-600 text-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
          <RotateCcw className="h-8 w-8" />
          Gestión de Devoluciones
        </h1>
        <p className="text-red-100 text-lg">
          Administra las devoluciones de productos - MINI SUPER ROSITA
        </p>
      </div>
      
      <div className="flex items-center justify-between">
        <Dialog open={isNewReturnDialogOpen} onOpenChange={setIsNewReturnDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-white hover:scale-105 transition-all duration-200 shadow-lg">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Devolución
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-[95vw] h-[95vh] max-h-[95vh] p-0 overflow-hidden">
            <DialogDescription className="sr-only">
              Formulario para crear una nueva devolución de productos
            </DialogDescription>
            <div className="bg-gradient-to-br from-red-50 via-pink-50 to-red-100 p-6 rounded-2xl border border-red-200/50 m-4 h-full overflow-auto">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-xl mb-6 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <RotateCcw className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Nueva Devolución</h3>
                    <p className="text-red-100 text-sm">
                      Procesa la devolución de productos de una venta completada
                    </p>
                  </div>
                </div>
              </div>
            
              <div className="space-y-6">
                {/* Sale Selection */}
                <div className="space-y-3">
                  <Label className="text-red-800 font-medium flex items-center gap-2">
                    🛒 Seleccionar Venta Completada
                  </Label>
                  <Select value={selectedSale} onValueChange={setSelectedSale}>
                    <SelectTrigger className="bg-white/80 border-red-200 focus:border-red-400 focus:ring-red-400/20 rounded-xl">
                      <SelectValue placeholder="Busca una venta completada..." />
                    </SelectTrigger>
                    <SelectContent>
                      {completedSales.map(sale => (
                        <SelectItem key={sale.id} value={sale.id}>
                          <div className="flex items-center justify-between w-full">
                            <div>
                              <span className="font-medium">Venta #{sale.id}</span>
                              <div className="text-sm text-gray-500">
                                {sale.customerName} • {formatCurrency(sale.total)} • {formatDate(sale.createdAt)}
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Return Reason */}
                <div className="space-y-3">
                  <Label className="text-red-800 font-medium flex items-center gap-2">
                    📝 Motivo General de la Devolución
                  </Label>
                  <Textarea
                    placeholder="Describe brevemente el motivo general de la devolución..."
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="bg-white/80 border-red-200 focus:border-red-400 focus:ring-red-400/20 rounded-xl min-h-[80px]"
                  />
                </div>

                {/* Products from Selected Sale */}
                {selectedSaleData && (
                  <div className="space-y-3">
                    <Label className="text-red-800 font-medium flex items-center gap-2">
                      📦 Productos de la Venta Seleccionada
                    </Label>
                    <div className="bg-white/60 rounded-xl p-4 border border-red-200">
                      <div className="grid gap-3 max-h-64 overflow-y-auto">
                        {selectedSaleData.items.map(item => (
                          <div key={item.productId} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-100 hover:shadow-md transition-all duration-200">
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">{item.productName}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="font-medium text-green-600">{formatCurrency(item.price)}</span>
                                <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                                  Cantidad: {item.quantity}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Select onValueChange={(reason) => addItemToReturn(item, reason)}>
                                <SelectTrigger className="w-48 bg-red-50 border-red-200 focus:border-red-400 rounded-lg">
                                  <SelectValue placeholder="Selecciona motivo" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="defectuoso">
                                    <div className="flex items-center gap-2">
                                      ❌ <span>Producto defectuoso</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="no_cumple">
                                    <div className="flex items-center gap-2">
                                      😞 <span>No cumple expectativas</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="error_pedido">
                                    <div className="flex items-center gap-2">
                                      ⚠️ <span>Error en el pedido</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="otro">
                                    <div className="flex items-center gap-2">
                                      📝 <span>Otro motivo</span>
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Return Items */}
                {returnItems.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-red-800 font-medium flex items-center gap-2">
                      🔄 Productos Seleccionados para Devolución
                    </Label>
                    <div className="bg-white/60 rounded-xl p-4 border border-red-200">
                      <div className="space-y-3">
                        {returnItems.map(item => {
                          const originalItem = selectedSaleData?.items.find(si => si.productId === item.productId);
                          const maxQuantity = originalItem?.quantity || 1;
                          
                          const getReasonEmoji = (reason: string) => {
                            switch (reason) {
                              case 'defectuoso': return '❌';
                              case 'no_cumple': return '😞';
                              case 'error_pedido': return '⚠️';
                              default: return '📝';
                            }
                          };
                          
                          return (
                            <div key={item.productId} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-100">
                              <div className="flex-1">
                                <p className="font-medium text-gray-800">{item.productName}</p>
                                <p className="text-sm text-gray-600">
                                  {formatCurrency(item.price)} cada uno
                                </p>
                                <p className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full inline-block mt-1">
                                  {getReasonEmoji(item.reason)} {item.reason.replace('_', ' ')}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => updateItemQuantity(item.productId, item.quantity - 1, maxQuantity)}
                                    className="h-7 w-7 p-0 hover:bg-red-100"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => updateItemQuantity(item.productId, item.quantity + 1, maxQuantity)}
                                    disabled={item.quantity >= maxQuantity}
                                    className="h-7 w-7 p-0 hover:bg-green-100"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                                <span className="min-w-20 text-right font-bold text-red-600">
                                  {formatCurrency(item.total)}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      <Separator className="my-4" />
                      
                      {/* Totals */}
                      <div className="bg-gradient-to-r from-red-100 to-pink-100 p-4 rounded-lg space-y-2">
                        <div className="flex justify-between text-gray-700">
                          <span>Subtotal a devolver:</span>
                          <span>{formatCurrency(getSubtotalAmount(calculateTotals().taxBreakdown))}</span>
                        </div>
                        <div className="flex justify-between text-gray-700">
                          <span>ISV Total:</span>
                          <span>{formatCurrency(getTotalTaxAmount(calculateTotals().taxBreakdown))}</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between text-xl font-bold text-red-800">
                          <span>Total a devolver:</span>
                          <span>{formatCurrency(calculateTotals().total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-red-200">
                  <Button 
                    variant="outline" 
                    onClick={resetNewReturn}
                    className="px-6 py-2 border-red-300 text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200"
                  >
                    🗑️ Limpiar
                  </Button>
                  <Button
                    onClick={handleCreateReturn}
                    disabled={!selectedSale || returnItems.length === 0 || !returnReason.trim()}
                    className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ✅ Crear Devolución
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Returns List */}
      <div className="space-y-4">
        {returns.map((returnItem) => (
          <Card key={returnItem.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <RotateCcw className="h-4 w-4 text-muted-foreground" />
                    <span>Devolución #{returnItem.id}</span>
                    {getStatusBadge(returnItem.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Cliente: {returnItem.customerName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Venta: #{returnItem.saleId}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Creada: {formatDate(returnItem.createdAt)}
                  </p>
                  {returnItem.processedAt && (
                    <p className="text-xs text-muted-foreground">
                      Procesada: {formatDate(returnItem.processedAt)}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg">{formatCurrency(returnItem.total)}</p>
                    <p className="text-xs text-muted-foreground">
                      {returnItem.items.length} productos
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setViewingReturn(returnItem)}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    {returnItem.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateReturnStatus(returnItem.id, 'approved')}
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateReturnStatus(returnItem.id, 'rejected')}
                        >
                          <XCircle className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                    {returnItem.status === 'approved' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateReturnStatus(returnItem.id, 'processed')}
                      >
                        Procesar
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDeletingReturnId(returnItem.id)}
                      className="hover:bg-red-50 hover:border-red-200 text-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {returns.length === 0 && (
        <div className="text-center py-8">
          <RotateCcw className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No hay devoluciones registradas</p>
          <p className="text-sm text-muted-foreground">
            Crea tu primera devolución desde una venta completada
          </p>
        </div>
      )}

      {/* View Return Dialog */}
      <Dialog open={!!viewingReturn} onOpenChange={() => setViewingReturn(null)}>
        <DialogContent className="w-[90vw] max-w-[800px] max-h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-4 border-b bg-white sticky top-0 z-10">
            <DialogTitle>Detalles de Devolución #{viewingReturn?.id}</DialogTitle>
            <DialogDescription>
              Información completa de la devolución seleccionada
            </DialogDescription>
          </DialogHeader>
          
          {viewingReturn && (
            <div className="flex-1 overflow-auto p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Cliente</Label>
                  <p>{viewingReturn.customerName}</p>
                </div>
                <div>
                  <Label>Estado</Label>
                  <div className="mt-1">{getStatusBadge(viewingReturn.status)}</div>
                </div>
                <div>
                  <Label>Venta Original</Label>
                  <p>#{viewingReturn.saleId}</p>
                </div>
                <div>
                  <Label>Fecha de Creación</Label>
                  <p>{formatDate(viewingReturn.createdAt)}</p>
                </div>
              </div>
              
              <div>
                <Label>Motivo</Label>
                <p className="text-sm bg-muted p-2 rounded">{viewingReturn.reason}</p>
              </div>
              
              <div>
                <Label>Productos a Devolver</Label>
                <div className="space-y-2">
                  {viewingReturn.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                      <div>
                        <span className="text-sm">{item.productName}</span>
                        <p className="text-xs text-muted-foreground">Motivo: {item.reason}</p>
                      </div>
                      <span className="text-sm">{item.quantity} × {formatCurrency(item.price)} = {formatCurrency(item.total)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(getSubtotalAmount(viewingReturn.taxBreakdown))}</span>
                </div>
                <div className="flex justify-between">
                  <span>ISV Total:</span>
                  <span>{formatCurrency(getTotalTaxAmount(viewingReturn.taxBreakdown))}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span>Total a devolver:</span>
                  <span>{formatCurrency(viewingReturn.total)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Return Confirmation Dialog */}
      <AlertDialog open={!!deletingReturnId} onOpenChange={() => setDeletingReturnId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de eliminar esta devolución?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La devolución será eliminada permanentemente del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deletingReturnId && (() => {
            const returnItem = returns.find(r => r.id === deletingReturnId);
            return returnItem ? (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="font-medium text-gray-900">Devolución #{returnItem.id}</p>
                <p className="text-sm text-gray-600">Cliente: {returnItem.customerName}</p>
                <p className="text-sm text-gray-600">Total: {formatCurrency(returnItem.total)}</p>
              </div>
            ) : null;
          })()}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingReturnId) {
                  onDeleteReturn(deletingReturnId);
                  setDeletingReturnId(null);
                }
              }}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}