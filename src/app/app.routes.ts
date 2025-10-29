import { Routes } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { NosotrosComponent } from './components/nosotros/nosotros.component';

export const routes: Routes = [
  {
    path: '',
    component: MenuComponent
  },
  {
    path: 'nosotros',
    component: NosotrosComponent
  }
];