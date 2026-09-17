/**
 * CUIT / CUIL — Clave Única de Identificación Tributaria / Laboral.
 *
 * Formato: XX-XXXXXXXX-X (11 dígitos). El último dígito es un verificador
 * calculado con módulo 11 sobre los 10 primeros.
 */

const WEIGHTS = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2] as const;

/** Prefijos de tipo válidos para CUIT/CUIL. */
const VALID_PREFIXES = new Set(['20', '23', '24', '25', '26', '27', '30', '33', '34']);

/** Deja solo los dígitos de una cadena. */
function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Calcula el dígito verificador de un CUIT a partir de sus 10 primeros dígitos.
 *
 * @throws si no recibe exactamente 10 dígitos.
 *
 * @example
 * cuitCheckDigit('2012345678') // 3
 */
export function cuitCheckDigit(first10: string): number {
  const digits = onlyDigits(first10);
  if (digits.length !== 10) {
    throw new Error('cuitCheckDigit espera exactamente 10 dígitos');
  }

  const sum = digits
    .split('')
    .reduce((acc, digit, index) => acc + Number(digit) * WEIGHTS[index], 0);

  const remainder = 11 - (sum % 11);
  if (remainder === 11) return 0;
  if (remainder === 10) return 9;
  return remainder;
}

/**
 * Valida un CUIT o CUIL. Acepta el número con o sin guiones/espacios.
 *
 * @example
 * isValidCuit('30-71234567-8')
 * isValidCuit('30712345678')
 */
export function isValidCuit(value: string | null | undefined): boolean {
  if (!value) return false;

  const digits = onlyDigits(value);
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false; // 00000000000, 11111111111, ...
  if (!VALID_PREFIXES.has(digits.slice(0, 2))) return false;

  return cuitCheckDigit(digits.slice(0, 10)) === Number(digits[10]);
}

/** Alias de {@link isValidCuit}: el algoritmo del CUIL es el mismo. */
export const isValidCuil = isValidCuit;

/**
 * Formatea un CUIT como XX-XXXXXXXX-X. Devuelve `null` si no es válido.
 *
 * @example
 * formatCuit('30712345678') // '30-71234567-8'
 */
export function formatCuit(value: string | null | undefined): string | null {
  if (!isValidCuit(value)) return null;
  const d = onlyDigits(value as string);
  return `${d.slice(0, 2)}-${d.slice(2, 10)}-${d.slice(10)}`;
}

/**
 * Construye el CUIT de una persona física a partir del DNI y el género
 * registrado, probando los prefijos admitidos.
 *
 * Devuelve `null` si el DNI no es válido.
 *
 * @param dni     DNI de 7 u 8 dígitos.
 * @param prefix  '20' (masculino), '27' (femenino) o '23'/'24' (casos especiales).
 *
 * @example
 * cuitFromDni('12345678', '20') // '20-12345678-4'
 */
export function cuitFromDni(dni: string | number, prefix: '20' | '23' | '24' | '27'): string | null {
  const digits = onlyDigits(String(dni));
  if (digits.length < 7 || digits.length > 8) return null;

  const padded = digits.padStart(8, '0');
  const base = `${prefix}${padded}`;
  return `${prefix}-${padded}-${cuitCheckDigit(base)}`;
}
