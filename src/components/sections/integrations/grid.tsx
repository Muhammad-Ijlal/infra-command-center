import { ReactNode } from "react";
import Image from "next/image";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";

interface IntegrationItemProps {
  name: string;
  logo: string;
  description?: string;
  url?: string;
}

interface IntegrationLogosProps {
  title?: string;
  description?: string;
  items?: IntegrationItemProps[];
  className?: string;
}

export default function IntegrationLogos({
  title = "Seamlessly integrates with your existing tools",
  description = "Connect with the platforms and systems you already use",
  items = [
    {
      name: "SAP",
      logo: "/integrations/sap-3.png",
    },
    {
      name: "Cityworks",
      logo: "/integrations/cityworks-3.png", 
    },
    {
      name: "Maximo",
      logo: "/integrations/ibm-maximo-3.png",
    },
    {
        name: "Oracle",
        logo: "/integrations/oracle-3.png",
    },
  ],
  className,
}: IntegrationLogosProps) {
  return (
    <Section className={cn("w-full overflow-hidden", className)}>
      <div className="max-w-container mx-auto flex flex-col gap-8 md:flex-row md:gap-20 md:items-center md:justify-center">
        <div className="flex flex-col items-center md:items-start">
          <h2 className="text-xl font-semibold sm:text-2xl max-w-[600px] text-center md:text-left">
            {title}
          </h2>
          <p className="text-md text-muted-foreground max-w-[700px] font-medium text-balance sm:text-xl mt-2 sm:mt-3 text-center md:text-left">
            {description}
          </p>
        </div>
        {items && items.length > 0 && (
          <div className="grid grid-cols-2 gap-8 md:gap-12">
            {items.map((item, index) => (
              <div
                key={index}
                className="group flex items-center justify-center p-6 rounded-xl border border-border/20 hover:border-border/40 transition-all duration-300 hover:shadow-lg bg-card/30 hover:bg-card/50"
              >
                <Image
                  src={item.logo}
                  alt={item.name}
                  width={220}
                  height={220}
                  className="object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
