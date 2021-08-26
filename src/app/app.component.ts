import { Component, OnInit } from "@angular/core";
import { TranslocoService } from "@ngneat/transloco";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor(private service: TranslocoService) {}

  ngOnInit() {
    // this.service
    //   .selectTranslate("title", {}, "admin-page")
    //   .subscribe(console.log);
  }

  change(lang: string) {
    this.service.setActiveLang(lang);
  }
}
