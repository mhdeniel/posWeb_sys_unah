import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Separator } from './ui/separator';
import { Label } from './ui/label';
import { SalesInvoiceManager } from './SalesInvoiceManager';
import { Sale, Customer } from '../types';
import { ShoppingCart, Eye, Trash2 } from 'lucide-react';

interface SalesListProps {
  sales: Sale[];
  customers: Customer[];
  onDeleteSale: (id: string) => void;
}

export function SalesList({
  sales,
  customers,
  onDeleteSale,
}: SalesListProps) {
  const [viewingSale, setViewingSale] = useState<Sale | null>(null);
  const [deletingSaleId, setDeletingSaleId] = useState<string | null>(null);

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
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="space-y-8">
      <div className="text-center bg-gradient-to-r from-amber-500 to-orange-600 text-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-semibold mb-2 flex items-center justify-center gap-3">
          <ShoppingCart className="h-8 w-8" />
          Lista de Ventas
        </h1>
        <p className="text-amber-100 text-lg">
          Administra y revisa las ventas realizadas - MINI SUPER ROSITA
        </p>
      </div>

      {/* Sales List */}
      <div className="space-y-4">
        {sales.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay ventas registradas</h3>
            <p className="text-gray-500">Las ventas aparecerán aquí una vez que se realicen.</p>
          </div>
        ) : (
          sales.map((sale) => (
            <Card key={sale.id} className="hover-lift">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Venta #{sale.id}</span>
                      <Badge
                        variant={
                          sale.status === 'completed'
                            ? 'default'
                            : sale.status === 'pending'
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {sale.status === 'completed'
                          ? 'Completada'
                          : sale.status === 'pending'
                          ? 'Pendiente'
                          : 'Cancelada'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Cliente: {sale.customerName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(sale.createdAt)}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-semibold">{formatCurrency(sale.total)}</p>
                      <p className="text-xs text-muted-foreground">
                        {sale.items.length} productos
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setViewingSale(sale)}
                        className="hover:bg-blue-50 hover:border-blue-200"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      
                      {/* Botón de factura */}
                      {(() => {
                        let customer = customers.find(c => c.id === sale.customerId);
                        
                        // Si no se encuentra el cliente, crear uno temporal basado en los datos de la venta
                        if (!customer) {
                          customer = {
                            id: sale.customerId,
                            clave_busqueda: sale.customerName.toLowerCase().replace(/\s+/g, ''),
                            nombre: sale.customerName,
                            correo: '',
                            telefono: '',
                            direccion: 'Sin dirección',
                            ciudad: 'Omoa',
                            departamento: 'Cortés',
                            pais: 'Honduras',
                            codigo_postal: '00000',
                            rtn: '9999999999999',
                            visible: true,
                          };
                        }
                        
                        return (
                          <SalesInvoiceManager 
                            sale={sale} 
                            customer={customer} 
                            variant="icon"
                          />
                        );
                      })()}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeletingSaleId(sale.id)}
                        className="hover:bg-red-50 hover:border-red-200 text-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* View Sale Dialog */}
      <Dialog open={!!viewingSale} onOpenChange={() => setViewingSale(null)}>
        <DialogContent className="w-[90vw] max-w-[800px] max-h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-4 border-b bg-white sticky top-0 z-10">
            <DialogTitle>Detalles de la Venta #{viewingSale?.id}</DialogTitle>
            <DialogDescription>
              Revisa los detalles de la venta seleccionada.
            </DialogDescription>
          </DialogHeader>
          
          {viewingSale && (
            <div className="flex-1 overflow-auto p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Cliente</Label>
                  <p className="font-medium">{viewingSale.customerName}</p>
                </div>
                <div>
                  <Label>Fecha</Label>
                  <p className="font-medium">{formatDate(viewingSale.createdAt)}</p>
                </div>
              </div>
              
              <div>
                <Label>Productos</Label>
                <div className="space-y-2 mt-2">
                  {viewingSale.items.map(item => (
                    <div key={item.productId} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{item.productName}</span>
                      <span className="text-sm text-gray-600">
                        {item.quantity} × {formatCurrency(item.price)} = <span className="font-medium">{formatCurrency(item.total)}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-medium">{formatCurrency(viewingSale.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>IGV (15%):</span>
                  <span className="font-medium">{formatCurrency(viewingSale.tax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(viewingSale.total)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingSaleId} onOpenChange={() => setDeletingSaleId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de eliminar esta venta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La venta será eliminada permanentemente del sistema.
            </AlertDialogDescription>
            {deletingSaleId && (() => {
              const sale = sales.find(s => s.id === deletingSaleId);
              return sale ? (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="font-medium text-gray-900">Venta #{sale.id}</p>
                  <p className="text-sm text-gray-600">Cliente: {sale.customerName}</p>
                  <p className="text-sm text-gray-600">Total: {formatCurrency(sale.total)}</p>
                </div>
              ) : null;
            })()}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingSaleId) {
                  onDeleteSale(deletingSaleId);
                  setDeletingSaleId(null);
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