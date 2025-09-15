import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Store, Package, Ruler, Plus, ShoppingCart, Users, BarChart, Beaker } from "lucide-react";

const Cadastros = () => {
  const navigate = useNavigate();

  const cadastroOptions = [
    {
      title: "Cadastro da Loja",
      description: "Configure os dados da sua loja",
      icon: Store,
      path: "/cadastro-loja",
      active: true
    },
    {
      title: "Plataformas",
      description: "Adicione plataformas de venda",
      icon: Package,
      path: "/cadastro-plataforma",
      active: true
    },
    {
      title: "Cadastro de Unidade",
      description: "Defina unidades de medida",
      icon: Ruler,
      path: "/cadastro-unidade",
      active: true
    },
    {
      title: "Produtos",
      description: "Gerencie seus produtos",
      icon: ShoppingCart,
      path: "/cadastro-produto",
      active: true
    },
    {
      title: "Insumos",
      description: "Cadastre seus insumos",
      icon: Beaker,
      path: "/cadastro-insumo",
      active: true
    },
    {
      title: "Clientes",
      description: "Cadastre seus clientes",
      icon: Users,
      path: "#",
      active: false
    },
    {
      title: "Relatórios",
      description: "Visualize relatórios",
      icon: BarChart,
      path: "#",
      active: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 left-0 right-0 bg-background border-b border-border z-50 safe-area-top">
        <div className="flex items-center justify-between px-4 py-3 h-14">
          {/* Botão Voltar */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="hover:bg-muted min-w-[44px] min-h-[44px]"
          >
            <ArrowLeft className="h-6 w-6 text-foreground" />
          </Button>

          {/* Título Central */}
          <h1 className="text-base sm:text-lg font-bold text-foreground">
            Cadastros
          </h1>

          {/* Espaço para manter centralização */}
          <div className="w-10 sm:w-11"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 p-3 sm:p-4 pb-6 safe-area-bottom">
        <div className="max-w-2xl mx-auto space-y-3 sm:space-y-4">
          {cadastroOptions.map((option, index) => {
            const IconComponent = option.icon;
            
            const handleClick = () => {
              if (!option.active) return;
              
              // Check if data exists and redirect accordingly
              if (option.path === "/cadastro-loja") {
                const dadosLoja = localStorage.getItem("dadosLoja");
                navigate(dadosLoja ? "/listagem-lojas" : "/cadastro-loja");
              } else if (option.path === "/cadastro-plataforma") {
                const plataformas = JSON.parse(localStorage.getItem("plataformas") || "[]");
                navigate(plataformas.length > 0 ? "/listagem-plataformas" : "/cadastro-plataforma");
              } else if (option.path === "/cadastro-unidade") {
                const unidades = JSON.parse(localStorage.getItem("unidades") || "[]");
                navigate(unidades.length > 0 ? "/listagem-unidades" : "/cadastro-unidade");
              } else if (option.path === "/cadastro-produto") {
                const produtos = JSON.parse(localStorage.getItem("produtos") || "[]");
                navigate(produtos.length > 0 ? "/listagem-produtos" : "/cadastro-produto");
              } else if (option.path === "/cadastro-insumo") {
                const insumos = JSON.parse(localStorage.getItem("insumos") || "[]");
                navigate(insumos.length > 0 ? "/listagem-insumos" : "/cadastro-insumo");
              } else {
                navigate(option.path);
              }
            };
            
            return (
              <Card 
                key={index} 
                className={`shadow-sm transition-all duration-200 ${
                  option.active 
                    ? 'hover:shadow-md cursor-pointer' 
                    : 'opacity-60 cursor-not-allowed'
                }`}
                onClick={handleClick}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-4">
                    {/* Ícone com "+" */}
                    <div className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center ${
                      option.active ? 'bg-primary' : 'bg-muted'
                    }`}>
                      <IconComponent className={`h-6 w-6 sm:h-7 sm:w-7 ${
                        option.active ? 'text-primary-foreground' : 'text-muted-foreground'
                      }`} />
                      {option.active && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-background">
                          <Plus className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    
                    {/* Conteúdo */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold text-sm sm:text-base ${
                        option.active ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {option.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Cadastros;