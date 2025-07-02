export function validateAmountSent(fieldId: string): boolean {
  const el = document.getElementById(fieldId) as HTMLInputElement | null;
  if (!el) return false;
  return !!el.value && !isNaN(Number(el.value));
}