import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useTranslation } from '../i18n/useTranslation'

interface Props {
  team0Score: number
  team1Score: number
  target: number
  team0Tricks?: number
  team1Tricks?: number
}

export function ScorePanel({ team0Score, team1Score, target, team0Tricks, team1Tricks }: Props) {
  const { t } = useTranslation()
  return (
    <View style={styles.container}>
      <View style={styles.team}>
        <Text style={styles.label}>{t('yourTeam')}</Text>
        <Text style={styles.score}>{team0Score}</Text>
        {team0Tricks !== undefined && (
          <Text style={styles.tricks}>{team0Tricks} {t('tricks')}</Text>
        )}
      </View>
      <View style={styles.mid}>
        <Text style={styles.vs}>/</Text>
        <Text style={styles.target}>{target}</Text>
      </View>
      <View style={styles.team}>
        <Text style={styles.label}>{t('opponents')}</Text>
        <Text style={styles.score}>{team1Score}</Text>
        {team1Tricks !== undefined && (
          <Text style={styles.tricks}>{team1Tricks} {t('tricks')}</Text>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 6,
  },
  team: { flex: 1, alignItems: 'center' },
  label: { color: 'rgba(255,255,255,0.6)', fontSize: 10, marginBottom: 1 },
  score: { color: '#ffd700', fontSize: 24, fontWeight: 'bold' },
  tricks: { color: 'rgba(255,255,255,0.55)', fontSize: 10 },
  mid: { alignItems: 'center', paddingHorizontal: 10 },
  vs: { color: 'rgba(255,255,255,0.4)', fontSize: 18 },
  target: { color: 'rgba(255,255,255,0.5)', fontSize: 12 },
})
