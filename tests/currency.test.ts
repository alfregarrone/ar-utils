import { describe, it, expect } from 'vitest';
import { formatArs, parseArs, pctChange } from '../src/currency.js';

describe('formatArs', () => {
  it('usa punto de miles y coma decimal', () => {
    const out = formatArs(1234567.891);
    expect(out.startsWith('$')).toBe(true);
    expect(out).toContain('1.234.567');
    expect(out).toContain(',89');
  });

  it('permite ocultar el símbolo y fijar decimales', () => {
    expect(formatArs(1234567, { symbol: false })).toBe('1.234.567,00');
    expect(formatArs(0, { decimals: 0 })).toBe('$ 0');
  });

  it('maneja valores no finitos', () => {
    expect(formatArs(Number.NaN)).toBe('$ —');
    expect(formatArs(Number.POSITIVE_INFINITY, { symbol: false })).toBe('—');
  });

  it('abrevia en modo compacto', () => {
    const out = formatArs(2_500_000, { compact: true });
    expect(out.length).toBeLessThan(12);
    expect(out.startsWith('$')).toBe(true);
  });
});

describe('parseArs', () => {
  it('interpreta el formato argentino', () => {
    expect(parseArs('$ 1.234.567,89')).toBe(1234567.89);
    expect(parseArs('1234,5')).toBe(1234.5);
    expect(parseArs('-2.000')).toBe(-2000);
  });

  it('acepta números tal cual', () => {
    expect(parseArs(42)).toBe(42);
    expect(parseArs(Number.NaN)).toBeNull();
  });

  it('devuelve null con basura', () => {
    expect(parseArs('no es plata')).toBeNull();
    expect(parseArs('')).toBeNull();
    expect(parseArs(null)).toBeNull();
  });

  it('es inverso de formatArs', () => {
    expect(parseArs(formatArs(98765.43))).toBe(98765.43);
  });
});

describe('pctChange', () => {
  it('calcula la variación porcentual', () => {
    expect(pctChange(100, 125)).toBe(25);
    expect(pctChange(200, 100)).toBe(-50);
  });

  it('devuelve null si la base es cero o inválida', () => {
    expect(pctChange(0, 10)).toBeNull();
    expect(pctChange(Number.NaN, 10)).toBeNull();
  });
});
