import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalMensajesService, MensajePortal } from '../../services/portal-mensajes.service';
import { ThemeService } from '../../services/theme.service';

@Component({
    selector: 'app-portal-message',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './portal-message.component.html',
    styleUrl: './portal-message.component.scss'
})
export class PortalMessageComponent implements OnInit {
    mensaje: MensajePortal | null = null;
    currentTheme: any;
    mostrar = false;

    private readonly STORAGE_KEY_PREFIX = 'ultimo_mensaje_portal_';
    private readonly MINUTOS_ESPERA = 30;

    constructor(
        private portalService: PortalMensajesService,
        private themeService: ThemeService
    ) {
        this.currentTheme = this.themeService.getCurrentTheme();
    }

    ngOnInit() {
        // Obtener mensaje para visitante (sin necesidad de usuario)
        this.portalService.obtenerMensajeVisitante().subscribe({
            next: (response) => {
                this.mensaje = response;
                
                // Verificar si debe mostrar el mensaje usando la IP del backend
                if (this.deberMostrarMensaje(response.ip_cliente)) {
                    this.mostrar = true;
                    this.guardarTimestamp(response.ip_cliente);
                } else {
                    this.mostrar = false;
                    console.log('Mensaje no se muestra - menos de 30 minutos desde el último');
                }
            },
            error: (error) => {
                console.error('Error obteniendo mensaje portal:', error);
                this.mostrar = false;
            }
        });
    }

    /**
     * Verifica si han pasado más de 30 minutos desde el último mensaje para esta IP
     */
    private deberMostrarMensaje(ipCliente: string): boolean {
        const storageKey = this.STORAGE_KEY_PREFIX + ipCliente;
        const ultimoTimestamp = localStorage.getItem(storageKey);
        
        if (!ultimoTimestamp) {
            console.log('No hay registro previo para IP:', ipCliente);
            return true;
        }

        const ultimaFecha = new Date(ultimoTimestamp);
        const ahora = new Date();
        
        const diferenciaMs = ahora.getTime() - ultimaFecha.getTime();
        const diferenciaMinutos = Math.floor(diferenciaMs / (1000 * 60));

        console.log(`IP: ${ipCliente} - Último mensaje hace ${diferenciaMinutos} minutos`);

        return diferenciaMinutos >= this.MINUTOS_ESPERA;
    }

    /**
     * Guarda el timestamp actual en localStorage usando la IP como clave
     */
    private guardarTimestamp(ipCliente: string): void {
        const storageKey = this.STORAGE_KEY_PREFIX + ipCliente;
        const ahora = new Date().toISOString();
        localStorage.setItem(storageKey, ahora);
        console.log(`Timestamp guardado para IP ${ipCliente}:`, ahora);
    }

    getIconoPorTipo(): string {
        if (!this.mensaje) return '✨';

        const iconos: any = {
            'dato_curioso': '🧠',
            'tip_educativo': '💡',
            'mensaje_motivacional': '💪',
            'frase_inspiradora': '⭐',
            'consejo_crianza': '🌱',
            'fallback': '🌟'
        };

        return iconos[this.mensaje.tipo] || '✨';
    }

    getTipoTexto(): string {
        if (!this.mensaje) return '';

        const textos: any = {
            'dato_curioso': 'Dato Curioso',
            'tip_educativo': 'Tip Educativo',
            'mensaje_motivacional': 'Motivación',
            'frase_inspiradora': 'Inspiración',
            'consejo_crianza': 'Consejo',
            'fallback': 'Mensaje de Bienvenida'
        };

        return textos[this.mensaje.tipo] || 'Mensaje';
    }

    cerrar() {
        this.mostrar = false;
    }
}
