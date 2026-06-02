export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    currency: 'BRL',
    style: 'currency',
    maximumFractionDigits: 2
  }).format(value);
}

export function formatMinutes(minutes: number) {
  const rounded = Math.max(0, Math.round(minutes));
  return `${rounded} min`;
}

export function formatTimeLabel(value: string) {
  try {
    return new Date(value).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch {
    return value;
  }
}

export function normalizeStatusClass(status: string) {
  return status.toLowerCase().replace(/_/g, '-');
}

