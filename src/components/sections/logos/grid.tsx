import { ReactNode } from "react";
import { cn } from "@/lib/utils";

import { Section } from "@/components/ui/section";
import TrustedLogo from "@/components/ui/trusted-logo";

interface LogoItemProps {
  logo: ReactNode;
}

interface LogosProps {
  title?: string;
  logoItems?: LogoItemProps[];
  className?: string;
}

export default function LogosGrid({
  title = "Trusted by Leading Names in the Industry",
  logoItems = [
    {
      logo: <TrustedLogo src="/trusted_by/Besix.png" alt="Besix" />,
    },
    {
      logo: <TrustedLogo src="/trusted_by/Boskalis.png" alt="Boskalis" />,
    },
    {
      logo: <TrustedLogo src="/trusted_by/DEME.png" alt="DEME" />,
    },
    {
      logo: <TrustedLogo src="/trusted_by/Gemente.png" alt="Gemente" />,
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
  ],
  className,
}: LogosProps) {
  return (
    <Section className={cn(className)}>
      <div className="max-w-container mx-auto flex flex-col items-center gap-8 text-center">
        <h2 className="text-md text-muted-foreground font-semibold">{title}</h2>
        <div className="bg-border dark:bg-border/20 relative grid w-full auto-rows-fr grid-cols-2 gap-[1px] text-center md:grid-cols-3">
          {logoItems.map((item, index) => (
            <div
              key={index}
              className="bg-background flex aspect-2/1 items-center justify-center p-6"
            >
              {item.logo}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
