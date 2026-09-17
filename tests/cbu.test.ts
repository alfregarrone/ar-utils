import { describe, it, expect } from 'vitest';
import { isValidCbu, parseCbu, isValidAliasCbu } from '../src/cbu.js';

/**
 * Construye un CBU válido calculando los verificadores de forma independiente,
 * para no testear la implementación contra sí misma.
 */
function buildCbu(bank: string, branch: string, account: string): string {
  const dv = (digits: string, weights: number[]) =>
    (10 -
      (digits
        .split('')
        .reduce((acc, d, i) => acc + Number(d) * weights[i], 0) %
        10)) %
    10;

  const block1Base = `${bank}${branch}`;
  const block1 = `${block1Base}${dv(block1Base, [7, 1, 3, 9, 7, 1, 3])}`;
  const block2 = `${account}${dv(account, [3, 9, 7, 1, 3, 9, 7, 1, 3, 9, 7, 1, 3])}`;

  return `${block1}${block2}`;
}

const VALID = buildCbu('017', '0099', '0000067797151');

describe('isValidCbu', () => {
  it('acepta un CBU con verificadores correctos', () => {
    expect(VALID).toHaveLength(22);
    expect(isValidCbu(VALID)).toBe(true);
  });

  it('ignora espacios y guiones', () => {
    const spaced = `${VALID.slice(0, 8)} ${VALID.slice(8)}`;
    expect(isValidCbu(spaced)).toBe(true);
  });

  it('rechaza longitudes incorrectas y valores vacíos', () => {
    expect(isValidCbu('0170099220000067797')).toBe(false);
    expect(isValidCbu('')).toBe(false);
    expect(isValidCbu(undefined)).toBe(false);
  });

  it('rechaza si se altera un dígito del primer bloque', () => {
    const broken = `${((Number(VALID[0]) + 1) % 10).toString()}${VALID.slice(1)}`;
    expect(isValidCbu(broken)).toBe(false);
  });

  it('rechaza si se altera un dígito del segundo bloque', () => {
    const idx = 10;
    const broken =
      VALID.slice(0, idx) + ((Number(VALID[idx]) + 1) % 10).toString() + VALID.slice(idx + 1);
    expect(isValidCbu(broken)).toBe(false);
  });
});

describe('parseCbu', () => {
  it('descompone banco, sucursal y cuenta', () => {
    expect(parseCbu(VALID)).toEqual({
      bank: '017',
      branch: '0099',
      account: '0000067797151',
    });
  });

  it('devuelve null para un CBU inválido', () => {
    expect(parseCbu('1234')).toBeNull();
  });
});

describe('isValidAliasCbu', () => {
  it('acepta alias de 6 a 20 caracteres', () => {
    expect(isValidAliasCbu('pesito.ahorro.ar')).toBe(true);
    expect(isValidAliasCbu('corx-dev_01')).toBe(true);
  });

  it('rechaza cortos, largos, con espacios o vacíos', () => {
    expect(isValidAliasCbu('corto')).toBe(false);
    expect(isValidAliasCbu('a'.repeat(21))).toBe(false);
    expect(isValidAliasCbu('con espacio')).toBe(false);
    expect(isValidAliasCbu('')).toBe(false);
  });
});
