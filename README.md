# Transloco + [Locize](https://www.locize.com/?from=transloco-example) example

A minimal Angular 21 sample showing how to load translations from
[Locize](https://www.locize.com/?from=transloco-example) into
[Transloco](https://jsverse.gitbook.io/transloco) and push missing keys
back via a custom `TranslocoMissingHandler` — analogous to i18next's
`saveMissing`.

Stack: Angular 21 · `@jsverse/transloco` 8 · [locizer](https://github.com/locize/locizer)
6 · TypeScript 5.9 · standalone components, signals, control-flow templates.

## Getting started

1. Create a user account and a project at <https://www.locize.com/?from=transloco-example>,
   then copy your project id and an API key from the developer page.
2. Either set the values directly in
   [`src/app/locize.config.ts`](src/app/locize.config.ts), or keep the
   shipped demo-project credentials to try it out first (those are
   intentionally public — every visitor hits the same demo).
3. `npm install && npm run start` and <http://localhost:4200> opens.

## What's in this example

### Loading translations — custom `TranslocoLoader`

The Locize CDN serves translations at
`https://{host}/{projectId}/{version}/{lang}/{namespace}`.
[`TranslocoHttpLoader`](src/app/transloco-http-loader.ts) builds that
URL from the values in [`locize.config.ts`](src/app/locize.config.ts)
and calls `HttpClient.get` to fetch each language:

```ts
@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private readonly http = inject(HttpClient)

  getTranslation(lang: string) {
    return this.http.get<Translation>(
      `${locizeHost}/${locizeConfig.projectId}/${locizeConfig.version}/${lang}/${locizeConfig.namespace}`,
    )
  }
}
```

Wired in [`app.config.ts`](src/app/app.config.ts) via
`provideTransloco({ loader, config })`:

```ts
provideTransloco({
  config: {
    availableLangs: ['en', 'de'],
    defaultLang: 'en',
    fallbackLang: 'de',
    reRenderOnLangChange: true,
    prodMode: !isDevMode(),
  },
  loader: TranslocoHttpLoader,
})
```

### Pushing missing keys back — `TranslocoMissingHandler` + `locizer`

[`LocizeMissingTranslationHandler`](src/app/transloco-missing-translation-handler.ts)
calls `locizer.add(namespace, key, value)` whenever Transloco hits a key
that isn't in the loaded JSON. The handler only writes when the active
language equals the default (reference) language — avoiding pushes for
target-language gaps that translators resolve naturally. `locizer` is
initialised once at module load with the apiKey **only in dev** —
production builds never carry the write-enabled credential.

```ts
locizer.init({
  projectId: locizeConfig.projectId,
  apiKey: isDevMode() ? locizeConfig.apiKey : undefined,
  version: locizeConfig.version,
  cdnType: locizeConfig.cdnType,
})

@Injectable({ providedIn: 'root' })
export class LocizeMissingTranslationHandler implements TranslocoMissingHandler {
  handle(key: string, config: TranslocoConfig): string {
    if (config.activeLang === config.defaultLang) {
      locizer.add(locizeConfig.namespace, key, key)
    }
    return key
  }
}
```

Registered via `provideTranslocoMissingHandler(LocizeMissingTranslationHandler)`.

### Locize CDN endpoint

Locize ships two CDN infrastructures (full comparison at
[CDN types: Standard vs. Pro](https://www.locize.com/docs/integration/cdn-types-standard-vs-pro?from=transloco-example)):

- **Standard CDN** at `api.lite.locize.app` — BunnyCDN-backed, free for
  generous monthly volumes, 1-hour fixed cache, public-only. Default
  for newly created Locize projects.
- **Pro CDN** at `api.locize.app` — CloudFront-backed, paid, supports
  private downloads, custom caching, namespace backups.

Both serve the same URL shape. The example picks the host from
`cdnType` in [`src/app/locize.config.ts`](src/app/locize.config.ts) (the
shipped demo project lives on the Pro CDN).

## Scripts

| Command | What it does |
| --- | --- |
| `npm start` | Dev server at <http://localhost:4200> with HMR |
| `npm run build` | Production build into `dist/` |
| `npm run watch` | Development build, rebuilt on source changes |

## Related

- [Transloco documentation](https://jsverse.gitbook.io/transloco)
- [Locize platform docs](https://www.locize.com/docs?from=transloco-example)
- [`locizer`](https://github.com/locize/locizer) — lightweight client for Locize
- ngx-translate alternative:
  [ngx-translate-example](https://github.com/locize/ngx-translate-example)
- Angular + i18next alternative:
  [angular-i18next](https://github.com/Romanchuk/angular-i18next),
  [Locize Angular tutorial](https://www.locize.com/blog/angular-i18next?from=transloco-example)
