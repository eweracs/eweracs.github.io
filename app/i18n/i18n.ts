import translations from "./translations.json";

export type Lang = keyof typeof translations;

type Dict = (typeof translations)[Lang];

function getByPath(obj: any, path: string): string | undefined {
  return path.split(".").reduce((acc, part) => (acc ? acc[part] : undefined), obj);
}

export function t(lang: Lang, key: string, vars?: Record<string, string>): string {
  const dict = translations[lang] as Dict;
  const fallback = translations.EN as Dict;

  const raw =
    getByPath(dict, key) ??
    getByPath(fallback, key) ??
    key; // if missing, show the key so you notice

  if (!vars) return raw;

  return Object.entries(vars).reduce(
    (s, [k, v]) => s.replaceAll(`{${k}}`, v),
    raw
  );
}