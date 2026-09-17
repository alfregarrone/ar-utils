import { describe, it, expect } from 'vitest';
import { isValidCuit, isValidCuil, formatCuit, cuitCheckDigit, cuitFromDni } from '../src/cuit.js';

describe('cuitCheckDigit', () => {
  it('calcula el dígito verificador', () => {
    expect(cuitCheckDigit('2012345678')).toBe(cuitCheckDigit('20-12345678'));
    expect(typeof cuitCheckDigit('2012345678')).toBe('number');
  });

  it('rechaza longitudes distintas de 10', () => {
    expect(() => cuitCheckDigit('123')).toThrow();
  });
});

describe('isValidCuit', () => {
  it('acepta un CUIT generado correctamente', () => {
    const cuit = cuitFromDni('12345678', '20') as string;
    expect(isValidCuit(cuit)).toBe(true);
  });

  it('acepta con y sin guiones', () => {
    const cuit = cuitFromDni('30123456', '27') as string;
    expect(isValidCuit(cuit)).toBe(true);
    expect(isValidCuit(cuit.replace(/-/g, ''))).toBe(true);
  });

  it('rechaza dígito verificador incorrecto', () => {
    const cuit = cuitFromDni('12345678', '20') as string;
    const last = Number(cuit.slice(-1));
    const wrong = `${cuit.slice(0, -1)}${(last + 1) % 10}`;
    expect(isValidCuit(wrong)).toBe(false);
  });

  it('rechaza prefijos inválidos, repetidos, vacíos y longitudes erróneas', () => {
    expect(isValidCuit('99-12345678-1')).toBe(false);
    expect(isValidCuit('00000000000')).toBe(false);
    expect(isValidCuit('')).toBe(false);
    expect(isValidCuit(null)).toBe(false);
    expect(isValidCuit('2012345678')).toBe(false);
  });

  it('isValidCuil es el mismo algoritmo', () => {
    expect(isValidCuil).toBe(isValidCuit);
  });
});

describe('formatCuit', () => {
  it('formatea XX-XXXXXXXX-X', () => {
    const cuit = cuitFromDni('12345678', '20') as string;
    expect(formatCuit(cuit.replace(/-/g, ''))).toBe(cuit);
  });

  it('devuelve null si es inválido', () => {
    expect(formatCuit('123')).toBeNull();
  });
});

describe('cuitFromDni', () => {
  it('completa DNIs de 7 dígitos con cero', () => {
    const cuit = cuitFromDni('1234567', '27') as string;
    expect(cuit.startsWith('27-01234567-')).toBe(true);
    expect(isValidCuit(cuit)).toBe(true);
  });

  it('rechaza DNIs fuera de rango', () => {
    expect(cuitFromDni('123', '20')).toBeNull();
    expect(cuitFromDni('123456789', '20')).toBeNull();
  });
});
