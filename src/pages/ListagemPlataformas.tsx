import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Package, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

interface Plataforma {
  id: string;
  nome: string;
  taxa: number;
}

const ListagemPlataformas = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [plataformas, setPlataformas] = useState<Plataforma[]>([]);

  useEffect(() => {
    const dadosPlataformas = localStorage.getItem("plataformas");
    if (dadosPlataformas) {
      setPlataformas(JSON.parse(dadosPlataformas));
    }
  }, []);

  const handleBack = () => {
    navigate("/cadastros");
  };

  const handleNovaPlataforma = () => {
    navigate("/cadastro-plataforma");
  };

  const handleEditPlataforma = (plataforma: Plataforma) => {
    navigate("/cadastro-plataforma", { state: { plataforma } });
  };

  const handleDeletePlataforma = (id: string) => {
    const updatedPlataformas = plataformas.filter(p => p.id !== id);
    setPlataformas(updatedPlataformas);
    localStorage.setItem("plataformas", JSON.stringify(updatedPlataformas));
    
    toast({
      title: "Plataforma removida!",
      description: "A plataforma foi excluída com sucesso"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 left-0 right-0 bg-background border-b border-border z-50 safe-area-top">
        <div className="flex items-center justify-between px-4 py-3 h-14">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="hover:bg-muted min-w-[44px] min-h-[44px]"
          >
            <ArrowLeft className="h-6 w-6 text-foreground" />
          </Button>
          
          <h1 className="text-base sm:text-lg font-bold text-primary">
            Plataformas
          </h1>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNovaPlataforma}
            className="hover:bg-muted min-w-[44px] min-h-[44px]"
          >
            <Plus className="h-6 w-6 text-foreground" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 p-3 sm:p-4 pb-6 safe-area-bottom">
        <div className="max-w-2xl mx-auto space-y-3 sm:space-y-4">
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
                <BreadcrumbPage>Plataformas</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {plataformas.length === 0 ? (
            <Card className="shadow-sm">
              <CardContent className="p-6 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhuma plataforma cadastrada</p>
                <Button onClick={handleNovaPlataforma} className="mt-4">
                  Cadastrar Primeira Plataforma
                </Button>
              </CardContent>
            </Card>
          ) : (
            plataformas.map((plataforma) => (
              <Card key={plataforma.id} className="shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary flex items-center justify-center">
                        <Package className="h-6 w-6 sm:h-7 sm:w-7 text-primary-foreground" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base text-foreground">
                          {plataforma.nome}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          Taxa: {plataforma.taxa}%
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditPlataforma(plataforma)}
                        className="shrink-0 text-primary hover:text-primary/80"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeletePlataforma(plataforma.id)}
                        className="shrink-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default ListagemPlataformas;