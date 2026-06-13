import { create } from 'zustand'
import { Language, Difficulty, GameMode } from '../types'

interface SettingsStore {
  language: Language
  difficulty: Difficulty
  gameMode: GameMode
  targetScore: number
  soundEnabled: boolean
  setLanguage: (lang: Language) => void
  setDifficulty: (d: Difficulty) => void
  setGameMode: (m: GameMode) => void
  setTargetScore: (n: number) => void
  setSoundEnabled: (v: boolean) => void
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  language: 'en',
  difficulty: 'medium',
  gameMode: 'modern',
  targetScore: 21,
  soundEnabled: true,
  setLanguage: (language) => set({ language }),
  setDifficulty: (difficulty) => set({ difficulty }),
  setGameMode: (gameMode) => set({ gameMode }),
  setTargetScore: (targetScore) => set({ targetScore }),
  setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
}))
