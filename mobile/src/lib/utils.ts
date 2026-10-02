import type { Casa, Familia, LatLng, Membro, Rota } from './types'

export function uid(prefixo = 'id'): string {
  return `${prefixo}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`
}

export function hoje(): string {
  return new Date().toISOString()
}

export function formatarData(iso: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('pt-BR')
}

export function moeda(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function idade(nascimento: string): number | null {
  if (!nascimento) return null
  const nasc = new Date(nascimento)
  if (Number.isNaN(nasc.getTime())) return null
  const hoje = new Date()
  let anos = hoje.getFullYear() - nasc.getFullYear()
  const m = hoje.getMonth() - nasc.getMonth()
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) anos--
  return anos
}

/** Distância aproximada em metros entre dois pontos (fórmula de Haversine). */
export function distanciaMetros(a: LatLng, b: LatLng): number {
  const R = 6371000
  const rad = (g: number) => (g * Math.PI) / 180
  const dLat = rad(b.lat - a.lat)
  const dLng = rad(b.lng - a.lng)
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(s))
}

/** Comprimento total de uma rota, em metros. */
export function comprimentoRota(rota: Rota): number {
  let total = 0
  for (let i = 1; i < rota.pontos.length; i++) {
    total += distanciaMetros(rota.pontos[i - 1], rota.pontos[i])
  }
  return total
}

export function formatarDistancia(metros: number): string {
  if (metros < 1000) return `${Math.round(metros)} m`
  return `${(metros / 1000).toFixed(2)} km`
}

const CORES_CONDICAO: Record<string, string> = {
  Boa: '#16a34a',
  Regular: '#ca8a04',
  Ruim: '#ea580c',
  Intransitável: '#dc2626',
}

export function corDaCondicao(condicao: string): string {
  return CORES_CONDICAO[condicao] ?? '#64748b'
}

/**
 * Índice de vulnerabilidade da família (0 a 100). Combina renda per capita,
 * composição familiar (crianças, idosos, PCD, gestantes) e a infraestrutura
 * da casa vinculada. Serve para priorizar visitas e encaminhamentos — não
 * substitui a avaliação técnica do CRAS.
 */
export function indiceVulnerabilidade(familia: Familia, casa?: Casa | null): number {
  let pontos = 0

  const pessoas = Math.max(familia.membros.length, 1)
  const perCapita = familia.rendaMensal / pessoas
  if (perCapita <= 109) pontos += 30
  else if (perCapita <= 218) pontos += 22
  else if (perCapita <= 706) pontos += 12
  else if (perCapita <= 1412) pontos += 5

  const anos = (m: Membro) => idade(m.nascimento) ?? 30
  if (familia.membros.some((m) => anos(m) < 6)) pontos += 8
  if (familia.membros.some((m) => anos(m) >= 60)) pontos += 6
  if (familia.membros.some((m) => m.pcd)) pontos += 8
  if (familia.membros.some((m) => m.gestante)) pontos += 6
  if (familia.membros.some((m) => m.doencaCronica)) pontos += 6
  if (familia.membros.some((m) => anos(m) >= 6 && anos(m) <= 17 && !m.estuda)) pontos += 8
  if (!familia.membros.some((m) => m.trabalha)) pontos += 6

  if (casa) {
    if (!casa.aguaEncanada) pontos += 7
    if (!casa.esgoto) pontos += 6
    if (!casa.energiaEletrica) pontos += 7
    if (!casa.coletaLixo) pontos += 4
    if (casa.tipoConstrucao === 'Improvisada') pontos += 8
    else if (casa.tipoConstrucao === 'Madeira') pontos += 3
    pontos += Math.min(casa.riscos.length * 4, 10)
    if (casa.comodos > 0 && pessoas / casa.comodos > 2) pontos += 5
  }

  return Math.min(Math.round(pontos), 100)
}

export function faixaVulnerabilidade(indice: number): {
  rotulo: string
  fundo: string
  texto: string
} {
  if (indice >= 70) return { rotulo: 'Crítica', fundo: '#fee2e2', texto: '#991b1b' }
  if (indice >= 45) return { rotulo: 'Alta', fundo: '#ffedd5', texto: '#9a3412' }
  if (indice >= 25) return { rotulo: 'Média', fundo: '#fef3c7', texto: '#92400e' }
  return { rotulo: 'Baixa', fundo: '#d1fae5', texto: '#065f46' }
}

/** Divide uma string separada por vírgulas em lista de tags limpas. */
export function parseTags(texto: string): string[] {
  return texto
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}
