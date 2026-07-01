---
name: TypeScript narrowing lost in nested closures
description: A TS control-flow narrowing quirk that produces "Property 'x' does not exist on type 'never'" for optional-chained values inside .map() callbacks nested in a ternary
---

Pattern that triggers it: `{!someObj ? (<>{list.map(item => (<div className={someObj?.id === item.id ? ... }>))}</>) : ...}` — referencing `someObj?.field` via optional chaining *inside* a `.map()` callback that's nested inside the truthy/falsy branch of a ternary on `someObj`.

TypeScript's control-flow narrowing can mis-resolve the type of `someObj` inside the nested closure to `never` (rather than the expected `null`/narrowed type), producing `TS2339: Property 'x' does not exist on type 'never'`. This is a narrowing limitation, not a real bug — the code is logically correct and runs fine, but `tsc --noEmit` fails.

**Why:** worth remembering because the fix is non-obvious from the error message alone (it looks like a real type mismatch, but the surrounding code is untouched and was working before).

**How to apply:** hoist the optional-chained value to a plain local `const` (e.g. `const selectedId = someObj?.id ?? null;`) before the ternary/map, and reference that const inside the closure instead of re-deriving it from the original narrowed variable.
