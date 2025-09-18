// helpers/monetary.ts

/**
 * Recebe string exibida na UI e retorna integer cents (ex: "R$ 10,10" -> 1010)
 * Funciona para R$ 10,10, 10,10, R$10,10
 */
export function parseBRLToCents(brlString: string): number {
  if (!brlString) return 0;
  // remove tudo que não for dígito
  const onlyDigits = brlString.replace(/\D/g, "");
  // se onlyDigits for "" -> 0
  return onlyDigits === "" ? 0 : parseInt(onlyDigits, 10);
}

/**
 * Recebe integer cents e formata para "R$ 10,10"
 */
export function formatCentsToBRL(cents: number | string): string {
  const value = (Number(cents) / 100).toFixed(2); // string "10.10"
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value));
}

/**
 * Se sua API já retorna decimal (ex: 10.10), converte para cents
 */
export function decimalToCents(decimal: number | string): number {
  return Math.round(Number(decimal) * 100);
}

/*
Exemplo de uso (React):

// ao editar (carregar dados):
useEffect(() => {
  // data.price_cents pode vir da API como integer ou decimal
  const cents = data.price_cents !== undefined
    ? Number(data.price_cents)
    : decimalToCents(data.price);
  setDisplayValue(formatCentsToBRL(cents)); // mostra "R$ 10,10"
  setInternalCents(cents);
}, [data]);

// no input controlado:
function onInputChange(e) {
  const raw = e.target.value;
  // mantém máscara na UI (você pode usar uma lib de mask)
  setDisplayValue(raw);
  // sempre atualiza o valor "normalizado" em cents
  setInternalCents(parseBRLToCents(raw));
}

// ao salvar:
async function onSave() {
  // envia price_cents (integer) para a API — evita ambiguidade
  await api.put('/insumos/123', { price_cents: internalCents, ...otherFields });
}

Backend — garantir contrato e salvar corretamente

Se optar por cents (recomendado): salvar no banco como integer price_cents.

Se optar por decimal: salvar em coluna DECIMAL(12,2) e no backend converter incoming price_cents → price = price_cents / 100.

Exemplo Node/Express (simples):

// Recebe price_cents do frontend e salva decimal no DB (opção A -> converte para decimal)
app.post('/insumos', async (req, res) => {
  const { price_cents, ...rest } = req.body;
  const price_decimal = Number(price_cents) / 100; // 1010 -> 10.10
  // Salvar price_decimal em DECIMAL(12,2) ou salvar price_cents como integer conforme sua escolha
  await db.query('INSERT INTO insumos (name, price) VALUES ($1, $2)', [rest.name, price_decimal]);
});
*/