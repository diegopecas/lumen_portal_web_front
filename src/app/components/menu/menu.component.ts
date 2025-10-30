import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService, ThemeConfig } from '../../services/theme.service';
import { AnalyticsService } from '../../services/analytics.service';
import { PortalMessageComponent } from '../portal-message/portal-message.component';
import { ContactoModalComponent } from '../contacto-modal/contacto-modal.component';

interface Star {
  top: number;
  left: number;
  size: number;
  duration: number;
}

interface FloatingParticle {
  x: number;
  y: number;
  delay: number;
  duration: number;
  icon: string;
}

interface PortalParticle {
  delay: number;
}

interface MenuOption {
  angle: number;
  radius: number;
  label: string;
  route: string;
  icon: string;
}

interface ExplosionParticle {
  x: number;
  y: number;
  angle: number;
  icon: string;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  standalone: true,
  imports: [CommonModule, RouterModule, PortalMessageComponent, ContactoModalComponent]
})
export class MenuComponent implements AfterViewInit, OnDestroy {

  @ViewChild('effectCanvas', { static: false }) effectCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('constellationCanvas', { static: false }) constellationCanvas!: ElementRef<HTMLCanvasElement>;

  public isMobile = false;
  public currentTheme!: ThemeConfig;
  public highlightedIndex: number | null = null;

  // Elementos visuales
  public stars: Star[] = [];
  public floatingParticles: FloatingParticle[] = [];
  public portalParticles: PortalParticle[] = [];
  public explosionParticles: ExplosionParticle[] = [];

  // Posiciones de las opciones del menú (órbita circular)
  public menuOptions: MenuOption[] = [];

  // Mouse position para efectos gravitacionales
  private mouseX = 0;
  private mouseY = 0;

  private animationId: number | null = null;
  private constellationAnimationId: number | null = null;

  // Para tracking de hover (evitar múltiples eventos)
  private portalHoverTracked = false;

  constructor(
    private router: Router,
    private themeService: ThemeService,
    private analyticsService: AnalyticsService
  ) {
    this.checkScreenSize();
  }

  ngOnInit() {
    this.currentTheme = this.themeService.getCurrentTheme();

    this.generateStars();
    this.generateFloatingParticles();
    this.generatePortalParticles();
    this.calculateMenuPositions();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initEffectCanvas();
      this.initConstellationCanvas();
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.constellationAnimationId) {
      cancelAnimationFrame(this.constellationAnimationId);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
    this.calculateMenuPositions();
    if (this.effectCanvas) {
      this.initEffectCanvas();
    }
    if (this.constellationCanvas) {
      this.initConstellationCanvas();
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  private generateStars(): void {
    const numStars = this.isMobile ? 40 : 80;
    this.stars = Array.from({ length: numStars }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 3 + 2
    }));
  }

  private generateFloatingParticles(): void {
    const numParticles = this.isMobile ? 12 : 25;
    this.floatingParticles = Array.from({ length: numParticles }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 15 + Math.random() * 10,
      icon: this.currentTheme.decorativeElements[Math.floor(Math.random() * this.currentTheme.decorativeElements.length)]
    }));
  }

  private generatePortalParticles(): void {
    const numParticles = this.isMobile ? 8 : 15;
    this.portalParticles = Array.from({ length: numParticles }, (_, i) => ({
      delay: i * 0.3
    }));
  }

  private calculateMenuPositions(): void {
    const options = [
      { label: 'Nosotros', route: '/nosotros', icon: '/assets/images/nosotros.png' },
      { label: 'Programas', route: '/programas', icon: '/assets/images/programas.png' },
      { label: 'Admisión', route: '/admision', icon: '/assets/images/admision.png' },
      { label: 'Galería', route: '/galeria', icon: '/assets/images/galeria.png' },
      { label: 'Contacto', route: '/contacto', icon: '/assets/images/contacto.png' },
      { label: 'Familia Lumen', route: '/familia-lumen', icon: '/assets/images/familia-lumen.png' }
    ];

    if (this.isMobile) {
      // En móvil no usamos órbita
      this.menuOptions = options.map(opt => ({
        ...opt,
        angle: 0,
        radius: 0
      }));
    } else {
      // Desktop: distribuir en círculo PERFECTO empezando desde arriba
      const radius = 320;
      const startAngle = -90; // Empezar desde arriba (12 en punto)
      
      this.menuOptions = options.map((opt, i) => ({
        ...opt,
        angle: startAngle + (360 / options.length) * i,
        radius: radius
      }));
    }
  }

  private initEffectCanvas(): void {
    if (!this.effectCanvas) return;

    const canvas = this.effectCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const numParticles = this.isMobile ? 20 : 35;
    
    const getThemeColor = () => {
      if (this.currentTheme.name === 'halloween') return '139, 0, 139';
      if (this.currentTheme.name === 'christmas') return '0, 100, 200';
      if (this.currentTheme.name === 'valentine') return '255, 20, 147';
      if (this.currentTheme.name === 'spring') return '50, 205, 50';
      if (this.currentTheme.name === 'summer') return '0, 191, 255';
      if (this.currentTheme.name === 'new-year') return '255, 215, 0';
      if (this.currentTheme.name === 'colombia-day') return '252, 209, 22';
      if (this.currentTheme.name === 'kites') return '0, 191, 255';
      if (this.currentTheme.name === 'love-friendship') return '255, 20, 147';
      return '100, 100, 200';
    };

    const particles = Array.from({ length: numParticles }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * (this.isMobile ? 50 : 80) + 30,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.2 + 0.05
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const themeColor = getThemeColor();

      particles.forEach(p => {
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        gradient.addColorStop(0, `rgba(${themeColor}, ${p.opacity})`);
        gradient.addColorStop(1, `rgba(${themeColor}, 0)`);
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < -p.radius) p.x = canvas.width + p.radius;
        if (p.x > canvas.width + p.radius) p.x = -p.radius;
        if (p.y < -p.radius) p.y = canvas.height + p.radius;
        if (p.y > canvas.height + p.radius) p.y = -p.radius;
      });

      this.animationId = requestAnimationFrame(animate);
    };

    animate();
  }

  private initConstellationCanvas(): void {
    if (!this.constellationCanvas || this.isMobile) return;

    const canvas = this.constellationCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const drawConnections = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dibujar líneas de constelación entre opciones cercanas
      this.menuOptions.forEach((option, i) => {
        const angle1 = (option.angle * Math.PI) / 180;
        const x1 = centerX + Math.cos(angle1) * option.radius;
        const y1 = centerY + Math.sin(angle1) * option.radius;

        // Conectar con las opciones adyacentes
        this.menuOptions.forEach((option2, j) => {
          if (i >= j) return; // Evitar duplicados
          
          const angle2 = (option2.angle * Math.PI) / 180;
          const x2 = centerX + Math.cos(angle2) * option2.radius;
          const y2 = centerY + Math.sin(angle2) * option2.radius;

          const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
          
          // Solo conectar opciones cercanas
          if (distance < 400) {
            const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
            gradient.addColorStop(0, `rgba(255, 140, 0, 0.3)`);
            gradient.addColorStop(0.5, `rgba(138, 43, 226, 0.5)`);
            gradient.addColorStop(1, `rgba(255, 140, 0, 0.3)`);

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 10]);
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            // Partículas viajando por las líneas
            const time = Date.now() / 1000;
            const t = (time + i + j) % 1;
            const particleX = x1 + (x2 - x1) * t;
            const particleY = y1 + (y2 - y1) * t;

            ctx.fillStyle = 'rgba(255, 140, 0, 0.8)';
            ctx.beginPath();
            ctx.arc(particleX, particleY, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      });

      this.constellationAnimationId = requestAnimationFrame(drawConnections);
    };

    drawConnections();
  }

  /**
   * ✅ MODIFICADO: Agregar tracking de hover sobre el portal
   */
  onPortalHover(isHovering: boolean): void {
    if (isHovering && !this.portalHoverTracked) {
      // Enviar evento a Google Analytics
      this.analyticsService.trackPortalHover();
      this.portalHoverTracked = true;
      
      // Resetear después de 5 segundos para permitir re-tracking
      setTimeout(() => {
        this.portalHoverTracked = false;
      }, 5000);
    }
  }

  highlightOption(index: number): void {
    this.highlightedIndex = index;
  }

  unhighlightOption(): void {
    this.highlightedIndex = null;
  }

  /**
   * ✅ MODIFICADO: Agregar tracking de clic en opción del menú
   */
  selectOption(path: string, index: number): void {
    const option = this.menuOptions[index];
    
    // 📊 Enviar evento a Google Analytics ANTES de navegar
    this.analyticsService.trackMenuOptionClick(option.label, path);

    // Crear explosión de partículas
    this.createExplosion(index);

    // Navegar después de un pequeño delay para ver la animación
    setTimeout(() => {
      this.router.navigate([path]);
    }, 400);
  }

  private createExplosion(optionIndex: number): void {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Calcular posición de la opción seleccionada
    let x = centerX;
    let y = centerY;

    if (!this.isMobile && this.menuOptions[optionIndex]) {
      const option = this.menuOptions[optionIndex];
      const angle = (option.angle * Math.PI) / 180;
      x = centerX + Math.cos(angle) * option.radius;
      y = centerY + Math.sin(angle) * option.radius;
    }

    // Generar partículas de explosión
    const numParticles = this.isMobile ? 8 : 15;
    const newParticles: ExplosionParticle[] = Array.from({ length: numParticles }, (_, i) => ({
      x: x,
      y: y,
      angle: (360 / numParticles) * i,
      icon: this.currentTheme.decorativeElements[Math.floor(Math.random() * this.currentTheme.decorativeElements.length)]
    }));

    this.explosionParticles = newParticles;

    // Limpiar después de la animación
    setTimeout(() => {
      this.explosionParticles = [];
    }, 800);
  }
}