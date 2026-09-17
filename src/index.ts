/**
 * ar-utils — utilidades para aplicaciones argentinas.
 *
 * Cero dependencias, TypeScript, ESM + CJS.
 */

export { isValidCuit, isValidCuil, formatCuit, cuitCheckDigit, cuitFromDni } from './cuit.js';
export { isValidCbu, parseCbu, isValidAliasCbu, type CbuParts } from './cbu.js';
export { formatArs, parseArs, pctChange, type FormatArsOptions } from './currency.js';
export { toE164, isValidArPhone, formatArPhone } from './phone.js';
export { isValidDni, formatDni } from './dni.js';
export {
  parseArDate,
  formatArDate,
  getFixedHoliday,
  isNonWorkingDay,
} from './dates.js';
