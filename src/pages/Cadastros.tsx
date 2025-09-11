import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Store, Package, Ruler } from "lucide-react";

const Cadastros = () => {
  const navigate = useNavigate();

  const cadastroOptions = [
    {
      title: "Cadastro da Loja",
      description: "Configure os dados da sua loja",
      icon: Store,
      path: "/cadastro-loja"
    },
    {
      title: "Cadastro de Plataforma",
      description: "Adicione plataformas de venda",
      icon: Package,
      path: "/cadastro-plataforma"
    },
    {
      title: "Cadastro de Unidade",
      description: "Defina unidades de medida",
      icon: Ruler,
      path: "/cadastro-unidade"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-background border-b border-border z-50 safe-area-top">
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
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {cadastroOptions.map((option, index) => {
              const IconComponent = option.icon;
              return (
                <Card 
                  key={index} 
                  className="shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => navigate(option.path)}
                >
                  <CardHeader className="text-center p-4 sm:p-6">
                    <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                      <IconComponent className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />`
                    </div>
                    <CardTitle className="text-sm sm:text-base text-foreground">{option.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center p-4 sm:p-6 pt-0">
                    <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4">
                      {option.description}
                    </p>
                    <Button 
                      className="w-full h-10 sm:h-11 text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(option.path);
                      }}
                    >
                      Acessar
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cadastros;