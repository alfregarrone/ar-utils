import { describe, it, expect } from 'vitest';
import { toE164, isValidArPhone, formatArPhone } from '../src/phone.js';

describe('toE164', () => {
  it('normaliza las formas más comunes de un celular de CABA', () => {
    const esperado = '+5491134567890';
    expect(toE164('011 15-3456-7890')).toBe(esperado);
    expect(toE164('+54 9 11 3456-7890')).toBe(esperado);
    expect(toE164('5491134567890')).toBe(esperado);
    expect(toE164('1134567890')).toBe(esperado);
    expect(toE164('0054 9 11 3456 7890')).toBe(esperado);
  });

  it('reconoce áreas de tres dígitos', () => {
    expect(toE164('351 555 1234')).toBe('+543515551234'.replace('+54', '+549'));
    expect(toE164('0341 15 444 5566')).toBe('+5493414445566');
  });

  it('permite pedir formato de línea fija', () => {
    expect(toE164('011 4567-8900', { mobile: false })).toBe('+541145678900');
  });

  it('devuelve null con entradas inválidas', () => {
    expect(toE164('123')).toBeNull();
    expect(toE164('')).toBeNull();
    expect(toE164(null)).toBeNull();
    expect(toE164('11 3456 78901234')).toBeNull();
  });
});

describe('isValidArPhone', () => {
  it('coincide con toE164', () => {
    expect(isValidArPhone('011 15-3456-7890')).toBe(true);
    expect(isValidArPhone('abc')).toBe(false);
  });
});

describe('formatArPhone', () => {
  it('devuelve un formato legible', () => {
    expect(formatArPhone('+5491134567890')).toBe('+54 9 11 3456-7890');
  });

  it('devuelve null si no se puede normalizar', () => {
    expect(formatArPhone('123')).toBeNull();
  });
});
