import { Injectable, isDevMode } from '@angular/core'
import {
  TranslocoMissingHandler,
  TranslocoMissingHandlerData,
} from '@jsverse/transloco'
import locizer from 'locizer'
import { locizeConfig } from './locize.config'

// Initialise locizer once. The apiKey is only attached in dev so that
// production builds never ship a write-enabled credential.
locizer.init({
  projectId: locizeConfig.projectId,
  apiKey: isDevMode() ? locizeConfig.apiKey : undefined,
  version: locizeConfig.version,
  cdnType: locizeConfig.cdnType,
})

/**
 * TranslocoMissingHandler that pushes missing keys back to Locize so
 * translators can fill them in. Only writes when the missing key is
 * requested in the active language that equals the default (reference)
 * language — avoids pushing target-language gaps that translators would
 * resolve naturally.
 */
@Injectable({ providedIn: 'root' })
export class LocizeMissingTranslationHandler implements TranslocoMissingHandler {
  handle(key: string, data: TranslocoMissingHandlerData): string {
    if (data.activeLang === data.defaultLang) {
      locizer.add(locizeConfig.namespace, key, key)
    }
    return key
  }
}
