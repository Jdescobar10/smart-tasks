import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { RemoteConfigService } from './core/services/remote-config.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(private remoteConfigService: RemoteConfigService) {}

  async ngOnInit() {
    await this.remoteConfigService.initialize();
  }
}