import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Search, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  handleCurrencyInput,
  parseCurrencyToDecimal,
  formatCurrency,
  parsePercentageToDecimal,
  handlePercentageInput,
} from "@/lib/utils";
import { formatCentsToBRL } from "@/lib/monetary";

interface Insumo {
  id: string;
  nome: string;
  unidade: string;
  preco?: string | number;
  preco_cents?: number;
  quantidadeEmbalagem?: number;
  preco_unitario_cents?: number; // Novo campo para o preço unitário calculado
}

// Nova interface para representar um componente (insumo ou produto) dentro de outro produto
interface ComponenteProduto {
  itemId: string; // ID do insumo ou do produto
  itemNome: string; // Nome do insumo ou do produto
  itemTipo: "insumo" | "produto_intermediario" | "produto_final"; // Tipo do item
  quantidade: number;
  unidade: string;
  custoUnitarioCalculado: number; // O custo unitário do item
}

// Interface legada para compatibilidade (será removida gradualmente)
interface InsumoVinculado {
  insumoId: string;
  nome: string;
  quantidade: number;
  unidade: string;
  preco: number;
}


interface Plataforma {
  id: string;
  nome: string;
  taxa: number;
}

interface CanalVenda {
  plataformaId: string;
  valorFinal: string;
}

interface Produto {
  id: string;
  nome: string;
  codigo?: string;
  unidadeMedida: string;
  tipo: "intermediario" | "final"; // Novo campo para o tipo de produto
  custoProducao: number;
  precoVenda: number;
  quantoRende?: number;
  componentes?: ComponenteProduto[]; // Nova estrutura para componentes
  fichaTecnica?: InsumoVinculado[]; // Mantido para compatibilidade
  custoIndireto?: string;
  canaisVenda?: CanalVenda[];
}

const CadastroProduto = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const isEditing = !!id;

  const [activeTab, setActiveTab] = useState<"normal" | "ficha">("normal");
  const [defaultCustoIndireto, setDefaultCustoIndireto] = useState("0,0%");

  const [formData, setFormData] = useState({
    nome: "",
    codigo: "",
    unidadeMedida: "",
    tipo: "final" as "intermediario" | "final", // Novo campo para tipo de produto
    preco: "",
    quantoRende: "",
    custoTotalProducao: 0,
    custoUnitario: 0,
    precoSugerido: 0,
    custoIndireto: "0,0%",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [produtosDisponiveis, setProdutosDisponiveis] = useState<Produto[]>([]); // Para buscar produtos como componentes
  const [searchTerm, setSearchTerm] = useState("");
  const [componentesDoProduto, setComponentesDoProduto] = useState<ComponenteProduto[]>([]); // Nova estrutura para componentes
  const [insumosVinculados, setInsumosVinculados] = useState<InsumoVinculado[]>([]); // Mantido para compatibilidade
  const [quantidadeTemp, setQuantidadeTemp] = useState("");
  const [margem, setMargem] = useState(0);
  const [custoUnitarioInput, setCustoUnitarioInput] = useState("");
  const [margemAtualPercent, setMargemAtualPercent] = useState<number | null>(null);
  const [margemCadastrada, setMargemCadastrada] = useState(false);
  const [margemLoaded, setMargemLoaded] = useState(false);
  const [unidadesMedida, setUnidadesMedida] = useState<string[]>([]);
  const [plataformas, setPlataformas] = useState<Plataforma[]>([]);
  const [canaisVenda, setCanaisVenda] = useState<CanalVenda[]>([]);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Carrega dados base (insumos, produtos, margem padrão, produto em edição)
  useEffect(() => {
    // insumos
    const savedInsumos = JSON.parse(localStorage.getItem("insumos") || "[]");
    setInsumos(savedInsumos);
    
    // produtos disponíveis (para usar como componentes)
    const savedProdutos = JSON.parse(localStorage.getItem("produtos") || "[]");
    // Filtra para não incluir o próprio produto em edição na lista de componentes selecionáveis
    const produtosParaComponentes = savedProdutos.filter((p: Produto) => p.id !== id);
    setProdutosDisponiveis(produtosParaComponentes);
    
    // unidades de medida
    const storedUnidades = JSON.parse(localStorage.getItem("unidades") || "[]");
    const unidadeOptions = storedUnidades.map((unidade: any) => unidade.sigla);
    
    setUnidadesMedida(unidadeOptions);
    
    // plataformas
    const savedPlataformas = JSON.parse(localStorage.getItem("plataformas") || "[]");
    console.log("Plataformas carregadas:", savedPlataformas);
    setPlataformas(savedPlataformas);
    

    // margem padrão
    const savedMargem = localStorage.getItem("margem");
    let margemData: any = null;
    if (savedMargem) {
      try {
        margemData = JSON.parse(savedMargem);
        const hasValidMargem = margemData && 
          margemData.margem && 
          margemData.margem.trim() !== "" && 
          margemData.margemDecimal !== undefined;
        setMargemCadastrada(hasValidMargem);
        setMargem(margemData.margemDecimal || 0);
        setDefaultCustoIndireto(margemData.custoIndireto || "0,0%");
        setFormData((prev) => ({
          ...prev,
          custoIndireto: margemData.custoIndireto || "0,0%",
        }));
      } catch (error) {
        console.error("Erro ao carregar margem:", error);
        setMargemCadastrada(false);
      }
    } else {
      setMargemCadastrada(false);
    }

    // produto (edição)
    if (isEditing && id) {
      const produto: Produto | undefined = savedProdutos.find((p: Produto) => p.id === id);
      if (produto) {
        setFormData({
          nome: produto.nome,
          codigo: produto.codigo || "",
          unidadeMedida: produto.unidadeMedida,
          tipo: produto.tipo || "final", // Carrega o tipo do produto
          preco: (produto.custoProducao || 0).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }),
          quantoRende: produto.quantoRende ? String(produto.quantoRende) : "",
          custoTotalProducao: produto.custoProducao || 0,
          custoUnitario: produto.custoProducao || 0,
          precoSugerido: produto.precoVenda || 0,
          custoIndireto: produto.custoIndireto ?? margemData?.custoIndireto ?? defaultCustoIndireto,
        });
        setCustoUnitarioInput((produto.custoProducao || 0).toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }));
        // Carregar componentes (nova estrutura) ou ficha técnica (estrutura legada)
        if (produto.componentes) {
          setComponentesDoProduto(produto.componentes);
        } else if (produto.fichaTecnica) {
          setInsumosVinculados(produto.fichaTecnica);
        }
        if (produto.canaisVenda) setCanaisVenda(produto.canaisVenda);
      }
    }
  setMargemLoaded(true);
  }, [isEditing, id, defaultCustoIndireto]);

  // Alerta de margem não cadastrada (somente após carregar a margem)
  useEffect(() => {
    if (margemLoaded && !margemCadastrada && !isEditing) {
      toast({
        title: "⚠️ Margem não cadastrada",
        description: "Para cálculos precisos de preço, cadastre uma margem antes de adicionar produtos.",
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/cadastro-margem")}
          >
            Cadastrar Margem
          </Button>
        ),
        duration: 8000,
      });
    }
  }, [margemLoaded, margemCadastrada, isEditing, navigate, toast]);

  // Recalcula custo total de produção quando os componentes mudam
  useEffect(() => {
    // Usar nova estrutura de componentes se disponível, senão usar estrutura legada
    if (componentesDoProduto.length > 0) {
      const custoComponentes = calcularCustoTotalProduto(componentesDoProduto, insumos, produtosDisponiveis);
      setFormData((prev) => ({ ...prev, custoTotalProducao: custoComponentes }));
    } else {
      // Fallback para estrutura legada
      const custoInsumos = insumosVinculados.reduce((total, item) => total + item.quantidade * item.preco, 0);
      setFormData((prev) => ({ ...prev, custoTotalProducao: custoInsumos }));
    }
  }, [componentesDoProduto, insumosVinculados, insumos, produtosDisponiveis]);

  // Ficha Técnica: calcula custo unitário e preço sugerido (considera custo indireto e margem)
  useEffect(() => {
    if (activeTab === "ficha") {
      const quantoRendeNum = parseFloat(formData.quantoRende) || 1;
      const custoUnitario = (formData.custoTotalProducao || 0) / quantoRendeNum;

      const custoIndiretoDecimal = parsePercentageToDecimal(formData.custoIndireto || "0");
      const custoComIndireto = custoUnitario * (1 + custoIndiretoDecimal / 100);
      const precoSugerido = custoComIndireto * (1 + margem / 100);

      setFormData((prev) => ({
        ...prev,
        custoUnitario,
        precoSugerido,
      }));

      setCustoUnitarioInput(formatCurrency(custoUnitario));
    }
  }, [formData.custoTotalProducao, formData.quantoRende, margem, formData.custoIndireto, activeTab]);

  // Normal: recalcula preço sugerido quando muda custo unitário/margem/custo indireto
  useEffect(() => {
    if (activeTab === "normal") {
      const custoIndiretoDecimal = parsePercentageToDecimal(formData.custoIndireto || "0");
      const custoComIndireto = (formData.custoUnitario || 0) * (1 + custoIndiretoDecimal / 100);
      const precoSugerido = custoComIndireto * (1 + margem / 100);

      console.log("Cálculo Preço Sugerido (Normal):", {
        custoUnitario: formData.custoUnitario,
        custoIndireto: formData.custoIndireto,
        custoIndiretoDecimal,
        custoComIndireto,
        margem,
        precoSugerido
      });

      setFormData((prev) => ({
        ...prev,
        precoSugerido,
      }));
    }
  }, [formData.custoUnitario, margem, formData.custoIndireto, activeTab]);

  // Indicador de margem do preço digitado
  useEffect(() => {
    const custo = formData.custoUnitario || 0;
    const precoVenda = parseCurrencyToDecimal(formData.preco) || 0;

    // considera o custo indireto
    const custoIndiretoDecimal = parsePercentageToDecimal(formData.custoIndireto || "0");
    const custoComIndireto = custo * (1 + custoIndiretoDecimal / 100);

    if (custoComIndireto > 0 && precoVenda > 0) {
      const percent = ((precoVenda - custoComIndireto) / precoVenda) * 100;
      setMargemAtualPercent(percent);
    } else {
      setMargemAtualPercent(null);
    }
  }, [formData.preco, formData.custoUnitario, formData.custoIndireto]);

  // Sincroniza campo "Custo" com custoUnitario para ativar cálculos (aba Normal)
  useEffect(() => {
    if (activeTab === "normal") {
      const novoCusto = parseCurrencyToDecimal(formData.preco) || 0;
      if (formData.custoUnitario !== novoCusto) {
        setFormData(prev => ({ ...prev, custoUnitario: novoCusto }));
      }
    }
  }, [formData.preco, formData.custoUnitario, activeTab]);

  // Garante máscara de moeda ao entrar na aba Normal
  useEffect(() => {
    if (activeTab === "normal") {
      setCustoUnitarioInput(formatCurrency(formData.custoUnitario || 0));
    }
  }, [activeTab, formData.custoUnitario]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    setHasUnsavedChanges(true);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.nome.trim()) newErrors.nome = "Nome é obrigatório";
    if (!formData.unidadeMedida) newErrors.unidadeMedida = "Unidade de Medida é obrigatória";
    
    // Validar código duplicado
    const existingProdutos: Produto[] = JSON.parse(localStorage.getItem("produtos") || "[]");
    if (formData.codigo.trim()) {
      const codigoDuplicado = existingProdutos.find(
        (p) => p.codigo?.toLowerCase() === formData.codigo.trim().toLowerCase() && p.id !== id
      );
      if (codigoDuplicado) {
        newErrors.codigo = "Já existe um produto com este código";
      }
    }
    
    // Validar nome duplicado
    const nomeDuplicado = existingProdutos.find(
      (p) => p.nome.toLowerCase() === formData.nome.trim().toLowerCase() && p.id !== id
    );
    if (nomeDuplicado) {
      newErrors.nome = "Já existe um produto com este nome";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const filteredInsumos = insumos.filter((insumo) =>
    insumo.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const addInsumo = (insumo: Insumo) => {
    if (!quantidadeTemp || parseFloat(quantidadeTemp) <= 0) {
      toast({
        title: "Quantidade inválida",
        description: "Informe uma quantidade válida",
        variant: "destructive",
      });
      return;
    }

    // Obtém o preço do insumo em decimal (R$ por unidade), compatível com formatos antigos e novos
    const precoNumerico = obterPrecoUnitarioInsumo(insumo);

    const novoInsumo: InsumoVinculado = {
      insumoId: insumo.id,
      nome: insumo.nome,
      quantidade: parseFloat(quantidadeTemp),
      unidade: insumo.unidade,
      preco: precoNumerico,
    };

    setInsumosVinculados((prev) => [...prev, novoInsumo]);
    setQuantidadeTemp("");
    setSearchTerm("");
  };

  const removeInsumo = (index: number) => {
    setInsumosVinculados((prev) => prev.filter((_, i) => i !== index));
  };

  // Funções para gerenciar componentes (nova estrutura hierárquica)
  const addComponente = (componente: ComponenteProduto) => {
    if (!componente.quantidade || componente.quantidade <= 0) {
      toast({
        title: "Quantidade inválida",
        description: "Informe uma quantidade válida para o componente",
        variant: "destructive",
      });
      return;
    }

    setComponentesDoProduto((prev) => [...prev, componente]);
    setQuantidadeTemp("");
    setSearchTerm("");
    setHasUnsavedChanges(true);
  };

  const removeComponente = (index: number) => {
    setComponentesDoProduto((prev) => prev.filter((_, i) => i !== index));
    setHasUnsavedChanges(true);
  };

  // Função para calcular o custo total de um produto baseado em seus componentes
  // Função auxiliar para obter o preço unitário de um insumo
  const obterPrecoUnitarioInsumo = (insumo: Insumo): number => {
    if (insumo.preco_unitario_cents !== undefined) {
      // Usar o preço unitário calculado (mais preciso)
      return insumo.preco_unitario_cents / 100;
    } else if (insumo.preco_cents !== undefined && insumo.quantidadeEmbalagem !== undefined && insumo.quantidadeEmbalagem > 0) {
      // Calcular preço unitário baseado no preço da embalagem e quantidade
      return (insumo.preco_cents / 100) / insumo.quantidadeEmbalagem;
    } else if (insumo.preco_cents !== undefined) {
      // Fallback para preco_cents (preço da embalagem)
      return insumo.preco_cents / 100;
    } else {
      // Fallback para preco (formato antigo)
      return typeof insumo.preco === 'number' 
        ? insumo.preco 
        : parseCurrencyToDecimal(String(insumo.preco ?? '0'));
    }
  };

  // Função auxiliar para obter o custo total de um produto (incluindo custo indireto)
  const obterCustoTotalProduto = (produto: Produto): number => {
    const custoSimples = produto.custoProducao || 0;
    const custoIndiretoDecimal = parsePercentageToDecimal(produto.custoIndireto || "0");
    const custoComIndireto = custoSimples * (1 + custoIndiretoDecimal / 100);
    return custoComIndireto;
  };

  const calcularCustoTotalProduto = (componentes: ComponenteProduto[], todosInsumos: Insumo[], todosProdutos: Produto[]): number => {
    let totalCusto = 0;

    componentes.forEach(comp => {
      let custoItem = 0;
      if (comp.itemTipo === "insumo") {
        const insumo = todosInsumos.find(i => i.id === comp.itemId);
        if (insumo) {
          const precoUnitario = obterPrecoUnitarioInsumo(insumo);
          custoItem = comp.quantidade * precoUnitario;
        }
      } else { // É um produto (intermediário ou final)
        const produtoComponente = todosProdutos.find(p => p.id === comp.itemId);
        if (produtoComponente) {
          // Usar o custo total do produto (incluindo custo indireto)
          const custoTotalProduto = obterCustoTotalProduto(produtoComponente);
          custoItem = comp.quantidade * custoTotalProduto;
        }
      }
      totalCusto += custoItem;
    });
    return totalCusto;
  };

  const saveProduto = () => {
    if (!validateForm()) {
      toast({
        title: "Campos obrigatórios",
        description: "Os campos Nome e Unidade de Medida são obrigatórios",
        variant: "destructive",
      });
      return false;
    }

    const existingProdutos: Produto[] = JSON.parse(localStorage.getItem("produtos") || "[]");

    const produtoData: Produto = {
      id: isEditing ? id! : Date.now().toString(),
      nome: formData.nome.trim(),
      codigo: formData.codigo.trim(),
      unidadeMedida: formData.unidadeMedida,
      tipo: formData.tipo, // Salva o tipo do produto
      custoProducao: formData.custoUnitario,
      precoVenda: formData.precoSugerido,
      quantoRende: parseFloat(formData.quantoRende) || 0,
      componentes: componentesDoProduto.length > 0 ? componentesDoProduto : undefined, // Salva os componentes
      fichaTecnica: insumosVinculados.length > 0 ? insumosVinculados : undefined, // Mantém compatibilidade
      custoIndireto: formData.custoIndireto,
      canaisVenda: canaisVenda.length > 0 ? canaisVenda : undefined,
    };

    if (isEditing) {
      const index = existingProdutos.findIndex((p) => p.id === id);
      if (index !== -1) existingProdutos[index] = produtoData;
    } else {
      existingProdutos.push(produtoData);
    }

    localStorage.setItem("produtos", JSON.stringify(existingProdutos));
    return true;
  };

  const handleSave = () => {
    if (saveProduto()) {
      toast({
        title: "Produto salvo!",
        description: isEditing ? "O produto foi atualizado com sucesso" : "O produto foi cadastrado com sucesso",
      });
      setHasUnsavedChanges(false);
      navigate("/listagem-produtos");
    }
  };

  const handleContinuarCadastrando = () => {
    if (saveProduto()) {
      toast({
        title: "Produto salvo!",
        description: "Continue cadastrando mais produtos",
      });

      setFormData({
        nome: "",
        codigo: "",
        unidadeMedida: "",
        tipo: "final", // Resetar para o tipo padrão
        preco: "",
        quantoRende: "",
        custoTotalProducao: 0,
        custoUnitario: 0,
        precoSugerido: 0,
        custoIndireto: defaultCustoIndireto,
      });
      setComponentesDoProduto([]); // Limpar componentes
      setInsumosVinculados([]); // Limpar insumos vinculados (compatibilidade)
      setCanaisVenda([]);
      setActiveTab("normal");
      setErrors({});
      setHasUnsavedChanges(false);
    }
  };

  const calcularPrecoSugeridoPlataforma = (taxa: number) => {
    const precoVenda = formData.precoSugerido || 0;
    if (precoVenda === 0) return 0;
    return precoVenda / (1 - taxa / 100);
  };

  const handleCanalVendaChange = (plataformaId: string, valor: string) => {
    setCanaisVenda((prev) => {
      const existing = prev.find((c) => c.plataformaId === plataformaId);
      if (existing) {
        return prev.map((c) =>
          c.plataformaId === plataformaId ? { ...c, valorFinal: valor } : c
        );
      } else {
        return [...prev, { plataformaId, valorFinal: valor }];
      }
    });
  };

  const getCanalVendaValor = (plataformaId: string) => {
    return canaisVenda.find((c) => c.plataformaId === plataformaId)?.valorFinal || "";
  };

  const handleBack = () => {
    if (hasUnsavedChanges) {
      setShowExitDialog(true);
    } else {
      navigate("/listagem-produtos");
    }
  };

  const confirmExit = () => {
    setShowExitDialog(false);
    setHasUnsavedChanges(false);
    navigate("/listagem-produtos");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-background border-b border-border z-50 safe-area-top">
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
            {isEditing ? "Editar Produto" : "Cadastrar Produto"}
          </h1>

          <div className="w-10 sm:w-11"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 pb-20">
        <div className="max-w-lg mx-auto p-4">
          <Card className="shadow-lg border-0" style={{ borderRadius: "3px" }}>
            <CardContent className="p-6">
              {/* Campos básicos */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Nome</label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
                    placeholder="Nome"
                    className={`w-full h-12 px-4 border rounded text-sm ${
                      errors.nome ? "border-red-500" : "border-gray-300"
                    }`}
                    style={{ borderRadius: "3px", color: "#666666" }}
                  />
                  {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Código</label>
                  <input
                    type="text"
                    value={formData.codigo}
                    onChange={(e) => handleInputChange("codigo", e.target.value)}
                    placeholder="Código"
                    className={`w-full h-12 px-4 border rounded text-sm ${
                      errors.codigo ? "border-red-500" : "border-gray-300"
                    }`}
                    style={{ borderRadius: "3px", color: "#666666" }}
                  />
                  {errors.codigo && <p className="text-red-500 text-xs mt-1">{errors.codigo}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Unidade de Medida</label>
                  <select
                    value={formData.unidadeMedida}
                    onChange={(e) => handleInputChange("unidadeMedida", e.target.value)}
                    className={`w-full h-12 px-4 border rounded text-sm ${
                      errors.unidadeMedida ? "border-red-500" : "border-gray-300"
                    }`}
                    style={{ borderRadius: "3px", color: formData.unidadeMedida ? "#000" : "#666666" }}
                  >
                    <option value="">Unidade Medida</option>
                    {unidadesMedida.map((unidade) => (
                      <option key={unidade} value={unidade}>
                        {unidade}
                      </option>
                    ))}
                  </select>
                  {errors.unidadeMedida && (
                    <p className="text-red-500 text-xs mt-1">{errors.unidadeMedida}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Tipo de Produto</label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => handleInputChange("tipo", e.target.value as "intermediario" | "final")}
                    className="w-full h-12 px-4 border border-gray-300 rounded text-sm"
                    style={{ borderRadius: "3px", color: formData.tipo ? "#000" : "#666666" }}
                  >
                    <option value="final">Produto Final</option>
                    <option value="intermediario">Produto Intermediário</option>
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Produtos intermediários podem ser usados como componentes de outros produtos
                  </p>
                </div>


                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Custo</label>
                  <input
                    type="text"
                    value={formData.preco}
                    onChange={(e) => handleCurrencyInput(e.target.value, (value) => handleInputChange("preco", value))}
                    placeholder="R$ 0,00"
                    className="w-full h-12 px-4 border border-gray-300 rounded text-sm"
                    style={{ borderRadius: "3px", color: "#666666" }}
                  />
                </div>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "normal" | "ficha")} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4" style={{ backgroundColor: "#E1E1E5" }}>
                  <TabsTrigger
                    value="normal"
                    className="data-[state=active]:bg-white data-[state=active]:text-white font-bold"
                    style={{
                      backgroundColor: activeTab === "normal" ? "#180F33" : "transparent",
                      color: activeTab === "normal" ? "white" : "#180F33",
                      borderRadius: "3px",
                    }}
                  >
                    Normal
                  </TabsTrigger>
                  <TabsTrigger
                    value="ficha"
                    className="data-[state=active]:bg-white data-[state=active]:text-white font-bold"
                    style={{
                      backgroundColor: activeTab === "ficha" ? "#180F33" : "transparent",
                      color: activeTab === "ficha" ? "white" : "#180F33",
                      borderRadius: "3px",
                    }}
                  >
                    Ficha Técnica
                  </TabsTrigger>
                </TabsList>

                {/* Aba Normal */}
                <TabsContent value="normal" className="space-y-4">
                  {/* Custo Indireto */}
                  <div className="text-center p-4 border border-border rounded-sm">
                    <div className="text-sm text-muted-foreground">Custo Indireto (%)</div>
                    <input
                      type="text"
                      value={formData.custoIndireto}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length < (formData.custoIndireto?.length || 0)) {
                          setFormData((prev) => ({ ...prev, custoIndireto: value }));
                        } else {
                          handlePercentageInput(value, (masked) =>
                            setFormData((prev) => ({ ...prev, custoIndireto: masked }))
                          );
                        }
                      }}
                      className="mt-2 w-full h-10 px-3 border border-border rounded-sm text-sm text-foreground text-center"
                      placeholder="Ex: 10,0%"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Percentual aplicado sobre o custo unitário para despesas indiretas.
                    </p>
                  </div>

                  {/* Detalhamento do Cálculo */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-sm space-y-2">
                    <div className="text-sm font-semibold text-blue-900">Composição do Preço de Venda:</div>
                    <div className="space-y-1 text-xs text-blue-800">
                      <div className="flex justify-between">
                        <span>Preço de Custo:</span>
                        <span className="font-medium">{formatCurrency(formData.custoUnitario || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>+ Custo Indireto ({formData.custoIndireto}):</span>
                        <span className="font-medium">
                          {formatCurrency((formData.custoUnitario || 0) * (parsePercentageToDecimal(formData.custoIndireto || "0") / 100))}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-blue-300 pt-1">
                        <span>Custo Total:</span>
                        <span className="font-medium">
                          {formatCurrency((formData.custoUnitario || 0) * (1 + parsePercentageToDecimal(formData.custoIndireto || "0") / 100))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>+ Margem ({margem.toFixed(1)}%):</span>
                        <span className="font-medium">
                          {formatCurrency(((formData.custoUnitario || 0) * (1 + parsePercentageToDecimal(formData.custoIndireto || "0") / 100)) * (margem / 100))}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-blue-300 pt-1 font-bold">
                        <span>Preço Sugerido:</span>
                        <span>{formatCurrency(formData.precoSugerido)}</span>
                      </div>
                    </div>
                  </div>

                </TabsContent>

                {/* Aba Ficha Técnica */}
                <TabsContent value="ficha" className="space-y-4">
                  {/* Seção de Componentes */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Componentes</h3>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Pesquisar insumos ou produtos"
                          className="w-full h-12 px-4 border border-border rounded-sm text-sm text-foreground"
                        />
                        <Search className="absolute right-3 top-3 h-6 w-6 text-muted-foreground" />
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        value={quantidadeTemp}
                        onChange={(e) => setQuantidadeTemp(e.target.value)}
                        placeholder="Quantidade"
                        className="w-24 h-12 px-2 border border-border rounded-sm text-sm text-foreground"
                      />
                    </div>
                  </div>

                  {/* Listagem de Itens para Adicionar (Insumos e Produtos) */}
                  {searchTerm && (insumos.length > 0 || produtosDisponiveis.length > 0) && (
                    <div className="max-h-40 overflow-y-auto border border-border rounded-sm">
                      {/* Insumos */}
                      {insumos.filter(i => i.nome.toLowerCase().includes(searchTerm.toLowerCase())).map((insumo) => (
                        <div
                          key={`insumo-${insumo.id}`}
                          className="p-3 border-b border-border last:border-b-0 flex items-center justify-between"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Insumo
                              </span>
                              <span className="font-medium">{insumo.nome}</span>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {formatCurrency(obterPrecoUnitarioInsumo(insumo))} / {insumo.unidade}
                            </div>
                          </div>
                          <Button
                            onClick={() => {
                              const precoUnitario = obterPrecoUnitarioInsumo(insumo);
                              addComponente({
                                itemId: insumo.id,
                                itemNome: insumo.nome,
                                itemTipo: "insumo",
                                quantidade: parseFloat(quantidadeTemp),
                                unidade: insumo.unidade,
                                custoUnitarioCalculado: precoUnitario
                              });
                            }}
                            size="sm"
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                            disabled={!quantidadeTemp || parseFloat(quantidadeTemp) <= 0}
                          >
                            Adicionar
                          </Button>
                        </div>
                      ))}

                      {/* Produtos (Intermediários/Finais) */}
                      {produtosDisponiveis.filter(p => p.nome.toLowerCase().includes(searchTerm.toLowerCase())).map((produto) => (
                        <div
                          key={`produto-${produto.id}`}
                          className="p-3 border-b border-border last:border-b-0 flex items-center justify-between"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Produto ({produto.tipo === "intermediario" ? "Interm." : "Final"})
                              </span>
                              <span className="font-medium">{produto.nome}</span>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {formatCurrency(obterCustoTotalProduto(produto))} / {produto.unidadeMedida}
                            </div>
                          </div>
                          <Button
                            onClick={() => addComponente({
                              itemId: produto.id,
                              itemNome: produto.nome,
                              itemTipo: produto.tipo === "intermediario" ? "produto_intermediario" : "produto_final",
                              quantidade: parseFloat(quantidadeTemp),
                              unidade: produto.unidadeMedida,
                              custoUnitarioCalculado: obterCustoTotalProduto(produto)
                            })}
                            size="sm"
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                            disabled={!quantidadeTemp || parseFloat(quantidadeTemp) <= 0}
                          >
                            Adicionar
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchTerm && insumos.filter(i => i.nome.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 &&
                   produtosDisponiveis.filter(p => p.nome.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                    <div className="text-center p-4 text-muted-foreground">
                      <p>Nenhum insumo ou produto encontrado</p>
                      <p className="text-xs mt-1">Verifique os cadastros de insumos e produtos.</p>
                    </div>
                  )}

                  {/* Listagem de Componentes Vinculados */}
                  {componentesDoProduto.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">Componentes Vinculados:</h4>
                      {componentesDoProduto.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-sm">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                item.itemTipo === "insumo" 
                                  ? "bg-blue-100 text-blue-800" 
                                  : "bg-green-100 text-green-800"
                              }`}>
                                {item.itemTipo === "insumo" 
                                  ? "Insumo" 
                                  : `Produto (${item.itemTipo === "produto_intermediario" ? "Interm." : "Final"})`
                                }
                              </span>
                              <span className="font-medium text-foreground">{item.itemNome}</span>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {item.quantidade.toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 })} {item.unidade} - {formatCurrency(item.quantidade * item.custoUnitarioCalculado)}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeComponente(index)}
                            className="hover:bg-destructive/10 hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      
                      <div className="mt-3 p-3 bg-primary/5 rounded-sm border-l-4 border-primary">
                        <div className="text-sm font-medium text-primary">
                          Total do Custo de Produção: {formatCurrency(formData.custoTotalProducao)}
                        </div>
                      </div>

                      <div className="mt-4">
                        <input
                          type="text"
                          value={formData.quantoRende}
                          onChange={(e) => handleInputChange("quantoRende", e.target.value)}
                          placeholder="Quanto Rende"
                          className="w-full h-12 px-4 border border-border rounded-sm text-sm text-foreground"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Informe o quanto todas essas quantidades de componentes irão render
                        </p>
                      </div>

                      {/* Custo Indireto (%) também na Ficha Técnica */}
                      <div className="mt-4">
                        <div className="text-center p-4 border border-border rounded-sm">
                          <div className="text-sm text-muted-foreground">Custo Indireto (%)</div>
                          <input
                            type="text"
                            value={formData.custoIndireto}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value.length < (formData.custoIndireto?.length || 0)) {
                                setFormData(prev => ({ ...prev, custoIndireto: value }));
                              } else {
                                handlePercentageInput(value, (masked) =>
                                  setFormData(prev => ({ ...prev, custoIndireto: masked }))
                                );
                              }
                            }}
                            className="mt-2 w-full h-10 px-3 border border-border rounded-sm text-sm text-foreground text-center"
                            placeholder="Ex: 10,0%"
                          />
                          <p className="text-xs text-muted-foreground mt-2">
                            Percentual aplicado sobre o custo unitário para despesas indiretas.
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="text-center p-4 border border-border rounded-sm">
                          <div className="text-sm text-muted-foreground">Custo Unitário</div>
                          <div className="text-lg font-bold">{formatCurrency(formData.custoUnitario)}</div>
                        </div>
                        <div className="text-center p-4 border border-border rounded-sm">
                          <div className="text-sm text-muted-foreground">Preço Sugerido</div>
                          <div className="text-lg font-bold">{formatCurrency(formData.precoSugerido)}</div>
                        </div>
                      </div>

                      {/* Detalhamento do Cálculo na Ficha Técnica */}
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-sm space-y-2">
                        <div className="text-sm font-semibold text-blue-900">Composição do Preço de Venda:</div>
                        <div className="space-y-1 text-xs text-blue-800">
                          <div className="flex justify-between">
                            <span>Custo Unitário:</span>
                            <span className="font-medium">{formatCurrency(formData.custoUnitario || 0)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>+ Custo Indireto ({formData.custoIndireto}):</span>
                            <span className="font-medium">
                              {formatCurrency((formData.custoUnitario || 0) * (1 + parsePercentageToDecimal(formData.custoIndireto || "0") / 100))}
                            </span>
                          </div>
                          <div className="flex justify-between border-t border-blue-300 pt-1">
                            <span>Custo Total:</span>
                            <span className="font-medium">
                              {formatCurrency((formData.custoUnitario || 0) * (1 + parsePercentageToDecimal(formData.custoIndireto || "0") / 100))}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>+ Margem ({margem.toFixed(1)}%):</span>
                            <span className="font-medium">
                              {formatCurrency(((formData.custoUnitario || 0) * (1 + parsePercentageToDecimal(formData.custoIndireto || "0") / 100)) * (margem / 100))}
                            </span>
                          </div>
                          <div className="flex justify-between border-t border-blue-300 pt-1 font-bold">
                            <span>Preço Sugerido:</span>
                            <span>{formatCurrency(formData.precoSugerido)}</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}
                </TabsContent>
              </Tabs>

              {/* Canais de Venda */}
              {plataformas.length > 0 ? (
                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-bold text-foreground">Canais de Venda</h3>
                  <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
                    <div className="inline-block min-w-full align-middle">
                      <div className="overflow-hidden">
                        <table className="w-full border-collapse min-w-[600px]">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-foreground whitespace-nowrap">Venda</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-foreground whitespace-nowrap">Taxa (%)</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-foreground whitespace-nowrap">Preço Sugerido (R$)</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-foreground whitespace-nowrap">Valor Final (R$)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 text-sm text-foreground whitespace-nowrap">Balcão</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground whitespace-nowrap">-</td>
                          <td className="py-3 px-4 text-sm font-medium text-foreground whitespace-nowrap">
                            {formatCurrency(formData.precoSugerido || 0)}
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="text"
                              value={formatCurrency(formData.precoSugerido || 0)}
                              onChange={(e) =>
                                handleCurrencyInput(e.target.value, (value) =>
                                  handleCanalVendaChange("balcao", value)
                                )
                              }
                              placeholder="R$ 0,00"
                              className="w-full h-10 px-3 border border-border rounded-sm text-sm text-foreground min-w-[120px]"
                            />
                          </td>
                        </tr>
                        {plataformas.map((plataforma) => (
                          <tr key={plataforma.id} className="border-b border-border">
                            <td className="py-3 px-4 text-sm text-foreground whitespace-nowrap">{plataforma.nome}</td>
                            <td className="py-3 px-4 text-sm text-muted-foreground whitespace-nowrap">
                              {plataforma.taxa.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })}%
                            </td>
                            <td className="py-3 px-4 text-sm font-medium text-foreground whitespace-nowrap">
                              {formatCurrency(calcularPrecoSugeridoPlataforma(plataforma.taxa))}
                            </td>
                            <td className="py-3 px-4">
                              <input
                                type="text"
                                value={formatCurrency(calcularPrecoSugeridoPlataforma(plataforma.taxa))}
                                onChange={(e) =>
                                  handleCurrencyInput(e.target.value, (value) =>
                                    handleCanalVendaChange(plataforma.id, value)
                                  )
                                }
                                placeholder="R$ 0,00"
                                className="w-full h-10 px-3 border border-border rounded-sm text-sm text-foreground min-w-[120px]"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="mt-6">
                <Button
                  onClick={isEditing ? handleSave : handleContinuarCadastrando}
                  className="w-full h-12 font-bold"
                  style={{ backgroundColor: "#180F33", borderRadius: "3px" }}
                >
                  {isEditing ? "Atualizar Produto" : "Salvar e Continuar Cadastrando"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-3 sm:p-4 safe-area-bottom">
        <div className="max-w-2xl mx-auto flex gap-3 sm:gap-4">
          <Button variant="outline" onClick={handleBack} className="flex-1 h-11 sm:h-12 text-sm">
            Voltar
          </Button>
          <Button onClick={handleSave} className="flex-1 h-11 sm:h-12 text-sm font-semibold">
            Salvar
          </Button>
        </div>
      </footer>

      {/* Alert Dialog para confirmação de saída */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja sair?</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem alterações não salvas. Se sair agora, todas as alterações serão perdidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmExit}>Sair sem salvar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CadastroProduto;
