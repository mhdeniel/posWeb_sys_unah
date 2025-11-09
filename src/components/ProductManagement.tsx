import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Product, Supplier, Category } from '../types';
import { Plus, Edit, Trash2, Package, Hash, DollarSign, Building, ShoppingCart, FolderPlus } from 'lucide-react';

interface ProductManagementProps {
  products: Product[];
  suppliers?: Supplier[];
  categories?: Category[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (id: string, product: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
  onAddCategory?: (category: Omit<Category, 'id'>) => void;
}

export function ProductManagement({
  products,
  suppliers = [],
  categories = [],
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAddCategory,
}: ProductManagementProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);

  const filteredCategories = Array.from(new Set(products.map(p => p.categoria)));
  
  const filteredProducts = products.filter(product => {
    const nombre = product.nombre || product.name || '';
    const codigo = product.codigo || product.barcode || '';
    const referencia = product.referencia || '';
    const categoria = product.categoria || product.category || '';
    
    const matchesSearch = nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         codigo.includes(searchTerm) ||
                         referencia.includes(searchTerm) ||
                         product.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-HN', {
      style: 'currency',
      currency: 'HNL',
    }).format(amount);
  };

  const getTaxLabel = (impuesto: number) => {
    if (impuesto === 0) return 'Exento (0%)';
    if (impuesto === 0.15) return 'ISV 15%';
    if (impuesto === 0.18) return 'ISV 18%';
    return `${(impuesto * 100).toFixed(0)}%`;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const proveedorValue = formData.get('proveedor') as string;
    
    const productData = {
      referencia: formData.get('referencia') as string,
      codigo: formData.get('codigo') as string,
      nombre: formData.get('nombre') as string,
      precio_compra: parseFloat(formData.get('precio_compra') as string) || 0,
      precio_venta: parseFloat(formData.get('precio_venta') as string) || 0,
      categoria: formData.get('categoria') as string,
      impuesto: parseFloat(formData.get('impuesto') as string),
      unidades_existencia: parseFloat(formData.get('unidades_existencia') as string) || 0,
      proveedor: proveedorValue === 'none' ? undefined : proveedorValue,
    };

    if (editingProduct) {
      onUpdateProduct(editingProduct.id, productData);
      setEditingProduct(null);
    } else {
      onAddProduct(productData);
      setIsAddDialogOpen(false);
    }
  };

  const ProductForm = () => (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        {editingProduct && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-800">ID del Producto:</span>
              <span className="text-sm text-blue-600 font-mono bg-white px-2 py-1 rounded border">
                {editingProduct.id}
              </span>
            </div>
          </div>
        )}
        
        <div className="grid gap-6">
          {/* Información Básica */}
          <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-500" />
              Información Básica
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="referencia" className="text-gray-700 font-medium">
                  Referencia *
                </Label>
                <Input
                  id="referencia"
                  name="referencia"
                  placeholder="Ej: REF-001"
                  defaultValue={editingProduct?.referencia || ''}
                  className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
                  required
                />
                <p className="text-xs text-gray-500">Código de referencia interno del producto</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="codigo" className="text-gray-700 font-medium flex items-center gap-2">
                  <Hash className="h-4 w-4 text-gray-500" />
                  Código de Barras *
                </Label>
                <Input
                  id="codigo"
                  name="codigo"
                  placeholder="7501234567890"
                  defaultValue={editingProduct?.codigo || editingProduct?.barcode || ''}
                  className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg font-mono"
                  required
                />
                <p className="text-xs text-gray-500">Código de barras o código único del producto</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-gray-700 font-medium">
                Nombre del Producto *
              </Label>
              <Input
                id="nombre"
                name="nombre"
                placeholder="Ej: Aceite de Cocina 1L"
                defaultValue={editingProduct?.nombre || editingProduct?.name || ''}
                className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria" className="text-gray-700 font-medium">
                Categoría *
              </Label>
              <div className="flex gap-2">
                <Select 
                  name="categoria" 
                  defaultValue={editingProduct?.categoria || editingProduct?.category || ''}
                >
                  <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 flex-1">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.nombre}>
                        {category.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {onAddCategory && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCategoryDialogOpen(true)}
                    className="px-3"
                  >
                    <FolderPlus className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className="text-xs text-gray-500">Selecciona una categoría o crea una nueva</p>
            </div>
          </div>

          {/* Precios */}
          <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-500" />
              Precios
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="precio_compra" className="text-gray-700 font-medium">
                  Precio de Compra (HNL) *
                </Label>
                <div className="relative">
                  <Input
                    id="precio_compra"
                    name="precio_compra"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    defaultValue={editingProduct?.precio_compra || ''}
                    className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg pl-12"
                    required
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    L
                  </div>
                </div>
                <p className="text-xs text-gray-500">Costo al que compras el producto</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="precio_venta" className="text-gray-700 font-medium">
                  Precio de Venta (HNL) *
                </Label>
                <div className="relative">
                  <Input
                    id="precio_venta"
                    name="precio_venta"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    defaultValue={editingProduct?.precio_venta || editingProduct?.price || ''}
                    className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg pl-12"
                    required
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    L
                  </div>
                </div>
                <p className="text-xs text-gray-500">Precio al que vendes el producto</p>
              </div>
            </div>
          </div>

          {/* Inventario e Impuestos */}
          <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-blue-500" />
              Inventario e Impuestos
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unidades_existencia" className="text-gray-700 font-medium">
                  Unidades en Existencia *
                </Label>
                <Input
                  id="unidades_existencia"
                  name="unidades_existencia"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0"
                  defaultValue={editingProduct?.unidades_existencia || editingProduct?.stock || ''}
                  className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="impuesto" className="text-gray-700 font-medium">
                  Impuesto (ISV) *
                </Label>
                <Select 
                  name="impuesto" 
                  defaultValue={(editingProduct?.impuesto ?? 0.15).toString()}
                >
                  <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500">
                    <SelectValue placeholder="Seleccionar impuesto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Exento (0%)</SelectItem>
                    <SelectItem value="0.15">ISV 15%</SelectItem>
                    <SelectItem value="0.18">ISV 18%</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">Tasa de impuesto aplicable al producto</p>
              </div>
            </div>

            {suppliers.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="proveedor" className="text-gray-700 font-medium flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-500" />
                  Proveedor
                </Label>
                <Select 
                  name="proveedor" 
                  defaultValue={editingProduct?.proveedor || 'none'}
                >
                  <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500">
                    <SelectValue placeholder="Seleccionar proveedor (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="none" value="none">Sin proveedor</SelectItem>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.nombre || supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">Proveedor principal del producto</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-4 border-t border-blue-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setEditingProduct(null);
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
            ✅ {editingProduct ? 'Actualizar' : 'Agregar'} Producto
          </Button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="text-center bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        <h1 className="text-3xl font-semibold mb-2 flex items-center justify-center gap-3 text-gray-900">
          <Package className="h-8 w-8 text-blue-500" />
          Gestión de Productos
        </h1>
        <p className="text-gray-600 text-lg">
          Administra tu inventario de productos - MINI SUPER ROSITA
        </p>
      </div>
      
      <div className="flex items-center justify-between">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200 shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[90vw] max-w-[900px] max-h-[90vh] p-0 overflow-hidden">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle>Agregar Producto</DialogTitle>
              <DialogDescription>
                Completa el formulario para agregar un nuevo producto al inventario
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 max-h-[70vh] overflow-y-auto px-6 pb-6">
              <ProductForm />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar por nombre, código de barras, referencia o ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {filteredCategories.map((category, index) => (
              <SelectItem key={`${category}-${index}`} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => {
          const nombre = product.nombre || product.name || 'Sin nombre';
          const stock = product.unidades_existencia ?? product.stock ?? 0;
          const precio = product.precio_venta ?? product.price ?? 0;
          const proveedor = suppliers.find(s => s.id === product.proveedor);
          
          return (
            <Card key={product.id} className="hover-lift border border-gray-200 shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-3 bg-white border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Package className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base text-gray-900">{nombre}</CardTitle>
                      <p className="text-xs text-gray-500 font-mono">{product.id}</p>
                    </div>
                  </div>
                  <Badge 
                    className={`text-white ${
                      stock > 10 ? 'bg-green-500' : 
                      stock > 0 ? 'bg-yellow-500' : 
                      'bg-red-500'
                    }`}
                  >
                    {stock} uds
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Referencia:</span>
                    <span className="font-mono text-gray-900">{product.referencia}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Código:</span>
                    <span className="font-mono text-gray-900">{product.codigo || product.barcode}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Categoría:</span>
                    <Badge variant="secondary">{product.categoria || product.category}</Badge>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Precio Compra:</span>
                    <span className="font-medium text-gray-700">{formatCurrency(product.precio_compra || 0)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Precio Venta:</span>
                    <span className="font-semibold text-green-600">{formatCurrency(precio)}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-2">
                    <span className="text-sm text-gray-600">Impuesto:</span>
                    <Badge variant="outline" className="text-xs">
                      {getTaxLabel(product.impuesto)}
                    </Badge>
                  </div>
                </div>

                {proveedor && (
                  <div className="flex items-center gap-2 text-xs text-gray-600 bg-blue-50 p-2 rounded">
                    <Building className="h-3 w-3 text-blue-500" />
                    <span className="truncate">{proveedor.nombre || proveedor.name}</span>
                  </div>
                )}
                
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingProduct(product)}
                    className="flex-1"
                  >
                    <Edit className="mr-1 h-3 w-3" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeletingProductId(product.id)}
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

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">
            {searchTerm || selectedCategory !== 'all' 
              ? 'No se encontraron productos con ese criterio de búsqueda' 
              : 'No hay productos registrados. Agrega tu primer producto.'}
          </p>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent className="w-[90vw] max-w-[900px] max-h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>Editar Producto</DialogTitle>
            <DialogDescription>
              Modifica los datos del producto seleccionado
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 max-h-[70vh] overflow-y-auto px-6 pb-6">
            <ProductForm />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingProductId} onOpenChange={() => setDeletingProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de eliminar este producto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El producto será eliminado permanentemente del inventario.
            </AlertDialogDescription>
            {deletingProductId && (() => {
              const product = products.find(p => p.id === deletingProductId);
              return product ? (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="font-medium text-gray-900">{product.nombre || product.name}</p>
                  <p className="text-sm text-gray-600">ID: {product.id}</p>
                </div>
              ) : null;
            })()}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingProductId) {
                  onDeleteProduct(deletingProductId);
                  setDeletingProductId(null);
                }
              }}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Category Dialog */}
      {onAddCategory && (
        <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nueva Categoría</DialogTitle>
              <DialogDescription>
                Crea una nueva categoría para organizar tus productos
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const categoryData = {
                  nombre: formData.get('nombre') as string,
                  descripcion: formData.get('descripcion') as string || undefined,
                };
                onAddCategory(categoryData);
                setIsCategoryDialogOpen(false);
                e.currentTarget.reset();
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="category-nombre" className="text-gray-700 font-medium">
                  Nombre de la Categoría *
                </Label>
                <Input
                  id="category-nombre"
                  name="nombre"
                  placeholder="Ej: Bebidas Alcohólicas"
                  className="bg-white border-gray-300 focus:border-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category-descripcion" className="text-gray-700 font-medium">
                  Descripción (Opcional)
                </Label>
                <Textarea
                  id="category-descripcion"
                  name="descripcion"
                  placeholder="Descripción de la categoría..."
                  className="bg-white border-gray-300 focus:border-blue-500"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCategoryDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Categoría
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}