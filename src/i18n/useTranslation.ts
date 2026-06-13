import { en, TranslationKey } from './en'
import { si } from './si'
import { useSettingsStore } from '../store/settingsStore'

export function useTranslation() {
  const language = useSettingsStore(s => s.language)
  const translations = language === 'si' ? si : (en as Record<string, string>)
  const t = (key: TranslationKey): string => translations[key] ?? (en as Record<string, string>)[key] ?? key
  return { t, language }
}
