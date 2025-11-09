import { useSidebar } from './ui/sidebar';
import { Button } from './ui/button';
import { BarChart3, Package, Users, ShoppingCart, FileText, RotateCcw, Truck, List } from 'lucide-react';

type ActiveView = 'dashboard' | 'products' | 'customers' | 'new-sale' | 'sales-list' | 'receipts' | 'returns' | 'suppliers';

interface MenuItem {
  title: string;
  icon: any;
  view: ActiveView;
  iconClass: string;
  gradient: string;
}

interface TopNavigationProps {
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
  menuItems: MenuItem[];
}

export function TopNavigation({ activeView, onViewChange, menuItems }: TopNavigationProps) {
  const { state, isMobile } = useSidebar();
  
  // Solo mostrar cuando el sidebar esté colapsado y no estemos en móvil
  if (state !== 'collapsed' || isMobile) {
    return null;
  }

  return (
    <div className="glass-effect border-b shadow-lg transition-all duration-300 animate-fade-in relative">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Company Logo/Info */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-sm">
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
            <div className="hidden lg:block">
              <h2 className="text-sm font-semibold text-gray-900">MINI SUPER ROSITA</h2>
              <p className="text-xs text-gray-500">Sistema de Ventas</p>
            </div>
          </div>
          
          {/* Navigation Menu - Centered */}
          <div className="flex items-center justify-center gap-2 flex-1">
            {menuItems.map((item) => {
              const isActive = activeView === item.view;
              return (
                <Button
                  key={item.view}
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewChange(item.view)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg shrink-0 relative border transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-500 text-white shadow-sm border-blue-500' 
                      : 'hover:bg-gray-100 border-gray-200 text-gray-700'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden md:inline-block text-sm font-medium">{item.title}</span>
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full opacity-80 animate-pulse"></div>
                  )}
                </Button>
              );
            })}
          </div>
          
          {/* Status Indicator */}
          <div className="text-xs text-gray-500 flex items-center gap-2 shrink-0 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="hidden xl:inline font-medium text-gray-700">Sistema Activo</span>
          </div>
        </div>
      </div>
      
      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
    </div>
  );
}