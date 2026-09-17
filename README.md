# ar-utils

> Las validaciones y formatos argentinos que todos reescribimos en cada proyecto: CUIT/CUIL, CBU y alias, pesos, DNI, teléfonos y fechas. Cero dependencias, TypeScript, ESM + CJS.

[![CI](https://github.com/alfredogarrone/ar-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/alfredogarrone/ar-utils/actions)
[![npm](https://img.shields.io/npm/v/ar-utils.svg)](https://www.npmjs.com/package/ar-utils)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Qué problema resuelve

Todo proyecto argentino termina con un `utils.ts` que valida CUIT a ojo, parsea `"$ 1.234,56"` con
un `replace` que falla, y guarda teléfonos en cinco formatos distintos que después no sirven para
mandar un WhatsApp. Esta librería resuelve esas cinco cosas bien, con tests, y sin arrastrar
dependencias.

```bash
npm install ar-utils
```

## Uso

```ts
import { isValidCuit, formatArs, parseArs, toE164, parseArDate } from 'ar-utils';

isValidCuit('30-71234567-8');        // true / false, con o sin guiones
formatArs(1234567.891);              // '$ 1.234.567,89'
parseArs('$ 1.234.567,89');          // 1234567.89
toE164('011 15-3456-7890');          // '+5491134567890'
parseArDate('03/04/2026');           // 3 de abril, no 4 de marzo
```

## API

### CUIT / CUIL

| Función | Devuelve |
|---|---|
| `isValidCuit(value)` · `isValidCuil(value)` | `boolean` — valida módulo 11 y prefijo de tipo |
| `formatCuit(value)` | `'XX-XXXXXXXX-X'` o `null` |
| `cuitCheckDigit(first10)` | El dígito verificador (`number`) |
| `cuitFromDni(dni, '20' \| '23' \| '24' \| '27')` | CUIT armado desde el DNI, o `null` |

### CBU y alias

| Función | Devuelve |
|---|---|
| `isValidCbu(value)` | `boolean` — valida los dos dígitos verificadores |
| `parseCbu(value)` | `{ bank, branch, account }` o `null` |
| `isValidAliasCbu(value)` | `boolean` — 6 a 20 caracteres, reglas del BCRA |

### Pesos

| Función | Devuelve |
|---|---|
| `formatArs(value, { symbol, decimals, compact })` | `'$ 1.234.567,89'` |
| `parseArs(value)` | `number` o `null` |
| `pctChange(from, to)` | Variación porcentual, o `null` |

### Teléfonos

| Función | Devuelve |
|---|---|
| `toE164(value, { mobile })` | `'+5491134567890'` o `null` |
| `isValidArPhone(value)` | `boolean` |
| `formatArPhone(value)` | `'+54 9 11 3456-7890'` o `null` |

### DNI y fechas

| Función | Devuelve |
|---|---|
| `isValidDni(value)` · `formatDni(value)` | `boolean` · `'12.345.678'` |
| `parseArDate(value)` · `formatArDate(date)` | `Date` · `'dd/mm/aaaa'` |
| `getFixedHoliday(date)` · `isNonWorkingDay(date)` | Nombre del feriado · `boolean` |

## Decisiones y limitaciones

- **Cero dependencias a propósito.** Es una librería de utilidades: si arrastra un árbol de
  paquetes, deja de convenir frente a copiar la función.
- **Todo devuelve `null` en lugar de tirar excepción**, salvo `cuitCheckDigit`, que es una
  operación de bajo nivel donde una entrada mal formada es un error del programador.
- **Teléfonos:** las áreas de 2 y 3 dígitos están tabuladas; el resto se asume de 4. Cubre los
  casos reales de una base de clientes, no el plan de numeración completo de ENACOM.
- **Feriados:** sólo los inamovibles. Los trasladables y los puentes turísticos se fijan por
  decreto cada año, así que meterlos en una librería garantiza que quede desactualizada.
- **CUIT:** se valida el dígito verificador y el prefijo de tipo. No se consulta ARCA: un CUIT
  válido no es lo mismo que un CUIT existente y activo.

## Desarrollo

```bash
npm install
npm test          # vitest
npm run typecheck
npm run build     # tsup → ESM + CJS + .d.ts
```

## Licencia

MIT © [Alfredo Garrone](https://github.com/alfredogarrone) — construido en [CORX](https://corxargentina.com).
