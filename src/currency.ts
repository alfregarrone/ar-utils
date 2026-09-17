/**
 * Formateo y parseo de pesos argentinos.
 *
 * En es-AR el separador de miles es el punto y el decimal es la coma:
 * `$ 1.234.567,89`. Todo lo que viene de un input de usuario suele llegar
 * en ese formato y `Number()` lo rompe — para eso está `parseArs`.
 */

export interface FormatArsOptions {
  /** Mostrar el símbolo `$`. Por defecto `true`. */
  symbol?: boolean;
  /** Cantidad de decimales. Por defecto 2. */
  decimals?: number;
  /** Abreviar a mil / M / MM (ej. `$ 1,2 M`). Por defecto `false`. */
  compact?: boolean;
}

/**
 * Formatea un número como pesos argentinos.
 *
 * @example
 * formatArs(1234567.891)                  // '$ 1.234.567,89'
 * formatArs(1234567, { symbol: false })   // '1.234.567,00'
 * formatArs(0, { decimals: 0 })           // '$ 0'
 * formatArs(2_500_000, { compact: true }) // '$ 2,5 M'
 */
export function formatArs(value: number, options: FormatArsOptions = {}): string {
  const { symbol = true, decimals = 2, compact = false } = options;

  if (!Number.isFinite(value)) return symbol ? '$ —' : '—';

  const formatted = new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: compact ? 0 : decimals,
    maximumFractionDigits: compact ? 1 : decimals,
    ...(compact ? { notation: 'compact' as const, compactDisplay: 'short' as const } : {}),
  }).format(value);

  return symbol ? `$ ${formatted}` : formatted;
}

/**
 * Convierte un string en formato argentino a número.
 * Tolera símbolo, espacios y separadores de miles.
 *
 * Devuelve `null` si no se puede interpretar.
 *
 * @example
 * parseArs('$ 1.234.567,89') // 1234567.89
 * parseArs('1234,5')         // 1234.5
 * parseArs('no es plata')    // null
 */
export function parseArs(value: string | number | null | undefined): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (!value) return null;

  const cleaned = value
    .toString()
    .replace(/\s/g, '')
    .replace(/^\$/, '')
    .replace(/\./g, '')
    .replace(',', '.');

  if (!/^-?\d+(\.\d+)?$/.test(cleaned)) return null;

  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Calcula el porcentaje de variación entre dos valores.
 * Útil para mostrar inflación o evolución de gastos mes a mes.
 *
 * @example
 * pctChange(100, 125) // 25
 */
export function pctChange(from: number, to: number): number | null {
  if (!Number.isFinite(from) || !Number.isFinite(to) || from === 0) return null;
  return ((to - from) / Math.abs(from)) * 100;
}
