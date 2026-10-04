import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { StyleSheet } from 'react-native'
import { WebView, type WebViewMessageEvent } from 'react-native-webview'
import type { LatLng } from '../lib/types'

/**
 * Mapa Leaflet + OpenStreetMap dentro de uma WebView.
 * Não depende de chave do Google: os tiles vêm do CARTO (dados do OpenStreetMap).
 */

export type LinhaMapa = { id: string; pontos: LatLng[]; cor: string; tracejada?: boolean }
export type PinoMapa = {
  id: string
  ponto: LatLng
  cor: string
  titulo: string
  subtitulo?: string
  /** Mostra "Ver detalhes" no balão e dispara onPino ao tocar. */
  detalhes?: boolean
}

export type MapaLeafletHandle = { centralizar: (p: LatLng, zoom?: number) => void }

type Props = {
  centro: LatLng
  linhas: LinhaMapa[]
  pinos: PinoMapa[]
  rascunho: LatLng[]
  usuario: LatLng | null
  onToque: (p: LatLng) => void
  onLinha?: (id: string) => void
  onPino?: (id: string) => void
}

type Mensagem =
  | { tipo: 'pronto' }
  | { tipo: 'toque'; lat: number; lng: number }
  | { tipo: 'linha'; id: string }
  | { tipo: 'pino'; id: string }

export const MapaLeaflet = forwardRef<MapaLeafletHandle, Props>(function MapaLeaflet(
  { centro, linhas, pinos, rascunho, usuario, onToque, onLinha, onPino },
  ref,
) {
  const webRef = useRef<WebView>(null)
  const [pronto, setPronto] = useState(false)
  // O HTML é montado uma vez só; o centro inicial não deve recarregar a página.
  const [html] = useState(() => montarHtml(centro))

  useImperativeHandle(ref, () => ({
    centralizar(p, zoom = 16) {
      webRef.current?.injectJavaScript(`window.centralizar(${p.lat}, ${p.lng}, ${zoom}); true;`)
    },
  }))

  useEffect(() => {
    if (!pronto) return
    const dados = JSON.stringify({ linhas, pinos, rascunho, usuario })
    webRef.current?.injectJavaScript(`window.desenhar(${dados}); true;`)
  }, [pronto, linhas, pinos, rascunho, usuario])

  function receber(e: WebViewMessageEvent) {
    let msg: Mensagem
    try {
      msg = JSON.parse(e.nativeEvent.data)
    } catch {
      return
    }
    if (msg.tipo === 'pronto') setPronto(true)
    else if (msg.tipo === 'toque') onToque({ lat: msg.lat, lng: msg.lng })
    else if (msg.tipo === 'linha') onLinha?.(msg.id)
    else if (msg.tipo === 'pino') onPino?.(msg.id)
  }

  return (
    <WebView
      ref={webRef}
      style={s.mapa}
      originWhitelist={['*']}
      source={{ html, baseUrl: 'https://rede-comunidade.local/' }}
      onMessage={receber}
      onLoadStart={() => setPronto(false)}
      javaScriptEnabled
      domStorageEnabled
      setSupportMultipleWindows={false}
    />
  )
})

function montarHtml(centro: LatLng) {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
  html, body, #mapa { margin: 0; padding: 0; height: 100%; width: 100%; background: #e5e7eb; }
  .titulo { font-weight: 700; font-size: 14px; color: #0f172a; }
  .sub { font-size: 12px; color: #64748b; margin-top: 2px; }
  .det { display: inline-block; margin-top: 6px; font-size: 13px; color: #059669; font-weight: 600; }
</style>
</head>
<body>
<div id="mapa"></div>
<script>
  function enviar(m) { window.ReactNativeWebView.postMessage(JSON.stringify(m)) }

  var mapa = L.map('mapa', { zoomControl: false }).setView([${centro.lat}, ${centro.lng}], 15)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    subdomains: 'abcd',
    attribution: '&copy; OpenStreetMap &copy; CARTO',
  }).addTo(mapa)

  var camada = L.layerGroup().addTo(mapa)

  mapa.on('click', function (e) { enviar({ tipo: 'toque', lat: e.latlng.lat, lng: e.latlng.lng }) })

  function balao(p) {
    var div = document.createElement('div')
    var t = document.createElement('div'); t.className = 'titulo'; t.textContent = p.titulo; div.appendChild(t)
    if (p.subtitulo) { var s = document.createElement('div'); s.className = 'sub'; s.textContent = p.subtitulo; div.appendChild(s) }
    if (p.detalhes) {
      var a = document.createElement('a'); a.className = 'det'; a.textContent = 'Ver detalhes'; a.href = '#'
      a.onclick = function (ev) { ev.preventDefault(); enviar({ tipo: 'pino', id: p.id }) }
      div.appendChild(a)
    }
    return div
  }

  function ll(p) { return [p.lat, p.lng] }

  window.desenhar = function (d) {
    camada.clearLayers()
    d.linhas.forEach(function (r) {
      var pts = r.pontos.map(ll)
      L.polyline(pts, { color: r.cor, weight: 4, dashArray: r.tracejada ? '6,6' : null, interactive: false }).addTo(camada)
      // Linha invisível e larga para facilitar o toque no celular.
      L.polyline(pts, { opacity: 0, weight: 22, bubblingMouseEvents: false })
        .on('click', function () { enviar({ tipo: 'linha', id: r.id }) })
        .addTo(camada)
    })
    if (d.rascunho.length > 0) {
      L.polyline(d.rascunho.map(ll), { color: '#2563eb', weight: 4, interactive: false }).addTo(camada)
      d.rascunho.forEach(function (p) {
        L.circleMarker(ll(p), { radius: 4, color: '#2563eb', fillColor: '#fff', fillOpacity: 1, weight: 2, interactive: false }).addTo(camada)
      })
    }
    d.pinos.forEach(function (p) {
      L.circleMarker(ll(p.ponto), { radius: 9, color: '#fff', weight: 2, fillColor: p.cor, fillOpacity: 1, bubblingMouseEvents: false })
        .bindPopup(balao(p))
        .addTo(camada)
    })
    if (d.usuario) {
      L.circleMarker(ll(d.usuario), { radius: 8, color: '#fff', weight: 3, fillColor: '#2563eb', fillOpacity: 1, interactive: false }).addTo(camada)
    }
  }

  window.centralizar = function (lat, lng, zoom) { mapa.flyTo([lat, lng], zoom) }

  enviar({ tipo: 'pronto' })
</script>
</body>
</html>`
}

const s = StyleSheet.create({
  mapa: { flex: 1 },
})
