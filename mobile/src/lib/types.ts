/** Coordenada geográfica simples usada por rotas, alertas, casas e negócios. */
export type LatLng = { lat: number; lng: number }

// ---------------------------------------------------------------------------
// Mapa colaborativo de rotas
// ---------------------------------------------------------------------------

export const TIPOS_ROTA = [
  'Caminho a pé',
  'Acesso de veículo',
  'Rota de transporte',
  'Rota escolar',
  'Coleta de lixo',
  'Rota de emergência',
] as const
export type TipoRota = (typeof TIPOS_ROTA)[number]

export const CONDICOES = ['Boa', 'Regular', 'Ruim', 'Intransitável'] as const
export type Condicao = (typeof CONDICOES)[number]

export type StatusValidacao = 'pendente' | 'validada' | 'recusada'

export type Rota = {
  id: string
  nome: string
  tipo: TipoRota
  condicao: Condicao
  iluminacao: boolean
  acessivel: boolean
  descricao: string
  pontos: LatLng[]
  autor: string
  criadaEm: string
  status: StatusValidacao
  /** IDs dos moradores que confirmaram que a rota existe e está como descrita. */
  confirmacoes: string[]
  autorId?: string | null
  comprimentoMetros?: number
}

export const TIPOS_ALERTA = [
  'Alagamento',
  'Buraco na via',
  'Sem iluminação',
  'Risco de deslizamento',
  'Lixo acumulado',
  'Falta de água',
  'Ponto de risco',
] as const
export type TipoAlerta = (typeof TIPOS_ALERTA)[number]

export const GRAVIDADES = ['Baixa', 'Média', 'Alta'] as const
export type Gravidade = (typeof GRAVIDADES)[number]

export type Alerta = {
  id: string
  tipo: TipoAlerta
  gravidade: Gravidade
  descricao: string
  ponto: LatLng
  autor: string
  criadoEm: string
  resolvido: boolean
  confirmacoes: string[]
  autorId?: string | null
  prioridade?: number
}

// ---------------------------------------------------------------------------
// Comércios e freelancers
// ---------------------------------------------------------------------------

export const CATEGORIAS_COMERCIO = [
  'Alimentação',
  'Mercearia / Mercado',
  'Vestuário',
  'Beleza',
  'Material de construção',
  'Farmácia / Saúde',
  'Papelaria',
  'Serviços gerais',
  'Outro',
] as const
export type CategoriaComercio = (typeof CATEGORIAS_COMERCIO)[number]

export type Comercio = {
  id: string
  nome: string
  responsavel: string
  categoria: CategoriaComercio
  descricao: string
  telefone: string
  whatsapp: boolean
  endereco: string
  horario: string
  formalizado: boolean
  cnpjMei: string
  aceitaFiado: boolean
  entrega: boolean
  ponto?: LatLng
  tags: string[]
  autor: string
  criadoEm: string
}

export const DISPONIBILIDADES = [
  'Manhã',
  'Tarde',
  'Noite',
  'Fim de semana',
  'Integral',
] as const
export type Disponibilidade = (typeof DISPONIBILIDADES)[number]

export type Freelancer = {
  id: string
  nome: string
  profissao: string
  descricao: string
  telefone: string
  whatsapp: boolean
  habilidades: string[]
  disponibilidade: Disponibilidade[]
  precoMin: number
  precoMax: number
  unidadePreco: 'hora' | 'diária' | 'serviço'
  atendeDomicilio: boolean
  temTransporte: boolean
  bairro: string
  autor: string
  criadoEm: string
}

// ---------------------------------------------------------------------------
// Casas e famílias
// ---------------------------------------------------------------------------

export const TIPOS_CONSTRUCAO = ['Alvenaria', 'Madeira', 'Mista', 'Improvisada'] as const
export type TipoConstrucao = (typeof TIPOS_CONSTRUCAO)[number]

export const SITUACOES_MORADIA = ['Própria', 'Alugada', 'Cedida', 'Ocupação'] as const
export type SituacaoMoradia = (typeof SITUACOES_MORADIA)[number]

export const RISCOS = ['Alagamento', 'Deslizamento', 'Incêndio', 'Estrutural'] as const
export type Risco = (typeof RISCOS)[number]

export type Casa = {
  id: string
  apelido: string
  endereco: string
  quadra: string
  lote: string
  tipoConstrucao: TipoConstrucao
  situacao: SituacaoMoradia
  comodos: number
  aguaEncanada: boolean
  esgoto: boolean
  energiaEletrica: boolean
  coletaLixo: boolean
  riscos: Risco[]
  ponto?: LatLng
  observacoes: string
  criadaEm: string
  totalFamilias?: number
  totalMoradores?: number
  superlotada?: boolean
}

export const PARENTESCOS = [
  'Responsável',
  'Cônjuge',
  'Filho(a)',
  'Neto(a)',
  'Pai/Mãe',
  'Irmão(ã)',
  'Outro',
] as const
export type Parentesco = (typeof PARENTESCOS)[number]

export const ESCOLARIDADES = [
  'Não alfabetizado',
  'Fundamental incompleto',
  'Fundamental completo',
  'Médio incompleto',
  'Médio completo',
  'Superior',
] as const
export type Escolaridade = (typeof ESCOLARIDADES)[number]

export type Membro = {
  id: string
  nome: string
  nascimento: string
  parentesco: Parentesco
  escolaridade: Escolaridade
  estuda: boolean
  trabalha: boolean
  pcd: boolean
  doencaCronica: boolean
  gestante: boolean
}

export const BENEFICIOS = [
  'Bolsa Família',
  'BPC',
  'Auxílio Gás',
  'Tarifa Social de Energia',
  'Cesta básica',
  'Nenhum',
] as const
export type Beneficio = (typeof BENEFICIOS)[number]

export type Familia = {
  id: string
  nomeFamilia: string
  casaId: string | null
  responsavel: string
  telefone: string
  nis: string
  rendaMensal: number
  beneficios: Beneficio[]
  membros: Membro[]
  observacoes: string
  criadaEm: string
  /** Calculados pelo servidor. */
  rendaPerCapita?: number
  indiceVulnerabilidade?: number
  faixaVulnerabilidade?: 'Crítica' | 'Alta' | 'Média' | 'Baixa'
}

// ---------------------------------------------------------------------------
// Autenticação e controle de acesso
// ---------------------------------------------------------------------------

export type Perfil = 'MORADOR' | 'ADMIN'

export type StatusCadastro = 'PENDENTE' | 'APROVADO' | 'REJEITADO'

export type Usuario = {
  id: string
  nome: string
  email: string
  cpf: string
  telefone: string
  rua: string
  /** Nunca vem da API — mantido opcional por compatibilidade. */
  senha?: string
  perfil: Perfil
  status: StatusCadastro
  criadoEm: string
  composicaoFamiliar?: { nome: string; idade: number; escolaridade: string }[]
  motivoRecusa?: string | null
}

// ---------------------------------------------------------------------------

export type Estado = {
  rotas: Rota[]
  alertas: Alerta[]
  comercios: Comercio[]
  freelancers: Freelancer[]
  casas: Casa[]
  familias: Familia[]
  /** Nome do morador logado (exibição). A autoria real vem do token na API. */
  usuario: string
}
