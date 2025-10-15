# 🧩 Estrutura Hierárquica - Exemplo Prático

## 📋 Como Testar a Nova Funcionalidade

### 1. **Cadastre os Insumos Base**
Primeiro, cadastre os insumos básicos:

```
📦 INSUMOS:
- Farinha: R$ 5,00/kg
- Leite: R$ 4,00/L  
- Frango: R$ 12,00/kg
- Temperos: R$ 2,00/kg
```

### 2. **Crie Produtos Intermediários**
Agora crie produtos intermediários usando os insumos:

#### 🥟 Massa de Coxinha (Produto Intermediário)
- **Tipo:** Intermediário
- **Componentes:**
  - Farinha: 0,5 kg → R$ 2,50
  - Leite: 0,2 L → R$ 0,80
- **Custo Total:** R$ 3,30
- **Quanto Rende:** 1 unidade
- **Custo Unitário:** R$ 3,30/un

#### 🍗 Recheio de Frango (Produto Intermediário)  
- **Tipo:** Intermediário
- **Componentes:**
  - Frango: 0,3 kg → R$ 3,60
  - Temperos: 0,05 kg → R$ 0,10
- **Custo Total:** R$ 3,70
- **Quanto Rende:** 1 unidade
- **Custo Unitário:** R$ 3,70/un

### 3. **Crie o Produto Final**
Agora crie o produto final usando os produtos intermediários:

#### 🥟 Coxinha de Frango (Produto Final)
- **Tipo:** Final
- **Componentes:**
  - Massa de Coxinha: 1 un → R$ 3,30
  - Recheio de Frango: 1 un → R$ 3,70
- **Custo Total:** R$ 7,00
- **Quanto Rende:** 1 unidade
- **Custo Unitário:** R$ 7,00/un

## 🎯 Resultado Esperado

O sistema deve calcular automaticamente:
- **Custo Total da Coxinha:** R$ 7,00
- **Com Margem de 50%:** R$ 10,50
- **Com Custo Indireto de 10%:** R$ 11,55

## 🔄 Vantagens da Estrutura Hierárquica

1. **Reutilização:** A massa e o recheio podem ser usados em outros produtos
2. **Precisão:** Mudanças no preço dos insumos se propagam automaticamente
3. **Flexibilidade:** Fácil de criar variações (coxinha de camarão, etc.)
4. **Controle:** Visibilidade completa da composição de custos

## 📝 Passo a Passo no Sistema

1. **Cadastre Insumos** → Cadastros → Insumos
2. **Crie Massa de Coxinha** → Cadastros → Produtos → Tipo: Intermediário
3. **Crie Recheio de Frango** → Cadastros → Produtos → Tipo: Intermediário  
4. **Crie Coxinha de Frango** → Cadastros → Produtos → Tipo: Final
5. **Use a aba "Ficha Técnica"** para adicionar componentes

## 🚀 Funcionalidades Implementadas

✅ **Interfaces Atualizadas:** Suporte a componentes hierárquicos
✅ **Campo Tipo de Produto:** Intermediário vs Final
✅ **Busca Unificada:** Insumos + Produtos na mesma interface
✅ **Cálculo Recursivo:** Custo total calculado automaticamente
✅ **Compatibilidade:** Mantém estrutura legada funcionando
✅ **Interface Intuitiva:** Badges coloridos para diferenciar tipos

## 🎨 Interface Visual

- 🔵 **Badge Azul:** Insumos
- 🟢 **Badge Verde:** Produtos (Intermediário/Final)
- **Cálculo Automático:** Custo total atualizado em tempo real
- **Hierarquia Clara:** Produtos podem usar outros produtos como componentes
