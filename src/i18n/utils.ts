import { ui } from "./ui";

// Objeto que define los idiomas disponibles
export const LANGUAGES = {
  en: "English",
  es: "Español",
};

// Idioma por defecto
export const DEFAULT_LANG = "es";

// Tipo que representa las claves del objeto 'ui'
export type UiType = keyof typeof ui;

// Función para obtener el idioma desde la URL
export function getLangFromUrl(url: URL) {
  // Divide la URL por "/"
  const [, lang] = url.pathname.split("/");
  // Si el idioma existe en el objeto 'ui', retorna ese idioma
  if (lang in ui) return lang as UiType;
  // Si no, retorna el idioma por defecto
  return DEFAULT_LANG;
}

// Función que retorna otra función para traducir las claves de 'ui'
export function useTranslations(lang?: UiType) {
  return function t(
    key: keyof (typeof ui)[typeof DEFAULT_LANG],
    ...args: any[]
  ) {
    // Obtiene la traducción del idioma especificado o del idioma por defecto
    let translation = ui[lang ?? DEFAULT_LANG][key] || ui[DEFAULT_LANG][key];
    // Si hay argumentos, reemplaza los marcadores en la traducción con esos argumentos
    if (args.length > 0) {
      for (let i = 0; i < args.length; i++) {
        translation = translation.replace(`{${i}}`, args[i]);
      }
    }
    return translation;
  };
}

// Función para verificar si la ruta está en el idioma especificado
export function pathNameIsInLanguage(pathname: string, lang: UiType) {
  // Retorna true si la ruta comienza con el idioma especificado o si es el idioma por defecto y la ruta no comienza con ningún idioma
  return pathname.startsWith(`/${lang}`) || (lang === DEFAULT_LANG && !pathNameStartsWithLanguage(pathname));
}

// Función auxiliar para verificar si la ruta comienza con un idioma
function pathNameStartsWithLanguage(pathname: string) {
  let startsWithLanguage = false;
  const languages = Object.keys(LANGUAGES);

  for (let i = 0; i < languages.length; i++) {
    const lang = languages[i];
    // Si la ruta comienza con algún idioma, retorna true
    if (pathname.startsWith(`/${lang}`)) {
      startsWithLanguage = true;
      break;
    }
  }

  return startsWithLanguage;
}

// Función para obtener la ruta localizaba según el idioma
export function getLocalizedPathname(pathname: string, lang: UiType) {
  if (pathNameStartsWithLanguage(pathname)) {
    // Si la ruta comienza con un idioma, reemplaza el idioma en la ruta
    const availableLanguages = Object.keys(LANGUAGES).join('|');
    const regex = new RegExp(`^\/(${availableLanguages})`);
    return pathname.replace(regex, `/${lang}`);
  }
  // Si no, añade el idioma al comienzo de la ruta
  return `/${lang}${pathname}`;
}
