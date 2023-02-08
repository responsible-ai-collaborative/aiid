# gatsby-theme-i18n

A Gatsby theme for providing internationalization support to your Gatsby site by taking in a configuration file and creating prefixed, enriched pages for each language (including client-only pages that have a matchPath). Also adds `<link rel="alternate" />` tags to your `<head>`, exposes useful React components and hooks.

## Installation

1. Install `gatsby-theme-i18n`:

   ```shell
   npm install gatsby-theme-i18n gatsby-plugin-react-helmet react-helmet
   ```

2. Add the configuration to your `gatsby-config.js` file:

   ```js:title=gatsby-config.js
   module.exports = {
     plugins: [
       {
         resolve: `gatsby-theme-i18n`,
         options: {
           defaultLang: `en`,
           configPath: require.resolve(`./i18n/config.json`),
         },
       },
     ],
   }
   ```

3. Create the folder `i18n` at the root of your project and create a file called `config.json` in it.

4. Add your locales to the config file and fill out this information:

   - `code`: The ISO 3166-1 alpha-2 code which will be used for the path prefix, as a unique identifier (e.g. for the `defaultLang` option)
   - `hrefLang`: The IETF language tag for the `<html lang="xx-XX" />` attribute. Also used for og tags
   - `name`: The english name of the locale
   - `localName`: The local name of the locale
   - `langDir`: The direction of language (e.g. "ltr", "rtl")
   - `dateFormat`: The tokens that [Moment.js](https://momentjs.com/docs/#/parsing/string-format/) accepts for date formatting. This can be used for dates on GraphQL queries

   Example config of English and German:

   ```json
   [
     {
       "code": "en",
       "hrefLang": "en-US",
       "name": "English",
       "localName": "English",
       "langDir": "ltr",
       "dateFormat": "MM/DD/YYYY"
     },
     {
       "code": "de",
       "hrefLang": "de-DE",
       "name": "German",
       "localName": "Deutsch",
       "langDir": "ltr",
       "dateFormat": "DD.MM.YYYY"
     }
   ]
   ```

5. Add a suffix/postfix to your MDX filenames, e.g. if you have your blogposts at `content/posts/my-title/index.mdx` you'll need to copy that file and place it with `index.de.mdx` in the same folder.

## Usage

By adding a suffix/postfix in your filenames you can define the locale that the document is in.

You can also see an [official example](https://github.com/gatsbyjs/themes/tree/master/starters/example-i18n) to learn more.

### Theme options

| Key             | Default Value | Description                                                                                                                               |
| --------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `defaultLang`   | `en`          | The locale that is your default language. For this language no prefixed routes will be created unless you set the option `prefixDefault`. |
| `prefixDefault` | `false`       | All routes will be prefixed, including the `defaultLang`                                                                                  |
| `configPath`    | none          | Path to the config file                                                                                                                   |
| `locales`       | `null`        | A string of locales (divided by spaces) to only build a subset of the locales defined in `configPath`, e.g. `en de`                       |

You can pass additional options in as they'll be forwarded to the plugin. You can query all options in GraphQL on the `themeI18N` type.

### Available React components/hooks

The theme also exports a couple of components and hooks that you could use in your project.

#### useLocalization

The theme saves its information into a custom `themeI18N` graphql type which you can access via the `useLocalization` hook. Furthermore, you're able to ask for the current locale via React context.

Example:

```js
import * as React from "react"
import { useLocalization } from "gatsby-theme-i18n"

const Example = () => {
  const { locale, config, defaultLang } = useLocalization()

  return (
    <div>
      <div>Current locale: {locale}</div>
      <div>Current defaultLang: {defaultLang}</div>
      <pre>{JSON.stringify(config, null, 2)}</pre>
    </div>
  )
}

export default Example
```

#### LocalesList

You can display all available locales via the `localesList` component.

Example:

```js
import * as React from "react"
import { LocalesList } from "gatsby-theme-i18n"

const Example = () => {
  return (
    <div>
      <LocalesList />
    </div>
  )
}

export default Example
```

#### LocalizedLink

This is a wrapper around the `Link` component from `gatsby` and is transforming links to the correct path by accessing the current locale via React context.

Example:

```js
import * as React from "react"
import { LocalizedLink as Link } from "gatsby-theme-i18n"

const Example = () => {
  return (
    <div>
      <Link to="/page-2/">Link to second page</Link>
    </div>
  )
}

export default Example
```

#### LocalizedRouter

Provides a `<Router />` from `@reach/router` that prefixes the `basePath` prop with the current locale.

Example:

```js
import * as React from "react"
import { LocalizedRouter } from "gatsby-theme-i18n"
import Detail from "../components/detail"

const App = () => {
  return (
    <LocalizedRouter basePath="/app">
      <Detail path="/:id" />
    </LocalizedRouter>
  )
}

export default App
```

#### MdxLink

This is a component specifically for MDX to replace the normal anchor tag. This way local links to other files are automatically localized (as it uses `LocalizedLink` behind the scenes).

Example:

```js
import * as React from "react"
import { MDXProvider } from "@mdx-js/react"
import { MdxLink } from "gatsby-theme-i18n"

const components = {
  a: MdxLink,
}

const Layout = ({ children }) => {
  return (
    <React.Fragment>
      <main>
        <MDXProvider components={components}>{children}</MDXProvider>
      </main>
    </React.Fragment>
  )
}

export default Layout
```

#### LocaleContext / LocaleProvider

You can also directly access the `LocaleContext` and `LocaleProvider` from the theme.

Example:

```js
import * as React from "react"
import { LocaleContext } from "gatsby-theme-i18n"

const Example = () => {
  const locale = React.useContext(LocaleContext)

  return <div>Locale: {locale}</div>
}

export default Example
```
