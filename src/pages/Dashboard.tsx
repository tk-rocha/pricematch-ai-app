import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Plus, Package, ShoppingCart, TrendingUp, TrendingDown, Menu } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [nomeEmpresa, setNomeEmpresa] = useState("Usuário");

  useEffect(() => {
    const dadosLoja = localStorage.getItem("dadosLoja");
    if (dadosLoja) {
      const loja = JSON.parse(dadosLoja);
      setNomeEmpresa(loja.nomeContato || loja.nome || "Usuário");
    }
  }, []);

  const handleUserClick = () => {
    const dadosLoja = localStorage.getItem("dadosLoja");
    if (dadosLoja) {
      // Se já tem loja cadastrada, vai para listagem
      navigate("/listagem-lojas");
    } else {
      // Se não tem loja, vai para cadastro
      navigate("/cadastro-loja");
    }
  };

  // Get today's date in Brazilian format
  const today = new Date().toLocaleDateString("pt-BR");

  // Mock data for counts - in real app these would come from localStorage/API
  const getCounts = () => {
    const plataformas = JSON.parse(localStorage.getItem("plataformas") || "[]");
    const unidades = JSON.parse(localStorage.getItem("unidades") || "[]");
    const produtos = JSON.parse(localStorage.getItem("produtos") || "[]");
    const insumos = JSON.parse(localStorage.getItem("insumos") || "[]");
    
    return {
      produtos: produtos.length,
      insumos: insumos.length,
      entradas: 0, // Not implemented yet
      vendas: 0 // Not implemented yet
    };
  };

  const counts = getCounts();

  const actionButtons = [
    {
      title: "Novo Produto",
      icon: Package,
      path: "/cadastro-produto",
      count: counts.produtos,
      label: "Produtos cadastrados",
      active: true
    },
    {
      title: "Novo Insumo",
      icon: Package,
      path: "/cadastro-insumo", 
      count: counts.insumos,
      label: "Insumos cadastrados",
      active: true
    },
    {
      title: "Nova Entrada",
      icon: TrendingUp,
      path: "#",
      count: counts.entradas,
      label: "Entradas cadastradas", 
      active: false
    },
    {
      title: "Nova Venda",
      icon: ShoppingCart,
      path: "#",
      count: counts.vendas,
      label: "Vendas hoje",
      active: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-background border-b border-border z-50 safe-area-top">
        <div className="flex items-center justify-between px-4 py-3 h-14">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/cadastros")}
            className="hover:bg-muted min-w-[44px] min-h-[44px]"
          >
            <Menu className="h-6 w-6 text-foreground" />
          </Button>
          
          <h1 className="text-base sm:text-lg font-bold text-foreground">
            Olá, {nomeEmpresa}
          </h1>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleUserClick}
            className="hover:bg-muted min-w-[44px] min-h-[44px]"
          >
            <User className="h-6 w-6 text-foreground" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 p-3 sm:p-4 pb-6 safe-area-bottom">
        <div className="max-w-2xl mx-auto space-y-4">
          
          {/* Sales Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Today's Sales */}
            <Card className="shadow-sm">
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-foreground">Vendas Hoje</h3>
                  <p className="text-xs text-muted-foreground">{today}</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">R$ 0,00</p>
                </div>
              </CardContent>
            </Card>

            {/* Orders Count */}
            <Card className="shadow-sm">
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-foreground">Quantidade</h3>
                  <p className="text-xs text-muted-foreground">de Pedidos</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">0</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profitability Section */}
          <Card className="shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-2 gap-4">
                {/* Higher Profitability */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-foreground">Maior Rentabilidade</h4>
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground p-2 bg-muted rounded">Produto 1</div>
                    <div className="text-xs text-muted-foreground p-2 bg-muted rounded">Produto 2</div>
                    <div className="text-xs text-muted-foreground p-2 bg-muted rounded">Produto 3</div>
                  </div>
                </div>

                {/* Lower Profitability */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-foreground">Menor Rentabilidade</h4>
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground p-2 bg-muted rounded">Produto 1</div>
                    <div className="text-xs text-muted-foreground p-2 bg-muted rounded">Produto 2</div>
                    <div className="text-xs text-muted-foreground p-2 bg-muted rounded">Produto 3</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            {actionButtons.map((button, index) => {
              const IconComponent = button.icon;
              return (
                <Card 
                  key={index} 
                  className={`shadow-sm transition-all duration-200 ${
                    button.active 
                      ? 'hover:shadow-md cursor-pointer' 
                      : 'opacity-60 cursor-not-allowed'
                  }`}
                  onClick={() => button.active && navigate(button.path)}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Icon with Plus */}
                        <div className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center ${
                          button.active ? 'bg-primary' : 'bg-muted'
                        }`}>
                          <IconComponent className={`h-6 w-6 sm:h-7 sm:w-7 ${
                            button.active ? 'text-primary-foreground' : 'text-muted-foreground'
                          }`} />
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-background">
                            <Plus className="h-3 w-3 text-primary-foreground" />
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-semibold text-sm sm:text-base ${
                            button.active ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {button.title}
                          </h3>
                        </div>
                      </div>
                      
                      {/* Count */}
                      <div className="text-right">
                        <p className="text-lg sm:text-xl font-bold text-foreground">{button.count.toString().padStart(4, '0')}</p>
                        <p className="text-xs text-muted-foreground">{button.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Cadastros Button */}
          <Card className="shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer" onClick={() => navigate("/cadastros")}>
            <CardContent className="p-4 sm:p-6">
              <div className="text-center">
                <h3 className="font-semibold text-base text-primary">Acessar Cadastros</h3>
                <p className="text-sm text-muted-foreground mt-1">Configure sua loja e produtos</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;