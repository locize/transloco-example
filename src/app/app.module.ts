import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injectable } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Translation, TRANSLOCO_LOADER, TranslocoLoader, TRANSLOCO_CONFIG, TranslocoConfig, TranslocoModule, TranslocoMissingHandler, TRANSLOCO_MISSING_HANDLER } from '@ngneat/transloco';
import { environment } from '../environments/environment';

// locizer is only used here to send the missing keys to locize
import locizer from 'locizer';
locizer.init({
  projectId: environment.locizeProjectId,
  apiKey: !environment.production && environment.locizeApiKey, // only needed if you want to add new keys via locizer - remove on production!
  version: environment.locizeVersion
});

@Injectable({ providedIn: 'root' })
export class TranslocoCustomMissingHandler implements TranslocoMissingHandler {
  handle(key: string, config: TranslocoConfig) {
    if (config['activeLang'] === config.defaultLang) {
      locizer.add(environment.locizeNamespace, key);
    }
    return key;
  }
}

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string) {
    return this.http.get<Translation>(`https://api.locize.app/${environment.locizeProjectId}/${environment.locizeVersion}/${lang}/${environment.locizeNamespace}`);
  }
}


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslocoModule
  ],
  providers: [
    { provide: TRANSLOCO_MISSING_HANDLER, useClass: TranslocoCustomMissingHandler },
    { provide: TRANSLOCO_LOADER, useClass: TranslocoHttpLoader },
    {
      provide: TRANSLOCO_CONFIG,
      useValue: {
        availableLangs: ["en", "de"],
        reRenderOnLangChange: true,
        fallbackLang: "de",
        defaultLang: "en"
      } as TranslocoConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
