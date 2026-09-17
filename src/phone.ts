/**
 * Normalización de teléfonos argentinos.
 *
 * El problema clásico: un mismo número aparece en la base como
 * `011 15-3456-7890`, `+5491134567890`, `0111534567890` o `1134567890`.
 * Para mandar un WhatsApp o un SMS hace falta uno solo: E.164.
 *
 * Limitación conocida: la longitud del código de área se deduce por prefijo
 * usando la tabla de áreas de 2 y 3 dígitos; el resto se asume de 4.
 */

/** Áreas de 2 dígitos (AMBA). */
const AREA_2 = ['11'];

/** Áreas de 3 dígitos más usadas (Córdoba, Rosario, Mendoza, La Plata, etc.). */
const AREA_3 = [
  '220', '221', '223', '230', '236', '237', '249', '260', '261', '263', '264', '266',
  '280', '291', '297', '299', '336', '341', '342', '343', '345', '348', '351', '353',
  '358', '362', '364', '370', '376', '379', '380', '381', '383', '385', '387', '388',
];

function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

function splitArea(national: string): { area: string; subscriber: string } | null {
  if (AREA_2.includes(national.slice(0, 2))) {
    return { area: national.slice(0, 2), subscriber: national.slice(2) };
  }
  if (AREA_3.includes(national.slice(0, 3))) {
    return { area: national.slice(0, 3), subscriber: national.slice(3) };
  }
  if (national.length === 10) {
    return { area: national.slice(0, 4), subscriber: national.slice(4) };
  }
  return null;
}

/**
 * Convierte cualquier forma de escribir un celular argentino a E.164
 * (`+549XXXXXXXXXX`). Devuelve `null` si no parece un número válido.
 *
 * @example
 * toE164('011 15-3456-7890')  // '+5491134567890'
 * toE164('+54 9 11 3456-7890')// '+5491134567890'
 * toE164('351 555 1234')      // '+5493515551234'
 */
export function toE164(value: string | null | undefined, options: { mobile?: boolean } = {}): string | null {
  if (!value) return null;
  const { mobile = true } = options;

  let digits = onlyDigits(value);

  // Prefijo internacional
  if (digits.startsWith('0054')) digits = digits.slice(4);
  else if (digits.startsWith('54')) digits = digits.slice(2);

  // 9 de celular al inicio (después del país)
  if (digits.startsWith('9') && digits.length >= 11) digits = digits.slice(1);

  // 0 de larga distancia nacional
  if (digits.startsWith('0')) digits = digits.slice(1);

  const parts = splitArea(digits);
  if (!parts) return null;

  // 15 de celular después del área
  let subscriber = parts.subscriber;
  if (subscriber.startsWith('15')) subscriber = subscriber.slice(2);

  const national = `${parts.area}${subscriber}`;
  if (national.length !== 10) return null;

  return mobile ? `+549${national}` : `+54${national}`;
}

/** Devuelve `true` si el valor se puede normalizar a un teléfono argentino. */
export function isValidArPhone(value: string | null | undefined): boolean {
  return toE164(value) !== null;
}

/**
 * Formato legible para mostrar en pantalla.
 *
 * @example
 * formatArPhone('+5491134567890') // '+54 9 11 3456-7890'
 */
export function formatArPhone(value: string | null | undefined): string | null {
  const e164 = toE164(value);
  if (!e164) return null;

  const national = e164.slice(4); // saca +549
  const parts = splitArea(national);
  if (!parts) return null;

  const s = parts.subscriber;
  return `+54 9 ${parts.area} ${s.slice(0, s.length - 4)}-${s.slice(-4)}`;
}
