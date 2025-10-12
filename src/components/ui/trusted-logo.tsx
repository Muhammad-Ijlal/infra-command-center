import Image from "next/image";
import { cn } from "@/lib/utils";

interface TrustedLogoProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export default function TrustedLogo({
  src,
  alt,
  className,
  width = 120,
  height = 60,
}: TrustedLogoProps) {
  return (
    <div className="flex items-center justify-center px-16">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          "h-12 w-auto",
          className
        )}
      />
    </div>
  );
}
