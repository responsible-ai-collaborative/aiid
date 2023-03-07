import * as React from "react";

export const LocaleContext: React.Context<string>;
export function LocaleProvider({ children, pageContext: { locale }, }: {
  children: any;
  pageContext: {
    locale?: string;
  };
}): JSX.Element;
export function MdxLink({ href, children, ...props }: {
  [x: string]: any;
  href: any;
  children: any;
}): JSX.Element;
export function LocalizedLink({ to, language, ...props }: {
  [x: string]: any;
  to: any;
  language: any;
}): JSX.Element;
export function LocalizedRouter({ basePath, children, ...props }: {
  [x: string]: any;
  basePath: any;
  children: any;
}): JSX.Element;
export function LocalesList(): JSX.Element;
export function localizedPath({ defaultLang, prefixDefault, locale, path }: {
  defaultLang: any;
  prefixDefault: any;
  locale: any;
  path: any;
}): any;
export function useLocalization(): {
  locale: string;
  defaultLang: any;
  prefixDefault: any;
  config: any;
  localizedPath: typeof localizedPath;
};

