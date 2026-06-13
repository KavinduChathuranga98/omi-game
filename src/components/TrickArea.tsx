import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { PlayedCard, Suit } from '../types'
import { CardView } from './CardView'
import { getSuitSymbol, getSuitColor } from '../engine/deck'

interface Props {
  trick: PlayedCard[]
  trumpSuit: Suit | null
  completedTricks: number
}

export function TrickArea({ trick, trumpSuit, completedTricks }: Props) {
  const slotForPlayer = (pos: number) => {
    const slots: Record<number, object> = {
      0: { bottom: 4, alignSelf: 'center' as const },
      1: { left: 4, top: '40%' as any },
      2: { top: 4, alignSelf: 'center' as const },
      3: { right: 4, top: '40%' as any },
    }
    return slots[pos]
  }

  return (
    <View style={styles.container}>
      {trumpSuit && (
        <View style={[styles.trumpBadge, { borderColor: getSuitColor(trumpSuit) }]}>
          <Text style={[styles.trumpSymbol, { color: getSuitColor(trumpSuit) }]}>
            {getSuitSymbol(trumpSuit)}
          </Text>
        </View>
      )}

      <View style={styles.tricksBadge}>
        <Text style={styles.tricksText}>{completedTricks}/8</Text>
      </View>

      {trick.map(({ card, player }) => (
        <View key={card.id} style={[styles.cardSlot, slotForPlayer(player)]}>
          <CardView card={card} size="medium" />
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 190,
    height: 190,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 16,
  },
  trumpBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 4,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  trumpSymbol: { fontSize: 18 },
  tricksBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tricksText: { color: 'rgba(255,255,255,0.7)', fontSize: 10 },
  cardSlot: { position: 'absolute' },
})
