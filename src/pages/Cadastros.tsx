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
      <header className="fixed top-0 left-0 right-0 bg-background border-b border-border z-50">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Botão Voltar */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="hover:bg-muted"
          >
            <ArrowLeft className="h-6 w-6 text-foreground" />
          </Button>

          {/* Título Central */}
          <h1 className="text-lg font-bold text-foreground">
            Cadastros
          </h1>

          {/* Espaço para manter centralização */}
          <div className="w-10"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cadastroOptions.map((option, index) => {
              const IconComponent = option.icon;
              return (
                <Card 
                  key={index} 
                  className="shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => navigate(option.path)}
                >
                  <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-foreground">{option.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground text-sm mb-4">
                      {option.description}
                    </p>
                    <Button 
                      className="w-full"
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