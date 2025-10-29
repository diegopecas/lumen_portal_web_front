import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface MensajePortal {
    success: boolean;
    mensaje: string;
    tipo: string;
    ip_cliente: string;
    razon?: string;
}

@Injectable({
    providedIn: 'root'
})
export class PortalMensajesService {
    private apiUrl = environment.apiUrl + '/portal/mensaje-visitante';

    constructor(private http: HttpClient) { }

    obtenerMensajeVisitante(): Observable<MensajePortal> {
        return this.http.get<MensajePortal>(this.apiUrl).pipe(
            tap(response => {
                console.log('Mensaje portal recibido:', response);
            }),
            catchError(error => {
                console.error('Error obteniendo mensaje portal:', error);
                return of({
                    success: true,
                    mensaje: '¡Bienvenido a Lumen! 🌟 Descubre nuestros programas educativos.',
                    tipo: 'fallback_local',
                    razon: 'error_red',
                    ip_cliente: '0.0.0.0'
                });
            })
        );
    }
}
