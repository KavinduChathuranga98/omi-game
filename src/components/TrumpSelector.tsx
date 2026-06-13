import React from 'react'
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Suit } from '../types'
import { getSuitSymbol, getSuitColor } from '../engine/deck'
import { useTranslation } from '../i18n/useTranslation'

interface Props {
  visible: boolean
  onSelect: (suit: Suit) => void
}

const SUITS: Suit[] = ['spades', 'hearts', 'diamonds', 'clubs']

export function TrumpSelector({ visible, onSelect }: Props) {
  const { t } = useTranslation()
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>{t('selectTrump')}</Text>
          <View style={styles.grid}>
            {SUITS.map(suit => (
              <TouchableOpacity key={suit} style={styles.suitBtn} onPress={() => onSelect(suit)}>
                <Text style={[styles.symbol, { color: getSuitColor(suit) }]}>
                  {getSuitSymbol(suit)}
                </Text>
                <Text style={styles.name}>{t(suit as any)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#1b5e20',
    borderRadius: 20,
    padding: 28,
    width: 300,
    alignItems: 'center',
    elevation: 10,
  },
  title: { color: '#ffd700', fontSize: 20, fontWeight: 'bold', marginBottom: 22 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  suitBtn: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    width: 116,
    elevation: 3,
  },
  symbol: { fontSize: 38 },
  name: { fontSize: 13, color: '#333', marginTop: 5, fontWeight: '600' },
})
