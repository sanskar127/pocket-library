import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
  LayoutRectangle,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  ViewStyle,
} from 'react-native'
import { Video, AVPlaybackStatus, AVPlaybackStatusSuccess } from 'expo-av'

// Fix: AVPlaybackStatus is a union. Narrow to AVPlaybackStatusSuccess before accessing fields.

import type { ResizeMode } from 'react-native'

type Props = {
  source: { uri: string } | number
  poster?: string | null
  style?: ViewStyle
  autoPlay?: boolean
  resizeMode?: ResizeMode
  showFullscreenButton?: boolean
  onEnd?: () => void
} | number
  poster?: string | null
  style?: ViewStyle
  autoPlay?: boolean
  resizeMode?: 'cover' | 'contain' | 'stretch'
  showFullscreenButton?: boolean
  onEnd?: () => void
}

export default function CustomVideoPlayer({
  source,
  poster = null,
  style,
  autoPlay = false,
  resizeMode = 'contain',
  showFullscreenButton = true,
  onEnd,
}: Props) {
  const videoRef = useRef<Video | null>(null)
  const [status, setStatus] = useState<AVPlaybackStatusSuccess | null>(null)
  const [isBuffering, setIsBuffering] = useState(false)
  const [controlsVisible, setControlsVisible] = useState(true)
  const [isSeeking, setIsSeeking] = useState(false)
  const [seekPosition, setSeekPosition] = useState(0)

  useEffect(() => {
    if (autoPlay) playAsync()
  }, [])

  useEffect(() => {
    if (!controlsVisible) return
    const t = setTimeout(() => setControlsVisible(false), 3000)
    return () => clearTimeout(t)
  }, [controlsVisible, status?.isPlaying])

  const playAsync = async () => {
    try {
      await videoRef.current?.playAsync()
    } catch (e) {
      console.warn('playAsync error', e)
    }
  }

  const pauseAsync = async () => {
    try {
      await videoRef.current?.pauseAsync()
    } catch (e) {
      console.warn('pauseAsync error', e)
    }
  }

  const togglePlayPause = async () => {
    if (!status) return
    if (status.isPlaying) await pauseAsync()
    else await playAsync()
    setControlsVisible(true)
  }

  const onPlaybackStatusUpdate = (s: AVPlaybackStatus) => {
    if (!s.isLoaded) {
      setStatus(null)
      return
    }
    setStatus(s)
    setIsBuffering(s.isBuffering)
    if (s.didJustFinish && !s.isLooping) {
      onEnd && onEnd()
      setControlsVisible(true)
    }
  }

  const enterFullscreen = async () => {
    try {
      if (Platform.OS === 'web') return
      await (videoRef.current as any)?.presentFullscreenPlayer()
    } catch (e) {
      console.warn('fullscreen error', e)
    }
  }

  const seekTo = async (fraction: number) => {
    if (!status || !status.durationMillis) return
    const ms = Math.floor(Math.max(0, Math.min(1, fraction)) * status.durationMillis)
    try {
      await videoRef.current?.setPositionAsync(ms)
      setSeekPosition(ms)
    } catch (e) {
      console.warn('seek error', e)
    }
  }

  const formatTime = (ms?: number) => {
    if (ms === undefined || ms === null || Number.isNaN(ms)) return '00:00'
    const total = Math.floor(ms / 1000)
    const s = total % 60
    const m = Math.floor((total % 3600) / 60)
    const h = Math.floor(total / 3600)
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const videoWidth = Dimensions.get('window').width
  const videoHeight = (videoWidth * 9) / 16

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => setControlsVisible(v => !v)}
      style={[{ width: '100%' }, style]}
    >
      <View style={[styles.container, { height: videoHeight }]}> 
        {poster && !status?.isPlaying && (
          <Image source={{ uri: poster }} style={[styles.poster, { width: '100%', height: videoHeight }]} />
        )}

        <Video
          ref={videoRef}
          source={source}
          style={{ width: '100%', height: videoHeight, backgroundColor: 'black' }}
          resizeMode={resizeMode}
          onPlaybackStatusUpdate={onPlaybackStatusUpdate}
          useNativeControls={false}
          isLooping={false}
        />

        {isBuffering && (
          <View style={styles.bufferingContainer} pointerEvents="none">
            <ActivityIndicator size="large" />
          </View>
        )}

        {controlsVisible && (
          <View style={[styles.controlsOverlay, { height: videoHeight }]}> 
            <View style={styles.topRow}>
              <Text style={styles.whiteText}>{status ? 'Playing' : 'Loading'}</Text>
            </View>

            <View style={styles.centerRow}>
              <TouchableOpacity onPress={togglePlayPause} style={styles.playPauseBtn}>
                <Text style={styles.whiteText}>{status?.isPlaying ? '❚❚' : '►'}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.bottomRow}>
              <View style={styles.timeRow}>
                <Text style={styles.smallWhite}>{formatTime(status?.positionMillis)}</Text>
                <Text style={styles.smallWhite}>{formatTime(status?.durationMillis)}</Text>
              </View>

              <View style={{ flex: 1, marginHorizontal: 10 }}>
                <SimpleSlider
                  position={status?.positionMillis ?? 0}
                  duration={status?.durationMillis ?? 0}
                  onSeek={async fraction => {
                    setIsSeeking(true)
                    await seekTo(fraction)
                    setIsSeeking(false)
                  }}
                />
              </View>

              <View style={styles.rowRight}>
                {showFullscreenButton && (
                  <TouchableOpacity onPress={enterFullscreen} style={styles.iconBtn}>
                    <Text style={styles.whiteText}>⤢</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}

function SimpleSlider({
  position,
  duration,
  onSeek,
}: {
  position: number
  duration: number
  onSeek: (fraction: number) => void
}) {
  const trackRef = useRef<View | null>(null)
  const trackLayout = useRef<LayoutRectangle | null>(null)

  const getFractionFromGesture = (gestureX: number) => {
    if (!trackLayout.current) return 0
    const x = Math.max(0, Math.min(trackLayout.current.width, gestureX - trackLayout.current.x))
    return x / trackLayout.current.width
  }

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e: GestureResponderEvent, s: PanResponderGestureState) => {
        const { locationX } = e.nativeEvent
        const frac = trackLayout.current ? Math.max(0, Math.min(1, locationX / (trackLayout.current.width || 1))) : 0
        onSeek(frac)
      },
      onPanResponderMove: (e: GestureResponderEvent, s: PanResponderGestureState) => {
        const moveX = s.moveX ?? e.nativeEvent.pageX
        const frac = getFractionFromGesture(moveX)
        onSeek(frac)
      },
      onPanResponderRelease: () => {},
      onPanResponderTerminationRequest: () => true,
    })
  ).current

  const fraction = duration > 0 ? Math.max(0, Math.min(1, position / duration)) : 0

  return (
    <View
      ref={r => { trackRef.current = r }}
      onLayout={ev => {
        trackLayout.current = ev.nativeEvent.layout
      }}
      style={styles.sliderTrack}
      {...pan.panHandlers}
    >
      <View style={[styles.sliderFilled, { flex: fraction }]} />
      <View style={[styles.sliderEmpty, { flex: 1 - fraction }]} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { width: '100%', backgroundColor: '#000', overflow: 'hidden', borderRadius: 8 },
  poster: { position: 'absolute', zIndex: 0, resizeMode: 'cover' },
  bufferingContainer: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', zIndex: 30 },
  controlsOverlay: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 40, justifyContent: 'space-between', padding: 8 },
  topRow: { marginTop: 6, alignItems: 'flex-start' },
  centerRow: { alignItems: 'center', justifyContent: 'center' },
  playPauseBtn: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)' },
  bottomRow: { paddingBottom: 6, flexDirection: 'row', alignItems: 'center' },
  timeRow: { position: 'absolute', left: 8, bottom: 36, flexDirection: 'row', justifyContent: 'space-between', width: 120 },
  rowRight: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { padding: 6, marginRight: 6 },
  whiteText: { color: '#fff', fontSize: 14 },
  smallWhite: { color: '#fff', fontSize: 12 },
  sliderTrack: { height: 24, borderRadius: 4, overflow: 'hidden', backgroundColor: '#444', flexDirection: 'row', alignItems: 'center' },
  sliderFilled: { height: 4, backgroundColor: '#fff', marginHorizontal: 8, borderRadius: 2 },
  sliderEmpty: { height: 4, backgroundColor: 'rgba(255,255,255,0.3)', marginHorizontal: 8, borderRadius: 2 },
})
