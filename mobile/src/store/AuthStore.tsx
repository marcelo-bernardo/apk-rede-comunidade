import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { Alert } from 'react-native'
import {
  api,
  definirAoExpirarSessao,
  ErroApi,
  lerRefreshToken,
  limparSessao,
  salvarSessao,
  temSessaoSalva,
} from '../lib/api'
import type { Usuario } from '../lib/types'

type Resultado = { ok: boolean; erro?: string }

const mensagem = (e: unknown, padrao: string) => (e instanceof ErroApi ? e.message : padrao)

// ---------------------------------------------------------------------------
// Contexto
// ---------------------------------------------------------------------------
type AuthContextType = {
  usuario: Usuario | null
  carregando: boolean
  login: (identificador: string, senha: string) => Promise<Resultado>
  register: (dados: {
    nome: string
    email: string
    cpf: string
    telefone: string
    rua: string
    senha: string
    composicaoFamiliar?: { nome: string; idade: number; escolaridade: string }[]
  }) => Promise<Resultado>
  logout: () => Promise<void>
  esqueciSenha: (email: string) => Promise<Resultado>
  redefinirSenha: (token: string, novaSenha: string) => Promise<Resultado>
  atualizarPerfil: (dados: Partial<Pick<Usuario, 'nome' | 'telefone' | 'rua'>>) => Promise<Resultado>
  aprovarCadastro: (id: string) => Promise<void>
  recusarCadastro: (id: string, motivo?: string) => Promise<void>
  recarregarUsuarios: () => Promise<void>
  listarPendentes: () => Usuario[]
  listarTodos: () => Usuario[]
}

const AuthContext = createContext<AuthContextType | null>(null)

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [carregando, setCarregando] = useState(true)

  // Restaura a sessão salva no aparelho (o api.ts renova o token se preciso).
  useEffect(() => {
    definirAoExpirarSessao(() => setUsuario(null))
    ;(async () => {
      try {
        if (await temSessaoSalva()) setUsuario(await api.get<Usuario>('/auth/me'))
      } catch {
        await limparSessao()
      } finally {
        setCarregando(false)
      }
    })()
  }, [])

  // Lista de usuários só é carregada para a diretoria (aprovações / censo).
  const recarregarUsuarios = useCallback(async () => {
    if (usuario?.perfil !== 'ADMIN') return setUsuarios([])
    try {
      setUsuarios(await api.get<Usuario[]>('/usuarios'))
    } catch (e) {
      console.warn('Falha ao listar usuários', e)
    }
  }, [usuario?.perfil])

  useEffect(() => {
    recarregarUsuarios()
  }, [recarregarUsuarios])

  // ---------------------------------------------------------------------------
  const login = useCallback(async (identificador: string, senha: string): Promise<Resultado> => {
    try {
      const r = await api.post<{ accessToken: string; refreshToken: string; usuario: Usuario }>(
        '/auth/login',
        { identificador: identificador.trim(), senha },
      )
      await salvarSessao(r.accessToken, r.refreshToken)
      setUsuario(r.usuario)
      return { ok: true }
    } catch (e) {
      return { ok: false, erro: mensagem(e, 'Erro ao fazer login. Tente novamente.') }
    }
  }, [])

  const register = useCallback<AuthContextType['register']>(async (dados) => {
    try {
      await api.post('/auth/registrar', {
        ...dados,
        composicaoFamiliar: (dados.composicaoFamiliar ?? []).filter((m) => m.nome.trim()),
      })
      return { ok: true }
    } catch (e) {
      return { ok: false, erro: mensagem(e, 'Erro ao realizar cadastro. Tente novamente.') }
    }
  }, [])

  const esqueciSenha = useCallback(async (email: string): Promise<Resultado> => {
    try {
      await api.post('/auth/esqueci-senha', { email: email.trim().toLowerCase() })
      return { ok: true }
    } catch (e) {
      return { ok: false, erro: mensagem(e, 'Erro ao enviar e-mail. Tente novamente.') }
    }
  }, [])

  const redefinirSenha = useCallback(async (token: string, novaSenha: string): Promise<Resultado> => {
    try {
      await api.post('/auth/redefinir-senha', { token: token.trim(), novaSenha })
      return { ok: true }
    } catch (e) {
      return { ok: false, erro: mensagem(e, 'Não foi possível redefinir a senha.') }
    }
  }, [])

  const atualizarPerfil = useCallback<AuthContextType['atualizarPerfil']>(async (dados) => {
    try {
      setUsuario(await api.patch<Usuario>('/auth/me', dados))
      return { ok: true }
    } catch (e) {
      return { ok: false, erro: mensagem(e, 'Não foi possível salvar.') }
    }
  }, [])

  const logout = useCallback(async () => {
    const refreshToken = await lerRefreshToken()
    api.post('/auth/logout', { refreshToken }).catch(() => {})
    await limparSessao()
    setUsuario(null)
  }, [])

  // ---------------------------------------------------------------------------
  const substituir = (u: Usuario) => setUsuarios((prev) => prev.map((x) => (x.id === u.id ? u : x)))

  const aprovarCadastro = useCallback(async (id: string) => {
    try {
      substituir(await api.post<Usuario>(`/usuarios/${id}/aprovar`))
    } catch (e) {
      Alert.alert('Erro', mensagem(e, 'Não foi possível aprovar.'))
    }
  }, [])

  const recusarCadastro = useCallback(async (id: string, motivo?: string) => {
    try {
      substituir(await api.post<Usuario>(`/usuarios/${id}/recusar`, { motivo }))
    } catch (e) {
      Alert.alert('Erro', mensagem(e, 'Não foi possível recusar.'))
    }
  }, [])

  const listarPendentes = useCallback(() => usuarios.filter((u) => u.status === 'PENDENTE'), [usuarios])
  const listarTodos = useCallback(() => usuarios, [usuarios])

  // ---------------------------------------------------------------------------
  const valor: AuthContextType = {
    usuario,
    carregando,
    login,
    register,
    logout,
    esqueciSenha,
    redefinirSenha,
    atualizarPerfil,
    aprovarCadastro,
    recusarCadastro,
    recarregarUsuarios,
    listarPendentes,
    listarTodos,
  }

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>')
  return ctx
}
