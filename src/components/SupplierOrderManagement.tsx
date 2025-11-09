import { useState } from 'react';
import { Supplier, SupplierOrder, Product } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Truck, Plus, Eye, Package, Calendar, Phone, Mail, MapPin, Building, CheckCircle, Clock, XCircle, Minus, FileText, Globe, Edit, Trash2, User } from 'lucide-react';

interface SupplierOrderManagementProps {
  suppliers: Supplier[];
  supplierOrders: SupplierOrder[];
  products: Product[];
  onAddSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt'>) => void;
  onUpdateSupplier: (id: string, supplierData: Partial<Supplier>) => void;
  onDeleteSupplier: (id: string) => void;
  onAddSupplierOrder: (order: Omit<SupplierOrder, 'id' | 'createdAt'>) => void;
  onUpdateSupplierOrder: (id: string, orderData: Partial<SupplierOrder>) => void;
  onDeleteSupplierOrder: (id: string) => void;
}

export function SupplierOrderManagement({
  suppliers,
  supplierOrders,
  products,
  onAddSupplier,
  onUpdateSupplier,
  onDeleteSupplier,
  onAddSupplierOrder,
  onUpdateSupplierOrder,
  onDeleteSupplierOrder,
}: SupplierOrderManagementProps) {
  const [isSupplierDialogOpen, setIsSupplierDialogOpen] = useState(false);
  const [isEditSupplierDialogOpen, setIsEditSupplierDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [deletingSupplierId, setDeletingSupplierId] = useState<string | null>(null);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    // Validar que el amount es un número válido
    const validAmount = isNaN(amount) || !isFinite(amount) ? 0 : amount;
    return new Intl.NumberFormat('es-HN', {
      style: 'currency',
      currency: 'HNL',
      minimumFractionDigits: 2,
    }).format(validAmount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-HN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'sent':
        return <Truck className="h-4 w-4 text-blue-500" />;
      case 'received':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'sent':
        return 'bg-blue-500';
      case 'received':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'sent':
        return 'Enviado';
      case 'received':
        return 'Recibido';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  // Función helper para generar clave de búsqueda
  const generarClaveBusqueda = (nombre: string): string => {
    return nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
      .replace(/[^a-z0-9]/g, '') // Solo letras y números
      .substring(0, 50); // Limitar longitud
  };

  const handleSupplierSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const nombre = formData.get('nombre') as string;
    const supplierData = {
      clave_busqueda: generarClaveBusqueda(nombre),
      nombre: nombre,
      correo: formData.get('correo') as string || undefined,
      telefono: formData.get('telefono') as string || undefined,
      direccion: formData.get('direccion') as string || undefined,
      rtn: (formData.get('rtn') as string) || undefined,
      codigo_postal: (formData.get('codigo_postal') as string) || undefined,
      ciudad: (formData.get('ciudad') as string) || undefined,
      departamento: (formData.get('departamento') as string) || undefined,
      pais: (formData.get('pais') as string) || undefined,
      visible: true,
    };

    onAddSupplier(supplierData);
    setIsSupplierDialogOpen(false);
    e.currentTarget.reset();
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsEditSupplierDialogOpen(true);
  };

  const handleEditSupplierSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingSupplier) return;

    const formData = new FormData(e.currentTarget);
    
    const nombre = formData.get('nombre') as string;
    const supplierData = {
      clave_busqueda: generarClaveBusqueda(nombre),
      nombre: nombre,
      correo: formData.get('correo') as string || undefined,
      telefono: formData.get('telefono') as string || undefined,
      direccion: formData.get('direccion') as string || undefined,
      rtn: (formData.get('rtn') as string) || undefined,
      codigo_postal: (formData.get('codigo_postal') as string) || undefined,
      ciudad: (formData.get('ciudad') as string) || undefined,
      departamento: (formData.get('departamento') as string) || undefined,
      pais: (formData.get('pais') as string) || undefined,
    };

    onUpdateSupplier(editingSupplier.id, supplierData);
    setIsEditSupplierDialogOpen(false);
    setEditingSupplier(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        <h1 className="text-3xl font-semibold mb-2 flex items-center justify-center gap-3 text-gray-900">
          <Truck className="h-8 w-8 text-purple-500" />
          Pedidos a Proveedores
        </h1>
        <p className="text-gray-600 text-lg">
          Gestiona tus pedidos y proveedores - MINI SUPER ROSITA
        </p>
      </div>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="orders">Pedidos</TabsTrigger>
          <TabsTrigger value="suppliers">Proveedores</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Lista de Pedidos</h2>
          </div>

          <div className="grid gap-6">
            {supplierOrders.map((order) => (
              <Card key={order.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader className="bg-white border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                        <Truck className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-base text-gray-900">{order.supplierName}</CardTitle>
                        <p className="text-xs text-gray-500 font-mono">{order.id}</p>
                      </div>
                    </div>
                    <Badge className={`text-white ${getStatusColor(order.status)}`}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        {getStatusText(order.status)}
                      </div>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Total del Pedido</p>
                      <p className="text-lg font-semibold text-gray-900">{formatCurrency(order.total)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Productos</p>
                      <p className="text-lg font-semibold text-gray-900">{order.items.length}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Fecha de Pedido</p>
                      <p className="text-lg font-semibold text-gray-900">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Entrega Esperada</p>
                      <p className="text-lg font-semibold text-gray-900">{formatDate(order.expectedDelivery)}</p>
                    </div>
                  </div>

                  {order.notes && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600"><strong>Notas:</strong> {order.notes}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Productos del Pedido:</h4>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Producto</TableHead>
                            <TableHead className="text-center">Cantidad</TableHead>
                            <TableHead className="text-right">Costo Unit.</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {order.items.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{item.productName}</TableCell>
                              <TableCell className="text-center">{item.quantity}</TableCell>
                              <TableCell className="text-right">{formatCurrency(item.unitCost)}</TableCell>
                              <TableCell className="text-right font-medium">{formatCurrency(item.total)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {order.status === 'pending' && (
                    <div className="flex gap-2 mt-4 pt-4 border-t">
                      <Button
                        size="sm"
                        onClick={() => onUpdateSupplierOrder(order.id, { status: 'sent' })}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        Marcar como Enviado
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onUpdateSupplierOrder(order.id, { status: 'cancelled' })}
                        className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                      >
                        Cancelar Pedido
                      </Button>
                    </div>
                  )}

                  {order.status === 'sent' && (
                    <div className="flex gap-2 mt-4 pt-4 border-t">
                      <Button
                        size="sm"
                        onClick={() => onUpdateSupplierOrder(order.id, { status: 'received', receivedAt: new Date() })}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        Marcar como Recibido
                      </Button>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDeletingOrderId(order.id)}
                      className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {supplierOrders.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Truck className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No hay pedidos registrados</h3>
                <p>Crea tu primer pedido a proveedor para comenzar.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Lista de Proveedores</h2>
            <Dialog open={isSupplierDialogOpen} onOpenChange={setIsSupplierDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200 shadow-sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Proveedor
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90vw] max-w-[800px] max-h-[90vh] p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-0">
                  <DialogTitle>Agregar Proveedor</DialogTitle>
                  <DialogDescription>
                    Completa el formulario para agregar un nuevo proveedor a la base de datos
                  </DialogDescription>
                </DialogHeader>
                <div className="flex-1 max-h-[70vh] overflow-y-auto px-6 pb-6">
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <div className="bg-white p-4 rounded-lg mb-6 border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                          <Building className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">
                            Nuevo Proveedor
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Registra un nuevo proveedor en el sistema
                          </p>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleSupplierSubmit} className="space-y-6">
                      <div className="grid gap-6">
                        {/* Información Básica */}
                        <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
                          <h4 className="font-medium text-gray-900 flex items-center gap-2">
                            <Building className="h-4 w-4 text-blue-500" />
                            Información Básica
                          </h4>
                          
                          <div className="space-y-2">
                            <Label htmlFor="nombre" className="text-gray-700 font-medium">
                              Nombre de la Empresa *
                            </Label>
                            <Input
                              id="nombre"
                              name="nombre"
                              placeholder="Ej: Distribuidora La Granja"
                              className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
                              required
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="correo" className="text-gray-700 font-medium flex items-center gap-2">
                                <Mail className="h-4 w-4 text-gray-500" />
                                Correo Electrónico
                              </Label>
                              <Input
                                id="correo"
                                name="correo"
                                type="email"
                                placeholder="ventas@proveedor.hn"
                                className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="telefono" className="text-gray-700 font-medium flex items-center gap-2">
                                <Phone className="h-4 w-4 text-gray-500" />
                                Teléfono
                              </Label>
                              <Input
                                id="telefono"
                                name="telefono"
                                placeholder="+504 2234-5678"
                                className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="rtn" className="text-gray-700 font-medium flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gray-500" />
                              RTN (Registro Tributario Nacional)
                            </Label>
                            <Input
                              id="rtn"
                              name="rtn"
                              placeholder="08011990123456"
                              className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
                            />
                            <p className="text-xs text-gray-500">Opcional - Registro tributario del proveedor</p>
                          </div>
                        </div>

                        {/* Información de Ubicación */}
                        <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
                          <h4 className="font-medium text-gray-900 flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-blue-500" />
                            Ubicación
                          </h4>
                          
                          <div className="space-y-2">
                            <Label htmlFor="direccion" className="text-gray-700 font-medium">
                              Dirección Completa
                            </Label>
                            <Input
                              id="direccion"
                              name="direccion"
                              placeholder="Zona Industrial, edificio, número..."
                              className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="ciudad" className="text-gray-700 font-medium flex items-center gap-2">
                                <Building className="h-4 w-4 text-gray-500" />
                                Ciudad
                              </Label>
                              <Input
                                id="ciudad"
                                name="ciudad"
                                placeholder="Ej: Tegucigalpa"
                                className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="departamento" className="text-gray-700 font-medium">
                                Departamento
                              </Label>
                              <Input
                                id="departamento"
                                name="departamento"
                                placeholder="Ej: Francisco Morazán"
                                className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="codigo_postal" className="text-gray-700 font-medium">
                                Código Postal
                              </Label>
                              <Input
                                id="codigo_postal"
                                name="codigo_postal"
                                placeholder="11101"
                                className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="pais" className="text-gray-700 font-medium flex items-center gap-2">
                              <Globe className="h-4 w-4 text-gray-500" />
                              País
                            </Label>
                            <Input
                              id="pais"
                              name="pais"
                              placeholder="Honduras"
                              className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-3 pt-4 border-t border-blue-200">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsSupplierDialogOpen(false)}
                          className="px-6 py-2 border-blue-300 text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-200"
                        >
                          Cancelar
                        </Button>
                        <Button 
                          type="submit"
                          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                        >
                          ✅ Agregar Proveedor
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Diálogo de Editar Proveedor */}
            <Dialog open={isEditSupplierDialogOpen} onOpenChange={setIsEditSupplierDialogOpen}>
              <DialogContent className="w-[90vw] max-w-[800px] max-h-[90vh] p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-0">
                  <DialogTitle>Editar Proveedor</DialogTitle>
                  <DialogDescription>
                    Modifica los datos del proveedor seleccionado
                  </DialogDescription>
                </DialogHeader>
                <div className="flex-1 max-h-[70vh] overflow-y-auto px-6 pb-6">
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <div className="bg-white p-4 rounded-lg mb-6 border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                          <Building className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">
                            Editar Proveedor
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Modifica los datos del proveedor
                          </p>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleEditSupplierSubmit} className="space-y-6">
                      <div className="grid gap-6">
                        {/* Información Básica */}
                        <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
                          <h4 className="font-medium text-gray-900 flex items-center gap-2">
                            <Building className="h-4 w-4 text-blue-500" />
                            Información Básica
                          </h4>
                          
                          <div className="space-y-2">
                            <Label htmlFor="edit-nombre" className="text-gray-700 font-medium">
                              Nombre de la Empresa *
                            </Label>
                            <Input
                              id="edit-nombre"
                              name="nombre"
                              placeholder="Ej: Distribuidora La Granja"
                              defaultValue={editingSupplier?.nombre || editingSupplier?.name || ''}
                              className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
                              required
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-correo" className="text-gray-700 font-medium flex items-center gap-2">
                                <Mail className="h-4 w-4 text-gray-500" />
                                Correo Electrónico
                              </Label>
                              <Input
                                id="edit-correo"
                                name="correo"
                                type="email"
                                placeholder="ventas@proveedor.hn"
                                defaultValue={editingSupplier?.correo || editingSupplier?.email || ''}
                                className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="edit-telefono" className="text-gray-700 font-medium flex items-center gap-2">
                                <Phone className="h-4 w-4 text-gray-500" />
                                Teléfono
                              </Label>
                              <Input
                                id="edit-telefono"
                                name="telefono"
                                placeholder="+504 2234-5678"
                                defaultValue={editingSupplier?.telefono || editingSupplier?.phone || ''}
                                className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="edit-rtn" className="text-gray-700 font-medium flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gray-500" />
                              RTN (Registro Tributario Nacional)
                            </Label>
                            <Input
                              id="edit-rtn"
                              name="rtn"
                              placeholder="08011990123456"
                              defaultValue={editingSupplier?.rtn || ''}
                              className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
                            />
                            <p className="text-xs text-gray-500">Opcional - Registro tributario del proveedor</p>
                          </div>
                        </div>

                        {/* Información de Ubicación */}
                        <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
                          <h4 className="font-medium text-gray-900 flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-blue-500" />
                            Ubicación
                          </h4>
                          
                          <div className="space-y-2">
                            <Label htmlFor="edit-direccion" className="text-gray-700 font-medium">
                              Dirección Completa
                            </Label>
                            <Input
                              id="edit-direccion"
                              name="direccion"
                              placeholder="Zona Industrial, edificio, número..."
                              defaultValue={editingSupplier?.direccion || editingSupplier?.address || ''}
                              className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-ciudad" className="text-gray-700 font-medium flex items-center gap-2">
                                <Building className="h-4 w-4 text-gray-500" />
                                Ciudad
                              </Label>
                              <Input
                                id="edit-ciudad"
                                name="ciudad"
                                placeholder="Ej: Tegucigalpa"
                                defaultValue={editingSupplier?.ciudad || ''}
                                className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="edit-departamento" className="text-gray-700 font-medium">
                                Departamento
                              </Label>
                              <Input
                                id="edit-departamento"
                                name="departamento"
                                placeholder="Ej: Francisco Morazán"
                                defaultValue={editingSupplier?.departamento || ''}
                                className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="edit-codigo_postal" className="text-gray-700 font-medium">
                                Código Postal
                              </Label>
                              <Input
                                id="edit-codigo_postal"
                                name="codigo_postal"
                                placeholder="11101"
                                defaultValue={editingSupplier?.codigo_postal || ''}
                                className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="edit-pais" className="text-gray-700 font-medium flex items-center gap-2">
                              <Globe className="h-4 w-4 text-gray-500" />
                              País
                            </Label>
                            <Input
                              id="edit-pais"
                              name="pais"
                              placeholder="Honduras"
                              defaultValue={editingSupplier?.pais || ''}
                              className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-3 pt-4 border-t border-blue-200">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsEditSupplierDialogOpen(false);
                            setEditingSupplier(null);
                          }}
                          className="px-6 py-2 border-blue-300 text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-200"
                        >
                          Cancelar
                        </Button>
                        <Button 
                          type="submit"
                          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                        >
                          ✅ Actualizar Proveedor
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {suppliers.map((supplier) => (
              <Card key={supplier.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader className="bg-white border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Building className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base text-gray-900">{supplier.nombre || supplier.name || 'Sin nombre'}</CardTitle>
                      <p className="text-xs text-gray-500 font-mono">{supplier.id}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div className="space-y-2 text-sm">
                    {supplier.rtn && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <FileText className="h-4 w-4" />
                        <span className="text-xs">RTN: {supplier.rtn}</span>
                      </div>
                    )}
                    {(supplier.telefono || supplier.phone) && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{supplier.telefono || supplier.phone}</span>
                      </div>
                    )}
                    {(supplier.correo || supplier.email) && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{supplier.correo || supplier.email}</span>
                      </div>
                    )}
                    {(supplier.ciudad || supplier.departamento || supplier.direccion || supplier.address) && (
                      <div className="flex items-start gap-2 text-gray-600">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span className="text-xs leading-tight">
                          {[
                            supplier.direccion || supplier.address,
                            supplier.ciudad,
                            supplier.departamento,
                          ].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    )}
                    {supplier.pais && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Globe className="h-4 w-4" />
                        <span className="text-xs">{supplier.pais}</span>
                      </div>
                    )}
                  </div>

                  {supplier.products && Array.isArray(supplier.products) && supplier.products.length > 0 && (
                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-2">Productos (Legacy):</p>
                      <div className="flex flex-wrap gap-1">
                        {supplier.products.slice(0, 3).map((productId) => {
                          const product = products.find(p => p.id === productId);
                          return (
                            <Badge key={productId} variant="secondary" className="text-xs">
                              {product?.name.split(' ').slice(0, 2).join(' ') || productId}
                            </Badge>
                          );
                        })}
                        {supplier.products.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{supplier.products.length - 3} más
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditSupplier(supplier)}
                      className="flex-1"
                    >
                      <Edit className="mr-1 h-3 w-3" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeletingSupplierId(supplier.id)}
                      className="flex-1 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {suppliers.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                <Building className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No hay proveedores registrados</h3>
                <p>Agrega tu primer proveedor para comenzar a gestionar pedidos.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Delete Supplier Confirmation Dialog */}
      <AlertDialog open={!!deletingSupplierId} onOpenChange={() => setDeletingSupplierId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de eliminar este proveedor?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El proveedor será eliminado permanentemente de la base de datos.
            </AlertDialogDescription>
            {deletingSupplierId && (() => {
              const supplier = suppliers.find(s => s.id === deletingSupplierId);
              return supplier ? (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="font-medium text-gray-900">{supplier.nombre || supplier.name}</p>
                  <p className="text-sm text-gray-600">ID: {supplier.id}</p>
                </div>
              ) : null;
            })()}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingSupplierId) {
                  onDeleteSupplier(deletingSupplierId);
                  setDeletingSupplierId(null);
                }
              }}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Order Confirmation Dialog */}
      <AlertDialog open={!!deletingOrderId} onOpenChange={() => setDeletingOrderId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de eliminar este pedido?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El pedido será eliminado permanentemente de la base de datos.
            </AlertDialogDescription>
            {deletingOrderId && (() => {
              const order = supplierOrders.find(s => s.id === deletingOrderId);
              return order ? (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="font-medium text-gray-900">{order.supplierName}</p>
                  <p className="text-sm text-gray-600">ID: {order.id}</p>
                </div>
              ) : null;
            })()}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingOrderId) {
                  onDeleteSupplierOrder(deletingOrderId);
                  setDeletingOrderId(null);
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