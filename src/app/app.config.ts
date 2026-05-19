import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core'
import { provideHttpClient } from '@angular/common/http'
import {
  provideTransloco,
  provideTranslocoMissingHandler,
} from '@jsverse/transloco'
import { TranslocoHttpLoader } from './transloco-http-loader'
import { LocizeMissingTranslationHandler } from './transloco-missing-translation-handler'

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideTransloco({
      config: {
        availableLangs: ['en', 'de'],
        defaultLang: 'en',
        fallbackLang: 'de',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    provideTranslocoMissingHandler(LocizeMissingTranslationHandler),
  ],
}
