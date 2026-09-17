/**
 * DNI — Documento Nacional de Identidad.
 *
 * El DNI no tiene dígito verificador, así que "validar" es verificar
 * formato y rango razonable, y normalizar la escritura.
 */

function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Valida el formato de un DNI (7 u 8 dígitos, sin ceros a la izquierda de más).
 *
 * @example
 * isValidDni('12.345.678') // true
 * isValidDni('123')        // false
 */
export function isValidDni(value: string | number | null | undefined): boolean {
  if (value === null || value === undefined || value === '') return false;

  const digits = onlyDigits(String(value));
  if (digits.length < 7 || digits.length > 8) return false;

  const numeric = Number(digits);
  return numeric >= 1_000_000 && numeric <= 99_999_999;
}

/**
 * Formatea un DNI con puntos de miles. Devuelve `null` si no es válido.
 *
 * @example
 * formatDni('12345678') // '12.345.678'
 */
export function formatDni(value: string | number | null | undefined): string | null {
  if (!isValidDni(value)) return null;
  const digits = onlyDigits(String(value));
  return new Intl.NumberFormat('es-AR').format(Number(digits));
}
