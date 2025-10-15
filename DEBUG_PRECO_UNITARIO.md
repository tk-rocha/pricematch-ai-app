# 🧪 Teste de Debug - Preço Unitário

## Como testar:

1. **Abra o console do navegador** (F12 → Console)
2. **Vá para Cadastros → Produtos**
3. **Clique na aba "Ficha Técnica"**
4. **Digite "knor" na busca**
5. **Observe os logs no console**

## O que esperar:

Se o insumo "Caldo knor" estiver correto, você deve ver:
```
Caldo knor: usando preco_unitario_cents = 38 (R$ 0,38)
```

Se estiver incorreto, você verá:
```
Caldo knor: usando preco_cents = 450 (R$ 4,50)
```

## Se o problema persistir:

1. **Verifique se o insumo foi salvo corretamente:**
   - Vá para Cadastros → Insumos
   - Edite o "Caldo knor"
   - Verifique se o "Preço Unitário" está mostrando R$ 0,38
   - Salve o insumo novamente

2. **Verifique o localStorage:**
   - Abra o console (F12)
   - Digite: `JSON.parse(localStorage.getItem("insumos"))`
   - Procure pelo "Caldo knor" e verifique se tem `preco_unitario_cents: 38`

## Dados esperados para "Caldo knor":
```json
{
  "id": "...",
  "nome": "Caldo knor",
  "unidade": "UN",
  "preco_cents": 450,        // R$ 4,50 (preço da embalagem)
  "quantidadeEmbalagem": 12, // 12 unidades na embalagem
  "preco_unitario_cents": 38 // R$ 0,38 (preço unitário)
}
```
