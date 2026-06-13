import React from 'react'
import { View, ScrollView, StyleSheet, Text } from 'react-native'
import { Card, Suit } from '../types'
import { CardView } from './CardView'
import { getValidCards } from '../engine/gameEngine'

interface Props {
  cards: Card[]
  isActive: boolean
  ledSuit: Suit | null
  onCardPlay: (card: Card) => void
  label?: string
  faceDown?: boolean
  horizontal?: boolean
  compact?: boolean
}

export function PlayerHand({
  cards,
  isActive,
  ledSuit,
  onCardPlay,
  label,
  faceDown,
  horizontal = true,
  compact = false,
}: Props) {
  const validSet = isActive
    ? new Set(getValidCards(cards, ledSuit).map(c => c.id))
    : new Set<string>()

  const overlap = compact ? -18 : -8

  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <ScrollView
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.inner,
          horizontal ? { paddingHorizontal: 16 } : { paddingVertical: 4 },
        ]}
      >
        {cards.map(card => (
          <View
            key={card.id}
            style={horizontal ? { marginRight: overlap } : { marginBottom: overlap }}
          >
            <CardView
              card={card}
              faceDown={faceDown}
              size={horizontal ? 'medium' : 'small'}
              disabled={!isActive || !validSet.has(card.id)}
              onPress={
                isActive && validSet.has(card.id) ? () => onCardPlay(card) : undefined
              }
            />
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  inner: { alignItems: 'center' },
  label: { color: 'rgba(255,255,255,0.65)', fontSize: 11, marginBottom: 3 },
})
