import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal as RNModal,
  ScrollView,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { StatusBar } from 'expo-status-bar'

// ---------------------------------------------------------------------------
// FundoGradiente
// ---------------------------------------------------------------------------
export function FundoGradiente({ children }: { children: React.ReactNode }) {
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#ecfdf5', '#f0fdf4', '#f0fdfa', '#f8fafc']}
        locations={[0, 0.4, 0.7, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 200 }}>
        <LinearGradient
          colors={['rgba(16,185,129,0.08)', 'rgba(52,211,153,0.03)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </View>
      <View style={{ position: 'absolute', bottom: 0, right: 0, width: 300, height: 300 }}>
        <LinearGradient
          colors={['transparent', 'rgba(16,185,129,0.04)', 'rgba(52,211,153,0.06)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </View>
      {children}
    </View>
  )
}

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------
export function Card({
  children,
  style,
}: {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
}) {
  return <View style={[s.card, style]}>{children}</View>
}

// ---------------------------------------------------------------------------
// CardHeader
// ---------------------------------------------------------------------------
export function CardHeader({
  titulo,
  icon,
}: {
  titulo: string
  icon?: string
}) {
  return (
    <View style={s.cardHeader}>
      {icon ? <Text style={s.cardHeaderIcon}>{icon}</Text> : null}
      <Text style={s.cardHeaderTitle}>{titulo}</Text>
    </View>
  )
}

// ---------------------------------------------------------------------------
// SectionTitle
// ---------------------------------------------------------------------------
export function SectionTitle({
  titulo,
  descricao,
  acao,
  onAcao,
}: {
  titulo: string
  descricao?: string
  acao?: string
  onAcao?: () => void
}) {
  return (
    <View style={s.sectionHeader}>
      <View style={{ flex: 1 }}>
        <Text style={s.sectionTitle}>{titulo}</Text>
        {descricao ? <Text style={s.sectionDesc}>{descricao}</Text> : null}
      </View>
      {acao && onAcao ? (
        <TouchableOpacity style={s.btnPrimario} onPress={onAcao}>
          <Text style={s.btnPrimarioText}>{acao}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  )
}

// ---------------------------------------------------------------------------
// Botao
// ---------------------------------------------------------------------------
type Variante = 'primario' | 'secundario' | 'perigo' | 'fantasma'

const BOTAO_CORES: Record<Variante, { bg: string; text: string; border?: string }> = {
  primario: { bg: '#059669', text: '#fff' },
  secundario: { bg: '#f1f5f9', text: '#334155', border: '#e2e8f0' },
  perigo: { bg: '#dc2626', text: '#fff' },
  fantasma: { bg: 'transparent', text: '#475569' },
}

export function Botao({
  titulo,
  variante = 'primario',
  onPress,
  style,
  disabled,
}: {
  titulo: string
  variante?: Variante
  onPress: () => void
  style?: ViewStyle
  disabled?: boolean
}) {
  const cores = BOTAO_CORES[variante]
  return (
    <TouchableOpacity
      style={[
        s.botao,
        { backgroundColor: cores.bg, borderColor: cores.border ?? cores.bg },
        disabled && { opacity: 0.5 },
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[s.botaoText, { color: cores.text }]}>{titulo}</Text>
    </TouchableOpacity>
  )
}

// ---------------------------------------------------------------------------
// Badge
// ---------------------------------------------------------------------------
export function Badge({
  texto,
  fundo = '#f1f5f9',
  cor = '#334155',
  style,
}: {
  texto: string
  fundo?: string
  cor?: string
  style?: TextStyle
}) {
  return (
    <View style={[s.badge, { backgroundColor: fundo }, style]}>
      <Text style={[s.badgeText, { color: cor }]}>{texto}</Text>
    </View>
  )
}

// ---------------------------------------------------------------------------
// Campo (label + input)
// ---------------------------------------------------------------------------
export function Campo({
  label,
  dica,
  children,
}: {
  label: string
  dica?: string
  children: React.ReactNode
}) {
  return (
    <View style={s.campo}>
      <Text style={s.campoLabel}>{label}</Text>
      {children}
      {dica ? <Text style={s.campoDica}>{dica}</Text> : null}
    </View>
  )
}

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------
export function Input({
  value,
  onChangeText,
  placeholder,
  multiline,
  keyboardType,
  style,
}: {
  value: string
  onChangeText: (t: string) => void
  placeholder?: string
  multiline?: boolean
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad'
  style?: TextStyle
}) {
  return (
    <TextInput
      style={[s.input, multiline && s.inputMultiline, style]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#94a3b8"
      multiline={multiline}
      numberOfLines={multiline ? 4 : undefined}
      keyboardType={keyboardType}
      textAlignVertical={multiline ? 'top' : 'center'}
    />
  )
}

// ---------------------------------------------------------------------------
// Select
// ---------------------------------------------------------------------------
export function Select({
  value,
  options,
  onValueChange,
  placeholder,
}: {
  value: string
  options: readonly string[]
  onValueChange: (v: string) => void
  placeholder?: string
}) {
  const [visivel, setVisivel] = useState(false)

  return (
    <View>
      <TouchableOpacity style={s.select} onPress={() => setVisivel(true)}>
        <Text style={[s.selectText, !value && { color: '#94a3b8' }]}>
          {value || placeholder || 'Selecionar...'}
        </Text>
        <Text style={s.selectArrow}>▾</Text>
      </TouchableOpacity>

      <RNModal visible={visivel} transparent animationType="fade">
        <TouchableOpacity
          style={s.selectOverlay}
          activeOpacity={1}
          onPress={() => setVisivel(false)}
        >
          <View style={s.selectModal}>
            <ScrollView style={{ maxHeight: 300 }}>
              {options.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[s.selectOption, value === opt && s.selectOptionAtivo]}
                  onPress={() => {
                    onValueChange(opt)
                    setVisivel(false)
                  }}
                >
                  <Text
                    style={[
                      s.selectOptionText,
                      value === opt && s.selectOptionTextAtivo,
                    ]}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </RNModal>
    </View>
  )
}

// ---------------------------------------------------------------------------
// Checkbox
// ---------------------------------------------------------------------------
export function Checkbox({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <TouchableOpacity style={s.checkbox} onPress={() => onChange(!value)}>
      <View style={[s.checkboxBox, value && s.checkboxBoxChecked]}>
        {value ? <Text style={s.checkboxCheck}>✓</Text> : null}
      </View>
      <Text style={s.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  )
}

// ---------------------------------------------------------------------------
// MultiSelect
// ---------------------------------------------------------------------------
export function MultiSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: readonly string[]
  value: string[]
  onChange: (v: string[]) => void
}) {
  function toggle(item: string) {
    if (value.includes(item)) {
      onChange(value.filter((v) => v !== item))
    } else {
      onChange([...value, item])
    }
  }

  return (
    <View style={s.multiSelect}>
      <Text style={s.campoLabel}>{label}</Text>
      <View style={s.multiSelectRow}>
        {options.map((opt) => {
          const ativo = value.includes(opt)
          return (
            <TouchableOpacity
              key={opt}
              style={[s.multiSelectBtn, ativo && s.multiSelectBtnAtivo]}
              onPress={() => toggle(opt)}
            >
              <Text style={[s.multiSelectBtnText, ativo && s.multiSelectBtnTextAtivo]}>
                {opt}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

// ---------------------------------------------------------------------------
// Modal
// ---------------------------------------------------------------------------
export function Modal({
  visivel,
  onFechar,
  titulo,
  children,
}: {
  visivel: boolean
  onFechar: () => void
  titulo: string
  children: React.ReactNode
}) {
  return (
    <RNModal visible={visivel} transparent animationType="slide">
      <View style={s.modalOverlay}>
        <View style={s.modalContent}>
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>{titulo}</Text>
            <TouchableOpacity onPress={onFechar}>
              <Text style={s.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={s.modalBody} showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        </View>
      </View>
    </RNModal>
  )
}

// ---------------------------------------------------------------------------
// Vazio
// ---------------------------------------------------------------------------
export function Vazio({
  mensagem,
  acao,
  onAcao,
}: {
  mensagem: string
  acao?: string
  onAcao?: () => void
}) {
  return (
    <View style={s.vazio}>
      <Text style={s.vazioIcon}>📋</Text>
      <Text style={s.vazioText}>{mensagem}</Text>
      {acao && onAcao ? (
        <Botao titulo={acao} onPress={onAcao} variante="secundario" />
      ) : null}
    </View>
  )
}

// ---------------------------------------------------------------------------
// Estatistica
// ---------------------------------------------------------------------------
export function Estatistica({
  rotulo,
  valor,
  detalhe,
  cor,
}: {
  rotulo: string
  valor: string | number
  detalhe?: string
  cor?: string
}) {
  return (
    <View style={s.estatistica}>
      <Text style={s.estatRotulo}>{rotulo}</Text>
      <Text style={[s.estatValor, cor ? { color: cor } : null]}>{valor}</Text>
      {detalhe ? <Text style={s.estatDetalhe}>{detalhe}</Text> : null}
    </View>
  )
}

// ---------------------------------------------------------------------------
// BarraProgresso
// ---------------------------------------------------------------------------
export function BarraProgresso({
  valor,
  max = 100,
  cor = '#059669',
  altura = 8,
}: {
  valor: number
  max?: number
  cor?: string
  altura?: number
}) {
  const pct = Math.min(Math.max((valor / max) * 100, 0), 100)
  return (
    <View style={[s.barraBg, { height: altura, borderRadius: altura / 2 }]}>
      <View
        style={[
          s.barraFill,
          { width: `${pct}%`, backgroundColor: cor, height: altura, borderRadius: altura / 2 },
        ]}
      />
    </View>
  )
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------
const s = StyleSheet.create({
  // Card
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e8ecf0',
    padding: 18,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  // CardHeader
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  cardHeaderIcon: {
    fontSize: 18,
  },
  cardHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
  },

  // SectionTitle
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
  },
  sectionDesc: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },

  // Botao
  botao: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoText: {
    fontSize: 14,
    fontWeight: '600',
  },
  btnPrimario: {
    backgroundColor: '#059669',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  btnPrimarioText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },

  // Badge
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Campo
  campo: {
    marginBottom: 12,
  },
  campoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4,
  },
  campoDica: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },

  // Input
  input: {
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1e293b',
    backgroundColor: '#f0fdf4',
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },

  // Select
  select: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  selectText: {
    fontSize: 15,
    color: '#1e293b',
    flex: 1,
  },
  selectArrow: {
    fontSize: 12,
    color: '#94a3b8',
  },
  selectOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 24,
  },
  selectModal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
  },
  selectOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  selectOptionAtivo: {
    backgroundColor: '#ecfdf5',
  },
  selectOptionText: {
    fontSize: 15,
    color: '#334155',
  },
  selectOptionTextAtivo: {
    color: '#059669',
    fontWeight: '600',
  },

  // Checkbox
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxBoxChecked: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  checkboxCheck: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#334155',
  },

  // MultiSelect
  multiSelect: {
    marginBottom: 12,
  },
  multiSelectRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  multiSelectBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  multiSelectBtnAtivo: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  multiSelectBtnText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  multiSelectBtnTextAtivo: {
    color: '#fff',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  modalClose: {
    fontSize: 20,
    color: '#94a3b8',
    padding: 4,
  },
  modalBody: {
    padding: 16,
  },

  // Vazio
  vazio: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  vazioIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  vazioText: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },

  // Estatistica
  estatistica: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 12,
    minWidth: 100,
    flex: 1,
  },
  estatRotulo: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 4,
  },
  estatValor: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
  },
  estatDetalhe: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },

  // BarraProgresso
  barraBg: {
    backgroundColor: '#e2e8f0',
    width: '100%',
    overflow: 'hidden',
  },
  barraFill: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
})

// ---------------------------------------------------------------------------
// Toast / Snackbar
// ---------------------------------------------------------------------------
type ToastTipo = 'sucesso' | 'erro' | 'aviso' | 'info'

type ToastProps = {
  visivel: boolean
  mensagem: string
  tipo?: ToastTipo
  onFechar?: () => void
  duracao?: number
}

const TOAST_CORES: Record<ToastTipo, { fundo: string; icone: string; texto: string }> = {
  sucesso: { fundo: '#065f46', icone: '✓', texto: '#fff' },
  erro: { fundo: '#dc2626', icone: '✕', texto: '#fff' },
  aviso: { fundo: '#d97706', icone: '⚠', texto: '#fff' },
  info: { fundo: '#0369a1', icone: 'ℹ', texto: '#fff' },
}

export function Toast({ visivel, mensagem, tipo = 'sucesso', onFechar, duracao = 3000 }: ToastProps) {
  const cores = TOAST_CORES[tipo]

  React.useEffect(() => {
    if (visivel && onFechar && duracao > 0) {
      const timer = setTimeout(onFechar, duracao)
      return () => clearTimeout(timer)
    }
  }, [visivel, onFechar, duracao])

  if (!visivel) return null

  return (
    <View style={[toastStyles.container, { backgroundColor: cores.fundo }]}>
      <View style={toastStyles.iconeContainer}>
        <Text style={[toastStyles.icone, { color: cores.texto }]}>{cores.icone}</Text>
      </View>
      <Text style={[toastStyles.mensagem, { color: cores.texto }]} numberOfLines={2}>
        {mensagem}
      </Text>
      {onFechar && (
        <TouchableOpacity onPress={onFechar} style={toastStyles.fecharBtn}>
          <Text style={[toastStyles.fecharTexto, { color: cores.texto }]}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const toastStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 9999,
  },
  iconeContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icone: {
    fontSize: 14,
    fontWeight: '700',
  },
  mensagem: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  fecharBtn: {
    padding: 4,
    marginLeft: 8,
  },
  fecharTexto: {
    fontSize: 14,
    fontWeight: '700',
  },
})
