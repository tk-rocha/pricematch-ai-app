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
      <header className="sticky top-0 left-0 right-0 bg-background border-b border-border z-50 safe-area-top">
        <div className="flex items-center justify-between px-4 py-3 h-14">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/cadastros")}
            className="hover:bg-muted min-w-[44px] min-h-[44px]"
          >
            <ArrowLeft className="h-6 w-6 text-foreground" />
          </Button>

          <h1 className="text-base sm:text-lg font-bold text-foreground">
            Margem
          </h1>

          <div className="w-10 sm:w-11"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 p-3 sm:p-4 pb-6 safe-area-bottom">
        <div className="max-w-lg mx-auto space-y-4">
          {/* Breadcrumb */}
          <Breadcrumb>
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
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Margem Padrão</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground">% Margem</div>
                  <div className="text-2xl font-bold text-foreground">{margem.margem}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">% Custo Indireto Padrão</div>
                  <div className="text-2xl font-bold text-foreground">{margem.custoIndireto}
                  </div>
                </div>
              </div>

                
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/cadastros")}
                    className="flex-1"
                  >
                    Voltar
                  </Button>
                  <Button
                    onClick={() => navigate("/cadastro-margem?modo=editar")}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center space-y-4">
                <div className="text-muted-foreground">
                  Nenhuma margem cadastrada
                </div>
                <Button
                  onClick={() => navigate("/cadastro-margem")}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Cadastrar Margem
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default ListagemMargem;