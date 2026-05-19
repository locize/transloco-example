/**
 * Locize project configuration.
 *
 * The values below point at a public demo project so that this example
 * works out of the box. For your own project, replace them with your own
 * `projectId` (and an `apiKey` if you want to push missing keys back to
 * Locize from dev — never bundle the apiKey in production).
 *
 * Sign up at https://www.locize.com/?from=transloco-example
 */
export const locizeConfig = {
  projectId: '18a555a3-2dfa-4ded-b6d0-b50b02bd6bcb',
  // Optional. Only required if you want `saveMissing` to push new reference
  // keys to Locize from this dev build. Strip on production.
  apiKey: '3a03f975-633b-405f-94b9-6e72a16f6092',
  // Published Locize version to load. 'latest' is the default published version.
  version: 'latest',
  // Translation namespace. Matches the file name in your Locize project.
  namespace: 'translation',
  // CDN endpoint your Locize project lives on:
  //   'standard' → https://api.lite.locize.app — BunnyCDN, free for
  //                generous monthly volumes, 1-hour cache, public-only.
  //                Default for newly created Locize projects.
  //   'pro'      → https://api.locize.app — CloudFront, paid, supports
  //                private downloads, custom caching, namespace backups.
  // The shipped demo project is on the Pro CDN.
  // See https://www.locize.com/docs/integration/cdn-types-standard-vs-pro
  cdnType: 'pro' as const,
} as const

/** Locize CDN host derived from `cdnType`. */
export const locizeHost =
  locizeConfig.cdnType === 'pro'
    ? 'https://api.locize.app'
    : 'https://api.lite.locize.app'
