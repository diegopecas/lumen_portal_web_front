import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { HeaderWebComponent } from '../../common/header-web/header-web.component';
import { ThemeService, ThemeConfig } from '../../services/theme.service';

declare var AOS: any;

interface GalleryImage {
    id: number;
    url: string;
    alt: string;
    category: string;
    loaded?: boolean;
}

@Component({
    selector: 'app-galeria',
    standalone: true,
    imports: [CommonModule, HeaderWebComponent, HttpClientModule],
    templateUrl: './galeria.component.html',
    styleUrl: './galeria.component.scss'
})
export class GaleriaComponent implements OnInit {

    public currentTheme!: ThemeConfig;
    public allImages: GalleryImage[] = [];
    public displayedImages: GalleryImage[] = [];
    public selectedImage: GalleryImage | null = null;
    public isMobile = false;
    public isLoading = false;

    public currentIndex = 0;
    public imagesPerLoad = 18; // Default para desktop

    constructor(
        private router: Router,
        private themeService: ThemeService,
        private http: HttpClient
    ) {
        this.checkScreenSize();
    }

    ngOnInit(): void {
        // Cargar tema actual
        this.currentTheme = this.themeService.getCurrentTheme();

        // Ajustar cantidad de imágenes según dispositivo
        this.imagesPerLoad = this.isMobile ? 12 : 18;

        // Cargar imágenes desde JSON
        this.loadImages();

        // Inicializar animaciones AOS si está disponible
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true,
                offset: 100
            });
        }
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.checkScreenSize();
        this.imagesPerLoad = this.isMobile ? 12 : 18;
    }

    @HostListener('window:scroll', ['$event'])
    onScroll() {
        // Detectar cuando el usuario está cerca del final de la página
        const scrollPosition = window.innerHeight + window.scrollY;
        const pageHeight = document.documentElement.scrollHeight;

        if (scrollPosition >= pageHeight - 500 && !this.isLoading) {
            this.loadMoreImages();
        }
    }

    private checkScreenSize(): void {
        this.isMobile = window.innerWidth <= 768;
    }

    private loadImages(): void {
        this.http.get<{ images: GalleryImage[] }>('assets/data/galeria.json')
            .subscribe({
                next: (data) => {
                    this.allImages = data.images;
                    this.loadMoreImages();
                },
                error: (error) => {
                    console.error('Error loading gallery images:', error);
                }
            });
    }

    private loadMoreImages(): void {
        if (this.isLoading || this.currentIndex >= this.allImages.length) {
            return;
        }

        this.isLoading = true;

        const nextBatch = this.isMobile ? 6 : 9;
        const endIndex = Math.min(
            this.currentIndex + (this.displayedImages.length === 0 ? this.imagesPerLoad : nextBatch),
            this.allImages.length
        );

        const newImages = this.allImages.slice(this.currentIndex, endIndex);

        // Simular un pequeño delay para suavizar la carga
        setTimeout(() => {
            this.displayedImages = [...this.displayedImages, ...newImages];
            this.currentIndex = endIndex;
            this.isLoading = false;

            // Refrescar AOS para las nuevas imágenes
            if (typeof AOS !== 'undefined') {
                setTimeout(() => AOS.refresh(), 100);
            }
        }, 300);
    }

    openLightbox(image: GalleryImage): void {
        this.selectedImage = image;
        document.body.style.overflow = 'hidden';
    }

    closeLightbox(): void {
        this.selectedImage = null;
        document.body.style.overflow = 'auto';
    }

    previousImage(): void {
        if (!this.selectedImage) return;

        const currentIndex = this.displayedImages.findIndex(img => img.id === this.selectedImage?.id);
        if (currentIndex > 0) {
            this.selectedImage = this.displayedImages[currentIndex - 1];
        }
    }

    nextImage(): void {
        if (!this.selectedImage) return;

        const currentIndex = this.displayedImages.findIndex(img => img.id === this.selectedImage?.id);
        if (currentIndex < this.displayedImages.length - 1) {
            this.selectedImage = this.displayedImages[currentIndex + 1];
        }
    }

    @HostListener('document:keydown', ['$event'])
    handleKeyboard(event: KeyboardEvent): void {
        if (!this.selectedImage) return;

        switch (event.key) {
            case 'Escape':
                this.closeLightbox();
                break;
            case 'ArrowLeft':
                this.previousImage();
                break;
            case 'ArrowRight':
                this.nextImage();
                break;
        }
    }

    onImageLoad(image: GalleryImage): void {
        image.loaded = true;
    }
    trackInstagramClick(): void {
        console.log('Usuario hizo clic en Instagram desde la galería');
    }
}