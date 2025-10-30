import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ConfiguracionesPublicas {
  google_analytics_id?: string;
  calendly_url?: string;
  honeypot_enabled?: boolean;
  [key: string]: any;
}

export interface ConfiguracionResponse {
  success: boolean;
  configuraciones: ConfiguracionesPublicas;
}

export interface ContactoInfo {
  correos: string[];
  telefono: string;
  whatsapp: string;
  horarios: {
    lunesViernes: string;
    extendido: string;
    sabados: string;
  };
  ubicacion: {
    direccion: string;
    mapsUrl: string;
  };
  redesSociales: {
    instagram: string;
    facebook: string;
  };
}

export interface ContactoResponse {
  success: boolean;
  contacto: ContactoInfo;
}

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {
  private apiUrl = environment.apiUrl + '/configuraciones';

  constructor(private http: HttpClient) { }

  /**
   * Obtener configuraciones públicas del portal
   */
  obtenerConfiguracionesPublicas(): Observable<ConfiguracionResponse> {
    return this.http.get<ConfiguracionResponse>(`${this.apiUrl}/publicas`).pipe(
      tap(response => {
        console.log('✅ Configuraciones públicas obtenidas:', response);
      }),
      catchError(error => {
        console.error('❌ Error obteniendo configuraciones públicas:', error);
        return of({
          success: false,
          configuraciones: {}
        });
      })
    );
  }

  /**
   * Obtener configuraciones de contacto
   */
  obtenerConfiguracionesContacto(): Observable<ContactoResponse> {
    return this.http.get<ContactoResponse>(`${this.apiUrl}/contacto`).pipe(
      tap(response => {
        console.log('✅ Configuraciones de contacto obtenidas:', response);
      }),
      catchError(error => {
        console.error('❌ Error obteniendo configuraciones de contacto:', error);
        return of({
          success: false,
          contacto: {
            correos: [],
            telefono: '',
            whatsapp: '',
            horarios: {
              lunesViernes: '',
              extendido: '',
              sabados: ''
            },
            ubicacion: {
              direccion: '',
              mapsUrl: ''
            },
            redesSociales: {
              instagram: '',
              facebook: ''
            }
          }
        });
      })
    );
  }
}