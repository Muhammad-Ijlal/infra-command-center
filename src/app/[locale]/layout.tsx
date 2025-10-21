import { Geist, Geist_Mono, Cairo } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/request';
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/lib/providers/query-provider";
import { SupabaseProvider } from "@/lib/providers/supabase-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ['300', '400', '600', '700'],
});

// San Francisco font configuration
const sanFrancisco = {
  variable: "--font-san-francisco",
  family: [
    "-apple-system",
    "BlinkMacSystemFont",
    "SF Pro Display",
    "SF Pro Text",
    "Helvetica Neue",
    "Helvetica",
    "Arial",
    "sans-serif"
  ],
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Omit<Props, 'children'>) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'landing' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function LocaleLayout({
  children,
  params
}: Props) {
  const { locale } = await params;
  
  // Validate that the incoming `locale` parameter is valid
  const isValidLocale = locales.some((l) => l === locale);
  if (!isValidLocale) {
    notFound();
  }

  const messages = await getMessages({ locale });
  const isRTL = locale === 'ar';

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} antialiased ${isRTL ? 'font-cairo' : 'font-sans'}`}
        style={{
          '--font-san-francisco': sanFrancisco.family.join(', ')
        } as React.CSSProperties}
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          <QueryProvider>
            <SupabaseProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem={false}
                disableTransitionOnChange
              >
                {children}
              </ThemeProvider>
            </SupabaseProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
