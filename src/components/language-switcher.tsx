"use client"

import { useTransition } from 'react'
import { useLocale } from 'next-intl'
import { Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRouter, usePathname } from '@/i18n/routing'
import type { Locale } from '@/i18n/request'

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const switchLocale = (newLocale: Locale) => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale })
    })
  }

  return (
    <DropdownMenu key={locale} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2 w-full justify-start"
          disabled={isPending}
        >
          <Languages className="h-4 w-4" />
          <span className="text-sm" key={locale}>{locale === 'ar' ? 'العربية' : 'English'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => switchLocale('en')}
          className={locale === 'en' ? 'bg-accent' : ''}
          disabled={isPending}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => switchLocale('ar')}
          className={locale === 'ar' ? 'bg-accent' : ''}
          disabled={isPending}
        >
          العربية (Arabic)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

