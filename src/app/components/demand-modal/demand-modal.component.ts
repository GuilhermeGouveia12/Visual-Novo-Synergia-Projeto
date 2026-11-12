import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Demanda, Prioridade } from '../../models/demanda.model';
import { DemandasService } from '../../services/demandas.service';

@Component({
  selector: 'app-demand-modal',
  standalone: true,
  imports: [FormsModule],
  template: `
    <!-- Modal de Detalhes / Edição / Exclusão -->
    @if (demandaSelecionada) {
      <div class="modal-overlay visible" (click)="aoFecharDetalhes()">
        <div class="modal" (click)="$event.stopPropagation()">
          @if (!modoEdicao()) {
            <h2>{{ demandaSelecionada.titulo }}</h2>

            <p><strong>Número:</strong> {{ demandaSelecionada.numero }}</p>
            <p>
              <strong>Etapa:</strong>
              {{ demandasService.obterNomeEtapa(demandaSelecionada.etapa) }}
            </p>
            <p><strong>Prioridade:</strong> {{ demandaSelecionada.prioridade }}</p>
            <p>
              <strong>Responsável:</strong>
              {{ demandaSelecionada.responsavel || 'Não informado' }}
            </p>
            <p>
              <strong>Descrição:</strong>
              {{ demandaSelecionada.descricao || 'Nenhuma descrição informada.' }}
            </p>

            @if (confirmandoExclusao()) {
              <div class="delete-confirm-box">
                <span>Tem certeza que deseja excluir esta demanda?</span>
                <div class="delete-confirm-actions">
                  <button
                    type="button"
                    class="secondary-button"
                    (click)="confirmandoExclusao.set(false)"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    class="danger-button"
                    (click)="confirmarExclusao()"
                  >
                    Sim, excluir
                  </button>
                </div>
              </div>
            } @else {
              <div class="modal-footer-actions">
                <button
                  type="button"
                  class="danger-button"
                  (click)="confirmandoExclusao.set(true)"
                >
                  Excluir
                </button>

                <div class="modal-actions-right">
                  <button
                    type="button"
                    class="filter-button"
                    (click)="iniciarEdicao()"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    class="secondary-button"
                    (click)="aoFecharDetalhes()"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            }
          } @else {
            <h2>Editar demanda</h2>

            <form (ngSubmit)="salvarEdicao()">
              <label for="edit-title">Título</label>
              <input
                id="edit-title"
                name="editTitulo"
                [(ngModel)]="editTitulo"
                required
                maxlength="120"
              />

              <label for="edit-number">Número</label>
              <input
                id="edit-number"
                name="editNumero"
                [(ngModel)]="editNumero"
                required
                maxlength="30"
              />

              <label for="edit-priority">Prioridade</label>
              <select
                id="edit-priority"
                name="editPrioridade"
                [(ngModel)]="editPrioridade"
                required
              >
                <option value="Alta">Alta</option>
                <option value="Média">Média</option>
                <option value="Baixa">Baixa</option>
              </select>

              <label for="edit-responsible">Responsável</label>
              <input
                id="edit-responsible"
                name="editResponsavel"
                [(ngModel)]="editResponsavel"
                maxlength="100"
              />

              <label for="edit-stage">Etapa</label>
              <select
                id="edit-stage"
                name="editEtapa"
                [(ngModel)]="editEtapa"
              >
                @for (etapa of demandasService.etapas; track etapa.id) {
                  <option [value]="etapa.id">{{ etapa.nome }}</option>
                }
              </select>

              <label for="edit-description">Descrição</label>
              <textarea
                id="edit-description"
                name="editDescricao"
                [(ngModel)]="editDescricao"
                rows="3"
                maxlength="1000"
              ></textarea>

              <div class="modal-actions">
                <button
                  type="button"
                  class="secondary-button"
                  (click)="modoEdicao.set(false)"
                >
                  Cancelar
                </button>
                <button type="submit" class="filter-button">
                  Salvar alterações
                </button>
              </div>
            </form>
          }
        </div>
      </div>
    }

    <!-- Modal de Nova Demanda -->
    @if (exibirFormulario) {
      <div class="modal-overlay visible" (click)="cancelarCriacao()">
        <div class="modal" (click)="$event.stopPropagation()">
          <h2>Nova demanda</h2>

          <form (ngSubmit)="salvarCriacao()">
            <label for="demand-title">Título</label>
            <input
              id="demand-title"
              name="titulo"
              [(ngModel)]="novoTitulo"
              required
              maxlength="120"
            />

            <label for="demand-number">Número</label>
            <input
              id="demand-number"
              name="numero"
              [(ngModel)]="novoNumero"
              placeholder="Ex.: 001"
              required
              maxlength="30"
            />

            <label for="demand-priority">Prioridade</label>
            <select
              id="demand-priority"
              name="prioridade"
              [(ngModel)]="novaPrioridade"
              required
            >
              <option value="Alta">Alta</option>
              <option value="Média">Média</option>
              <option value="Baixa">Baixa</option>
            </select>

            <label for="demand-responsible">Responsável</label>
            <input
              id="demand-responsible"
              name="responsavel"
              [(ngModel)]="novoResponsavel"
              maxlength="100"
            />

            <label for="demand-stage">Etapa inicial</label>
            <select
              id="demand-stage"
              name="etapa"
              [(ngModel)]="novaEtapa"
            >
              @for (etapa of demandasService.etapas; track etapa.id) {
                <option [value]="etapa.id">{{ etapa.nome }}</option>
              }
            </select>

            <label for="demand-description">Descrição</label>
            <textarea
              id="demand-description"
              name="descricao"
              [(ngModel)]="novaDescricao"
              rows="3"
              maxlength="1000"
            ></textarea>

            <div class="modal-actions">
              <button
                type="button"
                class="secondary-button"
                (click)="cancelarCriacao()"
              >
                Cancelar
              </button>
              <button type="submit" class="filter-button">
                Salvar demanda
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
})
export class DemandModalComponent implements OnChanges {
  readonly demandasService = inject(DemandasService);

  @Input() demandaSelecionada: Demanda | null = null;
  @Input() exibirFormulario = false;

  @Output() fecharDetalhes = new EventEmitter<void>();
  @Output() fecharFormulario = new EventEmitter<void>();
  @Output() demandaAtualizada = new EventEmitter<Demanda>();

  readonly modoEdicao = signal<boolean>(false);
  readonly confirmandoExclusao = signal<boolean>(false);

  // Campos de criação
  novoTitulo = '';
  novoNumero = '';
  novaPrioridade: Prioridade = 'Média';
  novoResponsavel = '';
  novaEtapa = 'backlog';
  novaDescricao = '';

  // Campos de edição
  editTitulo = '';
  editNumero = '';
  editPrioridade: Prioridade = 'Média';
  editResponsavel = '';
  editEtapa = 'backlog';
  editDescricao = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['demandaSelecionada']) {
      this.modoEdicao.set(false);
      this.confirmandoExclusao.set(false);
    }
  }

  iniciarEdicao(): void {
    if (!this.demandaSelecionada) return;

    this.editTitulo = this.demandaSelecionada.titulo;
    this.editNumero = this.demandaSelecionada.numero;
    this.editPrioridade = this.demandaSelecionada.prioridade;
    this.editResponsavel = this.demandaSelecionada.responsavel;
    this.editEtapa = this.demandaSelecionada.etapa;
    this.editDescricao = this.demandaSelecionada.descricao ?? '';
    this.modoEdicao.set(true);
  }

  salvarEdicao(): void {
    if (!this.demandaSelecionada || !this.editTitulo.trim() || !this.editNumero.trim()) {
      return;
    }

    const resultado = this.demandasService.atualizarDemanda(this.demandaSelecionada.id, {
      titulo: this.editTitulo,
      numero: this.editNumero,
      prioridade: this.editPrioridade,
      responsavel: this.editResponsavel,
      etapa: this.editEtapa,
      descricao: this.editDescricao,
    });

    if (!resultado.sucesso) {
      alert(resultado.erro);
      return;
    }

    if (resultado.demandaAtualizada) {
      this.demandaAtualizada.emit(resultado.demandaAtualizada);
    }
    this.modoEdicao.set(false);
  }

  confirmarExclusao(): void {
    if (!this.demandaSelecionada) return;

    this.demandasService.excluirDemanda(this.demandaSelecionada.id);
    this.confirmandoExclusao.set(false);
    this.fecharDetalhes.emit();
  }

  aoFecharDetalhes(): void {
    this.modoEdicao.set(false);
    this.confirmandoExclusao.set(false);
    this.fecharDetalhes.emit();
  }

  salvarCriacao(): void {
    if (!this.novoTitulo.trim() || !this.novoNumero.trim()) {
      return;
    }

    const resultado = this.demandasService.adicionarDemanda({
      titulo: this.novoTitulo,
      numero: this.novoNumero,
      prioridade: this.novaPrioridade,
      responsavel: this.novoResponsavel,
      etapa: this.novaEtapa,
      descricao: this.novaDescricao,
    });

    if (!resultado.sucesso) {
      alert(resultado.erro);
      return;
    }

    this.resetarFormulario();
    this.fecharFormulario.emit();
  }

  cancelarCriacao(): void {
    this.resetarFormulario();
    this.fecharFormulario.emit();
  }

  private resetarFormulario(): void {
    this.novoTitulo = '';
    this.novoNumero = '';
    this.novaPrioridade = 'Média';
    this.novoResponsavel = '';
    this.novaEtapa = 'backlog';
    this.novaDescricao = '';
  }
}