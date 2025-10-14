import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Search, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
}

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
  custoProducao: number;
  precoVenda: number;
  quantoRende?: number;
  fichaTecnica?: InsumoVinculado[];
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
    preco: "",
    precoVendaFinal: "",
    quantoRende: "",
    custoTotalProducao: 0,
    custoUnitario: 0,
    precoSugerido: 0,
    custoIndireto: "0,0%",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [insumosVinculados, setInsumosVinculados] = useState<InsumoVinculado[]>([]);
  const [quantidadeTemp, setQuantidadeTemp] = useState("");
  const [margem, setMargem] = useState(0);
  const [custoUnitarioInput, setCustoUnitarioInput] = useState("");
  const [margemAtualPercent, setMargemAtualPercent] = useState<number | null>(null);
  const [margemCadastrada, setMargemCadastrada] = useState(false);
  const [margemLoaded, setMargemLoaded] = useState(false);
  const [unidadesMedida, setUnidadesMedida] = useState<string[]>([]);
  const [plataformas, setPlataformas] = useState<Plataforma[]>([]);
  const [canaisVenda, setCanaisVenda] = useState<CanalVenda[]>([]);

  // Carrega dados base (insumos, produtos, margem padrão, produto em edição)
  useEffect(() => {
    // insumos
    const savedInsumos = JSON.parse(localStorage.getItem("insumos") || "[]");
    setInsumos(savedInsumos);
    
    // unidades de medida
    const storedUnidades = JSON.parse(localStorage.getItem("unidades") || "[]");
    const unidadeOptions = storedUnidades.map((unidade: any) => unidade.sigla);
    
    setUnidadesMedida(unidadeOptions);
    
    // plataformas
    const savedPlataformas = JSON.parse(localStorage.getItem("plataformas") || "[]");
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
      const savedProdutos = JSON.parse(localStorage.getItem("produtos") || "[]");
      const produto: Produto | undefined = savedProdutos.find((p: Produto) => p.id === id);
      if (produto) {
        setFormData({
          nome: produto.nome,
          codigo: produto.codigo || "",
          unidadeMedida: produto.unidadeMedida,
          preco: (produto.custoProducao || 0).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }),
          precoVendaFinal: (produto.precoVenda || 0).toLocaleString('pt-BR', {
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
        if (produto.fichaTecnica) setInsumosVinculados(produto.fichaTecnica);
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

  // Recalcula custo total de produção quando a ficha muda
  useEffect(() => {
    const custoInsumos = insumosVinculados.reduce((total, item) => total + item.quantidade * item.preco, 0);
    setFormData((prev) => ({ ...prev, custoTotalProducao: custoInsumos }));
  }, [insumosVinculados]);

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

  // Preenche automaticamente o precoVendaFinal com precoSugerido (apenas se vazio)
  useEffect(() => {
    if (formData.precoSugerido > 0 && !formData.precoVendaFinal && !isEditing) {
      setFormData((prev) => ({
        ...prev,
        precoVendaFinal: formatCurrency(formData.precoSugerido),
      }));
    }
  }, [formData.precoSugerido, formData.precoVendaFinal, isEditing]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.nome.trim()) newErrors.nome = "Nome é obrigatório";
    if (!formData.unidadeMedida) newErrors.unidadeMedida = "Unidade de Medida é obrigatória";
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
    const precoNumerico = typeof (insumo as any).preco_cents === 'number'
      ? (insumo as any).preco_cents / 100
      : (() => {
          const raw = (insumo as any).preco;
          return typeof raw === 'number' ? raw : parseCurrencyToDecimal(String(raw ?? '0'));
        })();

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
      custoProducao: formData.custoUnitario,
      precoVenda: parseCurrencyToDecimal(formData.precoVendaFinal) || formData.precoSugerido,
      quantoRende: parseFloat(formData.quantoRende) || 0,
      fichaTecnica: insumosVinculados.length > 0 ? insumosVinculados : undefined,
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
        preco: "",
        precoVendaFinal: "",
        quantoRende: "",
        custoTotalProducao: 0,
        custoUnitario: 0,
        precoSugerido: 0,
        custoIndireto: defaultCustoIndireto,
      });
      setInsumosVinculados([]);
      setCanaisVenda([]);
      setActiveTab("normal");
      setErrors({});
    }
  };

  const calcularPrecoSugeridoPlataforma = (taxa: number) => {
    const precoVenda = parseCurrencyToDecimal(formData.precoVendaFinal) || formData.precoSugerido || 0;
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

  const handleBack = () => navigate("/listagem-produtos");

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
                    className="w-full h-12 px-4 border border-gray-300 rounded text-sm"
                    style={{ borderRadius: "3px", color: "#666666" }}
                  />
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

                  {/* Preço de Venda */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Preço de Venda</label>
                    <input
                      type="text"
                      value={formData.precoVendaFinal}
                      onChange={(e) => handleCurrencyInput(e.target.value, (value) => handleInputChange("precoVendaFinal", value))}
                      placeholder="R$ 0,00"
                      className="w-full h-12 px-4 border border-gray-300 rounded text-sm"
                      style={{ borderRadius: "3px", color: "#666666" }}
                    />
                  </div>
                </TabsContent>

                {/* Aba Ficha Técnica */}
                <TabsContent value="ficha" className="space-y-4">
                  {/* Seção de Insumos */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Insumos</h3>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Pesquisar insumos"
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

                  {searchTerm && filteredInsumos.length > 0 && (
                    <div className="max-h-40 overflow-y-auto border border-border rounded-sm">
                      {filteredInsumos.map((insumo) => (
                        <div
                          key={insumo.id}
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
                              {insumo.preco_cents !== undefined 
                                ? formatCentsToBRL(insumo.preco_cents)
                                : formatCurrency(parseCurrencyToDecimal(String(insumo.preco ?? '0')))
                              } / {insumo.unidade}
                            </div>
                          </div>
                          <Button
                            onClick={() => addInsumo(insumo)}
                            size="sm"
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            Adicionar
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchTerm && filteredInsumos.length === 0 && (
                    <div className="text-center p-4 text-muted-foreground">
                      <p>Nenhum insumo encontrado</p>
                      <p className="text-xs mt-1">Cadastre insumos primeiro em "Cadastros → Insumos"</p>
                    </div>
                  )}


                  {insumosVinculados.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">Insumos Vinculados:</h4>
                      {insumosVinculados.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-sm">
                          <div>
                            <div className="font-medium text-foreground">{item.nome}</div>
                            <div className="text-sm text-muted-foreground">
                              {item.quantidade.toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 })} {item.unidade} - {formatCurrency((item.quantidade || 0) * (typeof item.preco === 'number' ? item.preco : parseCurrencyToDecimal(String((item as any).preco ?? '0'))))}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeInsumo(index)}
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
                          Informe o quanto todas essas quantidades de insumos irão render
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

                    </div>
                  )}
                </TabsContent>
              </Tabs>

              {/* Canais de Venda */}
              {plataformas.length > 0 && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-bold text-foreground">Canais de Venda</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Venda</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Taxa (%)</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Preço Sugerido (R$)</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Valor Final (R$)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 text-sm text-foreground">Balcão</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">-</td>
                          <td className="py-3 px-4 text-sm font-medium text-foreground">
                            {formatCurrency(parseCurrencyToDecimal(formData.precoVendaFinal) || formData.precoSugerido || 0)}
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="text"
                              value={getCanalVendaValor("balcao")}
                              onChange={(e) =>
                                handleCurrencyInput(e.target.value, (value) =>
                                  handleCanalVendaChange("balcao", value)
                                )
                              }
                              placeholder="R$ 0,00"
                              className="w-full h-10 px-3 border border-border rounded-sm text-sm text-foreground"
                            />
                          </td>
                        </tr>
                        {plataformas.map((plataforma) => (
                          <tr key={plataforma.id} className="border-b border-border">
                            <td className="py-3 px-4 text-sm text-foreground">{plataforma.nome}</td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">
                              {plataforma.taxa.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })}%
                            </td>
                            <td className="py-3 px-4 text-sm font-medium text-foreground">
                              {formatCurrency(calcularPrecoSugeridoPlataforma(plataforma.taxa))}
                            </td>
                            <td className="py-3 px-4">
                              <input
                                type="text"
                                value={getCanalVendaValor(plataforma.id)}
                                onChange={(e) =>
                                  handleCurrencyInput(e.target.value, (value) =>
                                    handleCanalVendaChange(plataforma.id, value)
                                  )
                                }
                                placeholder="R$ 0,00"
                                className="w-full h-10 px-3 border border-border rounded-sm text-sm text-foreground"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

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
    </div>
  );
};

export default CadastroProduto;
