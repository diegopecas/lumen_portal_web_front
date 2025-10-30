import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AnalyticsService } from './services/analytics.service';
import { ConfiguracionService } from './services/configuracion.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Liceo Lumen';

  constructor(
    private analyticsService: AnalyticsService,
    private configuracionService: ConfiguracionService
  ) {}

  ngOnInit(): void {
    this.inicializarGoogleAnalytics();
  }

  /**
   * Inicializar Google Analytics obteniendo el ID desde el backend
   */
  private inicializarGoogleAnalytics(): void {
    this.configuracionService.obtenerConfiguracionesPublicas().subscribe({
      next: (response) => {
        if (response.success && response.configuraciones.google_analytics_id) {
          const analyticsId = response.configuraciones.google_analytics_id;
          console.log("inicializarGoogleAnalytics",analyticsId )
          this.analyticsService.initialize(analyticsId);
        } else {
          console.warn('⚠️ No se pudo obtener el Google Analytics ID desde la configuración');
        }
      },
      error: (error) => {
        console.error('❌ Error obteniendo configuraciones:', error);
      }
    });
  }
}