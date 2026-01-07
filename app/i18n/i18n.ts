import translations from "./translations.json";

export type Lang = keyof typeof translations;

type Dict = (typeof translations)[Lang];
type TranslationValue = string | string[];

function getByPath(obj: any, path: string): TranslationValue | undefined {
  return path.split(".").reduce((acc, part) => (acc ? acc[part] : undefined), obj);
}

/**
 * Low-level translation getter.
 * Can return either a string or a string[] depending on the JSON value.
 */
export function t(
  lang: Lang,
  key: string,
  vars?: Record<string, string>
): TranslationValue {
  const dict = translations[lang] as Dict;
  const fallback = translations.EN as Dict;

  const raw = getByPath(dict, key) ?? getByPath(fallback, key) ?? key;

  // Only strings support templating like "Hello {name}"
  if (!vars || typeof raw !== "string") return raw;

  return Object.entries(vars).reduce(
    (s, [k, v]) => s.replaceAll(`{${k}}`, v),
    raw
  );
}

/**
 * Strictly returns a string.
 * - If the key points to a list, it joins it (so it won't crash rendering).
 * - If the key is missing, returns the key (same behavior as t()).
 */
export function tString(
  lang: Lang,
  key: string,
  vars?: Record<string, string>
): string {
  const value = t(lang, key, vars);

  if (typeof value === "string") return value;

  // Shouldn't happen for normal copy, but keeps the app resilient.
  return value.join("\n");
}

/**
 * Strictly returns a list of strings.
 * - If the key points to a string, it returns a single-item list.
 * - If missing, returns [] (so list UIs don't show the raw key).
 */
export function tList(lang: Lang, key: string): string[] {
  const value = t(lang, key);

  if (Array.isArray(value)) return value;

  // If missing, t() returns the key string; treat that as "no list"
  if (value === key) return [];

  return [value];
}