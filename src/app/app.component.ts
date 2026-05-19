import { Component, inject, signal } from '@angular/core'
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco'

@Component({
  selector: 'app-root',
  imports: [TranslocoDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private readonly transloco = inject(TranslocoService)
  readonly languages = ['en', 'de'] as const
  readonly activeLang = signal<string>(this.transloco.getActiveLang())

  switchLang(lang: string): void {
    this.transloco.setActiveLang(lang)
    this.activeLang.set(lang)
  }
}
