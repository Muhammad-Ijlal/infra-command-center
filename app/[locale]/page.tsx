import Link from "next/link"
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function Home() {
  const t = useTranslations('landing')
  const tc = useTranslations('common')
  const locale = useLocale()
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/20">
      <div className="absolute top-4 ltr:right-4 rtl:left-4">
        <LanguageSwitcher />
      </div>
      
      <div className="container flex max-w-4xl flex-col items-center gap-8 px-4 text-center">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            {t('title')}
          </h1>
          <p className="text-xl text-muted-foreground sm:text-2xl">
            {t('subtitle')}
          </p>
        </div>

        <p className="max-w-2xl text-lg text-muted-foreground">
          {t('description')}
        </p>

        <Button asChild size="lg">
          <Link href={`/${locale}/dashboard`}>{tc('launchDemo')}</Link>
        </Button>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 text-sm text-muted-foreground">
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl">🧠</span>
            <span>{t('aiRecognition')}</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl">🏢</span>
            <span>{t('assetManagement')}</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl">👥</span>
            <span>{t('contractors')}</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl">📄</span>
            <span>{t('contracts')}</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl">🔔</span>
            <span>{t('notifications')}</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl">📊</span>
            <span>{t('dashboard')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
 