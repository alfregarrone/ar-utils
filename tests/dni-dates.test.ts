import { describe, it, expect } from 'vitest';
import { isValidDni, formatDni } from '../src/dni.js';
import { parseArDate, formatArDate, getFixedHoliday, isNonWorkingDay } from '../src/dates.js';

describe('DNI', () => {
  it('valida 7 y 8 dígitos', () => {
    expect(isValidDni('12.345.678')).toBe(true);
    expect(isValidDni(1234567)).toBe(true);
  });

  it('rechaza fuera de rango y vacíos', () => {
    expect(isValidDni('123')).toBe(false);
    expect(isValidDni('123456789')).toBe(false);
    expect(isValidDni('')).toBe(false);
    expect(isValidDni(null)).toBe(false);
  });

  it('formatea con puntos', () => {
    expect(formatDni('12345678')).toBe('12.345.678');
    expect(formatDni('123')).toBeNull();
  });
});

describe('parseArDate', () => {
  it('lee dd/mm/aaaa sin ambigüedad', () => {
    const date = parseArDate('03/04/2026') as Date;
    expect(date.getDate()).toBe(3);
    expect(date.getMonth()).toBe(3); // abril
    expect(date.getFullYear()).toBe(2026);
  });

  it('acepta guiones y puntos', () => {
    expect(formatArDate(parseArDate('03-04-2026'))).toBe('03/04/2026');
    expect(formatArDate(parseArDate('3.4.2026'))).toBe('03/04/2026');
  });

  it('rechaza fechas que no existen', () => {
    expect(parseArDate('31/02/2026')).toBeNull();
    expect(parseArDate('00/01/2026')).toBeNull();
    expect(parseArDate('hola')).toBeNull();
    expect(parseArDate(null)).toBeNull();
  });
});

describe('feriados', () => {
  it('reconoce feriados inamovibles', () => {
    expect(getFixedHoliday(new Date(2026, 6, 9))).toContain('Independencia');
    expect(getFixedHoliday(new Date(2026, 4, 25))).toContain('Revolución');
  });

  it('devuelve null en un día común', () => {
    expect(getFixedHoliday(new Date(2026, 6, 10))).toBeNull();
  });

  it('marca fines de semana y feriados como no laborables', () => {
    expect(isNonWorkingDay(new Date(2026, 8, 19))).toBe(true); // sábado
    expect(isNonWorkingDay(new Date(2026, 6, 9))).toBe(true); // feriado
    expect(isNonWorkingDay(new Date(2026, 8, 16))).toBe(false); // miércoles
  });
});
