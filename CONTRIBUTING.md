# Contribuir a ar-utils

Gracias por querer aportar. Esta librería crece a partir de casos reales: si una
validación argentina te falta o la resolviste distinto, abrí un issue y contalo.

## Antes de escribir código

- **Bug:** abrí un issue con el caso mínimo que lo reproduce.
- **Función nueva:** abrí un issue primero. La librería se mantiene chica a propósito;
  no todo lo que se puede agregar conviene agregarlo.

## El flujo

```bash
git clone https://github.com/alfregarrone/ar-utils.git
cd ar-utils
npm install
npm test
```

1. Rama desde `main`: `git checkout -b feat/validacion-cuil`
2. Escribí el test **antes** que la implementación. Si no se puede testear, no entra.
3. `npm test` y `npm run typecheck` tienen que pasar.
4. Commits en formato [Conventional Commits](https://www.conventionalcommits.org/es/):
   `feat:`, `fix:`, `docs:`, `test:`, `chore:`.
5. Abrí el PR con la plantilla completa.

## Lo que se espera de una función nueva

- **Cero dependencias.** Es la promesa de la librería.
- **Devuelve `null` ante entrada inválida**, no tira excepción (salvo operaciones de
  bajo nivel donde una entrada mal formada es un error del programador).
- **Documentada con JSDoc**, con al menos un `@example` que se pueda copiar y pegar.
- **Tests que cubran el caso feliz, el borde y la basura**: string vacío, `null`,
  longitud incorrecta, dígito verificador mal.
- **Exportada desde `src/index.ts`** y sumada a la tabla del README.

## Lo que no entra

- Consultas a APIs externas (ARCA, BCRA). Esta librería valida formato, no existencia.
- Datos que se desactualizan: feriados trasladables, cotizaciones, tablas de bancos.
- Helpers genéricos que no tengan nada de argentino.
