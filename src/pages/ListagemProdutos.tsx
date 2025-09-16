import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, ShoppingCart, Trash2, Pencil, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { parsePercentageToDecimal } from "@/lib/utils";

interface Produto {
  id: string;
  nome: string;
  codigo?: string;
  unidadeMedida: string;
  custoProducao: number;
  precoVenda: number;
  custoIndireto?: string;
}

const ListagemProdutos = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const dadosProdutos = localStorage.getItem("produtos");
    if (dadosProdutos) {
      setProdutos(JSON.parse(dadosProdutos));
    }
  }, []);

  const handleBack = () => {
    navigate("/cadastros");
  };

  const handleNovoProduto = () => {
    navigate("/cadastro-produto");
  };

  const handleEditProduto = (id: string) => {
    navigate(`/cadastro-produto/${id}`);
  };

  const handleDeleteProduto = (id: string) => {
    const updatedProdutos = produtos.filter(p => p.id !== id);
    setProdutos(updatedProdutos);
    localStorage.setItem("produtos", JSON.stringify(updatedProdutos));
    
    toast({
      title: "Produto removido!",
      description: "O produto foi excluído com sucesso"
    });
  };

  const filteredProdutos = produtos.filter((p) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return (
      p.nome.toLowerCase().includes(term) ||
      (p.codigo ? p.codigo.toLowerCase().includes(term) : false)
    );
  });

  const renderMargemBadge = (produto: Produto) => {
    const custo = produto.custoProducao || 0;
    const preco = produto.precoVenda || 0;
    if (custo <= 0 || preco <= 0) return null;
  
    // Busca custo indireto salvo no produto ou no padrão
    const saved = localStorage.getItem("margem");
    let custoIndiretoPercent = 0;
    try {
      if (produto.custoIndireto) {
        custoIndiretoPercent = parsePercentageToDecimal(produto.custoIndireto);
      } else if (saved) {
        const parsed = JSON.parse(saved);
        custoIndiretoPercent = parsePercentageToDecimal(parsed?.custoIndireto || "0");
      }
    } catch {
      custoIndiretoPercent = 0;
    }
  
    // Aplica custo indireto
    const custoComIndireto = custo * (1 + custoIndiretoPercent / 100);
  
    // Mantém a fórmula original
    const percent = ((preco - custoComIndireto) / preco) * 100;
    const rounded = Math.round(percent);
    const positive = percent >= 0;
    const bg = positive ? 'bg-green-600' : 'bg-red-600';
    const sign = positive ? '+' : '';
    return (
      <div
        className={`absolute top-2 right-6 w-8 h-8 rounded-full ${bg} text-white text-[9px] font-bold flex items-center justify-center shadow-sm`}
        title={`Margem ${rounded}%`}
      >
        {sign}{rounded}%
      </div>
    );
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
            Produtos
          </h1>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNovoProduto}
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
                <BreadcrumbPage>Produtos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Busca rápida */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome ou código"
              className="w-full h-11 sm:h-12 pl-10 pr-3 border border-border rounded-sm text-sm text-foreground"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>

          {filteredProdutos.length === 0 ? (
            <Card className="shadow-sm">
              <CardContent className="p-6 text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum produto encontrado</p>
                {produtos.length === 0 && (
                  <Button onClick={handleNovoProduto} className="mt-4">
                    Cadastrar Primeiro Produto
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredProdutos.map((produto) => (
              <Card key={produto.id} className="shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-4 sm:p-6 relative">
                  {renderMargemBadge(produto)}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary flex items-center justify-center">
                        <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base text-foreground">
                          {produto.nome}
                        </h3>
                        {produto.codigo && (
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                            Código: {produto.codigo}
                          </p>
                        )}
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Unidade: {produto.unidadeMedida}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Preço: R$ {produto.precoVenda.toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditProduto(produto.id)}
                        className="shrink-0 text-primary hover:text-primary/80"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteProduto(produto.id)}
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

export default ListagemProdutos;