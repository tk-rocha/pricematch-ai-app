import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, Plus } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const ListagemMargem = () => {
  const navigate = useNavigate();
  const [margem, setMargem] = useState<any>(null);

  useEffect(() => {
    const storedMargem = localStorage.getItem("margem");
    if (storedMargem) {
      try {
        setMargem(JSON.parse(storedMargem));
      } catch (error) {
        console.error("Erro ao carregar margem:", error);
      }
    }
  }, []);

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
            <ArrowLeft className="h-6 w-6 text-foreground" />
          </Button>

          <h1 className="text-base sm:text-lg font-bold text-primary">
            Margem
          </h1>

          <div className="w-10 sm:w-11"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 pb-20">
        <div className="max-w-lg mx-auto p-4">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/dashboard">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/cadastros">Cadastros</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Margem</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {margem ? (
            <Card className="shadow-lg border-0" style={{ borderRadius: "3px" }}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded" style={{ borderRadius: "3px" }}>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-muted-foreground">% Margem</div>
                        <div className="text-2xl font-bold text-foreground">{margem.margem}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">% Custo Indireto Padrão</div>
                        <div className="text-2xl font-bold text-foreground">{margem.custoIndireto}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button
                      onClick={() => navigate("/cadastro-margem?modo=editar")}
                      className="w-full h-12 font-bold"
                      style={{ backgroundColor: "#180F33", borderRadius: "3px" }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-lg border-0" style={{ borderRadius: "3px" }}>
              <CardContent className="p-8 text-center space-y-4">
                <div className="text-muted-foreground">
                  Nenhuma margem cadastrada
                </div>
                <Button
                  onClick={() => navigate("/cadastro-margem")}
                  className="w-full h-12 font-bold"
                  style={{ backgroundColor: "#180F33", borderRadius: "3px" }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Cadastrar Margem
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-3 sm:p-4 safe-area-bottom">
        <div className="max-w-2xl mx-auto">
          <Button 
            variant="outline" 
            onClick={() => navigate("/cadastros")} 
            className="w-full h-11 sm:h-12 text-sm"
          >
            Voltar
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default ListagemMargem;