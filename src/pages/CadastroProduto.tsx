import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Package, Search, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Produto {
  id: string;
  nome: string;
  codigo?: string;
  unidadeMedida: string;
  custoProducao: number;
  precoVenda: number;
  fichaTecnica?: InsumoVinculado[];
}

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

const CadastroProduto = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("normal");
  const [formData, setFormData] = useState({
    nome: "",
    codigo: "",
    unidadeMedida: "",
    quantoRende: "",
    custoProducao: 0,
    precoVenda: ""
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [insumosVinculados, setInsumosVinculados] = useState<InsumoVinculado[]>([]);
  const [quantidadeTemp, setQuantidadeTemp] = useState("");

  const unidadesMedida = ["Un", "L", "Kg", "M", "Caixa", "Pacote"];

  useEffect(() => {
    // Load insumos from localStorage
    const savedInsumos = JSON.parse(localStorage.getItem("insumos") || "[]");
    setInsumos(savedInsumos);
  }, []);

  useEffect(() => {
    // Recalculate production cost when linked inputs change
    const custo = insumosVinculados.reduce((total, item) => {
      return total + (item.quantidade * item.preco);
    }, 0);
    setFormData(prev => ({ ...prev, custoProducao: custo }));
  }, [insumosVinculados]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handlePrecoChange = (value: string) => {
    const regex = /^\d*[.,]?\d*$/;
    if (regex.test(value) || value === "") {
      const standardizedValue = value.replace(',', '.');
      handleInputChange("precoVenda", standardizedValue);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
    }

    if (!formData.unidadeMedida) {
      newErrors.unidadeMedida = "Unidade de Medida é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const filteredInsumos = insumos.filter(insumo =>
    insumo.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addInsumo = (insumo: Insumo) => {
    if (!quantidadeTemp || parseFloat(quantidadeTemp) <= 0) {
      toast({
        title: "Quantidade inválida",
        description: "Informe uma quantidade válida",
        variant: "destructive"
      });
      return;
    }

    const novoInsumo: InsumoVinculado = {
      insumoId: insumo.id,
      nome: insumo.nome,
      quantidade: parseFloat(quantidadeTemp),
      unidade: insumo.unidade,
      preco: parseFloat(insumo.preco)
    };

    setInsumosVinculados(prev => [...prev, novoInsumo]);
    setQuantidadeTemp("");
    setSearchTerm("");
  };

  const removeInsumo = (index: number) => {
    setInsumosVinculados(prev => prev.filter((_, i) => i !== index));
  };

  const saveProduto = () => {
    if (!validateForm()) {
      toast({
        title: "Campos obrigatórios",
        description: "Os campos Nome e Unidade de Medida são obrigatórios",
        variant: "destructive"
      });
      return false;
    }

    const existingProdutos = JSON.parse(localStorage.getItem("produtos") || "[]");
    
    const newProduto: Produto = {
      id: Date.now().toString(),
      nome: formData.nome.trim(),
      codigo: formData.codigo.trim(),
      unidadeMedida: formData.unidadeMedida,
      custoProducao: formData.custoProducao,
      precoVenda: parseFloat(formData.precoVenda) || 0,
      fichaTecnica: insumosVinculados.length > 0 ? insumosVinculados : undefined
    };

    existingProdutos.push(newProduto);
    localStorage.setItem("produtos", JSON.stringify(existingProdutos));

    return true;
  };

  const handleSave = () => {
    if (saveProduto()) {
      toast({
        title: "Produto salvo!",
        description: "O produto foi cadastrado com sucesso"
      });
      navigate("/dashboard");
    }
  };

  const handleContinuarCadastrando = () => {
    if (saveProduto()) {
      toast({
        title: "Produto salvo!",
        description: "Continue cadastrando mais produtos"
      });
      
      setFormData({
        nome: "",
        codigo: "",
        unidadeMedida: "",
        quantoRende: "",
        custoProducao: 0,
        precoVenda: ""
      });
      setInsumosVinculados([]);
      setActiveTab("normal");
      setErrors({});
    }
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between px-4 py-3 h-14">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="hover:bg-gray-100 min-w-[44px] min-h-[44px]"
          >
            <ArrowLeft className="h-6 w-6" style={{ color: '#180F33' }} />
          </Button>
          
          <h1 className="text-lg font-bold" style={{ color: '#180F33', fontFamily: 'sans-serif' }}>
            CADASTRO PRODUTO
          </h1>
          
          <div className="w-10"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 pb-20">
        <div className="max-w-lg mx-auto p-4">
          
          <Card className="shadow-lg border-0" style={{ borderRadius: '3px' }}>
            <CardContent className="p-6">
              
              {/* Basic Fields */}
              <div className="space-y-4 mb-6">
                {/* Nome Field */}
                <div>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
                    placeholder="Nome"
                    className={`w-full h-12 px-4 border rounded text-sm ${
                      errors.nome ? 'border-red-500' : 'border-gray-300'
                    }`}
                    style={{ borderRadius: '3px', color: '#666666' }}
                  />
                  {errors.nome && (
                    <p className="text-red-500 text-xs mt-1">{errors.nome}</p>
                  )}
                </div>

                {/* Código Field */}
                <div>
                  <input
                    type="text"
                    value={formData.codigo}
                    onChange={(e) => handleInputChange("codigo", e.target.value)}
                    placeholder="Código"
                    className="w-full h-12 px-4 border border-gray-300 rounded text-sm"
                    style={{ borderRadius: '3px', color: '#666666' }}
                  />
                </div>

                {/* Unidade de Medida Field */}
                <div>
                  <select
                    value={formData.unidadeMedida}
                    onChange={(e) => handleInputChange("unidadeMedida", e.target.value)}
                    className={`w-full h-12 px-4 border rounded text-sm ${
                      errors.unidadeMedida ? 'border-red-500' : 'border-gray-300'
                    }`}
                    style={{ borderRadius: '3px', color: formData.unidadeMedida ? '#000' : '#666666' }}
                  >
                    <option value="">Unidade Medida</option>
                    {unidadesMedida.map(unidade => (
                      <option key={unidade} value={unidade}>{unidade}</option>
                    ))}
                  </select>
                  {errors.unidadeMedida && (
                    <p className="text-red-500 text-xs mt-1">{errors.unidadeMedida}</p>
                  )}
                </div>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6" style={{ backgroundColor: '#E1E1E5' }}>
                  <TabsTrigger 
                    value="normal" 
                    className="data-[state=active]:bg-white data-[state=active]:text-white font-bold"
                    style={{ 
                      backgroundColor: activeTab === 'normal' ? '#180F33' : 'transparent',
                      color: activeTab === 'normal' ? 'white' : '#180F33',
                      borderRadius: '3px'
                    }}
                  >
                    Normal
                  </TabsTrigger>
                  <TabsTrigger 
                    value="ficha"
                    className="data-[state=active]:bg-white data-[state=active]:text-white font-bold"
                    style={{ 
                      backgroundColor: activeTab === 'ficha' ? '#180F33' : 'transparent',
                      color: activeTab === 'ficha' ? 'white' : '#180F33',
                      borderRadius: '3px'
                    }}
                  >
                    Ficha Técnica
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="normal" className="space-y-4">
                  {/* Financial Indicators */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border border-gray-300" style={{ borderRadius: '3px' }}>
                      <div className="text-sm" style={{ color: '#666666' }}>Custo Produção</div>
                      <div className="text-lg font-bold">R$ {formData.custoProducao.toFixed(2)}</div>
                    </div>
                    <div className="text-center p-4 border border-gray-300" style={{ borderRadius: '3px' }}>
                      <div className="text-sm" style={{ color: '#666666' }}>Preço Venda</div>
                      <div className="text-lg font-bold">R$ {parseFloat(formData.precoVenda || "0").toFixed(2)}</div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="ficha" className="space-y-4">
                  {/* Search Insumos */}
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Pesquisar"
                        className="w-full h-12 px-4 border border-gray-300 rounded text-sm"
                        style={{ borderRadius: '3px', color: '#666666' }}
                      />
                      <Search className="absolute right-3 top-3 h-6 w-6" style={{ color: '#666666' }} />
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      value={quantidadeTemp}
                      onChange={(e) => setQuantidadeTemp(e.target.value)}
                      placeholder="Quantidade"
                      className="w-24 h-12 px-2 border border-gray-300 rounded text-sm"
                      style={{ borderRadius: '3px', color: '#666666' }}
                    />
                    <Button
                      size="sm"
                      className="h-12 px-3"
                      style={{ backgroundColor: '#180F33', borderRadius: '3px' }}
                    >
                      Ok
                    </Button>
                  </div>

                  {/* Quanto Rende Field */}
                  <div>
                    <input
                      type="text"
                      value={formData.quantoRende}
                      onChange={(e) => handleInputChange("quantoRende", e.target.value)}
                      placeholder="Quanto Rende"
                      className="w-full h-12 px-4 border border-gray-300 rounded text-sm"
                      style={{ borderRadius: '3px', color: '#666666' }}
                    />
                  </div>

                  {/* Confirm Button */}
                  <Button
                    className="w-full h-12 font-bold"
                    style={{ backgroundColor: '#180F33', borderRadius: '3px' }}
                  >
                    Confirmar Ficha
                  </Button>

                  {/* Search Results */}
                  {searchTerm && (
                    <div className="max-h-32 overflow-y-auto border border-gray-300" style={{ borderRadius: '3px' }}>
                      {filteredInsumos.map(insumo => (
                        <div
                          key={insumo.id}
                          onClick={() => addInsumo(insumo)}
                          className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                        >
                          <div className="font-medium">{insumo.nome}</div>
                          <div className="text-sm" style={{ color: '#666666' }}>
                            R$ {parseFloat(insumo.preco).toFixed(2)} / {insumo.unidade}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Linked Insumos */}
                  {insumosVinculados.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Insumos Vinculados:</h4>
                      {insumosVinculados.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div>
                            <div className="font-medium">{item.nome}</div>
                            <div className="text-sm" style={{ color: '#666666' }}>
                              {item.quantidade} {item.unidade} - R$ {(item.quantidade * item.preco).toFixed(2)}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeInsumo(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Financial Indicators in Technical Sheet */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border border-gray-300" style={{ borderRadius: '3px' }}>
                      <div className="text-sm" style={{ color: '#666666' }}>Custo Produção</div>
                      <div className="text-lg font-bold">R$ {formData.custoProducao.toFixed(2)}</div>
                    </div>
                    <div className="text-center p-4 border border-gray-300" style={{ borderRadius: '3px' }}>
                      <div className="text-sm" style={{ color: '#666666' }}>Preço Venda</div>
                      <input
                        type="text"
                        value={formData.precoVenda}
                        onChange={(e) => handlePrecoChange(e.target.value)}
                        placeholder="0,00"
                        className="w-full text-center border-0 bg-transparent text-lg font-bold focus:outline-none"
                      />
                    </div>
                  </div>

                </TabsContent>
              </Tabs>

              {/* Continue Button */}
              <div className="mt-6">
                <Button
                  onClick={handleContinuarCadastrando}
                  className="w-full h-12 font-bold"
                  style={{ backgroundColor: '#180F33', borderRadius: '3px' }}
                >
                  Salvar e Continuar Cadastrando
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer Buttons */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-lg mx-auto flex gap-4">
          <Button
            variant="outline"
            onClick={handleBack}
            className="h-12 px-6 border-gray-300"
            style={{ borderRadius: '3px', color: '#180F33' }}
          >
            Voltar
          </Button>
          <Button
            onClick={handleSave}
            className="h-12 px-6 font-bold flex-1"
            style={{ backgroundColor: '#180F33', borderRadius: '3px' }}
          >
            Salvar
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default CadastroProduto;