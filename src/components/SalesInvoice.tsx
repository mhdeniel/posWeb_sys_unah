import { forwardRef } from 'react';
import { Sale, Customer, CompanyInfo } from '../types';
import { getTotalTaxAmount, getSubtotalAmount } from '../utils/taxCalculations';
import { ShoppingBasket } from 'lucide-react';

interface SalesInvoiceProps {
  sale: Sale;
  customer: Customer;
  companyInfo?: CompanyInfo;
}

export const SalesInvoice = forwardRef<HTMLDivElement, SalesInvoiceProps>(
  ({ sale, customer, companyInfo }, ref) => {
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
        hour12: false,
      }).format(date);
    };

    // Generar CAI aleatorio (formato típico hondureño)
    const generateCAI = () => {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const numbers = '0123456789';
      let cai = '';
      
      // Generar formato: ABC-123-456-789012
      for (let i = 0; i < 3; i++) {
        cai += letters.charAt(Math.floor(Math.random() * letters.length));
      }
      cai += '-';
      
      for (let i = 0; i < 3; i++) {
        cai += numbers.charAt(Math.floor(Math.random() * numbers.length));
      }
      cai += '-';
      
      for (let i = 0; i < 3; i++) {
        cai += numbers.charAt(Math.floor(Math.random() * numbers.length));
      }
      cai += '-';
      
      for (let i = 0; i < 6; i++) {
        cai += numbers.charAt(Math.floor(Math.random() * numbers.length));
      }
      
      return cai;
    };

    const cai = generateCAI();

    return (
      <div 
        ref={ref}
        className="invoice-document bg-white max-w-4xl mx-auto print:max-w-none print:mx-0 p-8 print:p-4"
        style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px', lineHeight: '1.4' }}
      >
        {/* ENCABEZADO */}
        <div className="text-center border-b-2 border-gray-300 pb-6 mb-6">
          {/* Logo de Cesta de Compras */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <ShoppingBasket className="h-8 w-8 text-white" />
            </div>
          </div>
          
          {/* Nombre de la empresa */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            MINI SUPER ROSITA
          </h1>
          
          {/* RTN y Teléfono */}
          <p className="text-sm font-medium text-gray-700 mb-1">
            RTN: 16161965002064 TEL: 97755614
          </p>
          
          {/* Dirección */}
          <p className="text-sm text-gray-700 mb-1">
            BARRIO EL CENTRO, FRENTE A PLAZA MENJIVAR
          </p>
          <p className="text-sm text-gray-700 mb-1">
            OMOA, CORTES, HONDURAS C.A
          </p>
          
          {/* Email */}
          <p className="text-sm text-gray-700">
            PEDROADAN2011@HOTMAIL.COM
          </p>
        </div>

        {/* CUERPO DE LA FACTURA */}
        <div className="mb-8">
          {/* Información de factura y fecha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm font-bold text-gray-900">
                FACTURA: {sale.id}
              </p>
              <p className="text-sm text-gray-700">
                FECHA: {formatDate(sale.createdAt)}
              </p>
            </div>
          </div>
          
          {/* Cliente y atendido por */}
          <div className="mb-6">
            <p className="text-sm font-bold text-gray-900 mb-1">
              CLIENTE: {customer.nombre || customer.name || 'Cliente'}
            </p>
            <p className="text-sm text-gray-700">
              RTN: {customer.rtn || customer.ruc || 'No disponible'}
            </p>
            <p className="text-sm text-gray-700 mb-3">
              {customer.direccion || customer.address || 'Sin dirección'}
            </p>
            <p className="text-sm font-bold text-gray-900">
              ATENDIDO: ADMINISTRADOR
            </p>
          </div>

          {/* Detalle de la factura - Tabla de productos */}
          <div className="mb-6">
            <div className="border border-gray-400">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-400 px-3 py-2 text-left text-xs font-bold">CANT.</th>
                    <th className="border border-gray-400 px-3 py-2 text-left text-xs font-bold">DESCRIPCION</th>
                    <th className="border border-gray-400 px-3 py-2 text-right text-xs font-bold">PRECIO</th>
                    <th className="border border-gray-400 px-3 py-2 text-right text-xs font-bold">IMPORTE</th>
                  </tr>
                </thead>
                <tbody>
                  {sale.items.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-gray-400 px-3 py-2 text-center text-xs">
                        {item.quantity}
                      </td>
                      <td className="border border-gray-400 px-3 py-2 text-xs">
                        {item.productName}
                      </td>
                      <td className="border border-gray-400 px-3 py-2 text-right text-xs">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="border border-gray-400 px-3 py-2 text-right text-xs font-medium">
                        {formatCurrency(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totales */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between items-center py-1 border-b border-gray-200">
              <span className="text-sm font-bold text-gray-900">DESCUENTOS Y REBAJAS:</span>
              <span className="text-sm font-medium">{formatCurrency(0)}</span>
            </div>
            
            <div className="flex justify-between items-center py-1 border-b border-gray-200">
              <span className="text-sm font-bold text-gray-900">SUBTOTAL:</span>
              <span className="text-sm font-medium">{formatCurrency(getSubtotalAmount(sale.taxBreakdown))}</span>
            </div>
            
            <div className="flex justify-between items-center py-1 border-b border-gray-200">
              <span className="text-sm font-bold text-gray-900">EXENTO:</span>
              <span className="text-sm font-medium">{formatCurrency(sale.taxBreakdown.exento)}</span>
            </div>
            
            <div className="flex justify-between items-center py-1 border-b border-gray-200">
              <span className="text-sm font-bold text-gray-900">EXONERADO:</span>
              <span className="text-sm font-medium">{formatCurrency(0)}</span>
            </div>
            
            <div className="flex justify-between items-center py-1 border-b border-gray-200">
              <span className="text-sm font-bold text-gray-900">ISV 15%:</span>
              <span className="text-sm font-medium">{formatCurrency(sale.taxBreakdown.isv15)}</span>
            </div>
            
            <div className="flex justify-between items-center py-1 border-b border-gray-200">
              <span className="text-sm font-bold text-gray-900">ISV 18%:</span>
              <span className="text-sm font-medium">{formatCurrency(sale.taxBreakdown.isv18)}</span>
            </div>
          </div>

          {/* Total a pagar, efectivo y cambio */}
          <div className="bg-gray-50 p-4 rounded border-2 border-gray-400">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-bold text-gray-900">TOTAL A PAGAR:</span>
              <span className="text-lg font-bold text-gray-900">{formatCurrency(sale.total)}</span>
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-gray-900">EFECTIVO:</span>
              <span className="text-sm font-medium">{formatCurrency(sale.total)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-900">CAMBIO:</span>
              <span className="text-sm font-medium">{formatCurrency(0)}</span>
            </div>
          </div>
        </div>

        {/* PIE DE PÁGINA */}
        <div className="border-t-2 border-gray-300 pt-6 space-y-2 text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="space-y-1">
              <p className="text-xs text-gray-700">
                <span className="font-bold">N.º ORDEN DE COMPRA EXENTA:</span> _______________
              </p>
              <p className="text-xs text-gray-700">
                <span className="font-bold">N.º CONST REGISTRO EXONERADO:</span> _______________
              </p>
              <p className="text-xs text-gray-700">
                <span className="font-bold">N.º REGISTRO SAG:</span> _______________
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-gray-700">
                <span className="font-bold">CAI:</span> {cai}
              </p>
              <p className="text-xs text-gray-700">
                <span className="font-bold">RANGO AUTORIZADO:</span> 0001-7500
              </p>
              <p className="text-xs text-gray-700">
                <span className="font-bold">FECHA LIMITE DE EMISION:</span> 01/01/26
              </p>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs font-bold text-gray-900">
              ORIGINAL CLIENTE / COPIA EMISOR
            </p>
          </div>
          
          <div className="pt-2">
            <p className="text-sm font-medium text-gray-800">
              ¡Gracias por su compra!
            </p>
            <p className="text-xs text-gray-600">
              Su supermercado de confianza en Omoa, Cortés
            </p>
          </div>
        </div>
      </div>
    );
  }
);

SalesInvoice.displayName = 'SalesInvoice';