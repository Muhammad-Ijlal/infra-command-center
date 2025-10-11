import { ReactNode } from "react";

import Logo from "@/components/ui/logo";
import { Section } from "@/components/ui/section";
import ReactLogo from "@/components/logos/react";
import TypeScriptLogo from "@/components/logos/typescript";
import TailwindLogo from "@/components/logos/tailwind";
import ShadcnUiLogo from "@/components/logos/shadcn-ui";
import Marquee from "@/components/ui/marquee";

interface LogosProps {
  title?: string;
  logos?: ReactNode[] | false;
  duration?: string;
  gap?: string;
  pauseOnHover?: boolean;
  showGradients?: boolean;
  className?: string;
}

export default function LogosMarquee({
  title = "Trusted by Leading Names in the Industry",
  logos = [
    <Logo
      key="react"
      image={ReactLogo}
      name="React"
      width={171}
      height={54}
      showName={false}
    />,
    <Logo
      key="typescript"
      image={TypeScriptLogo}
      name="TypeScript"
      width={185}
      height={54}
      showName={false}
    />,
    <Logo
      key="tailwind"
      image={TailwindLogo}
      name="Tailwind CSS"
      width={165}
      height={54}
      showName={false}
    />,
    <Logo
      key="shadcn"
      image={ShadcnUiLogo}
      name="shadcn/ui"
      width={180}
      height={54}
      showName={false}
    />,
    <Logo
      key="nextjs"
      image={ReactLogo}
      name="Next.js"
      width={185}
      height={54}
      showName={false}
    />,
    <Logo
      key="ai"
      image={TypeScriptLogo}
      name="AI Powered"
      width={185}
      height={54}
      showName={false}
    />,
  ],
  duration = "25s",
  gap = "3rem",
  pauseOnHover = true,
  showGradients = true,
  className,
}: LogosProps) {
  return (
    <Section className={className}>
      <div className="max-w-container mx-auto flex flex-col items-center gap-8 text-center">
        <h2 className="text-muted-foreground text-sm font-semibold uppercase tracking-wider">
          {title}
        </h2>
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <Marquee
            pauseOnHover={pauseOnHover}
            className={`[--duration:${duration}] [--gap:${gap}]`}
          >
            {logos}
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

