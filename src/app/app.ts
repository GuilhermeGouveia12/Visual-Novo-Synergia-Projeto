import { Component, HostListener, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DemandModalComponent } from './components/demand-modal/demand-modal.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { Demanda } from './models/demanda.model';
import { DemandasService } from './services/demandas.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, SidebarComponent, DemandModalComponent],
  template: `
    <div class="app-layout">
      <app-sidebar />

      <main class="main-content">
        <header class="page-header">
          <div>
            <span class="breadcrumb">Painel / Demandas</span>
            <h1>Demandas</h1>
            <p>Acompanhe e organize as demandas por etapa.</p>
          </div>

          <button
            type="button"
            class="filter-button"
            (click)="modalCriacaoAberto.set(true)"
          >
            + Nova demanda
          </button>
        </header>

        <section class="toolbar">
          <div class="search-box">
            <span>⌕</span>
            <input
              type="search"
              placeholder="Buscar demanda por nome ou número..."
              [ngModel]="demandasService.termoPesquisa()"
              (ngModelChange)="demandasService.termoPesquisa.set($event)"
            />
          </div>

          <select
            class="filter-button"
            [ngModel]="demandasService.filtroPrioridade()"
            (ngModelChange)="demandasService.filtroPrioridade.set($event)"
          >
            <option value="todas">Todas as prioridades</option>
            <option value="Alta">Alta</option>
            <option value="Média">Média</option>
            <option value="Baixa">Baixa</option>
          </select>
        </section>

        <div class="board-information">
          <span>VISUALIZAÇÃO KANBAN</span>
          <span>{{ demandasService.totalDemandas() }} demandas</span>
        </div>

        <section class="kanban-board">
          @for (etapa of demandasService.etapas; track etapa.id) {
            <section
              class="kanban-column"
              [class.drag-over]="etapaSobreposta() === etapa.id"
              (dragover)="onDragOver($event, etapa.id)"
              (dragleave)="onDragLeave($event, etapa.id)"
              (drop)="onDrop($event, etapa.id)"
            >
              <div class="column-header">
                <div class="column-title">
                  <span class="status-dot" [class]="etapa.cor"></span>
                  <h2>{{ etapa.nome }}</h2>
                  <span class="column-count">
                    {{ demandasService.contarPorEtapa(etapa.id) }}
                  </span>
                </div>

                <p>{{ etapa.descricao }}</p>
              </div>

              <div class="column-cards">
                @for (demanda of demandasService.filtrarPorEtapa(etapa.id); track demanda.id) {
                  <article
                    class="demand-card"
                    [class.dragging]="demandaArrastadaId() === demanda.id"
                    draggable="true"
                    tabindex="0"
                    role="button"
                    [attr.aria-label]="'Abrir detalhes: ' + demanda.titulo"
                    (dragstart)="onDragStart($event, demanda.id)"
                    (dragend)="onDragEnd()"
                    (click)="demandaSelecionada.set(demanda)"
                    (keydown.enter)="demandaSelecionada.set(demanda)"
                    (keydown.space)="$event.preventDefault(); demandaSelecionada.set(demanda)"
                  >
                    <div class="card-top">
                      <span class="card-number">{{ demanda.numero }}</span>
                      <span
                        class="priority"
                        [class]="'priority-' + demanda.prioridade.toLowerCase()"
                      >
                        {{ demanda.prioridade }}
                      </span>
                    </div>

                    <h3>{{ demanda.titulo }}</h3>

                    <div class="card-footer">
                      <span class="avatar">
                        {{
                          demanda.responsavel
                            ? demanda.responsavel.charAt(0).toUpperCase()
                            : '?'
                        }}
                      </span>
                      <span>{{ demanda.responsavel || 'Sem responsável' }}</span>
                      <span class="card-details">Ver detalhes ↗</span>
                    </div>
                  </article>
                } @empty {
                  <div class="empty-state">Nenhuma demanda aqui.</div>
                }
              </div>
            </section>
          }
        </section>
      </main>

      <app-demand-modal
        [demandaSelecionada]="demandaSelecionada()"
        [exibirFormulario]="modalCriacaoAberto()"
        (fecharDetalhes)="demandaSelecionada.set(null)"
        (fecharFormulario)="modalCriacaoAberto.set(false)"
      />
    </div>
  `,
})
export class AppComponent {
  readonly demandasService = inject(DemandasService);

  readonly demandaSelecionada = signal<Demanda | null>(null);
  readonly modalCriacaoAberto = signal<boolean>(false);
  readonly demandaArrastadaId = signal<number | null>(null);
  readonly etapaSobreposta = signal<string | null>(null);

  @HostListener('document:keydown.escape')
  fecharModaisComEsc(): void {
    this.demandaSelecionada.set(null);
    this.modalCriacaoAberto.set(false);
  }

  onDragStart(evento: DragEvent, id: number): void {
    this.demandaArrastadaId.set(id);
    if (evento.dataTransfer) {
      evento.dataTransfer.effectAllowed = 'move';
      evento.dataTransfer.setData('text/plain', String(id));
    }
  }

  onDragEnd(): void {
    this.demandaArrastadaId.set(null);
    this.etapaSobreposta.set(null);
  }

  onDragOver(evento: DragEvent, etapaId: string): void {
    evento.preventDefault();
    this.etapaSobreposta.set(etapaId);
    if (evento.dataTransfer) {
      evento.dataTransfer.dropEffect = 'move';
    }
  }

  onDragLeave(evento: DragEvent, etapaId: string): void {
    const coluna = evento.currentTarget as HTMLElement;
    if (!coluna.contains(evento.relatedTarget as Node) && this.etapaSobreposta() === etapaId) {
      this.etapaSobreposta.set(null);
    }
  }

  onDrop(evento: DragEvent, novaEtapa: string): void {
    evento.preventDefault();
    this.etapaSobreposta.set(null);

    const idTransferido = Number(
      evento.dataTransfer?.getData('text/plain') || this.demandaArrastadaId()
    );

    if (!idTransferido) return;

    this.demandasService.moverDemanda(idTransferido, novaEtapa);
    this.demandaArrastadaId.set(null);
  }
}