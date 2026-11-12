import { Injectable, computed, effect, signal } from '@angular/core';
import {
  Demanda,
  ETAPAS_KANBAN,
  ITENS_MENU,
  PaginaId,
  Prioridade,
} from '../models/demanda.model';

@Injectable({
  providedIn: 'root',
})
export class DemandasService {
  private readonly CHAVE_STORAGE = 'synergia.demandas.v1';
  private readonly CHAVE_TEMA = 'synergia.tema';

  readonly etapas = ETAPAS_KANBAN;
  readonly itensMenu = ITENS_MENU;

  // Estado reativo
  readonly paginaAtiva = signal<PaginaId>('demandas');
  readonly demandas = signal<Demanda[]>(this.carregarDemandas());
  readonly termoPesquisa = signal<string>('');
  readonly filtroPrioridade = signal<string>('todas');
  readonly temaEscuro = signal<boolean>(this.carregarTema());

  // Total de demandas cadastradas
  readonly totalDemandas = computed(() => this.demandas().length);

  constructor() {
    effect(() => {
      localStorage.setItem(this.CHAVE_STORAGE, JSON.stringify(this.demandas()));
    });

    effect(() => {
      const escuro = this.temaEscuro();
      document.body.classList.toggle('dark-theme', escuro);
      localStorage.setItem(this.CHAVE_TEMA, escuro ? 'escuro' : 'claro');
    });
  }

  private carregarDemandas(): Demanda[] {
    try {
      const dados = localStorage.getItem(this.CHAVE_STORAGE);
      return dados ? (JSON.parse(dados) as Demanda[]) : [];
    } catch {
      return [];
    }
  }

  private carregarTema(): boolean {
    return localStorage.getItem(this.CHAVE_TEMA) === 'escuro';
  }

  alternarTema(): void {
    this.temaEscuro.update((atual) => !atual);
  }

  filtrarPorEtapa(etapaId: string): Demanda[] {
    const termo = this.termoPesquisa().toLowerCase().trim();
    const prioridade = this.filtroPrioridade();

    return this.demandas().filter((demanda) => {
      if (demanda.etapa !== etapaId) return false;

      const correspondePesquisa = `${demanda.titulo} ${demanda.numero}`
        .toLowerCase()
        .includes(termo);

      const correspondePrioridade =
        prioridade === 'todas' || demanda.prioridade === prioridade;

      return correspondePesquisa && correspondePrioridade;
    });
  }

  contarPorEtapa(etapaId: string): number {
    return this.demandas().filter((d) => d.etapa === etapaId).length;
  }

  obterNomeEtapa(etapaId: string): string {
    return this.etapas.find((e) => e.id === etapaId)?.nome ?? 'Não definida';
  }

  adicionarDemanda(dados: {
    titulo: string;
    numero: string;
    prioridade: Prioridade;
    responsavel: string;
    etapa: string;
    descricao: string;
  }): { sucesso: boolean; erro?: string } {
    const numeroInformado = dados.numero.trim();
    const numeroFormatado = numeroInformado.startsWith('#')
      ? numeroInformado
      : `#${numeroInformado}`;

    const duplicado = this.demandas().some(
      (d) => d.numero.toLowerCase() === numeroFormatado.toLowerCase()
    );

    if (duplicado) {
      return {
        sucesso: false,
        erro: 'Já existe uma demanda com esse número.',
      };
    }

    const novaDemanda: Demanda = {
      id: Date.now(),
      titulo: dados.titulo.trim(),
      numero: numeroFormatado,
      etapa: dados.etapa,
      prioridade: dados.prioridade,
      responsavel: dados.responsavel.trim(),
      descricao: dados.descricao.trim(),
    };

    this.demandas.update((lista) => [...lista, novaDemanda]);
    return { sucesso: true };
  }

  atualizarDemanda(
    id: number,
    dados: {
      titulo: string;
      numero: string;
      prioridade: Prioridade;
      responsavel: string;
      etapa: string;
      descricao: string;
    }
  ): { sucesso: boolean; erro?: string; demandaAtualizada?: Demanda } {
    const numeroInformado = dados.numero.trim();
    const numeroFormatado = numeroInformado.startsWith('#')
      ? numeroInformado
      : `#${numeroInformado}`;

    const duplicado = this.demandas().some(
      (d) =>
        d.id !== id && d.numero.toLowerCase() === numeroFormatado.toLowerCase()
    );

    if (duplicado) {
      return {
        sucesso: false,
        erro: 'Já existe outra demanda com esse número.',
      };
    }

    let demandaAtualizada: Demanda | undefined;

    this.demandas.update((lista) =>
      lista.map((demanda) => {
        if (demanda.id !== id) return demanda;

        demandaAtualizada = {
          ...demanda,
          titulo: dados.titulo.trim(),
          numero: numeroFormatado,
          etapa: dados.etapa,
          prioridade: dados.prioridade,
          responsavel: dados.responsavel.trim(),
          descricao: dados.descricao.trim(),
        };
        return demandaAtualizada;
      })
    );

    return { sucesso: true, demandaAtualizada };
  }

  excluirDemanda(id: number): void {
    this.demandas.update((lista) => lista.filter((d) => d.id !== id));
  }

  moverDemanda(id: number, novaEtapa: string): void {
    this.demandas.update((lista) =>
      lista.map((demanda) =>
        demanda.id === id ? { ...demanda, etapa: novaEtapa } : demanda
      )
    );
  }
}