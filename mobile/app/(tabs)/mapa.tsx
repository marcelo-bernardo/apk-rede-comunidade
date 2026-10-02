import React, { useState, useMemo, useRef, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native'
import MapView, { Marker, Polyline, Callout } from 'react-native-maps'
import * as Location from 'expo-location'
import { useApp } from '../../src/store/AppStore'
import { useAuth } from '../../src/store/AuthStore'
import {
  Botao,
  Badge,
  Modal,
  Campo,
  Input,
  Select,
  Checkbox,
  Card,
} from '../../src/components/ui'
import {
  TIPOS_ROTA,
  CONDICOES,
  TIPOS_ALERTA,
  GRAVIDADES,
  type TipoRota,
  type Condicao,
  type TipoAlerta,
  type Gravidade,
  type Rota,
  type Alerta,
  type LatLng,
} from '../../src/lib/types'
import {
  corDaCondicao,
  comprimentoRota,
  formatarDistancia,
  uid,
  hoje,
} from '../../src/lib/utils'
import { CENTRO_PADRAO } from '../../src/lib/seed'

const { width } = Dimensions.get('window')

const CORES_GRAVIDADE: Record<string, string> = {
  Alta: '#dc2626',
  Média: '#f59e0b',
  Baixa: '#0ea5e9',
}

type ModoMapa = 'navegar' | 'desenhar' | 'alerta'

export default function Mapa() {
  const { estado, addRota, removeRota, confirmarRota, addAlerta, removeAlerta, confirmarAlerta } =
    useApp()
  const { usuario: authUsuario } = useAuth()
  const { rotas, alertas, comercios, usuario } = estado
  const meuId = authUsuario?.id ?? ''

  const mapRef = useRef<MapView>(null)
  const [modo, setModo] = useState<ModoMapa>('navegar')
  const [rascunho, setRascunho] = useState<LatLng[]>([])
  const [pontoAlerta, setPontoAlerta] = useState<LatLng | null>(null)

  // Filtros
  const [filtroRota, setFiltroRota] = useState<TipoRota | ''>('')
  const [mostrarResolvidos, setMostrarResolvidos] = useState(false)

  // Modais
  const [modalRota, setModalRota] = useState(false)
  const [modalAlerta, setModalAlerta] = useState(false)
  const [rotaDetalhe, setRotaDetalhe] = useState<Rota | null>(null)
  const [alertaDetalhe, setAlertaDetalhe] = useState<Alerta | null>(null)

  // Form rota
  const [rotaNome, setRotaNome] = useState('')
  const [rotaTipo, setRotaTipo] = useState<TipoRota>('Caminho a pé')
  const [rotaCondicao, setRotaCondicao] = useState<Condicao>('Regular')
  const [rotaIluminacao, setRotaIluminacao] = useState(false)
  const [rotaAcessivel, setRotaAcessivel] = useState(false)
  const [rotaDescricao, setRotaDescricao] = useState('')

  // Form alerta
  const [alertaTipo, setAlertaTipo] = useState<TipoAlerta>('Alagamento')
  const [alertaGravidade, setAlertaGravidade] = useState<Gravidade>('Média')
  const [alertaDescricao, setAlertaDescricao] = useState('')

  const rotasFiltradas = useMemo(() => {
    return rotas.filter((r) => {
      const matchTipo = !filtroRota || r.tipo === filtroRota
      return matchTipo
    })
  }, [rotas, filtroRota])

  const alertasFiltrados = useMemo(() => {
    return alertas.filter((a) => {
      return mostrarResolvidos || !a.resolvido
    })
  }, [alertas, mostrarResolvidos])

  useEffect(() => {
    ;(async () => {
      const { status } = await Location.getForegroundPermissionsAsync()
      if (status === 'undetermined') {
        await Location.requestForegroundPermissionsAsync()
      }
    })()
  }, [])

  function handleMapPress(e: { nativeEvent: { coordinate: LatLng } }) {
    const coord = e.nativeEvent.coordinate

    if (modo === 'desenhar') {
      setRascunho((prev) => [...prev, { lat: coord.latitude, lng: coord.longitude }])
    } else if (modo === 'alerta') {
      setPontoAlerta({ lat: coord.latitude, lng: coord.longitude })
      setModalAlerta(true)
    }
  }

  async function salvarRota() {
    if (rascunho.length < 2) {
      Alert.alert('Erro', 'Desenhe ao menos 2 pontos para criar uma rota.')
      return
    }
    if (!rotaNome.trim()) {
      Alert.alert('Erro', 'Dê um nome à rota.')
      return
    }

    const criada = await addRota({
      nome: rotaNome.trim(),
      tipo: rotaTipo,
      condicao: rotaCondicao,
      iluminacao: rotaIluminacao,
      acessivel: rotaAcessivel,
      descricao: rotaDescricao.trim(),
      pontos: rascunho,
      autor: usuario,
      status: 'pendente',
      confirmacoes: [],
    })
    if (!criada) return

    setRascunho([])
    setModalRota(false)
    limparFormRota()
    Alert.alert('Sucesso', 'Rota criada!')
  }

  async function salvarAlerta() {
    if (!pontoAlerta) return

    const criado = await addAlerta({
      tipo: alertaTipo,
      gravidade: alertaGravidade,
      descricao: alertaDescricao.trim(),
      ponto: pontoAlerta,
      autor: usuario,
      resolvido: false,
      confirmacoes: [],
    })
    if (!criado) return

    setPontoAlerta(null)
    setModalAlerta(false)
    limparFormAlerta()
    Alert.alert('Sucesso', 'Alerta criado!')
  }

  function limparFormRota() {
    setRotaNome('')
    setRotaTipo('Caminho a pé')
    setRotaCondicao('Regular')
    setRotaIluminacao(false)
    setRotaAcessivel(false)
    setRotaDescricao('')
  }

  function limparFormAlerta() {
    setAlertaTipo('Alagamento')
    setAlertaGravidade('Média')
    setAlertaDescricao('')
  }

  async function centralizarLocalizacao() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Precisamos de permissão para acessar sua localização.')
        return
      }
      const location = await Location.getCurrentPositionAsync({})
      mapRef.current?.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      })
    } catch {
      Alert.alert('Erro', 'Não foi possível obter sua localização.')
    }
  }

  function excluirRota(r: Rota) {
    Alert.alert('Excluir rota', `Excluir "${r.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => removeRota(r.id) },
    ])
  }

  function excluirAlerta(a: Alerta) {
    Alert.alert('Excluir alerta', `Excluir "${a.tipo}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => removeAlerta(a.id) },
    ])
  }

  function handleDesenhar() {
    if (rascunho.length < 2) {
      Alert.alert('Erro', 'Desenhe ao menos 2 pontos.')
      return
    }
    setModalRota(true)
  }

  return (
    <View style={s.container}>
      {/* Barra de modos */}
      <View style={s.toolbar}>
        <TouchableOpacity
          style={[s.modeBtn, modo === 'navegar' && s.modeBtnAtivo]}
          onPress={() => setModo('navegar')}
        >
          <Text style={[s.modeText, modo === 'navegar' && s.modeTextAtivo]}>🧭 Navegar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.modeBtn, modo === 'desenhar' && s.modeBtnDesenhar]}
          onPress={() => {
            setModo('desenhar')
            setRascunho([])
          }}
        >
          <Text style={[s.modeText, modo === 'desenhar' && s.modeTextAtivo]}>
            ✏️ Desenhar ({rascunho.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.modeBtn, modo === 'alerta' && s.modeBtnAlerta]}
          onPress={() => setModo('alerta')}
        >
          <Text style={[s.modeText, modo === 'alerta' && s.modeTextAtivo]}>🚨 Alerta</Text>
        </TouchableOpacity>
      </View>

      {/* Mapa */}
      <MapView
        ref={mapRef}
        style={s.map}
        initialRegion={{
          latitude: CENTRO_PADRAO.lat,
          longitude: CENTRO_PADRAO.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={handleMapPress}
        showsUserLocation
      >
        {/* Rotas */}
        {rotasFiltradas.map((r) => (
          <Polyline
            key={r.id}
            coordinates={r.pontos.map((p) => ({
              latitude: p.lat,
              longitude: p.lng,
            }))}
            strokeColor={corDaCondicao(r.condicao)}
            strokeWidth={3}
            lineDashPattern={r.status === 'pendente' ? [5, 5] : undefined}
          />
        ))}

        {/* Rascunho */}
        {rascunho.length > 0 && (
          <Polyline
            coordinates={rascunho.map((p) => ({
              latitude: p.lat,
              longitude: p.lng,
            }))}
            strokeColor="#2563eb"
            strokeWidth={3}
          />
        )}

        {/* Alertas */}
        {alertasFiltrados.map((a) => (
          <Marker
            key={a.id}
            coordinate={{ latitude: a.ponto.lat, longitude: a.ponto.lng }}
            pinColor={CORES_GRAVIDADE[a.gravidade]}
          >
            <Callout onPress={() => setAlertaDetalhe(a)}>
              <View style={s.callout}>
                <Text style={s.calloutTitle}>{a.tipo}</Text>
                <Text style={s.calloutSub}>Gravidade: {a.gravidade}</Text>
              </View>
            </Callout>
          </Marker>
        ))}

        {/* Comércios */}
        {comercios
          .filter((c) => c.ponto)
          .map((c) => (
            <Marker
              key={c.id}
              coordinate={{
                latitude: c.ponto!.lat,
                longitude: c.ponto!.lng,
              }}
              pinColor="#7c3aed"
            >
              <Callout>
                <View style={s.callout}>
                  <Text style={s.calloutTitle}>{c.nome}</Text>
                  <Text style={s.calloutSub}>{c.categoria}</Text>
                </View>
              </Callout>
            </Marker>
          ))}

        {/* Marcador de alerta pendente */}
        {pontoAlerta && (
          <Marker
            coordinate={{
              latitude: pontoAlerta.lat,
              longitude: pontoAlerta.lng,
            }}
            pinColor="#dc2626"
          />
        )}
      </MapView>

      {/* Botão centralizar localização */}
      <TouchableOpacity style={s.locationBtn} onPress={centralizarLocalizacao}>
        <Text style={s.locationBtnText}>📍</Text>
      </TouchableOpacity>

      {/* Legenda */}
      <View style={s.legend}>
        <Text style={s.legendTitle}>Legenda</Text>
        <View style={s.legendItem}>
          <View style={[s.legendDot, { backgroundColor: '#dc2626' }]} />
          <Text style={s.legendText}>Alerta Alta</Text>
        </View>
        <View style={s.legendItem}>
          <View style={[s.legendDot, { backgroundColor: '#f59e0b' }]} />
          <Text style={s.legendText}>Alerta Média</Text>
        </View>
        <View style={s.legendItem}>
          <View style={[s.legendDot, { backgroundColor: '#0ea5e9' }]} />
          <Text style={s.legendText}>Alerta Baixa</Text>
        </View>
        <View style={s.legendItem}>
          <View style={[s.legendDot, { backgroundColor: '#7c3aed' }]} />
          <Text style={s.legendText}>Comércio</Text>
        </View>
        <View style={s.legendItem}>
          <View style={[s.legendLine, { backgroundColor: '#22c55e' }]} />
          <Text style={s.legendText}>Rota Boa</Text>
        </View>
        <View style={s.legendItem}>
          <View style={[s.legendLine, { backgroundColor: '#f59e0b' }]} />
          <Text style={s.legendText}>Rota Regular</Text>
        </View>
        <View style={s.legendItem}>
          <View style={[s.legendLine, { backgroundColor: '#dc2626' }]} />
          <Text style={s.legendText}>Rota Ruim</Text>
        </View>
      </View>

      {/* Botão de confirmar desenho */}
      {modo === 'desenhar' && rascunho.length >= 2 && (
        <TouchableOpacity style={s.confirmarBtn} onPress={handleDesenhar}>
          <Text style={s.confirmarBtnText}>✓ Confirmar rota ({rascunho.length} pontos)</Text>
        </TouchableOpacity>
      )}

      {/* Botão limpar rascunho */}
      {modo === 'desenhar' && rascunho.length > 0 && (
        <TouchableOpacity
          style={s.limparBtn}
          onPress={() => setRascunho([])}
        >
          <Text style={s.limparBtnText}>✕ Limpar</Text>
        </TouchableOpacity>
      )}

      {/* Modal detalhe da rota */}
      <Modal
        visivel={!!rotaDetalhe}
        onFechar={() => setRotaDetalhe(null)}
        titulo={rotaDetalhe?.nome ?? ''}
      >
        {rotaDetalhe && (
          <View>
            <Badge texto={rotaDetalhe.tipo} />
            <Badge texto={rotaDetalhe.condicao} fundo={corDaCondicao(rotaDetalhe.condicao)} cor="#fff" />
            <Badge
              texto={rotaDetalhe.status}
              fundo={rotaDetalhe.status === 'validada' ? '#d1fae5' : '#fef3c7'}
              cor={rotaDetalhe.status === 'validada' ? '#065f46' : '#92400e'}
            />
            <Text style={s.detailText}>{rotaDetalhe.descricao}</Text>
            <Text style={s.detailMeta}>
              {formatarDistancia(comprimentoRota(rotaDetalhe))} · {rotaDetalhe.confirmacoes.length} confirmação(ões)
            </Text>
            <Text style={s.detailMeta}>Por: {rotaDetalhe.autor}</Text>

            <View style={s.detailActions}>
              <Botao
                titulo={rotaDetalhe.confirmacoes.includes(meuId) ? 'Desconfirmar' : 'Confirmar'}
                variante="secundario"
                onPress={() => {
                  confirmarRota(rotaDetalhe.id)
                  setRotaDetalhe(null)
                }}
              />
              <Botao titulo="Excluir" variante="perigo" onPress={() => excluirRota(rotaDetalhe)} />
            </View>
          </View>
        )}
      </Modal>

      {/* Modal detalhe do alerta */}
      <Modal
        visivel={!!alertaDetalhe}
        onFechar={() => setAlertaDetalhe(null)}
        titulo={alertaDetalhe?.tipo ?? ''}
      >
        {alertaDetalhe && (
          <View>
            <Badge
              texto={alertaDetalhe.gravidade}
              fundo={CORES_GRAVIDADE[alertaDetalhe.gravidade]}
              cor="#fff"
            />
            <Text style={s.detailText}>{alertaDetalhe.descricao}</Text>
            <Text style={s.detailMeta}>
              {alertaDetalhe.confirmacoes.length} confirmação(ões) · Por: {alertaDetalhe.autor}
            </Text>

            <View style={s.detailActions}>
              <Botao
                titulo={alertaDetalhe.confirmacoes.includes(meuId) ? 'Desconfirmar' : 'Confirmar'}
                variante="secundario"
                onPress={() => {
                  confirmarAlerta(alertaDetalhe.id)
                  setAlertaDetalhe(null)
                }}
              />
              <Botao titulo="Excluir" variante="perigo" onPress={() => excluirAlerta(alertaDetalhe)} />
            </View>
          </View>
        )}
      </Modal>

      {/* Modal nova rota */}
      <Modal visivel={modalRota} onFechar={() => setModalRota(false)} titulo="Descrever rota">
        <Campo label="Nome da rota *">
          <Input value={rotaNome} onChangeText={setRotaNome} placeholder="Ex: Caminho da escola" />
        </Campo>

        <Campo label="Tipo">
          <Select
            value={rotaTipo}
            options={TIPOS_ROTA}
            onValueChange={(v) => setRotaTipo(v as TipoRota)}
          />
        </Campo>

        <Campo label="Condição">
          <Select
            value={rotaCondicao}
            options={CONDICOES}
            onValueChange={(v) => setRotaCondicao(v as Condicao)}
          />
        </Campo>

        <Checkbox label="Iluminação" value={rotaIluminacao} onChange={setRotaIluminacao} />
        <Checkbox label="Acessível" value={rotaAcessivel} onChange={setRotaAcessivel} />

        <Campo label="Descrição">
          <Input
            value={rotaDescricao}
            onChangeText={setRotaDescricao}
            multiline
            placeholder="Descreva a rota..."
          />
        </Campo>

        <Botao titulo="Criar rota" onPress={salvarRota} />
      </Modal>

      {/* Modal novo alerta */}
      <Modal visivel={modalAlerta} onFechar={() => setModalAlerta(false)} titulo="Novo alerta">
        <Campo label="Tipo">
          <Select
            value={alertaTipo}
            options={TIPOS_ALERTA}
            onValueChange={(v) => setAlertaTipo(v as TipoAlerta)}
          />
        </Campo>

        <Campo label="Gravidade">
          <Select
            value={alertaGravidade}
            options={GRAVIDADES}
            onValueChange={(v) => setAlertaGravidade(v as Gravidade)}
          />
        </Campo>

        <Campo label="Descrição">
          <Input
            value={alertaDescricao}
            onChangeText={setAlertaDescricao}
            multiline
            placeholder="Descreva o problema..."
          />
        </Campo>

        <Botao titulo="Criar alerta" onPress={salvarAlerta} />
      </Modal>
    </View>
  )
}

const s = StyleSheet.create({
  container: { flex: 1 },
  toolbar: {
    flexDirection: 'row',
    gap: 6,
    padding: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  modeBtnAtivo: { backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' },
  modeBtnDesenhar: { backgroundColor: '#eff6ff', borderColor: '#93c5fd' },
  modeBtnAlerta: { backgroundColor: '#fef2f2', borderColor: '#fca5a5' },
  modeText: { fontSize: 13, color: '#475569', fontWeight: '500' },
  modeTextAtivo: { color: '#065f46', fontWeight: '700' },
  map: { flex: 1 },
  locationBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  locationBtnText: {
    fontSize: 20,
  },
  legend: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  legendTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLine: {
    width: 16,
    height: 3,
    borderRadius: 1.5,
  },
  legendText: {
    fontSize: 10,
    color: '#475569',
  },
  confirmarBtn: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#059669',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  confirmarBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  limparBtn: {
    position: 'absolute',
    bottom: 70,
    right: 20,
    backgroundColor: '#fee2e2',
    padding: 10,
    borderRadius: 8,
  },
  limparBtnText: { color: '#991b1b', fontSize: 13, fontWeight: '600' },
  callout: { padding: 4, minWidth: 120 },
  calloutTitle: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
  calloutSub: { fontSize: 12, color: '#64748b' },
  detailText: { fontSize: 14, color: '#334155', marginVertical: 8, lineHeight: 20 },
  detailMeta: { fontSize: 12, color: '#64748b', marginBottom: 4 },
  detailActions: { flexDirection: 'row', gap: 8, marginTop: 12 },
})
