import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { siteUrl } from "@/lib/seo";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const description =
  "Clases de matemáticas, diagnóstico académico y preparación personalizada para Saber 11, admisiones universitarias y pruebas internacionales.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Academia Integra | Matemáticas y preparación para exámenes",
    template: "%s · Academia Integra",
  },
  description,
  keywords: [
    "clases de matemáticas",
    "tutor de matemáticas",
    "preparación Saber 11",
    "curso preICFES",
    "preparación Universidad Nacional",
    "simulacros Saber 11",
    "refuerzo escolar",
    "clases virtuales de matemáticas",
    "preparación PAES",
    "preparación EXANI-II",
    "preparación PAA Costa Rica",
    "diagnóstico académico",
    "preparación admisión universitaria",
  ],
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "Academia Integra",
    title: "Academia Integra | Matemáticas y preparación para exámenes",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Academia Integra | Matemáticas y preparación para exámenes",
    description,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Academia Integra",
  description,
  url: siteUrl,
  logo: `${siteUrl}/Nova-PNG.png`,
  sameAs: [],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${plusJakartaSans.variable} antialiased`}>
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
