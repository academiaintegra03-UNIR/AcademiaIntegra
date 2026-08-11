import Image from "next/image";
import Link from "next/link";
import { siteName } from "@/lib/data/home-content";
import { footerCompanyLinks, footerPlatformLinks } from "@/lib/data/nav";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-primary px-4 pt-10 pb-6 text-[#D7E4F0] sm:px-8">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-2 text-base font-extrabold text-white">{siteName}</div>
          <p className="text-sm leading-relaxed text-[#AFC3D9]">
            Matemáticas, preparación para exámenes y aprendizaje inteligente.
          </p>
        </div>
        <div>
          <div className="mb-2.5 text-xs font-bold tracking-wide text-white uppercase">Plataforma</div>
          <div className="flex flex-col gap-2 text-sm">
            {footerPlatformLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-[#AFC3D9] hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-2.5 text-xs font-bold tracking-wide text-white uppercase">Compañía</div>
          <div className="flex flex-col gap-2 text-sm">
            {footerCompanyLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-[#AFC3D9] hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-2.5 text-xs font-bold tracking-wide text-white uppercase">Legal</div>
          <div className="flex flex-col gap-2 text-sm text-[#AFC3D9]">
            <span>Política de privacidad</span>
            <span>Términos y condiciones</span>
            <span>Consentimiento para menores</span>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-6 flex max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-[#2C5486] pt-4 text-xs text-[#8FA9C4]">
        <p>
          © 2026 {siteName}. No garantizamos puntajes ni admisiones. Contenido educativo con acompañamiento
          humano y tecnológico.
        </p>
        <span className="flex items-center gap-1.5 whitespace-nowrap">
          Sitio desarrollado por
          <Image src="/Nova-PNG.png" alt="Nova Digital Studio" width={18} height={18} className="rounded-full" />
          Nova Digital Studio
        </span>
      </div>
    </footer>
  );
}
