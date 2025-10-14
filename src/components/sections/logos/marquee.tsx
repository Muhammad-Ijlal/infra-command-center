import { ReactNode } from "react";
import { cn } from "@/lib/utils";

import { Section } from "@/components/ui/section";
import TrustedLogo from "@/components/ui/trusted-logo";
import Marquee from "@/components/ui/marquee";

interface LogoItemProps {
  logo: ReactNode;
}

interface LogosMarqueeProps {
  title?: string;
  logoItems?: LogoItemProps[];
  duration?: string;
  gap?: string;
  pauseOnHover?: boolean;
  showGradients?: boolean;
  className?: string;
}

export default function LogosMarquee({
  title = "Backed by the expertise trusted by leading public clients and contractors",
  logoItems = [
    {
      logo: <TrustedLogo src="/trusted_by/Besix.png" alt="Besix" />,
    },
    {
      logo: <TrustedLogo src="/trusted_by/Boskalis.png" alt="Boskalis" />,
    },
    {
      logo: <TrustedLogo src="/trusted_by/Deme.png" alt="DEME" />,
    },
    {
      logo: <TrustedLogo src="/trusted_by/Gementee.svg" alt="Gemente" />,
    },
    {
      logo: <TrustedLogo src="/trusted_by/heijmans.svg" alt="Heijmans" />,
    },
    {
      logo: <TrustedLogo src="/trusted_by/idverde.png" alt="idverde" />,
    },
    {
      logo: <TrustedLogo src="/trusted_by/Ministere.png" alt="Ministerie" />,
    },
    {
      logo: <TrustedLogo src="/trusted_by/YUNEX.svg" alt="YUNEX" />,
    },
    {
      logo: <TrustedLogo src="/trusted_by/PortOfRotterdam.png" alt="Port of Rotterdam" />,
    },
    {
      logo: <TrustedLogo src="/trusted_by/Siemens.png" alt="Siemens" />,
    },
  ],
  duration = "20s",
  gap = "3rem",
  pauseOnHover = true,
  showGradients = true,
  className,
}: LogosMarqueeProps) {
  return (
    <Section className={cn(className)}>
      <div className="max-w-container mx-auto flex flex-col items-center gap-8 text-center">
        <h2 className="text-xl font-semibold sm:text-2xl max-w-[600px]">{title}</h2>
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <Marquee
            pauseOnHover={pauseOnHover}
            className={`[--duration:${duration}] [--gap:${gap}]`}
            style={{ '--duration': duration, '--gap': gap } as React.CSSProperties}
          >
            {logoItems.map((item, index) => (
              <div key={index} className="flex items-center justify-center">
                {item.logo}
              </div>
            ))}
          </Marquee>
          {showGradients && (
            <>
              <div className="from-background pointer-events-none absolute inset-y-0 left-0 hidden w-1/3 bg-linear-to-r sm:block" />
              <div className="from-background pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 bg-linear-to-l sm:block" />
            </>
          )}
        </div>
      </div>
    </Section>
  );
}
