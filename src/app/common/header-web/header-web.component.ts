import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ThemeService, ThemeConfig } from '../../services/theme.service';

@Component({
  selector: 'app-header-web',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header-web.component.html',
  styleUrl: './header-web.component.css'
})
export class HeaderWebComponent implements OnInit {

  @Input() titulo: string = '';
  @Input() breadcrumbs: string[] = [];
  @Input() rutaVolver: string = '/';

  public currentTheme!: ThemeConfig;
  public particles: string[] = [];

  constructor(
    private themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentTheme = this.themeService.getCurrentTheme();
    this.generateParticles();
  }

  private generateParticles(): void {
    this.particles = Array.from({ length: 5 }, () => 
      this.currentTheme.decorativeElements[
        Math.floor(Math.random() * this.currentTheme.decorativeElements.length)
      ]
    );
  }

  volver(): void {
    this.router.navigate([this.rutaVolver]);
  }
}
