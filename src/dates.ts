/**
 * Fechas en formato argentino (dd/mm/aaaa) y feriados nacionales.
 *
 * `new Date('03/04/2026')` interpreta 4 de marzo en runtimes con locale
 * estadounidense. Acá siempre es 3 de abril.
 */

/**
 * Parsea una fecha escrita como dd/mm/aaaa (o dd-mm-aaaa).
 * Devuelve `null` si la fecha no existe (ej. 31/02/2026).
 *
 * @example
 * parseArDate('03/04/2026') // 3 de abril de 2026
 */
export function parseArDate(value: string | null | undefined): Date | null {
  if (!value) return null;

  const match = value.trim().match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})$/);
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  let year = Number(match[3]);
  if (year < 100) year += year < 50 ? 2000 : 1900;

  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

/**
 * Formatea una fecha como dd/mm/aaaa.
 *
 * @example
 * formatArDate(new Date(2026, 3, 3)) // '03/04/2026'
 */
export function formatArDate(date: Date | null | undefined): string | null {
  if (!date || Number.isNaN(date.getTime())) return null;
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${date.getFullYear()}`;
}

/** Feriados nacionales de fecha fija (inamovibles). */
const FIXED_HOLIDAYS: Array<{ month: number; day: number; name: string }> = [
  { month: 1, day: 1, name: 'Año Nuevo' },
  { month: 3, day: 24, name: 'Día Nacional de la Memoria por la Verdad y la Justicia' },
  { month: 4, day: 2, name: 'Día del Veterano y de los Caídos en la Guerra de Malvinas' },
  { month: 5, day: 1, name: 'Día del Trabajador' },
  { month: 5, day: 25, name: 'Día de la Revolución de Mayo' },
  { month: 6, day: 20, name: 'Paso a la Inmortalidad del General Manuel Belgrano' },
  { month: 7, day: 9, name: 'Día de la Independencia' },
  { month: 12, day: 8, name: 'Inmaculada Concepción de María' },
  { month: 12, day: 25, name: 'Navidad' },
];

/**
 * Devuelve el nombre del feriado nacional de fecha fija, o `null`.
 *
 * Limitación: sólo cubre feriados inamovibles. Los trasladables y los puentes
 * turísticos se definen por decreto cada año y no están incluidos.
 *
 * @example
 * getFixedHoliday(new Date(2026, 6, 9)) // 'Día de la Independencia'
 */
export function getFixedHoliday(date: Date): string | null {
  const found = FIXED_HOLIDAYS.find(
    (h) => h.month === date.getMonth() + 1 && h.day === date.getDate(),
  );
  return found ? found.name : null;
}

/** `true` si la fecha cae sábado, domingo o feriado nacional inamovible. */
export function isNonWorkingDay(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6 || getFixedHoliday(date) !== null;
}
