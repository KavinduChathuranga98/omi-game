import React, { useState } from 'react'
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Suit } from '../types'
import { useTranslation } from '../i18n/useTranslation'
import { getSuitSymbol, getSuitColor } from '../engine/deck'
import { canDeclareBaila } from '../engine/gameEngine'
import { Card } from '../types'

interface Props {
  visible: boolean
  phase: 'baila-opportunity' | 'kiya-opportunity'
  playerHand: Card[]
  onBaila: (trumpSuit: Suit) => void
  onKiya: () => void
  onPass: () => void
}

const SUITS: Suit[] = ['spades', 'hearts', 'diamonds', 'clubs']

export function DeclarationModal({ visible, phase, playerHand, onBaila, onKiya, onPass }: Props) {
  const { t } = useTranslation()
  const [step, setStep] = useState<'choice' | 'trump'>('choice')
  const [bailaTrump, setBailaTrump] = useState<Suit | null>(null)

  const reset = () => { setStep('choice'); setBailaTrump(null) }

  const handleBaila = () => {
    if (!bailaTrump || !canDeclareBaila(playerHand, bailaTrump)) return
    onBaila(bailaTrump)
    reset()
  }

  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onPass}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>
            {phase === 'baila-opportunity' ? t('bailaOpportunity') : t('kiyaOpportunity')}
          </Text>

          {step === 'choice' && (
            <>
              {phase === 'baila-opportunity' && (
                <TouchableOpacity
                  style={[styles.btn, styles.bailaBtn]}
                  onPress={() => setStep('trump')}
                >
                  <Text style={styles.btnTitle}>🃏 {t('baila')}</Text>
                  <Text style={styles.btnDesc}>{t('bailaDesc')}</Text>
                </TouchableOpacity>
              )}
              {phase === 'kiya-opportunity' && (
                <TouchableOpacity
                  style={[styles.btn, styles.kiyaBtn]}
                  onPress={() => { onKiya(); reset() }}
                >
                  <Text style={styles.btnTitle}>⚡ {t('kiya')}</Text>
                  <Text style={styles.btnDesc}>{t('kiyaDesc')}</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={[styles.btn, styles.passBtn]} onPress={() => { onPass(); reset() }}>
                <Text style={styles.btnTitle}>{t('pass')}</Text>
              </TouchableOpacity>
            </>
          )}

          {step === 'trump' && (
            <>
              <Text style={styles.sub}>{t('selectTrump')}</Text>
              <View style={styles.suits}>
                {SUITS.map(suit => {
                  const ok = canDeclareBaila(playerHand, suit)
                  return (
                    <TouchableOpacity
                      key={suit}
                      style={[
                        styles.suitBtn,
                        bailaTrump === suit && styles.suitSel,
                        !ok && styles.suitDim,
                      ]}
                      onPress={() => ok && setBailaTrump(suit)}
                      disabled={!ok}
                    >
                      <Text style={[styles.suitSym, { color: getSuitColor(suit) }]}>
                        {getSuitSymbol(suit)}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
              {bailaTrump && !canDeclareBaila(playerHand, bailaTrump) && (
                <Text style={styles.warn}>{t('bailaWarning')}</Text>
              )}
              <View style={styles.row}>
                <TouchableOpacity
                  style={[styles.btn, styles.passBtn, { flex: 1 }]}
                  onPress={reset}
                >
                  <Text style={styles.btnTitle}>{t('back')}</Text>
                </TouchableOpacity>
                {bailaTrump && canDeclareBaila(playerHand, bailaTrump) && (
                  <TouchableOpacity
                    style={[styles.btn, styles.bailaBtn, { flex: 1 }]}
                    onPress={handleBaila}
                  >
                    <Text style={styles.btnTitle}>{t('declareBaila')}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#1b5e20',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
  },
  title: { color: '#ffd700', fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 18 },
  sub: { color: '#fff', fontSize: 15, textAlign: 'center', marginBottom: 14 },
  btn: { borderRadius: 14, padding: 14, marginVertical: 5 },
  bailaBtn: { backgroundColor: '#e65100' },
  kiyaBtn: { backgroundColor: '#b71c1c' },
  passBtn: { backgroundColor: 'rgba(255,255,255,0.12)' },
  btnTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  btnDesc: { color: 'rgba(255,255,255,0.75)', fontSize: 12, textAlign: 'center', marginTop: 3 },
  suits: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 14 },
  suitBtn: { backgroundColor: '#fff', borderRadius: 14, padding: 14, width: 66, alignItems: 'center' },
  suitSel: { borderWidth: 3, borderColor: '#ffd700' },
  suitDim: { opacity: 0.28 },
  suitSym: { fontSize: 30 },
  warn: { color: '#ff8a65', fontSize: 12, textAlign: 'center', marginBottom: 8 },
  row: { flexDirection: 'row', gap: 8 },
})
