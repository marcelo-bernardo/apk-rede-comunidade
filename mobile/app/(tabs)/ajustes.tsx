import React, { useState, useCallback } from 'react'
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  Linking,
  Platform,
  RefreshControl,
} from 'react-native'
import { useApp } from '../../src/store/AppStore'
import { useAuth } from '../../src/store/AuthStore'
import { Card, SectionTitle, Botao, Modal, Campo, Input, Checkbox, FundoGradiente } from '../../src/components/ui'

export default function Ajustes() {
  const {
    estado,
    setUsuario,
    restaurarDemo,
    limparTudo,
    exportarJson,
    importarJson,
  } = useApp()
  const { usuario: authUsuario, logout } = useAuth()

  const [nome, setNome] = useState(estado.usuario)
  const [modalImportar, setModalImportar] = useState(false)
  const [textoImportar, setTextoImportar] = useState('')
  const { recarregar } = useApp()
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    recarregar().finally(() => setRefreshing(false))
  }, [])

  function salvarNome() {
    if (nome.trim()) {
      setUsuario(nome.trim())
      Alert.alert('Sucesso', 'Nome atualizado!')
    }
  }

  function handleExportar() {
    const json = exportarJson()
    Alert.alert('Exportar dados', json.length > 0 ? 'Dados copiados! Cole em um local seguro.' : 'Nada para exportar.')
  }

  async function handleImportar() {
    if (!textoImportar.trim()) {
      Alert.alert('Erro', 'Cole o JSON para importar.')
      return
    }
    const resultado = await importarJson(textoImportar)
    if (resultado.ok) {
      Alert.alert('Sucesso', 'Dados importados!')
      setModalImportar(false)
      setTextoImportar('')
    } else {
      Alert.alert('Erro', resultado.erro || 'Formato inválido.')
    }
  }

  function handleRestaurar() {
    Alert.alert(
      'Restaurar dados de demonstração?',
      'Todos os dados atuais serão substituídos pelos dados de exemplo.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Restaurar',
          onPress: async () => {
            await restaurarDemo()
            Alert.alert('Pronto', 'Dados de demonstração carregados.')
          },
        },
      ],
    )
  }

  function handleLimpar() {
    Alert.alert(
      'Apagar todos os dados?',
      'Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar tudo',
          style: 'destructive',
          onPress: async () => {
            await limparTudo()
            Alert.alert('Pronto', 'Os dados da comunidade foram apagados.')
          },
        },
      ],
    )
  }

  function handleLogout() {
    Alert.alert(
      'Sair da conta',
      'Deseja realmente sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => logout(),
        },
      ],
    )
  }

  return (
    <FundoGradiente>
      <ScrollView
        style={s.container}
        contentContainerStyle={s.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#059669" colors={['#059669']} />}
      >
        <SectionTitle titulo="Ajustes" descricao="Configurações e dados" />

        {/* Perfil logado */}
        {authUsuario && (
          <Card style={s.card}>
            <Text style={s.cardTitle}>Meus Dados Cadastrais</Text>
            <View style={s.dadosContainer}>
              <View style={s.dadosLinha}>
                <Text style={s.dadosLabel}>Nome:</Text>
                <Text style={s.dadosValor}>{authUsuario.nome}</Text>
              </View>
              <View style={s.dadosLinha}>
                <Text style={s.dadosLabel}>E-mail:</Text>
                <Text style={s.dadosValor}>{authUsuario.email}</Text>
              </View>
              <View style={s.dadosLinha}>
                <Text style={s.dadosLabel}>CPF:</Text>
                <Text style={s.dadosValor}>
                  {authUsuario.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
                </Text>
              </View>
              {authUsuario.telefone ? (
                <View style={s.dadosLinha}>
                  <Text style={s.dadosLabel}>Telefone:</Text>
                  <Text style={s.dadosValor}>{authUsuario.telefone}</Text>
                </View>
              ) : null}
              {authUsuario.rua ? (
                <View style={s.dadosLinha}>
                  <Text style={s.dadosLabel}>Endereço:</Text>
                  <Text style={s.dadosValor}>{authUsuario.rua}</Text>
                </View>
              ) : null}
              <View style={s.dadosLinha}>
                <Text style={s.dadosLabel}>Perfil:</Text>
                <Text style={s.dadosValor}>
                  {authUsuario.perfil === 'ADMIN' ? 'Presidente (Admin)' : 'Morador'}
                </Text>
              </View>
              <View style={s.dadosLinha}>
                <Text style={s.dadosLabel}>Status:</Text>
                <Text style={[s.dadosValor, { color: authUsuario.status === 'APROVADO' ? '#16a34a' : '#dc2626', fontWeight: '600' }]}>
                  {authUsuario.status === 'APROVADO' ? 'Aprovado' : authUsuario.status === 'PENDENTE' ? 'Pendente' : 'Recusado'}
                </Text>
              </View>
            </View>
            <Botao titulo="Sair da conta" variante="perigo" onPress={handleLogout} />
          </Card>
        )}

        {/* Usuário */}
        <Card style={s.card}>
          <Text style={s.cardTitle}>Contribuinte</Text>
          <Text style={s.cardDesc}>
            Seu nome é usado como autor nas contribuições.
          </Text>
          <View style={s.nomeRow}>
            <TextInput
              style={s.nomeInput}
              value={nome}
              onChangeText={setNome}
              placeholder="Seu nome"
              placeholderTextColor="#94a3b8"
            />
            <Botao titulo="Salvar" onPress={salvarNome} />
          </View>
        </Card>

        {/* Ferramentas de dados — só a diretoria (o servidor também bloqueia) */}
        {authUsuario?.perfil === 'ADMIN' && (<>
        {/* Backup */}
        <Card style={s.card}>
          <Text style={s.cardTitle}>Backup e restauração</Text>
          <Text style={s.cardDesc}>
            Exporte ou importe os dados da comunidade em formato JSON.
          </Text>

          <View style={s.botoes}>
            <Botao titulo="📥 Exportar JSON" variante="secundario" onPress={handleExportar} />
            <Botao titulo="📤 Importar JSON" variante="secundario" onPress={() => setModalImportar(true)} />
          </View>
        </Card>

        {/* Demonstraça */}
        <Card style={s.card}>
          <Text style={s.cardTitle}>Dados de demonstração</Text>
          <Text style={s.cardDesc}>
            Restaure os dados de exemplo para explorar o app.
          </Text>
          <Botao titulo="🔄 Restaurar demo" variante="secundario" onPress={handleRestaurar} />
        </Card>

        {/* Limpar */}
        <Card style={[s.card, { borderColor: '#fca5a5' }]}>
          <Text style={[s.cardTitle, { color: '#dc2626' }]}>Zona de perigo</Text>
          <Text style={s.cardDesc}>
            Apague todos os dados da comunidade. Esta ação é irreversível.
          </Text>
          <Botao titulo="🗑️ Apagar tudo" variante="perigo" onPress={handleLimpar} />
        </Card>
        </>)}

        {/* Sobre */}
        <Card style={s.card}>
          <Text style={s.cardTitle}>Sobre</Text>
          <Text style={s.sobre}>
            Rede Comunidade v1.0{'\n'}
            Plataforma de mapeamento colaborativo para comunidades carentes.{'\n\n'}
            Dados sincronizados com o servidor da comunidade.
          </Text>
        </Card>

        <Modal
          visivel={modalImportar}
          onFechar={() => {
            setModalImportar(false)
            setTextoImportar('')
          }}
          titulo="Importar dados"
        >
          <Campo label="Cole o JSON abaixo">
            <Input
              value={textoImportar}
              onChangeText={setTextoImportar}
              multiline
              placeholder='{"rotas":[], "familias":[], ...}'
            />
          </Campo>
          <Botao titulo="Importar" onPress={handleImportar} />
        </Modal>
      </ScrollView>
    </FundoGradiente>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  content: { padding: 16, paddingBottom: 32 },
  card: { marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
  cardDesc: { fontSize: 13, color: '#64748b', marginBottom: 12 },
  perfilRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  perfilInfo: { flex: 1 },
  perfilNome: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
  perfilDetalhe: { fontSize: 13, color: '#64748b', marginTop: 2 },
  dadosContainer: { marginBottom: 12 },
  dadosLinha: { flexDirection: 'row', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  dadosLabel: { fontSize: 13, fontWeight: '600', color: '#64748b', width: 85 },
  dadosValor: { fontSize: 13, color: '#1e293b', flex: 1 },
  nomeRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  nomeInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1e293b',
  },
  botoes: { gap: 8 },
  sobre: { fontSize: 13, color: '#475569', lineHeight: 20 },
})
