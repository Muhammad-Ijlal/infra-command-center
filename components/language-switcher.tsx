"use client"

import { useLocale } from 'next-intl'
import { Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { usePathname, useRouter } from 'next/navigation'

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (newLocale: string) => {
    // Remove current locale from pathname and add new one
    const currentPath = pathname.replace(`/${locale}`, '')
    const newPath = `/${newLocale}${currentPath || ''}`
    router.push(newPath)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 w-full justify-start">
          <Languages className="h-4 w-4" />
          <span className="text-sm">{locale === 'ar' ? 'العربية' : 'English'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => switchLocale('en')}
          className={locale === 'en' ? 'bg-accent' : ''}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => switchLocale('ar')}
          className={locale === 'ar' ? 'bg-accent' : ''}
        >
          العربية (Arabic)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

