import React from 'react'
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native'
import { Card } from '../types'
import { getSuitSymbol, getSuitColor, getCardDisplayValue } from '../engine/deck'

interface Props {
  card: Card
  onPress?: () => void
  disabled?: boolean
  selected?: boolean
  size?: 'small' | 'medium' | 'large'
  faceDown?: boolean
}

const SIZES = {
  small: { w: 32, h: 46, font: 9, center: 16 },
  medium: { w: 50, h: 72, font: 11, center: 20 },
  large: { w: 64, h: 92, font: 14, center: 26 },
}

export function CardView({ card, onPress, disabled, selected, size = 'medium', faceDown }: Props) {
  const dim = SIZES[size]
  const color = getSuitColor(card.suit)
  const symbol = getSuitSymbol(card.suit)
  const val = getCardDisplayValue(card.value)

  if (faceDown) {
    return (
      <View style={[styles.card, { width: dim.w, height: dim.h, backgroundColor: '#1a237e' }]}>
        <View style={[styles.backPattern, { borderColor: 'rgba(255,255,255,0.2)' }]} />
      </View>
    )
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || !onPress}
      style={[
        styles.card,
        { width: dim.w, height: dim.h },
        selected && styles.selected,
        disabled && !selected && styles.disabled,
      ]}
      activeOpacity={0.75}
    >
      <Text style={[styles.corner, { color, fontSize: dim.font }]}>{val}</Text>
      <Text style={[styles.centerSuit, { color, fontSize: dim.center }]}>{symbol}</Text>
      <Text style={[styles.cornerBottom, { color, fontSize: dim.font }]}>{val}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    justifyContent: 'space-between',
    padding: 3,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  corner: { fontWeight: 'bold', lineHeight: 14 },
  centerSuit: { textAlign: 'center' },
  cornerBottom: {
    fontWeight: 'bold',
    alignSelf: 'flex-end',
    transform: [{ rotate: '180deg' }],
    lineHeight: 14,
  },
  selected: {
    borderColor: '#ffd700',
    borderWidth: 2,
    transform: [{ translateY: -10 }],
    elevation: 8,
  },
  disabled: { opacity: 0.45 },
  backPattern: {
    flex: 1,
    margin: 3,
    borderRadius: 3,
    borderWidth: 2,
  },
})
