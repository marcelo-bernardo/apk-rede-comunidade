import type { ExpoConfig } from 'expo/config'

/**
 * Config dinâmica: injeta a chave do Google Maps no Android sem versionar
 * no app.json. A chave vem de GOOGLE_MAPS_API_KEY (.env local ou env do EAS).
 */
type ConfigFn = (props: { config: ExpoConfig }) => ExpoConfig

const config: ConfigFn = ({ config }) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY ?? ''
  if (!apiKey) {
    console.warn(
      '[app.config] GOOGLE_MAPS_API_KEY ausente — o mapa do Android ficará em branco no build. ' +
        'Defina em mobile/.env (local) ou na EAS Environment do profile (eas env:set).',
    )
  }
  return {
    ...config,
    android: {
      ...config.android,
      config: {
        googleMaps: {
          apiKey,
        },
      },
    },
  }
}

export default config
