import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderWebComponent } from '../../common/header-web/header-web.component';
import { ThemeService, ThemeConfig } from '../../services/theme.service';
import { AnalyticsService } from '../../services/analytics.service';

declare var AOS: any;

interface PasoAdmision {
  id: number;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  icono: string;
  detalles?: string[];
  esOpcional?: boolean;
  expandido?: boolean;
}

@Component({
  selector: 'app-admision',
  standalone: true,
  imports: [CommonModule, HeaderWebComponent],
  templateUrl: './admision.component.html',
  styleUrl: './admision.component.scss'
})
export class AdmisionComponent implements OnInit {

  public currentTheme!: ThemeConfig;
  public pasoActual: number = 0;
  public mostrarConfetti: boolean = false;

  public pasos: PasoAdmision[] = [
    {
      id: 1,
      titulo: 'Visitarnos',
      subtitulo: 'Conoce nuestras instalaciones',
      descripcion: 'Agenda una cita para conocer personalmente nuestro jardín, las instalaciones, el equipo docente y nuestra metodología de enseñanza. Incluye pequeño obsequio para que nos recuerdes.',
      icono: '🏫',
      detalles: [
        'Recorrido por todas nuestras instalaciones',
        'Conoce a nuestro equipo docente',
        'Espacios acondicionados para cada edad',
        'Hermoso parque al aire libre',
        'Pequeño obsequio de bienvenida',
        'Resolución de todas tus dudas'
      ],
      expandido: false
    },
    {
      id: 2,
      titulo: 'Registro de Formulario',
      subtitulo: 'Completa el formulario de inscripción',
      descripcion: 'Diligencia el formulario de inscripción con los datos básicos de tu hijo(a) y la familia.',
      icono: '📋',
      detalles: [
        'Información personal del niño(a)',
        'Datos de contacto de los padres',
        'Información médica relevante'
      ],
      expandido: false
    },
    {
      id: 3,
      titulo: 'Día Lumen de Cortesía',
      subtitulo: 'Experiencia gratuita (Opcional)',
      descripcion: '¡Trae a tu bebé a vivir un día Lumen completamente gratis! Una experiencia para que conozcan nuestra rutina y se sientan en casa. Incluye onces y almuerzo.',
      icono: '🎁',
      esOpcional: true,
      detalles: [
        'Día completo de actividades',
        'Sin costo alguno',
        'Incluye onces y almuerzo',
        'Experimenta nuestra metodología',
        'Conoce a los compañeritos',
        'Vive la rutina Lumen'
      ],
      expandido: false
    },
    {
      id: 4,
      titulo: 'Registro de Documentación',
      subtitulo: 'Entrega de documentos requeridos',
      descripcion: 'Presenta la documentación necesaria para formalizar el ingreso de tu hijo(a) a nuestra familia Lumen.',
      icono: '📄',
      detalles: [
        'Fotocopia de afiliación a EPS',
        'Registro civil',
        'Carnet de vacunas',
        'Cédula de ciudadanía de acudiente(s)',
        '3 fotos de carnet fondo blanco',
        'Certificado médico'
      ],
      expandido: false
    },
    {
      id: 5,
      titulo: 'Matrícula y Contrato',
      subtitulo: 'Formalización del ingreso',
      descripcion: 'Firma del contrato de prestación de servicios educativos y pago de matrícula.',
      icono: '✍️',
      detalles: [
        'Lectura del contrato de servicios',
        'Firma de documentos legales',
        'Pago de matrícula',
        'Confirmación de inicio de clases'
      ],
      expandido: false
    },
    {
      id: 6,
      titulo: 'Sesión de Anamnesis',
      subtitulo: 'Entrevista con la familia',
      descripcion: 'Reunión personalizada para conocer a profundidad las necesidades, rutinas y características especiales de tu hijo(a).',
      icono: '👨‍👩‍👧',
      detalles: [
        'Entrevista con psicóloga',
        'Historia familiar y médica',
        'Rutinas y hábitos del niño(a)',
        'Necesidades especiales'
      ],
      expandido: false
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
    this.analyticsService.trackPageView('/admision');

    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
      });
    }
  }

  togglePaso(paso: PasoAdmision): void {
    const estadoAnterior = paso.expandido;
    paso.expandido = !paso.expandido;

    // Track expansion
    if (paso.expandido) {
      this.analyticsService.trackEvent('admision_paso_expandido', {
        event_category: 'admision',
        event_label: `Paso ${paso.id}: ${paso.titulo}`,
        paso_numero: paso.id,
        paso_titulo: paso.titulo
      });
    }

    // Animación de confetti cuando expanden un paso
    if (paso.expandido && !estadoAnterior) {
      this.mostrarConfetti = true;
      setTimeout(() => {
        this.mostrarConfetti = false;
      }, 1000);
    }
  }

  irContacto(): void {
    // Track CTA click
    this.analyticsService.trackEvent('admision_contacto_click', {
      event_category: 'conversion',
      event_label: 'Botón Contactar',
      cta_location: 'admision_page'
    });

    this.router.navigate(['/contacto']);
  }

  descargarInfo(): void {
    // Track download
    this.analyticsService.trackEvent('admision_descargar_info', {
      event_category: 'engagement',
      event_label: 'Descargar PDF Información',
      file_name: 'informacion-admision.pdf'
    });

    // Abrir el PDF de información
    window.open('assets/documents/informacion-admision.pdf', '_blank');
  }

  agendarVisita(): void {
    // Track scheduling attempt
    this.analyticsService.trackEvent('admision_agendar_visita', {
      event_category: 'conversion',
      event_label: 'Botón Agendar Visita',
      cta_location: 'admision_page'
    });

    // Redirigir a contacto
    this.router.navigate(['/contacto']);
  }
}