import { Component, inject } from '@angular/core';
import { DemandasService } from '../../services/demandas.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  template: `
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-icon">S</div>
        <div>
          <strong>Synergia</strong>
          <small>Fábrica de Talentos</small>
        </div>
      </div>

      <nav class="navigation">
        <span class="nav-label">MENU PRINCIPAL</span>

        <a href="#" class="nav-item" (click)="$event.preventDefault()">
          ⌂ <span>Início</span>
        </a>
        <a href="#" class="nav-item active" (click)="$event.preventDefault()">
          ▣ <span>Demandas</span>
        </a>
        <a href="#" class="nav-item" (click)="$event.preventDefault()">
          ◈ <span>Projetos</span>
        </a>
        <a href="#" class="nav-item" (click)="$event.preventDefault()">
          ▦ <span>Calendário</span>
        </a>
        <a href="#" class="nav-item" (click)="$event.preventDefault()">
          ◇ <span>Pendências</span>
        </a>
        <a href="#" class="nav-item" (click)="$event.preventDefault()">
          ▤ <span>Performance</span>
        </a>
        <a href="#" class="nav-item" (click)="$event.preventDefault()">
          ♧ <span>Guias</span>
        </a>
        <a href="#" class="nav-item" (click)="$event.preventDefault()">
          ♙ <span>Perfil</span>
        </a>
        <a href="#" class="nav-item" (click)="$event.preventDefault()">
          ♧ <span>Solicitações</span>
        </a>
        <a href="#" class="nav-item" (click)="$event.preventDefault()">
          ♧ <span>Notificações</span>
        </a>
      </nav>

      <div class="sidebar-bottom">
        <button
          class="theme-toggle"
          type="button"
          (click)="demandasService.alternarTema()"
        >
          <span>{{ demandasService.temaEscuro() ? '☀' : '☾' }}</span>
          <span>{{ demandasService.temaEscuro() ? 'Tema claro' : 'Tema escuro' }}</span>
        </button>
      </div>
    </aside>
  `,
})
export class SidebarComponent {
  readonly demandasService = inject(DemandasService);
}