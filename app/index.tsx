import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { useTranslation } from '../src/i18n/useTranslation'
import { useSettingsStore } from '../src/store/settingsStore'
import { useGameStore } from '../src/store/gameStore'

export default function HomeScreen() {
  const { t } = useTranslation()
  const { language, setLanguage, targetScore, gameMode } = useSettingsStore()
  const startGame = useGameStore(s => s.startGame)

  const handleStart = (mode: 'classic' | 'modern') => {
    startGame(mode, targetScore)
    router.push('/game')
  }

  return (
    <LinearGradient colors={['#0a3520', '#0d4a2e', '#1b5e20']} style={styles.container}>
      {/* Language toggle */}
      <View style={styles.langRow}>
        <TouchableOpacity
          style={[styles.langBtn, language === 'en' && styles.langActive]}
          onPress={() => setLanguage('en')}
        >
          <Text style={[styles.langText, language === 'en' && styles.langTextActive]}>
            English
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.langBtn, language === 'si' && styles.langActive]}
          onPress={() => setLanguage('si')}
        >
          <Text style={[styles.langText, language === 'si' && styles.langTextActive]}>
            සිංහල
          </Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <View style={styles.hero}>
        <Text style={styles.titleSi}>ඔමි</Text>
        <Text style={styles.titleEn}>OMI</Text>
        <Text style={styles.subtitle}>Sri Lankan Card Game</Text>
      </View>

      {/* Menu */}
      <View style={styles.menu}>
        <Text style={styles.sectionLabel}>{t('singlePlayer')}</Text>

        <TouchableOpacity style={styles.card} onPress={() => handleStart('classic')}>
          <View style={styles.cardIcon}><Text style={styles.cardIconText}>♠</Text></View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{t('classicOmi')}</Text>
            <Text style={styles.cardDesc}>{t('classicDesc')}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, styles.cardGold]} onPress={() => handleStart('modern')}>
          <View style={styles.cardIcon}><Text style={styles.cardIconText}>⚡</Text></View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{t('modernOmi')}</Text>
            <Text style={styles.cardDesc}>{t('modernDesc')}</Text>
            <View style={styles.tagRow}>
              <View style={styles.tag}><Text style={styles.tagText}>{t('baila')}</Text></View>
              <View style={styles.tag}><Text style={styles.tagText}>{t('kiya')}</Text></View>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.cardDim]}
          onPress={() => Alert.alert(t('multiplayer'), 'Coming soon!\nOnline multiplayer is in development.')}
        >
          <View style={styles.cardIcon}><Text style={styles.cardIconText}>🌐</Text></View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{t('multiplayer')}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsLink} onPress={() => router.push('/settings')}>
          <Text style={styles.settingsText}>⚙️  {t('settings')}</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 52, paddingHorizontal: 20 },
  langRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginBottom: 12 },
  langBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  langActive: { backgroundColor: '#ffd700', borderColor: '#ffd700' },
  langText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  langTextActive: { color: '#000' },
  hero: { alignItems: 'center', marginBottom: 32 },
  titleSi: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#ffd700',
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  titleEn: { fontSize: 20, color: 'rgba(255,215,0,0.6)', letterSpacing: 8, marginTop: -6 },
  subtitle: { color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 4 },
  menu: { gap: 10 },
  sectionLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  cardGold: { borderColor: 'rgba(255,215,0,0.4)', backgroundColor: 'rgba(255,215,0,0.07)' },
  cardDim: { opacity: 0.45 },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIconText: { fontSize: 22 },
  cardInfo: { flex: 1 },
  cardTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cardDesc: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 },
  tagRow: { flexDirection: 'row', gap: 6, marginTop: 6 },
  tag: {
    backgroundColor: 'rgba(255,215,0,0.18)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagText: { color: '#ffd700', fontSize: 11, fontWeight: 'bold' },
  settingsLink: { alignItems: 'center', paddingVertical: 14 },
  settingsText: { color: 'rgba(255,255,255,0.55)', fontSize: 15 },
})
