"use client"

import { useLocale, useTranslations } from 'next-intl'

export function LocaleDebug() {
  const locale = useLocale()
  const t = useTranslations('common')
  
  return (
    <div className="fixed bottom-4 right-4 bg-background border rounded-lg p-4 shadow-lg text-sm z-50">
      <div><strong>Current Locale:</strong> {locale}</div>
      <div><strong>Dashboard Translation:</strong> {t('dashboard')}</div>
      <div><strong>Assets Translation:</strong> {t('assets')}</div>
    </div>
  )
}

