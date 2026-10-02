import '../global.css'

import { useEffect } from 'react'
import { Stack, useRouter, useSegments } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native'
import { AppProvider } from '../src/store/AppStore'
import { AuthProvider, useAuth } from '../src/store/AuthStore'
import { Ionicons } from '@expo/vector-icons'

function useProtectedRoute() {
  const { usuario, carregando } = useAuth()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    if (carregando) return

    const telaAtual = segments[0] ?? ''
    const isAuth = telaAtual === 'login' || telaAtual === 'register'
    // Tela pública: aberta pelo link do e-mail, com ou sem sessão.
    if (telaAtual === 'redefinir-senha') return

    if (!usuario && !isAuth) {
      router.replace('/login')
    } else if (usuario && isAuth) {
      router.replace('/(tabs)')
    }
  }, [usuario, carregando, segments])
}

function RootNavigator() {
  const { carregando } = useAuth()

  useProtectedRoute()

  if (carregando) {
    return (
      <View style={splashStyles.container}>
        <View style={splashStyles.logoContainer}>
          <View style={splashStyles.logoCircle}>
            <Ionicons name="home" size={40} color="#059669" />
          </View>
        </View>
        <Text style={splashStyles.titulo}>Rede Comunidade</Text>
        <Text style={splashStyles.subtitulo}>Sistema de Apoio à Gestão Comunitária</Text>
        <ActivityIndicator size="small" color="#059669" style={{ marginTop: 24 }} />
      </View>
    )
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#ecfdf5' },
        headerTintColor: '#065f46',
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: '#f0fdf4' },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="login"
        options={{ headerShown: false, animation: 'fade' }}
      />
      <Stack.Screen
        name="register"
        options={{ title: 'Cadastro', animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="redefinir-senha"
        options={{ title: 'Nova senha', animation: 'slide_from_right' }}
      />
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppProvider>
        <StatusBar style="dark" />
        <RootNavigator />
      </AppProvider>
    </AuthProvider>
  )
}

const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#ecfdf5',
    borderWidth: 2,
    borderColor: '#a7f3d0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#065f46',
    letterSpacing: -0.5,
  },
  subtitulo: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
})
