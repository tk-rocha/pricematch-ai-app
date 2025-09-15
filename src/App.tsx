import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Cadastros from "./pages/Cadastros";
import CadastroLoja from "./pages/CadastroLoja";
import CadastroPlataforma from "./pages/CadastroPlataforma";
import CadastroUnidade from "./pages/CadastroUnidade";
import CadastroProduto from "./pages/CadastroProduto";
import CadastroInsumo from "./pages/CadastroInsumo";
import ListagemLojas from "./pages/ListagemLojas";
import ListagemPlataformas from "./pages/ListagemPlataformas";
import ListagemUnidades from "./pages/ListagemUnidades";
import ListagemProdutos from "./pages/ListagemProdutos";
import ListagemInsumos from "./pages/ListagemInsumos";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cadastros" element={<Cadastros />} />
          <Route path="/cadastro-loja" element={<CadastroLoja />} />
          <Route path="/cadastro-plataforma" element={<CadastroPlataforma />} />
          <Route path="/cadastro-unidade" element={<CadastroUnidade />} />
          <Route path="/cadastro-produto" element={<CadastroProduto />} />
          <Route path="/cadastro-insumo" element={<CadastroInsumo />} />
          <Route path="/cadastro-insumo/:action" element={<CadastroInsumo />} />
          <Route path="/listagem-lojas" element={<ListagemLojas />} />
          <Route path="/listagem-plataformas" element={<ListagemPlataformas />} />
          <Route path="/listagem-unidades" element={<ListagemUnidades />} />
          <Route path="/listagem-produtos" element={<ListagemProdutos />} />
          <Route path="/listagem-insumos" element={<ListagemInsumos />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
