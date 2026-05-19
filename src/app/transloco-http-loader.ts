import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Translation, TranslocoLoader } from '@jsverse/transloco'
import { locizeConfig, locizeHost } from './locize.config'

/**
 * Fetches translations for a given language from the Locize CDN.
 *
 * Locize serves translations at
 *   `${locizeHost}/{projectId}/{version}/{lang}/{namespace}`.
 */
@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private readonly http = inject(HttpClient)

  getTranslation(lang: string) {
    return this.http.get<Translation>(
      `${locizeHost}/${locizeConfig.projectId}/${locizeConfig.version}/${lang}/${locizeConfig.namespace}`,
    )
  }
}
