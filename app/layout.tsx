import type { Metadata } from 'next';
import { Bricolage_Grotesque, DM_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-bricolage',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FichaSport — Gestión de Catálogo Deportivo',
  description:
    'Gestor CRUD de catálogo de productos de marcas deportivas con atributos flexibles adaptados a Meta Commerce y exportación CSV.',
  openGraph: {
    title: 'FichaSport — Gestión de Catálogo Deportivo',
    description:
      'Gestor CRUD de catálogo de productos de marcas deportivas con atributos flexibles adaptados a Meta Commerce y exportación CSV.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FichaSport — Gestión de Catálogo Deportivo',
    description:
      'Gestor CRUD de catálogo de productos de marcas deportivas con atributos flexibles adaptados a Meta Commerce y exportación CSV.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${bricolage.variable} ${dmSans.variable} ${ibmPlexMono.variable}`}
    >
      <body
        suppressHydrationWarning
        className="font-sans antialiased bg-[#F7F8F9] text-[#111315] selection:bg-emerald-100 selection:text-emerald-950"
      >
        {children}
      </body>
    </html>
  );
}
