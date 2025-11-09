import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Customer } from '../types';
import { Plus, Edit, Trash2, User, Mail, Phone, MapPin, FileText, Building, Globe } from 'lucide-react';

interface CustomerManagementProps {
  customers: Customer[];
  onAddCustomer: (customer: Omit<Customer, 'id'>) => void;
  onUpdateCustomer: (id: string, customer: Partial<Customer>) => void;
  onDeleteCustomer: (id: string) => void;
}

export function CustomerManagement({
  customers,
  onAddCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
}: CustomerManagementProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingCustomerId, setDeletingCustomerId] = useState<string | null>(null);

  // Función helper para generar clave de búsqueda
  const generarClaveBusqueda = (nombre: string): string => {
    return nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
      .replace(/[^a-z0-9]/g, '') // Solo letras y números
      .substring(0, 50); // Limitar longitud
  };

  const filteredCustomers = customers.filter(customer => {
    const searchLower = searchTerm.toLowerCase();
    const nombre = customer.nombre || customer.name || '';
    const correo = customer.correo || customer.email || '';
    const telefono = customer.telefono || customer.phone || '';
    const rtn = customer.rtn || customer.ruc || '';
    const claveBusqueda = customer.clave_busqueda || '';
    
    return (
      nombre.toLowerCase().includes(searchLower) ||
      correo.toLowerCase().includes(searchLower) ||
      telefono.includes(searchLower) ||
      rtn.includes(searchLower) ||
      claveBusqueda.includes(searchLower)
    );
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const nombre = formData.get('nombre') as string;
    const customerData: Partial<Customer> = {
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

    if (editingCustomer) {
      onUpdateCustomer(editingCustomer.id, customerData);
      setEditingCustomer(null);
    } else {
      onAddCustomer(customerData as Omit<Customer, 'id'>);
      setIsAddDialogOpen(false);
    }
  };

  const CustomerForm = () => (
    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
      <div className="bg-white p-4 rounded-lg mb-6 border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900">
              {editingCustomer ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h3>
            <p className="text-gray-600 text-sm">
              {editingCustomer ? 'Modifica los datos del cliente' : 'Registra un nuevo cliente en el sistema'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6">
          {/* Información Básica */}
          <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <User className="h-4 w-4 text-blue-500" />
              Información Básica
            </h4>
            
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-gray-700 font-medium">
                Nombre Completo *
              </Label>
              <Input
                id="nombre"
                name="nombre"
                placeholder="Ej: Juan Carlos Pérez López"
                defaultValue={editingCustomer?.nombre || editingCustomer?.name || ''}
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
                  placeholder="cliente@email.com"
                  defaultValue={editingCustomer?.correo || editingCustomer?.email || ''}
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
                  placeholder="9999-9999"
                  defaultValue={editingCustomer?.telefono || editingCustomer?.phone || ''}
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
                placeholder="08011993123456"
                defaultValue={editingCustomer?.rtn || editingCustomer?.ruc || ''}
                className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
              />
              <p className="text-xs text-gray-500">Opcional - Solo para clientes empresariales</p>
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
                placeholder="Calle, colonia, número de casa..."
                defaultValue={editingCustomer?.direccion || editingCustomer?.address || ''}
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
                  placeholder="Ej: Bagua Grande"
                  defaultValue={editingCustomer?.ciudad || ''}
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
                  placeholder="Ej: Amazonas"
                  defaultValue={editingCustomer?.departamento || ''}
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
                  placeholder="01700"
                  defaultValue={editingCustomer?.codigo_postal || ''}
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
                defaultValue={editingCustomer?.pais || 'Honduras'}
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
              setEditingCustomer(null);
              setIsAddDialogOpen(false);
            }}
            className="px-6 py-2 border-blue-300 text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-200"
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            {editingCustomer ? '✅ Actualizar' : '✅ Agregar'} Cliente
          </Button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="text-center bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        <h1 className="text-3xl font-semibold mb-2 flex items-center justify-center gap-3 text-gray-900">
          <User className="h-8 w-8 text-blue-500" />
          Gestión de Clientes
        </h1>
        <p className="text-gray-600 text-lg">
          Administra tu base de datos de clientes - MINI SUPER ROSITA
        </p>
      </div>
      
      <div className="flex items-center justify-between">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200 shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[90vw] max-w-[800px] max-h-[90vh] p-0 overflow-hidden">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle>Agregar Cliente</DialogTitle>
              <DialogDescription>
                Completa el formulario para agregar un nuevo cliente a la base de datos
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 max-h-[70vh] overflow-y-auto px-6 pb-6">
              <CustomerForm />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div>
        <Input
          placeholder="Buscar clientes por nombre, email, teléfono, RTN o clave de búsqueda..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-2xl"
        />
      </div>

      {/* Customers Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCustomers.map((customer) => {
          const nombre = customer.nombre || customer.name || '';
          const correo = customer.correo || customer.email || '';
          const telefono = customer.telefono || customer.phone || '';
          const direccion = customer.direccion || customer.address || '';
          const rtn = customer.rtn || customer.ruc || '';
          
          return (
            <Card key={customer.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-500" />
                  {nombre}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  {correo && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{correo}</span>
                    </div>
                  )}
                  
                  {telefono && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{telefono}</span>
                    </div>
                  )}
                  
                  {rtn && (
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>RTN: {rtn}</span>
                    </div>
                  )}
                  
                  {(customer.ciudad || customer.departamento) && (
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">
                        {[customer.ciudad, customer.departamento].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  )}
                  
                  {direccion && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-muted-foreground line-clamp-2">
                        {direccion}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingCustomer(customer)}
                    className="flex-1"
                  >
                    <Edit className="mr-1 h-3 w-3" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeletingCustomerId(customer.id)}
                    className="flex-1 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">
            {searchTerm ? 'No se encontraron clientes con ese criterio de búsqueda' : 'No hay clientes registrados. Agrega tu primer cliente.'}
          </p>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingCustomer} onOpenChange={() => setEditingCustomer(null)}>
        <DialogContent className="w-[90vw] max-w-[800px] max-h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>
              Modifica los datos del cliente seleccionado
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 max-h-[70vh] overflow-y-auto px-6 pb-6">
            <CustomerForm />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingCustomerId} onOpenChange={() => setDeletingCustomerId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de eliminar este cliente?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El cliente será eliminado permanentemente de la base de datos.
            </AlertDialogDescription>
            {deletingCustomerId && (() => {
              const customer = customers.find(c => c.id === deletingCustomerId);
              return customer ? (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="font-medium text-gray-900">{customer.nombre || customer.name}</p>
                  <p className="text-sm text-gray-600">ID: {customer.id}</p>
                </div>
              ) : null;
            })()}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingCustomerId) {
                  onDeleteCustomer(deletingCustomerId);
                  setDeletingCustomerId(null);
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
