import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  useWindowDimensions,
  StyleSheet,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { useAuth } from '../src/store/AuthStore'

function IconeUsuario({ cor = '#94a3b8', tamanho = 20 }: { cor?: string; tamanho?: number }) {
  return (
    <View style={{ width: tamanho, height: tamanho, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: tamanho * 0.45, height: tamanho * 0.45, borderRadius: (tamanho * 0.45) / 2, backgroundColor: cor, marginBottom: tamanho * 0.08 }} />
      <View style={{ width: tamanho * 0.75, height: tamanho * 0.32, borderRadius: (tamanho * 0.75) / 2, backgroundColor: cor }} />
    </View>
  )
}

function IconeCadeado({ cor = '#94a3b8', tamanho = 20 }: { cor?: string; tamanho?: number }) {
  return (
    <View style={{ width: tamanho, height: tamanho, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: tamanho * 0.45, height: tamanho * 0.35, borderTopLeftRadius: tamanho * 0.22, borderTopRightRadius: tamanho * 0.22, borderWidth: 2.2, borderBottomWidth: 0, borderColor: cor }} />
      <View style={{ width: tamanho * 0.7, height: tamanho * 0.42, borderRadius: tamanho * 0.08, backgroundColor: cor, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: tamanho * 0.12, height: tamanho * 0.12, borderRadius: tamanho * 0.06, backgroundColor: '#fff', marginTop: tamanho * 0.04 }} />
      </View>
    </View>
  )
}

function IconeOlho({ aberto = false, cor = '#94a3b8', tamanho = 20 }: { aberto?: boolean; cor?: string; tamanho?: number }) {
  return (
    <View style={{ width: tamanho, height: tamanho, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: tamanho, height: tamanho * 0.55, borderRadius: tamanho * 0.28, borderWidth: 2, borderColor: cor, alignItems: 'center', justifyContent: 'center' }}>
        {aberto && <View style={{ width: tamanho * 0.3, height: tamanho * 0.3, borderRadius: (tamanho * 0.3) / 2, backgroundColor: cor }} />}
      </View>
      {!aberto && <View style={{ position: 'absolute', width: tamanho * 1.1, height: 2, backgroundColor: cor, transform: [{ rotate: '45deg' }] }} />}
    </View>
  )
}

function IconeEmail({ cor = '#94a3b8', tamanho = 20 }: { cor?: string; tamanho?: number }) {
  return (
    <View style={{ width: tamanho, height: tamanho, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: tamanho * 0.85, height: tamanho * 0.6, borderRadius: tamanho * 0.08, borderWidth: 1.8, borderColor: cor }}>
        <View style={{ position: 'absolute', top: -1, left: -1, width: 0, height: 0, borderLeftWidth: tamanho * 0.43, borderRightWidth: tamanho * 0.43, borderTopWidth: tamanho * 0.32, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: cor }} />
      </View>
    </View>
  )
}

function IconeAlerta({ cor = '#dc2626', tamanho = 18 }: { cor?: string; tamanho?: number }) {
  return (
    <View style={{ width: tamanho, height: tamanho, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 0, height: 0, borderLeftWidth: tamanho * 0.48, borderRightWidth: tamanho * 0.48, borderBottomWidth: tamanho * 0.85, borderBottomColor: cor, borderLeftColor: 'transparent', borderRightColor: 'transparent' }} />
      <View style={{ position: 'absolute', width: 2, height: tamanho * 0.35, backgroundColor: '#fff', top: tamanho * 0.3 }} />
      <View style={{ position: 'absolute', width: 2, height: 2, borderRadius: 1, backgroundColor: '#fff', top: tamanho * 0.7 }} />
    </View>
  )
}

function IconeChave({ cor = '#065f46', tamanho = 16 }: { cor?: string; tamanho?: number }) {
  return (
    <View style={{ width: tamanho, height: tamanho, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: tamanho * 0.4, height: tamanho * 0.4, borderRadius: (tamanho * 0.4) / 2, borderWidth: 2, borderColor: cor, marginBottom: tamanho * 0.05 }} />
      <View style={{ width: 2, height: tamanho * 0.4, backgroundColor: cor }} />
      <View style={{ position: 'absolute', bottom: tamanho * 0.1, right: tamanho * 0.2, width: tamanho * 0.22, height: 2, backgroundColor: cor }} />
    </View>
  )
}

function IconeCasa({ cor = '#065f46', tamanho = 20 }: { cor?: string; tamanho?: number }) {
  return (
    <View style={{ width: tamanho, height: tamanho, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 0, height: 0, borderLeftWidth: tamanho * 0.5, borderRightWidth: tamanho * 0.5, borderBottomWidth: tamanho * 0.35, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: cor }} />
      <View style={{ width: tamanho * 0.6, height: tamanho * 0.4, backgroundColor: cor, marginTop: tamanho * 0.02 }}>
        <View style={{ position: 'absolute', bottom: 0, left: '50%', transform: [{ translateX: -tamanho * 0.12 }], width: tamanho * 0.24, height: tamanho * 0.22, backgroundColor: '#fff' }} />
      </View>
    </View>
  )
}

export default function LoginScreen() {
  const router = useRouter()
  const { login, esqueciSenha } = useAuth()
  const { width: screenWidth, height: screenHeight } = useWindowDimensions()

  const [identificador, setIdentificador] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const [modalSenhaVisible, setModalSenhaVisible] = useState(false)
  const [emailRecuperacao, setEmailRecuperacao] = useState('')
  const [enviandoEmail, setEnviandoEmail] = useState(false)
  const [emailEnviado, setEmailEnviado] = useState(false)
  const [erroEmail, setErroEmail] = useState('')

  async function handleLogin() {
    setErro('')
    if (!identificador.trim() || !senha.trim()) {
      setErro('Preencha todos os campos.')
      return
    }
    setCarregando(true)
    const resultado = await login(identificador.trim(), senha)
    setCarregando(false)
    if (!resultado.ok) {
      setErro(resultado.erro || 'Erro ao fazer login.')
      return
    }
    router.replace('/(tabs)')
  }

  async function handleEsqueciSenha() {
    setErroEmail('')
    if (!emailRecuperacao.trim()) {
      setErroEmail('Digite seu e-mail.')
      return
    }
    setEnviandoEmail(true)
    const resultado = await esqueciSenha(emailRecuperacao)
    setEnviandoEmail(false)
    if (resultado.ok) {
      setEmailEnviado(true)
    } else {
      setErroEmail(resultado.erro || 'Erro ao enviar e-mail.')
    }
  }

  function abrirModalSenha() {
    setModalSenhaVisible(true)
    setEmailRecuperacao('')
    setEmailEnviado(false)
    setErroEmail('')
  }

  const isIdentificadorFocused = focusedField === 'identificador'
  const isSenhaFocused = focusedField === 'senha'
  const temErroIdentificador = erro && !identificador.trim()
  const temErroSenha = erro && !senha.trim()

  const scale = screenWidth / 390
  const fontScale = Math.min(scale, 1.2)
  const horizontalMargin = screenWidth * 0.05

  return (
    <KeyboardAvoidingView
      style={s.flex1}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <LinearGradient
        colors={['#065f46', '#047857', '#059669', '#34d399']}
        style={StyleSheet.absoluteFill}
      />

      {/* Círculos decorativos (bokeh) */}
      <View style={[s.bgCircle, { width: 200 * scale, height: 200 * scale, borderRadius: 100 * scale, top: -40 * scale, right: -60 * scale, backgroundColor: 'rgba(255,255,255,0.06)' }]} />
      <View style={[s.bgCircle, { width: 150 * scale, height: 150 * scale, borderRadius: 75 * scale, top: 80 * scale, left: -50 * scale, backgroundColor: 'rgba(255,255,255,0.04)' }]} />
      <View style={[s.bgCircle, { width: 100 * scale, height: 100 * scale, borderRadius: 50 * scale, bottom: 120 * scale, right: -30 * scale, backgroundColor: 'rgba(255,255,255,0.05)' }]} />
      <View style={[s.bgCircle, { width: 180 * scale, height: 180 * scale, borderRadius: 90 * scale, bottom: -40 * scale, left: -40 * scale, backgroundColor: 'rgba(255,255,255,0.03)' }]} />
      <View style={[s.bgCircle, { width: 60 * scale, height: 60 * scale, borderRadius: 30 * scale, top: screenHeight * 0.3, left: 40 * scale, backgroundColor: 'rgba(255,255,255,0.07)' }]} />
      <View style={[s.bgCircle, { width: 120 * scale, height: 120 * scale, borderRadius: 60 * scale, top: screenHeight * 0.55, right: 60 * scale, backgroundColor: 'rgba(255,255,255,0.04)' }]} />
      <View style={[s.bgCircle, { width: 80 * scale, height: 80 * scale, borderRadius: 40 * scale, top: screenHeight * 0.7, left: -20 * scale, backgroundColor: 'rgba(255,255,255,0.05)' }]} />
      <View style={[s.bgCircle, { width: 45 * scale, height: 45 * scale, borderRadius: 22.5 * scale, top: screenHeight * 0.18, right: 100 * scale, backgroundColor: 'rgba(255,255,255,0.08)' }]} />

      {/* Anéis concêntricos */}
      <View style={[s.bgRing, { width: 160 * scale, height: 160 * scale, borderRadius: 80 * scale, top: screenHeight * 0.05, left: -60 * scale, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }]} />
      <View style={[s.bgRing, { width: 120 * scale, height: 120 * scale, borderRadius: 60 * scale, top: screenHeight * 0.05 + 20 * scale, left: -40 * scale, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' }]} />
      <View style={[s.bgRing, { width: 200 * scale, height: 200 * scale, borderRadius: 100 * scale, bottom: screenHeight * 0.1, right: -80 * scale, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' }]} />
      <View style={[s.bgRing, { width: 140 * scale, height: 140 * scale, borderRadius: 70 * scale, bottom: screenHeight * 0.1 + 30 * scale, right: -50 * scale, borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)' }]} />

      {/* Linhas decorativas */}
      <View style={[s.bgLine, { width: 120 * scale, height: 1, top: screenHeight * 0.15, left: -20 * scale, transform: [{ rotate: '25deg' }], backgroundColor: 'rgba(255,255,255,0.08)' }]} />
      <View style={[s.bgLine, { width: 80 * scale, height: 1, top: screenHeight * 0.25, right: 20 * scale, transform: [{ rotate: '-15deg' }], backgroundColor: 'rgba(255,255,255,0.06)' }]} />
      <View style={[s.bgLine, { width: 150 * scale, height: 1, bottom: screenHeight * 0.3, left: 30 * scale, transform: [{ rotate: '35deg' }], backgroundColor: 'rgba(255,255,255,0.05)' }]} />
      <View style={[s.bgLine, { width: 100 * scale, height: 1, bottom: screenHeight * 0.2, right: -10 * scale, transform: [{ rotate: '-20deg' }], backgroundColor: 'rgba(255,255,255,0.07)' }]} />
      <View style={[s.bgLine, { width: 90 * scale, height: 1, top: screenHeight * 0.42, left: 50 * scale, transform: [{ rotate: '45deg' }], backgroundColor: 'rgba(255,255,255,0.06)' }]} />
      <View style={[s.bgLine, { width: 70 * scale, height: 1, top: screenHeight * 0.6, right: 70 * scale, transform: [{ rotate: '-30deg' }], backgroundColor: 'rgba(255,255,255,0.05)' }]} />
      <View style={[s.bgLine, { width: 110 * scale, height: 1, bottom: screenHeight * 0.45, left: -10 * scale, transform: [{ rotate: '20deg' }], backgroundColor: 'rgba(255,255,255,0.04)' }]} />
      <View style={[s.bgLine, { width: 60 * scale, height: 1, top: screenHeight * 0.72, left: 100 * scale, transform: [{ rotate: '-40deg' }], backgroundColor: 'rgba(255,255,255,0.06)' }]} />

      {/* Pontos decorativos */}
      <View style={[s.bgDot, { width: 6 * scale, height: 6 * scale, borderRadius: 3 * scale, top: screenHeight * 0.12, left: 60 * scale, backgroundColor: 'rgba(255,255,255,0.15)' }]} />
      <View style={[s.bgDot, { width: 4 * scale, height: 4 * scale, borderRadius: 2 * scale, top: screenHeight * 0.2, right: 80 * scale, backgroundColor: 'rgba(255,255,255,0.12)' }]} />
      <View style={[s.bgDot, { width: 5 * scale, height: 5 * scale, borderRadius: 2.5 * scale, top: screenHeight * 0.35, left: 30 * scale, backgroundColor: 'rgba(255,255,255,0.1)' }]} />
      <View style={[s.bgDot, { width: 7 * scale, height: 7 * scale, borderRadius: 3.5 * scale, bottom: screenHeight * 0.25, right: 50 * scale, backgroundColor: 'rgba(255,255,255,0.13)' }]} />
      <View style={[s.bgDot, { width: 4 * scale, height: 4 * scale, borderRadius: 2 * scale, bottom: screenHeight * 0.15, left: 80 * scale, backgroundColor: 'rgba(255,255,255,0.11)' }]} />
      <View style={[s.bgDot, { width: 5 * scale, height: 5 * scale, borderRadius: 2.5 * scale, top: screenHeight * 0.5, right: 40 * scale, backgroundColor: 'rgba(255,255,255,0.09)' }]} />
      <View style={[s.bgDot, { width: 8 * scale, height: 8 * scale, borderRadius: 4 * scale, top: screenHeight * 0.08, right: 120 * scale, backgroundColor: 'rgba(255,255,255,0.14)' }]} />
      <View style={[s.bgDot, { width: 3 * scale, height: 3 * scale, borderRadius: 1.5 * scale, top: screenHeight * 0.65, left: 110 * scale, backgroundColor: 'rgba(255,255,255,0.1)' }]} />
      <View style={[s.bgDot, { width: 6 * scale, height: 6 * scale, borderRadius: 3 * scale, bottom: screenHeight * 0.35, left: 20 * scale, backgroundColor: 'rgba(255,255,255,0.12)' }]} />
      <View style={[s.bgDot, { width: 4 * scale, height: 4 * scale, borderRadius: 2 * scale, bottom: screenHeight * 0.08, right: 100 * scale, backgroundColor: 'rgba(255,255,255,0.11)' }]} />
      <View style={[s.bgDot, { width: 5 * scale, height: 5 * scale, borderRadius: 2.5 * scale, top: screenHeight * 0.82, left: 60 * scale, backgroundColor: 'rgba(255,255,255,0.08)' }]} />
      <View style={[s.bgDot, { width: 7 * scale, height: 7 * scale, borderRadius: 3.5 * scale, top: screenHeight * 0.38, right: 25 * scale, backgroundColor: 'rgba(255,255,255,0.1)' }]} />

      {/* Formas geométricas (quadrados rotacionados) */}
      <View style={[s.bgHex, { width: 40 * scale, height: 40 * scale, top: screenHeight * 0.08, right: 30 * scale, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)', transform: [{ rotate: '45deg' }] }]} />
      <View style={[s.bgHex, { width: 30 * scale, height: 30 * scale, top: screenHeight * 0.45, left: 15 * scale, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', transform: [{ rotate: '30deg' }] }]} />
      <View style={[s.bgHex, { width: 50 * scale, height: 50 * scale, bottom: screenHeight * 0.35, right: 20 * scale, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.07)', transform: [{ rotate: '60deg' }] }]} />
      <View style={[s.bgHex, { width: 25 * scale, height: 25 * scale, bottom: screenHeight * 0.18, left: 50 * scale, borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)', transform: [{ rotate: '15deg' }] }]} />
      <View style={[s.bgHex, { width: 35 * scale, height: 35 * scale, top: screenHeight * 0.62, right: 90 * scale, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', transform: [{ rotate: '50deg' }] }]} />
      <View style={[s.bgHex, { width: 20 * scale, height: 20 * scale, top: screenHeight * 0.28, left: 90 * scale, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', transform: [{ rotate: '70deg' }] }]} />

      {/* Sinais de mais (+) */}
      <View style={[s.bgPlus, { top: screenHeight * 0.22, left: 100 * scale }]}>
        <View style={[s.bgPlusH, { width: 14 * scale, height: 1.5 * scale, backgroundColor: 'rgba(255,255,255,0.1)' }]} />
        <View style={[s.bgPlusV, { width: 1.5 * scale, height: 14 * scale, backgroundColor: 'rgba(255,255,255,0.1)' }]} />
      </View>
      <View style={[s.bgPlus, { top: screenHeight * 0.58, right: 30 * scale }]}>
        <View style={[s.bgPlusH, { width: 10 * scale, height: 1 * scale, backgroundColor: 'rgba(255,255,255,0.08)' }]} />
        <View style={[s.bgPlusV, { width: 1 * scale, height: 10 * scale, backgroundColor: 'rgba(255,255,255,0.08)' }]} />
      </View>
      <View style={[s.bgPlus, { bottom: screenHeight * 0.4, left: 15 * scale }]}>
        <View style={[s.bgPlusH, { width: 12 * scale, height: 1.5 * scale, backgroundColor: 'rgba(255,255,255,0.07)' }]} />
        <View style={[s.bgPlusV, { width: 1.5 * scale, height: 12 * scale, backgroundColor: 'rgba(255,255,255,0.07)' }]} />
      </View>
      <View style={[s.bgPlus, { bottom: screenHeight * 0.12, right: 70 * scale }]}>
        <View style={[s.bgPlusH, { width: 8 * scale, height: 1 * scale, backgroundColor: 'rgba(255,255,255,0.09)' }]} />
        <View style={[s.bgPlusV, { width: 1 * scale, height: 8 * scale, backgroundColor: 'rgba(255,255,255,0.09)' }]} />
      </View>

      {/* Triângulos */}
      <View style={[s.bgTri, { top: screenHeight * 0.32, right: 55 * scale, borderLeftWidth: 8 * scale, borderRightWidth: 8 * scale, borderBottomWidth: 14 * scale, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: 'rgba(255,255,255,0.06)' }]} />
      <View style={[s.bgTri, { bottom: screenHeight * 0.28, left: 70 * scale, borderLeftWidth: 6 * scale, borderRightWidth: 6 * scale, borderBottomWidth: 10 * scale, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: 'rgba(255,255,255,0.05)', transform: [{ rotate: '180deg' }] }]} />
      <View style={[s.bgTri, { top: screenHeight * 0.68, right: 110 * scale, borderLeftWidth: 5 * scale, borderRightWidth: 5 * scale, borderBottomWidth: 8 * scale, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: 'rgba(255,255,255,0.07)' }]} />

      <View style={[s.container, { paddingTop: screenHeight * 0.06, paddingHorizontal: horizontalMargin }]}>
        <View style={[s.logoContainer, { width: 80 * scale, height: 80 * scale, borderRadius: 24 * scale }]}>
          <View style={[s.logo, { width: 60 * scale, height: 60 * scale, borderRadius: 18 * scale }]}>
            <IconeCasa cor="#047857" tamanho={30 * scale} />
          </View>
        </View>

        <Text style={[s.titulo, { fontSize: 32 * fontScale, marginTop: 12 * scale }]}>Rede Comunidade</Text>
        <Text style={[s.subtitulo, { fontSize: 12 * fontScale, marginTop: 4 * scale }]}>
          Sistema de Apoio à Gestão Comunitária
        </Text>

        <View
          style={[
            s.card,
            { marginTop: 16 * scale, padding: 20 * scale },
          ]}
        >
          <View style={[s.usuarioContainer, { width: 72 * scale, height: 72 * scale, borderRadius: 36 * scale, alignSelf: 'center', marginBottom: 14 * scale }]}>
            <IconeUsuario cor="#059669" tamanho={36 * scale} />
          </View>
          <Text style={[s.cardTitulo, { fontSize: 24 * fontScale, letterSpacing: -0.5 }]}>Bem-vindo(a)</Text>
          <Text style={[s.cardSubtitulo, { fontSize: 12 * fontScale, marginBottom: 16 * scale }]}>
            Acesse sua conta para continuar
          </Text>

          {erro ? (
            <View style={[s.erroContainer, { marginBottom: 12 * scale, padding: 10 * scale }]}>
              <IconeAlerta cor="#fca5a5" tamanho={16 * scale} />
              <Text style={[s.erroTexto, { fontSize: 12 * fontScale }]}>{erro}</Text>
            </View>
          ) : null}

          <View
            style={[
              s.input,
              { marginBottom: 10 * scale, paddingHorizontal: 12 * scale },
              isIdentificadorFocused && s.inputFocused,
              temErroIdentificador && s.inputErro,
            ]}
          >
            <IconeUsuario
              cor={isIdentificadorFocused ? '#059669' : '#9ca3af'}
              tamanho={18 * scale}
            />
            <TextInput
              style={[s.inputTexto, { paddingVertical: 12 * scale, fontSize: 14 * fontScale, marginLeft: 10 * scale }]}
              value={identificador}
              onChangeText={setIdentificador}
              placeholder="Digite seu CPF ou e-mail"
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              onFocus={() => setFocusedField('identificador')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          <View
            style={[
              s.input,
              { marginBottom: 8 * scale, paddingHorizontal: 12 * scale },
              isSenhaFocused && s.inputFocused,
              temErroSenha && s.inputErro,
            ]}
          >
            <IconeCadeado
              cor={isSenhaFocused ? '#059669' : '#9ca3af'}
              tamanho={18 * scale}
            />
            <TextInput
              style={[s.inputTexto, { paddingVertical: 12 * scale, fontSize: 14 * fontScale, marginLeft: 10 * scale }]}
              value={senha}
              onChangeText={setSenha}
              placeholder="Digite sua senha"
              placeholderTextColor="#9ca3af"
              secureTextEntry={!mostrarSenha}
              onFocus={() => setFocusedField('senha')}
              onBlur={() => setFocusedField(null)}
            />
            <TouchableOpacity
              style={{ padding: 6 * scale }}
              onPress={() => setMostrarSenha(!mostrarSenha)}
              activeOpacity={0.7}
            >
              <IconeOlho
                aberto={mostrarSenha}
                cor={mostrarSenha ? '#059669' : '#9ca3af'}
                tamanho={18 * scale}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: 12 * scale, marginTop: 2 * scale }} activeOpacity={0.7} onPress={abrirModalSenha}>
            <Text style={[s.esqueciSenhaTexto, { fontSize: 12 * fontScale }]}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.botaoEntrar]}
            onPress={handleLogin}
            disabled={carregando}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#065f46', '#047857']}
              style={[s.botaoEntrarGradient, { paddingVertical: 14 * scale, borderRadius: 14 * scale }]}
            >
              {carregando ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={[s.botaoEntrarTexto, { fontSize: 15 * fontScale }]}>Entrar</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={[s.separador, { marginVertical: 12 * scale, gap: 10 * scale }]}>
            <View style={s.separadorLinha} />
            <Text style={[s.separadorTexto, { fontSize: 11 * fontScale }]}>ou</Text>
            <View style={s.separadorLinha} />
          </View>

          <TouchableOpacity
            style={[s.botaoCadastrar, { paddingVertical: 12 * scale, borderRadius: 14 * scale }]}
            onPress={() => router.push('/register')}
            activeOpacity={0.7}
          >
            <Text style={[s.botaoCadastrarTexto, { fontSize: 14 * fontScale }]}>Criar nova conta</Text>
          </TouchableOpacity>
        </View>

        <View style={[s.adminCard, { marginTop: 12 * scale, padding: 12 * scale }]}>
          <View style={[s.adminHeader, { gap: 6 * scale }]}>
            <IconeChave cor="#9ca3af" tamanho={12 * scale} />
            <Text style={[s.adminTitulo, { fontSize: 11 * fontScale }]}>Acesso da Presidente (Admin)</Text>
          </View>
          <View style={[s.adminLinha, { marginVertical: 6 * scale }]} />
          <Text style={[s.adminInfo, { fontSize: 10 * fontScale }]}>CPF: 000.000.000-00</Text>
          <Text style={[s.adminInfo, { fontSize: 10 * fontScale }]}>Senha: admin123</Text>
        </View>

        <Text style={[s.footer, { fontSize: 10 * fontScale, marginTop: 8 * scale }]}>v1.0.0 · Rede Comunidade</Text>
      </View>

      {/* Modal Esqueci a Senha */}
      {modalSenhaVisible && (
        <TouchableOpacity
          style={s.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalSenhaVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={[s.modalCard, { marginHorizontal: 24 * scale, padding: 20 * scale }]}
          >
            <Text style={[s.modalTitulo, { fontSize: 18 * fontScale }]}>Recuperar Senha</Text>

            {emailEnviado ? (
              <>
                <View style={[s.modalIconeSucesso, { width: 50 * scale, height: 50 * scale, borderRadius: 25 * scale }]}>
                  <Text style={{ fontSize: 24 * fontScale }}>✓</Text>
                </View>
                <Text style={[s.modalTexto, { fontSize: 13 * fontScale }]}>
                  Se o e-mail estiver cadastrado, você receberá um link e um código para criar uma nova senha.
                </Text>
                <TouchableOpacity
                  style={[s.modalBotao, { paddingVertical: 12 * scale, borderRadius: 12 * scale }]}
                  onPress={() => setModalSenhaVisible(false)}
                  activeOpacity={0.8}
                >
                  <Text style={[s.modalBotaoTexto, { fontSize: 14 * fontScale }]}>Voltar ao login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ marginTop: 12 * scale, alignItems: 'center' }}
                  onPress={() => {
                    setModalSenhaVisible(false)
                    router.push('/redefinir-senha')
                  }}
                >
                  <Text style={[s.esqueciSenhaTexto, { fontSize: 13 * fontScale }]}>Já tenho o código</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={[s.modalTexto, { fontSize: 12 * fontScale, marginBottom: 14 * scale }]}>
                  Digite o e-mail da sua conta para receber um link de redefinição de senha.
                </Text>

                {erroEmail ? (
                  <View style={[s.modalErro, { marginBottom: 10 * scale, padding: 8 * scale }]}>
                    <IconeAlerta cor="#fca5a5" tamanho={14 * scale} />
                    <Text style={[s.modalErroTexto, { fontSize: 11 * fontScale }]}>{erroEmail}</Text>
                  </View>
                ) : null}

                <View style={[s.modalInput, { marginBottom: 12 * scale, paddingHorizontal: 10 * scale }]}>
                  <IconeEmail cor="#9ca3af" tamanho={16 * scale} />
                  <TextInput
                    style={[s.modalInputTexto, { paddingVertical: 10 * scale, fontSize: 13 * fontScale, marginLeft: 8 * scale }]}
                    value={emailRecuperacao}
                    onChangeText={setEmailRecuperacao}
                    placeholder="Seu e-mail"
                    placeholderTextColor="#9ca3af"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    editable={!enviandoEmail}
                  />
                </View>

                <TouchableOpacity
                  style={[s.modalBotao, { paddingVertical: 12 * scale, borderRadius: 12 * scale, marginBottom: 8 * scale }]}
                  onPress={handleEsqueciSenha}
                  disabled={enviandoEmail}
                  activeOpacity={0.8}
                >
                  {enviandoEmail ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={[s.modalBotaoTexto, { fontSize: 14 * fontScale }]}>Enviar e-mail</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[s.modalBotaoCancelar, { paddingVertical: 10 * scale, borderRadius: 12 * scale }]}
                  onPress={() => setModalSenhaVisible(false)}
                  activeOpacity={0.7}
                >
                  <Text style={[s.modalBotaoCancelarTexto, { fontSize: 13 * fontScale }]}>Cancelar</Text>
                </TouchableOpacity>
              </>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    </KeyboardAvoidingView>
  )
}

const s = StyleSheet.create({
  flex1: { flex: 1 },
  bgCircle: {
    position: 'absolute',
  },
  bgRing: {
    position: 'absolute',
  },
  bgLine: {
    position: 'absolute',
  },
  bgDot: {
    position: 'absolute',
  },
  bgHex: {
    position: 'absolute',
    borderRadius: 4,
  },
  bgPlus: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgPlusH: {
    position: 'absolute',
  },
  bgPlusV: {
    position: 'absolute',
  },
  bgTri: {
    position: 'absolute',
    width: 0,
    height: 0,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logo: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  titulo: {
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitulo: {
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  card: {
    width: '100%',
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  cardTitulo: {
    fontWeight: '800',
    color: '#065f46',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  cardSubtitulo: {
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
  usuarioContainer: {
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  erroContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 16,
    gap: 10,
  },
  erroTexto: {
    color: '#dc2626',
    flex: 1,
    lineHeight: 18,
  },
  label: {
    fontWeight: '600',
    color: '#374151',
    marginLeft: 4,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#a7f3d0',
    backgroundColor: '#f0fdf4',
  },
  inputFocused: {
    backgroundColor: '#fff',
    borderColor: '#10b981',
  },
  inputErro: {
    backgroundColor: '#fef2f2',
    borderColor: '#fca5a5',
  },
  inputTexto: {
    flex: 1,
    color: '#1f2937',
  },
  esqueciSenhaTexto: {
    color: '#059669',
    fontWeight: '500',
  },
  botaoEntrar: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    elevation: 8,
  },
  botaoEntrarGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.3)',
  },
  botaoEntrarTexto: {
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  separador: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separadorLinha: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  separadorTexto: {
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },
  botaoCadastrar: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#10b981',
  },
  botaoCadastrarTexto: {
    color: '#10b981',
    fontWeight: '600',
  },
  adminCard: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  adminHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminTitulo: {
    fontWeight: '700',
    color: '#6b7280',
  },
  adminLinha: {
    width: 40,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  adminInfo: {
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 16,
  },
  footer: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '100%',
    borderRadius: 24,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
  },
  modalTitulo: {
    fontWeight: '800',
    color: '#065f46',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalTexto: {
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  modalIconeSucesso: {
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 12,
    color: '#059669',
  },
  modalErro: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 12,
    gap: 8,
  },
  modalErroTexto: {
    color: '#dc2626',
    flex: 1,
    lineHeight: 16,
  },
  modalInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#a7f3d0',
    backgroundColor: '#f0fdf4',
  },
  modalInputTexto: {
    flex: 1,
    color: '#1f2937',
  },
  modalBotao: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#047857',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBotaoTexto: {
    color: '#fff',
    fontWeight: '700',
  },
  modalBotaoCancelar: {
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  modalBotaoCancelarTexto: {
    color: '#6b7280',
    fontWeight: '500',
  },
})
