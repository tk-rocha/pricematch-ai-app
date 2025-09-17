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

interface Insumo {
  id: string;
  nome: string;
  preco: string;
  unidade: string;
}

interface InsumoVinculado {
  insumoId: string;
  nome: string;
  quantidade: number;
  unidade: string;
  preco: number;
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
  custoIndireto?: string; // novo
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
    quantoRende: "",
    custoTotalProducao: 0,
    custoUnitario: 0,
    precoSugerido: 0,
    custoIndireto: "0,0%", // novo
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [insumosVinculados, setInsumosVinculados] = useState<InsumoVinculado[]>([]);
  const [quantidadeTemp, setQuantidadeTemp] = useState("");
  const [margem, setMargem] = useState(0);
  const [custoUnitarioInput, setCustoUnitarioInput] = useState("");
  const [margemAtualPercent, setMargemAtualPercent] = useState<number | null>(null);

  const unidadesMedida = ["Un", "L", "Kg", "M", "Caixa", "Pacote"];

  // Carrega dados base (insumos, margem padrão, produto em edição)
  useEffect(() => {
    // insumos
    const savedInsumos = JSON.parse(localStorage.getItem("insumos") || "[]");
    setInsumos(savedInsumos);

    // margem padrão
    const savedMargem = localStorage.getItem("margem");
    let margemData: any = null;
    if (savedMargem) {
      try {
        margemData = JSON.parse(savedMargem);
        setMargem(margemData.margemDecimal || 0);
        setDefaultCustoIndireto(margemData.custoIndireto || "0,0%");
        setFormData((prev) => ({
          ...prev,
          custoIndireto: margemData.custoIndireto || "0,0%",
        }));
      } catch (error) {
        console.error("Erro ao carregar margem:", error);
      }
    }

    // produto (edição)
    if (isEditing && id) {
      const savedProdutos = JSON.parse(localStorage.getItem("produtos") || "[]");
      const produto: Produto | undefined = savedProdutos.find((p: Produto) => p.id === id);
      if (produto) {
        console.log("Produto carregado para edição:", produto);
        console.log("precoVenda original:", produto.precoVenda);
        console.log("precoVenda formatado:", formatCurrency(produto.precoVenda || 0));
        setFormData({
          nome: produto.nome,
          codigo: produto.codigo || "",
          unidadeMedida: produto.unidadeMedida,
          preco: formatCurrency(produto.precoVenda || 0),
          quantoRende: produto.quantoRende ? String(produto.quantoRende) : "",
          custoTotalProducao: produto.custoProducao || 0,
          custoUnitario: produto.custoProducao || 0,
          precoSugerido: produto.precoVenda || 0,
          custoIndireto: produto.custoIndireto ?? margemData?.custoIndireto ?? defaultCustoIndireto,
        });
        setCustoUnitarioInput(formatCurrency(produto.custoProducao || 0));
        if (produto.fichaTecnica) setInsumosVinculados(produto.fichaTecnica);
      }
    }
  }, [isEditing, id, defaultCustoIndireto]);

  // Recalcula custo total de produção quando a ficha muda
  useEffect(() => {
    const custoTotal = insumosVinculados.reduce((total, item) => total + item.quantidade * item.preco, 0);
    setFormData((prev) => ({ ...prev, custoTotalProducao: custoTotal }));
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

  // Garante máscara de moeda ao entrar na aba Normal
  useEffect(() => {
    if (activeTab === "normal") {
      setCustoUnitarioInput(formatCurrency(formData.custoUnitario || 0));
    }
  }, [activeTab, formData.custoUnitario]);

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

    const novoInsumo: InsumoVinculado = {
      insumoId: insumo.id,
      nome: insumo.nome,
      quantidade: parseFloat(quantidadeTemp),
      unidade: insumo.unidade,
      preco: parseFloat(insumo.preco),
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
      precoVenda: parseCurrencyToDecimal(formData.preco) || formData.precoSugerido,
      quantoRende: parseFloat(formData.quantoRende) || 0,
      fichaTecnica: insumosVinculados.length > 0 ? insumosVinculados : undefined,
      custoIndireto: formData.custoIndireto, // persistência por produto
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
        quantoRende: "",
        custoTotalProducao: 0,
        custoUnitario: 0,
        precoSugerido: 0,
        custoIndireto: defaultCustoIndireto,
      });
      setInsumosVinculados([]);
      setActiveTab("normal");
      setErrors({});
    }
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
                  <label className="text-sm font-medium text-foreground mb-1 block">Preço</label>
                  <input
                    type="text"
                    value={formData.preco}
                    onChange={(e) => handleCurrencyInput(e.target.value, (value) => handleInputChange("preco", value))}
                    placeholder="Preço"
                    className="w-full h-12 px-4 border border-gray-300 rounded text-sm"
                    style={{ borderRadius: "3px", color: "#666666" }}
                  />
                  {margemAtualPercent !== null && (
                    <div className="mt-1 text-xs font-medium">
                      <span className={margemAtualPercent >= 0 ? "text-green-600" : "text-red-600"}>
                        {margemAtualPercent >= 0 ? "+" : ""}
                        {Math.round(margemAtualPercent)}%
                      </span>
                      <span className="text-muted-foreground ml-1">margem</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "normal" | "ficha")} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6" style={{ backgroundColor: "#E1E1E5" }}>
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
                  {/* Linha 1 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border border-border rounded-sm">
                      <div className="text-sm text-muted-foreground">Custo Unitário</div>
                      <input
                        type="text"
                        value={custoUnitarioInput}
                        onChange={(e) =>
                          handleCurrencyInput(e.target.value, (masked) => {
                            setCustoUnitarioInput(masked);
                            const numeric = parseCurrencyToDecimal(masked) || 0;
                            setFormData((prev) => ({ ...prev, custoUnitario: numeric }));
                          })
                        }
                        className="mt-2 w-full h-10 px-3 border border-border rounded-sm text-sm text-foreground text-center"
                        placeholder="R$ 0,00"
                      />
                    </div>
                    <div className="text-center p-4 border border-border rounded-sm">
                      <div className="text-sm text-muted-foreground">Preço Sugerido</div>
                      <div className="text-lg font-bold">{formatCurrency(formData.precoSugerido)}</div>
                    </div>
                  </div>

                  {/* Linha 2 */}
                  <div className="grid grid-cols-1 gap-4">
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
                    <div />
                  </div>
                </TabsContent>

                {/* Aba Ficha Técnica */}
                <TabsContent value="ficha" className="space-y-4">
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

                  <Button className="w-full h-12 font-bold bg-primary text-primary-foreground rounded-sm">
                    Confirmar Ficha
                  </Button>

                  {searchTerm && filteredInsumos.length > 0 && (
                    <div className="max-h-40 overflow-y-auto border border-border rounded-sm">
                      {filteredInsumos.map((insumo) => (
                        <div
                          key={insumo.id}
                          onClick={() => addInsumo(insumo)}
                          className="p-3 hover:bg-muted cursor-pointer border-b border-border last:border-b-0 flex items-center justify-between"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Insumo
                              </span>
                              <span className="font-medium">{insumo.nome}</span>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {formatCurrency(parseFloat(insumo.preco))} / {insumo.unidade}
                            </div>
                          </div>
                          <Plus className="h-4 w-4 text-muted-foreground" />
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
                              {item.quantidade} {item.unidade} - {formatCurrency(item.quantidade * item.preco)}
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
                    </div>
                  )}
                  {/* Custo Indireto (%) também na Ficha Técnica */}
                  <div className="grid grid-cols-1 gap-4">
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
                    <div /> {/* espaçador para manter 2 colunas */}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border border-border rounded-sm">
                      <div className="text-sm text-muted-foreground">Custo Unitário</div>
                      <div className="text-lg font-bold">{formatCurrency(formData.custoUnitario)}</div>
                    </div>
                    <div className="text-center p-4 border border-border rounded-sm">
                      <div className="text-sm text-muted-foreground">Preço Sugerido</div>
                      <div className="text-lg font-bold">{formatCurrency(formData.precoSugerido)}</div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

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
