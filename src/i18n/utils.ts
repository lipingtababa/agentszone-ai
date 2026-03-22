import { ui, defaultLang } from './ui';
import type { Lang, TranslationKey } from './ui';

export function getLang(locale: string | undefined): Lang {
  if (locale === 'en') return 'en';
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: TranslationKey, vars?: Record<string, string | number>): string {
    let str = ui[lang][key] as string;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        str = str.replace(`{${k}}`, String(v));
      }
    }
    return str;
  };
}

export function localePath(lang: Lang, path: string): string {
  if (lang === 'zh') return path;
  if (path === '/') return '/en';
  return '/en' + path;
}

export function alternatePath(currentPath: string, currentLang: Lang): string {
  if (currentLang === 'zh') {
    return '/en' + (currentPath === '/' ? '' : currentPath);
  }
  const stripped = currentPath.replace(/^\/en/, '');
  return stripped || '/';
}
