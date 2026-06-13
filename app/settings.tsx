import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { useTranslation } from '../src/i18n/useTranslation'
import { useSettingsStore } from '../src/store/settingsStore'

export default function SettingsScreen() {
  const { t } = useTranslation()
  const {
    language, difficulty, gameMode, targetScore, soundEnabled,
    setLanguage, setDifficulty, setGameMode, setTargetScore, setSoundEnabled,
  } = useSettingsStore()

  return (
    <LinearGradient colors={['#0a3520', '#0d4a2e']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← {t('back')}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('settings')}</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Section title={t('language')}>
          <Chips
            items={[{ k: 'en', l: 'English' }, { k: 'si', l: 'සිංහල' }]}
            value={language}
            onChange={v => setLanguage(v as any)}
          />
        </Section>

        <Section title={t('gameMode')}>
          <Chips
            items={[{ k: 'classic', l: t('classicOmi') }, { k: 'modern', l: t('modernOmi') }]}
            value={gameMode}
            onChange={v => setGameMode(v as any)}
          />
        </Section>

        <Section title={t('difficulty')}>
          <Chips
            items={[
              { k: 'easy', l: t('easy') },
              { k: 'medium', l: t('medium') },
              { k: 'hard', l: t('hard') },
            ]}
            value={difficulty}
            onChange={v => setDifficulty(v as any)}
          />
        </Section>

        <Section title={t('targetScore')}>
          <Chips
            items={[{ k: '11', l: '11' }, { k: '21', l: '21' }, { k: '31', l: '31' }]}
            value={String(targetScore)}
            onChange={v => setTargetScore(Number(v))}
          />
        </Section>

        <Section title={t('sound')}>
          <Switch
            value={soundEnabled}
            onValueChange={setSoundEnabled}
            trackColor={{ false: 'rgba(255,255,255,0.2)', true: '#ffd700' }}
            thumbColor={soundEnabled ? '#fff' : '#aaa'}
          />
        </Section>

        <View style={styles.version}>
          <Text style={styles.versionText}>ඔමි Omi v1.0.0</Text>
          <Text style={styles.versionSub}>Expandable • Classic & Modern Modes</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={sec.container}>
      <Text style={sec.title}>{title}</Text>
      {children}
    </View>
  )
}

function Chips({
  items,
  value,
  onChange,
}: {
  items: { k: string; l: string }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <View style={sec.chips}>
      {items.map(item => (
        <TouchableOpacity
          key={item.k}
          style={[sec.chip, value === item.k && sec.chipActive]}
          onPress={() => onChange(item.k)}
        >
          <Text style={[sec.chipText, value === item.k && sec.chipTextActive]}>
            {item.l}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 52, paddingHorizontal: 20, paddingBottom: 16 },
  backBtn: { marginBottom: 10 },
  backText: { color: 'rgba(255,255,255,0.65)', fontSize: 15 },
  title: { color: '#ffd700', fontSize: 30, fontWeight: 'bold' },
  scroll: { flex: 1, paddingHorizontal: 20 },
})

const sec = StyleSheet.create({
  container: { marginBottom: 28 },
  title: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  chipActive: { backgroundColor: '#ffd700', borderColor: '#ffd700' },
  chipText: { color: '#fff', fontSize: 14 },
  chipTextActive: { color: '#000', fontWeight: 'bold' },
  version: { alignItems: 'center', paddingVertical: 32 },
  versionText: { color: 'rgba(255,255,255,0.35)', fontSize: 13 },
  versionSub: { color: 'rgba(255,255,255,0.2)', fontSize: 11, marginTop: 3 },
})
