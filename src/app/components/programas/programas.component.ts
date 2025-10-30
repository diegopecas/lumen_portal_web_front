import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderWebComponent } from '../../common/header-web/header-web.component';
import { ThemeService, ThemeConfig } from '../../services/theme.service';
import { AnalyticsService } from '../../services/analytics.service';

declare var AOS: any;

interface Programa {
  id: number;
  nombre: string;
  subtitulo: string;
  descripcion: string;
  edades: string;
  horarios: string[];
  caracteristicas: string[];
  icono: string;
  colorFondo: string;
  colorTexto: string;
}

@Component({
  selector: 'app-programas',
  standalone: true,
  imports: [CommonModule, HeaderWebComponent],
  templateUrl: './programas.component.html',
  styleUrl: './programas.component.scss'
})
export class ProgramasComponent implements OnInit {

  public currentTheme!: ThemeConfig;
  public mostrarModal: boolean = false;
  public programaSeleccionado: Programa | null = null;

  public programas: Programa[] = [
    {
      id: 1,
      nombre: 'Baby Lumen',
      subtitulo: 'Los primeros mil días marcan la diferencia',
      descripcion: 'En Baby Lumen entendemos que cada sonrisa, cada movimiento y cada descubrimiento de tu bebé construye conexiones cerebrales que durarán toda la vida.',
      edades: 'Desde los 5 meses a los 3 años',
      horarios: ['Lunes a Viernes: 6:30 AM - 5:30 PM'],
      caracteristicas: [
        'Estimulación temprana basada en evidencia',
        'Cuidado amoroso personalizado',
        'Acompañamiento en cada hito del desarrollo',
        'Ambiente seguro y protegido',
        'Conexiones cerebrales para toda la vida'
      ],
      icono: '👶',
      colorFondo: 'linear-gradient(135deg, #89CFF0 0%, #B0E0E6 100%)',
      colorTexto: '#0066CC'
    },
    {
      id: 2,
      nombre: 'Lumen Kids',
      subtitulo: 'Transformación y crecimiento integral',
      descripcion: 'Entre los 3 y los 6 años, los niños no solo crecen, se transforman. Lumen Kids acompaña esta metamorfosis con un programa integral donde cada logro importa.',
      edades: 'Desde los 3 años',
      horarios: ['Lunes a Viernes: 6:30 AM - 5:30 PM'],
      caracteristicas: [
        'Desarrollo de autonomía real',
        'Fomento de curiosidad genuina',
        'Resolución de conflictos',
        'Programa integral personalizado',
        'Equipo comprometido y amoroso'
      ],
      icono: '🎨',
      colorFondo: 'linear-gradient(135deg, #90EE90 0%, #98FB98 100%)',
      colorTexto: '#228B22'
    },
    {
      id: 3,
      nombre: 'Life Lumen',
      subtitulo: 'Habilidades para el futuro',
      descripcion: 'Life Lumen desarrolla lo que el colegio no enseña: inteligencia emocional y financiera, pensamiento lateral y creativo, competencias digitales.',
      edades: 'Desde los 6 hasta los 9 años',
      horarios: ['Lunes a Viernes: 1:00 PM - 5:30 PM'],
      caracteristicas: [
        'Inteligencia emocional y financiera',
        'Pensamiento lateral y creativo',
        'Competencias digitales',
        'Capacidad de adaptación',
        'Habilidades para el futuro'
      ],
      icono: '🚀',
      colorFondo: 'linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 100%)',
      colorTexto: '#C71585'
    },
    {
      id: 4,
      nombre: 'Lumen Days',
      subtitulo: 'Un día para ti, un día inolvidable para ellos',
      descripcion: 'Mientras tú recuperas energía, tus hijos viven experiencias que recordarán: desde manualidades divertidas hasta juegos al aire libre.',
      edades: 'Desde los 5 meses hasta los 9 años',
      horarios: [
        'Lunes a Viernes: 6:30 AM - 5:30 PM',
        'Sábado: 7:30 AM - 3:00 PM'
      ],
      caracteristicas: [
        'Servicio flexible por días',
        'Actividades y manualidades',
        'Juegos al aire libre',
        'Experiencias memorables',
        'Disponible también los sábados'
      ],
      icono: '🎁',
      colorFondo: 'linear-gradient(135deg, #FFE4E1 0%, #FFF0F5 100%)',
      colorTexto: '#DB7093'
    }
  ];

  constructor(
    private router: Router,
    private themeService: ThemeService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.currentTheme = this.themeService.getCurrentTheme();

    // Track page view
    this.analyticsService.trackPageView('/programas');

    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
      });
    }
  }

  abrirModal(programa: Programa): void {
    this.programaSeleccionado = programa;
    this.mostrarModal = true;

    // Track modal open
    this.analyticsService.trackEvent('programa_modal_abierto', {
      event_category: 'programas',
      event_label: programa.nombre,
      programa_id: programa.id
    });

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.programaSeleccionado = null;

    // Restore body scroll
    document.body.style.overflow = '';
  }

  irContacto(): void {
    // Track CTA click
    this.analyticsService.trackEvent('programas_contacto_click', {
      event_category: 'conversion',
      event_label: 'Botón Contactar desde Programas',
      cta_location: 'programas_page'
    });

    this.router.navigate(['/contacto']);
  }

  agendarVisita(): void {
    // Track agendar visita
    this.analyticsService.trackEvent('programas_agendar_visita', {
      event_category: 'conversion',
      event_label: 'Botón Agendar Visita desde Programas',
      cta_location: 'programas_page'
    });

    this.router.navigate(['/contacto']);
  }
}