import { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { SalesInvoice } from './SalesInvoice';
import { Sale, Customer, CompanyInfo } from '../types';
import { Printer, Eye } from 'lucide-react';

interface SalesInvoiceManagerProps {
  sale: Sale;
  customer: Customer;
  companyInfo?: CompanyInfo;
  variant?: 'icon' | 'full';
}

export function SalesInvoiceManager({ 
  sale, 
  customer, 
  companyInfo,
  variant = 'icon'
}: SalesInvoiceManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (invoiceRef.current) {
      const printContent = invoiceRef.current.cloneNode(true) as HTMLElement;
      
      // Crear una nueva ventana para imprimir
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Factura ${sale.id} - MINI SUPER ROSITA</title>
              <meta charset="utf-8">
              <style>
                * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                }
                
                body {
                  font-family: Arial, sans-serif !important;
                  font-size: 14px !important;
                  line-height: 1.4 !important;
                  color: #000 !important;
                  background: #fff !important;
                  padding: 1cm;
                }
                
                .invoice-document {
                  max-width: none !important;
                  margin: 0 !important;
                  padding: 20px !important;
                }
                
                h1 {
                  font-size: 24px !important;
                  font-weight: bold !important;
                  color: #000 !important;
                  margin-bottom: 8px !important;
                }
                
                h2, h3, h4 {
                  color: #000 !important;
                  font-weight: bold !important;
                }
                
                p {
                  font-size: 14px !important;
                  color: #000 !important;
                  margin-bottom: 4px !important;
                }
                
                table {
                  border-collapse: collapse !important;
                  width: 100% !important;
                  margin: 16px 0 !important;
                }
                
                th, td {
                  border: 2px solid #000 !important;
                  padding: 8px !important;
                  text-align: left !important;
                  font-size: 12px !important;
                }
                
                th {
                  background: #f0f0f0 !important;
                  font-weight: bold !important;
                  font-size: 12px !important;
                }
                
                tr:nth-child(even) {
                  background: #f9f9f9 !important;
                }
                
                .bg-gray-50, .bg-gray-100 {
                  background: #f5f5f5 !important;
                  border: 2px solid #000 !important;
                  padding: 12px !important;
                }
                
                .text-center {
                  text-align: center !important;
                }
                
                .text-left {
                  text-align: left !important;
                }
                
                .text-right {
                  text-align: right !important;
                }
                
                .font-bold {
                  font-weight: bold !important;
                }
                
                .font-medium {
                  font-weight: 500 !important;
                }
                
                .border-b-2 {
                  border-bottom: 2px solid #000 !important;
                  margin-bottom: 16px !important;
                  padding-bottom: 16px !important;
                }
                
                .border-t-2 {
                  border-top: 2px solid #000 !important;
                  margin-top: 16px !important;
                  padding-top: 16px !important;
                }
                
                .border-b {
                  border-bottom: 1px solid #ccc !important;
                  margin-bottom: 8px !important;
                  padding-bottom: 4px !important;
                }
                
                .border-t {
                  border-top: 1px solid #ccc !important;
                  margin-top: 8px !important;
                  padding-top: 8px !important;
                }
                
                .mb-1 { margin-bottom: 4px !important; }
                .mb-2 { margin-bottom: 8px !important; }
                .mb-3 { margin-bottom: 12px !important; }
                .mb-4 { margin-bottom: 16px !important; }
                .mb-6 { margin-bottom: 24px !important; }
                .mb-8 { margin-bottom: 32px !important; }
                
                .mt-2 { margin-top: 8px !important; }
                .mt-4 { margin-top: 16px !important; }
                
                .py-1 { padding-top: 4px !important; padding-bottom: 4px !important; }
                .py-2 { padding-top: 8px !important; padding-bottom: 8px !important; }
                .py-4 { padding-top: 16px !important; padding-bottom: 16px !important; }
                
                .px-3 { padding-left: 12px !important; padding-right: 12px !important; }
                .px-4 { padding-left: 16px !important; padding-right: 16px !important; }
                
                .p-4 { padding: 16px !important; }
                .pt-2 { padding-top: 8px !important; }
                .pt-4 { padding-top: 16px !important; }
                .pt-6 { padding-top: 24px !important; }
                .pb-6 { padding-bottom: 24px !important; }
                
                .space-y-1 > * + * { margin-top: 4px !important; }
                .space-y-2 > * + * { margin-top: 8px !important; }
                
                .grid {
                  display: grid !important;
                }
                
                .grid-cols-1 {
                  grid-template-columns: 1fr !important;
                }
                
                .grid-cols-2 {
                  grid-template-columns: 1fr 1fr !important;
                  gap: 16px !important;
                }
                
                .gap-4 {
                  gap: 16px !important;
                }
                
                .flex {
                  display: flex !important;
                }
                
                .justify-center {
                  justify-content: center !important;
                }
                
                .justify-between {
                  justify-content: space-between !important;
                }
                
                .items-center {
                  align-items: center !important;
                }
                
                .w-16 {
                  width: 64px !important;
                }
                
                .h-16 {
                  height: 64px !important;
                }
                
                .w-8 {
                  width: 32px !important;
                }
                
                .h-8 {
                  height: 32px !important;
                }
                
                .rounded-full {
                  border-radius: 50% !important;
                }
                
                .bg-blue-600 {
                  background-color: #2563eb !important;
                }
                
                .text-white {
                  color: #fff !important;
                }
                
                .text-xs {
                  font-size: 12px !important;
                }
                
                .text-sm {
                  font-size: 14px !important;
                }
                
                .text-lg {
                  font-size: 18px !important;
                }
                
                .text-2xl {
                  font-size: 24px !important;
                }
                
                @page {
                  size: A4;
                  margin: 2cm 1.5cm;
                }
                
                @media print {
                  body { 
                    print-color-adjust: exact !important;
                    -webkit-print-color-adjust: exact !important;
                  }
                  
                  * {
                    color: #000 !important;
                  }
                  
                  .bg-blue-600 {
                    background-color: #2563eb !important;
                    -webkit-print-color-adjust: exact !important;
                    color-adjust: exact !important;
                  }
                  
                  .text-white {
                    color: #fff !important;
                  }
                }
              </style>
            </head>
            <body>
              ${printContent.outerHTML}
            </body>
          </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        
        // Esperar a que se cargue completamente antes de imprimir
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      }
    }
  };

  if (variant === 'icon') {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="hover:bg-green-50 hover:border-green-200 text-green-600"
          >
            <Printer className="h-3 w-3" />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[95vw] max-w-[95vw] h-[95vh] max-h-[95vh] p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-4 border-b bg-white sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Printer className="h-5 w-5 text-green-600" />
                Factura de Venta #{sale.id}
              </DialogTitle>
              <div className="flex gap-2">
                <Button
                  onClick={handlePrint}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir Factura
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-auto p-6">
            <SalesInvoice
              ref={invoiceRef}
              sale={sale}
              customer={customer}
              companyInfo={companyInfo}
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Factura de Venta</h3>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsOpen(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Vista Previa
          </Button>
          <Button
            onClick={handlePrint}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            Imprimir Factura
          </Button>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[95vw] max-w-[95vw] h-[95vh] max-h-[95vh] p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-4 border-b bg-white sticky top-0 z-10">
            <DialogTitle className="flex items-center gap-2">
              <Printer className="h-5 w-5 text-green-600" />
              Vista Previa - Factura #{sale.id}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-auto p-6">
            <SalesInvoice
              ref={invoiceRef}
              sale={sale}
              customer={customer}
              companyInfo={companyInfo}
            />
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Componente oculto para impresión */}
      <div className="hidden">
        <SalesInvoice
          ref={invoiceRef}
          sale={sale}
          customer={customer}
          companyInfo={companyInfo}
        />
      </div>
    </div>
  );
}