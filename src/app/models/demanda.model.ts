export type Prioridade = 'Alta' | 'Média' | 'Baixa';

export type PaginaId =
  | 'inicio'
  | 'demandas'
  | 'projetos'
  | 'calendario'
  | 'pendencias'
  | 'performance'
  | 'guias'
  | 'perfil'
  | 'solicitacoes'
  | 'notificacoes';

export interface ItemMenu {
  id: PaginaId;
  icone: string;
  label: string;
  descricao: string;
}

export interface Etapa {
  id: string;
  nome: string;
  descricao: string;
  cor: 'cinza' | 'azul' | 'roxo' | 'verde' | 'amarelo' | 'menta';
}

export interface Demanda {
  id: number;
  titulo: string;
  numero: string;
  etapa: string;
  prioridade: Prioridade;
  responsavel: string;
  descricao?: string;
}

export const ITENS_MENU: ItemMenu[] = [
  { id: 'inicio', icone: '⌂', label: 'Início', descricao: 'Visão geral do ambiente Synergia.' },
  { id: 'demandas', icone: '▣', label: 'Demandas', descricao: 'Acompanhe e organize as demandas por etapa.' },
  { id: 'projetos', icone: '◈', label: 'Projetos', descricao: 'Portfólio de projetos ativos da Fábrica de Talentos.' },
  { id: 'calendario', icone: '▦', label: 'Calendário', descricao: 'Cronograma de entregas, sprints e marcos.' },
  { id: 'pendencias', icone: '◇', label: 'Pendências', descricao: 'Itens aguardando revisão ou aprovação.' },
  { id: 'performance', icone: '▤', label: 'Performance', descricao: 'Indicadores visuais de evolução e entregas.' },
  { id: 'guias', icone: '♧', label: 'Guias', descricao: 'Documentação, padrões e trilhas de apoio.' },
  { id: 'perfil', icone: '♙', label: 'Perfil', descricao: 'Informações da conta e trilha de atuação.' },
  { id: 'solicitacoes', icone: '♧', label: 'Solicitações', descricao: 'Chamados internos e pedidos de suporte.' },
  { id: 'notificacoes', icone: '♧', label: 'Notificações', descricao: 'Atualizações e avisos recentes do sistema.' },
];

export const ETAPAS_KANBAN: Etapa[] = [
  {
    id: 'backlog',
    nome: 'Backlog',
    descricao: 'Aguardando elaboração do requisito',
    cor: 'cinza',
  },
  {
    id: 'a-fazer',
    nome: 'A Fazer',
    descricao: 'Requisitos aprovados, prontos para iniciar',
    cor: 'azul',
  },
  {
    id: 'aguardando-design',
    nome: 'Aguardando design',
    descricao: 'Aguardando o design ficar pronto',
    cor: 'roxo',
  },
  {
    id: 'em-andamento',
    nome: 'Em Andamento',
    descricao: 'Sendo desenvolvida no momento',
    cor: 'verde',
  },
  {
    id: 'testes',
    nome: 'Testes / HML',
    descricao: 'Em fase de homologação',
    cor: 'amarelo',
  },
  {
    id: 'producao',
    nome: 'Produção',
    descricao: 'Pronta ou em execução em produção',
    cor: 'menta',
  },
  {
    id: 'finalizado',
    nome: 'Finalizado',
    descricao: 'Concluída e aprovada',
    cor: 'cinza',
  },
];