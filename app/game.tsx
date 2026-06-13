import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { useGameStore } from '../src/store/gameStore'
import { useTranslation } from '../src/i18n/useTranslation'
import { useSettingsStore } from '../src/store/settingsStore'
import { PlayerHand } from '../src/components/PlayerHand'
import { TrickArea } from '../src/components/TrickArea'
import { TrumpSelector } from '../src/components/TrumpSelector'
import { DeclarationModal } from '../src/components/DeclarationModal'
import { ScorePanel } from '../src/components/ScorePanel'
import { getSuitSymbol } from '../src/engine/deck'
import { Card } from '../src/types'

export default function GameScreen() {
  const { t } = useTranslation()
  const { targetScore: settingsTarget, gameMode: settingsMode } = useSettingsStore()
  const game = useGameStore()

  const human = game.players[0]
  const west = game.players[1]
  const partner = game.players[2]
  const east = game.players[3]

  const isMyTurn = game.currentPlayer === 0 && game.phase === 'playing'
  const ledSuit = game.currentTrick.length > 0 ? game.currentTrick[0].card.suit : null

  const team0Tricks = game.completedTricks.filter(t => t.winner % 2 === 0).length
  const team1Tricks = game.completedTricks.filter(t => t.winner % 2 === 1).length
  const lastResult = game.roundScores[game.roundScores.length - 1]

  const handleCardPlay = (card: Card) => {
    if (!isMyTurn) return
    game.playCard(card, 0)
  }

  const handleNewGame = () => {
    game.startGame(game.gameMode, game.targetScore)
  }

  return (
    <LinearGradient colors={['#0a3520', '#0d4a2e', '#1b5e20']} style={styles.root}>

      {/* Score bar */}
      <View style={styles.scoreBar}>
        <ScorePanel
          team0Score={game.scores.team0}
          team1Score={game.scores.team1}
          target={game.targetScore}
          team0Tricks={team0Tricks}
          team1Tricks={team1Tricks}
        />
      </View>

      {/* Top: partner hand */}
      <View style={styles.topPlayerArea}>
        {game.partnerSitsOut ? (
          <View style={styles.sitOutBadge}>
            <Text style={styles.sitOutText}>{t('partnerSitsOut')}</Text>
          </View>
        ) : (
          <PlayerHand
            cards={partner.hand}
            isActive={false}
            ledSuit={null}
            onCardPlay={() => {}}
            faceDown
            label={t('partner')}
          />
        )}
      </View>

      {/* Middle row: west + trick area + east */}
      <View style={styles.midRow}>
        <View style={styles.sideArea}>
          <Text style={styles.sideLabel}>{t('opponent')}</Text>
          <PlayerHand
            cards={west.hand}
            isActive={false}
            ledSuit={null}
            onCardPlay={() => {}}
            faceDown
            horizontal={false}
            compact
          />
        </View>

        <TrickArea
          trick={game.currentTrick}
          trumpSuit={game.trumpSuit}
          completedTricks={game.completedTricks.length}
        />

        <View style={styles.sideArea}>
          <Text style={styles.sideLabel}>{t('opponent')}</Text>
          <PlayerHand
            cards={east.hand}
            isActive={false}
            ledSuit={null}
            onCardPlay={() => {}}
            faceDown
            horizontal={false}
            compact
          />
        </View>
      </View>

      {/* Status strip */}
      <View style={styles.statusStrip}>
        {game.trumpSuit ? (
          <Text style={styles.statusChip}>
            {t('trumpIs')} {getSuitSymbol(game.trumpSuit)}
          </Text>
        ) : null}
        {game.kiyaActive ? (
          <Text style={[styles.statusChip, styles.kiyaChip]}>{t('kiya')} ⚡</Text>
        ) : null}
        {game.bailaActive ? (
          <Text style={[styles.statusChip, styles.bailaChip]}>{t('baila')} 🃏</Text>
        ) : null}
        <Text style={styles.statusChip}>
          {isMyTurn ? t('yourTurn') : t('waiting')}
        </Text>
        <Text style={styles.statusChip}>{t('roundNumber')} {game.roundNumber}</Text>
      </View>

      {/* Human hand */}
      <View style={styles.handArea}>
        <Text style={styles.youLabel}>{t('you')}</Text>
        <PlayerHand
          cards={human.hand}
          isActive={isMyTurn}
          ledSuit={ledSuit}
          onCardPlay={handleCardPlay}
        />
      </View>

      {/* ── Modals ── */}

      <TrumpSelector
        visible={game.phase === 'trump-selection' && game.currentPlayer === 0}
        onSelect={game.selectTrump}
      />

      <DeclarationModal
        visible={
          game.phase === 'baila-opportunity' || game.phase === 'kiya-opportunity'
        }
        phase={game.phase as 'baila-opportunity' | 'kiya-opportunity'}
        playerHand={human.hand}
        onBaila={game.declareBaila}
        onKiya={game.declareKiya}
        onPass={game.passDeclaration}
      />

      {/* Round / Game end modal */}
      <Modal
        transparent
        animationType="fade"
        visible={game.phase === 'round-end' || game.phase === 'game-end'}
      >
        <View style={styles.overlay}>
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>
              {game.phase === 'game-end' ? t('gameOver') : t('roundResult')}
            </Text>

            {lastResult && (
              <>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>{t('yourTeam')}</Text>
                  <Text style={styles.resultVal}>
                    {lastResult.team0Kata} {t('kataKola')}
                  </Text>
                  <Text style={styles.resultVal}>
                    {lastResult.team0Tricks} {t('tricks')}
                  </Text>
                </View>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>{t('opponents')}</Text>
                  <Text style={styles.resultVal}>
                    {lastResult.team1Kata} {t('kataKola')}
                  </Text>
                  <Text style={styles.resultVal}>
                    {lastResult.team1Tricks} {t('tricks')}
                  </Text>
                </View>

                {lastResult.declarationBonus !== 0 && (
                  <Text style={styles.bonusLine}>
                    {lastResult.declarationBonus > 0 ? '+' : ''}
                    {lastResult.declarationBonus} {t('kataKola')}
                    {lastResult.declarationBonus === 3 ? '  ' + t('kiyaSuccess') : ''}
                    {lastResult.declarationBonus === 2 ? '  ' + t('bailaSuccess') : ''}
                    {lastResult.declarationBonus < 0 && game.kiyaActive ? '  ' + t('kiyaFail') : ''}
                    {lastResult.declarationBonus < 0 && game.bailaActive ? '  ' + t('bailaFail') : ''}
                  </Text>
                )}

                <Text
                  style={[
                    styles.winnerLine,
                    { color: lastResult.winner === 0 ? '#ffd700' : '#ef9a9a' },
                  ]}
                >
                  {lastResult.winner === 0 ? t('teamWins') : t('teamLoses')}
                </Text>

                <View style={styles.totalRow}>
                  <Text style={styles.totalScore}>
                    {game.scores.team0}  –  {game.scores.team1}
                  </Text>
                  <Text style={styles.totalLabel}>/ {game.targetScore}</Text>
                </View>
              </>
            )}

            {game.phase === 'round-end' && (
              <TouchableOpacity style={styles.actionBtn} onPress={game.nextRound}>
                <Text style={styles.actionBtnText}>{t('nextRound')}</Text>
              </TouchableOpacity>
            )}

            {game.phase === 'game-end' && (
              <>
                <TouchableOpacity style={styles.actionBtn} onPress={handleNewGame}>
                  <Text style={styles.actionBtnText}>{t('playAgain')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: 'rgba(255,255,255,0.1)', marginTop: 6 }]}
                  onPress={() => { game.resetGame(); router.replace('/') }}
                >
                  <Text style={styles.actionBtnText}>{t('backToMenu')}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: 40 },
  scoreBar: { paddingHorizontal: 12, marginBottom: 4 },
  topPlayerArea: { alignItems: 'center', minHeight: 80, justifyContent: 'center' },
  sitOutBadge: {
    backgroundColor: 'rgba(183,28,28,0.25)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(183,28,28,0.5)',
  },
  sitOutText: { color: '#ef9a9a', fontSize: 12 },
  midRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 4,
  },
  sideArea: { width: 56, alignItems: 'center' },
  sideLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 9, marginBottom: 3 },
  statusStrip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  statusChip: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    backgroundColor: 'rgba(0,0,0,0.28)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  kiyaChip: { color: '#ffd700', backgroundColor: 'rgba(183,28,28,0.3)' },
  bailaChip: { color: '#ffcc80', backgroundColor: 'rgba(230,81,0,0.3)' },
  handArea: { paddingBottom: 16, alignItems: 'center' },
  youLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginBottom: 3 },
  // Result modal
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  resultCard: {
    backgroundColor: '#1b5e20',
    borderRadius: 22,
    padding: 26,
    width: '100%',
    maxWidth: 340,
    elevation: 12,
  },
  resultTitle: {
    color: '#ffd700',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  resultLabel: { color: '#fff', fontSize: 14, flex: 1 },
  resultVal: { color: '#ffd700', fontSize: 13, marginLeft: 8 },
  bonusLine: { color: '#ffcc80', fontSize: 13, textAlign: 'center', marginVertical: 8 },
  winnerLine: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginVertical: 12 },
  totalRow: { alignItems: 'center', marginBottom: 18 },
  totalScore: { color: '#fff', fontSize: 30, fontWeight: 'bold' },
  totalLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 13 },
  actionBtn: {
    backgroundColor: '#ffd700',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  actionBtnText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
})
