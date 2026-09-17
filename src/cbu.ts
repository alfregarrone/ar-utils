/**
 * CBU (Clave Bancaria Uniforme) y alias CBU.
 *
 * El CBU tiene 22 dígitos divididos en dos bloques:
 *   - Bloque 1 (8 dígitos): banco (3) + sucursal (4) + verificador (1)
 *   - Bloque 2 (14 dígitos): cuenta (13) + verificador (1)
 *
 * Cada bloque valida con su propio dígito verificador (módulo 10 con pesos fijos).
 */

const BLOCK_1_WEIGHTS = [7, 1, 3, 9, 7, 1, 3] as const;
const BLOCK_2_WEIGHTS = [3, 9, 7, 1, 3, 9, 7, 1, 3, 9, 7, 1, 3] as const;

function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

function checkDigit(digits: string, weights: readonly number[]): number {
  const sum = digits
    .split('')
    .reduce((acc, digit, index) => acc + Number(digit) * weights[index], 0);
  return (10 - (sum % 10)) % 10;
}

/**
 * Valida un CBU de 22 dígitos. Acepta espacios y guiones intercalados.
 *
 * @example
 * isValidCbu('0170099220000067797151')
 */
export function isValidCbu(value: string | null | undefined): boolean {
  if (!value) return false;

  const digits = onlyDigits(value);
  if (digits.length !== 22) return false;

  const block1 = digits.slice(0, 8);
  const block2 = digits.slice(8);

  const block1Ok = checkDigit(block1.slice(0, 7), BLOCK_1_WEIGHTS) === Number(block1[7]);
  const block2Ok = checkDigit(block2.slice(0, 13), BLOCK_2_WEIGHTS) === Number(block2[13]);

  return block1Ok && block2Ok;
}

/** Datos que se pueden leer directamente de un CBU válido. */
export interface CbuParts {
  /** Código de entidad bancaria (3 dígitos). */
  bank: string;
  /** Sucursal (4 dígitos). */
  branch: string;
  /** Número de cuenta (13 dígitos). */
  account: string;
}

/**
 * Descompone un CBU en banco, sucursal y cuenta. Devuelve `null` si no es válido.
 *
 * @example
 * parseCbu('0170099220000067797151')
 * // { bank: '017', branch: '0099', account: '0000067797151' }
 */
export function parseCbu(value: string | null | undefined): CbuParts | null {
  if (!isValidCbu(value)) return null;
  const d = onlyDigits(value as string);
  return {
    bank: d.slice(0, 3),
    branch: d.slice(3, 7),
    account: d.slice(8, 21),
  };
}

/**
 * Valida un alias CBU según las reglas del BCRA: entre 6 y 20 caracteres,
 * letras, números, puntos y guiones, sin espacios.
 *
 * @example
 * isValidAliasCbu('pesito.ahorro.ar') // true
 * isValidAliasCbu('corto')            // false
 */
export function isValidAliasCbu(value: string | null | undefined): boolean {
  if (!value) return false;
  return /^[A-Za-z0-9.\-_]{6,20}$/.test(value.trim());
}
