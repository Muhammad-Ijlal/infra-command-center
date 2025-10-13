import { Brain, Search, CheckCircle, Play } from "lucide-react";
import * as React from "react";
import { Beam } from "../ui/beam";
import Glow from "../ui/glow";

function PipelineIllustration() {
  const steps = [
    { icon: Brain, label: "Predict", color: "text-blue-500" },
    { icon: Search, label: "Detect", color: "text-yellow-500" },
    { icon: CheckCircle, label: "Decide", color: "text-green-500" },
    { icon: Play, label: "Perform", color: "text-purple-500" },
  ];

  return (
    <div
      data-slot="pipeline-illustration"
      className="group relative flex w-full flex-col gap-6 p-6 text-xs"
    >
      {/* Pipeline Steps */}
      <div className="relative flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center gap-3">
            {/* Step Circle */}
            <div className="border-border dark:border-border/5 dark:inset-shadow-lg inset-shadow-brand/10 flex items-center justify-center rounded-full border p-3 lg:p-4">
              <div className="border-border dark:border-border/15 dark:inset-shadow-lg inset-shadow-brand/20 flex items-center justify-center rounded-full border p-3 lg:p-4">
                <div className="glass-4 relative z-10 flex size-12 items-center justify-center rounded-full shadow-md backdrop-blur-lg transition-all duration-1000 ease-in-out group-hover:scale-105 sm:size-16 lg:size-20">
                  <Beam tone="brandLight">
                    <div className="relative z-10">
                      <step.icon className={`size-6 sm:size-8 ${step.color}`} />
                    </div>
                  </Beam>
                </div>
              </div>
            </div>
            
            {/* Step Label */}
            <span className="text-sm font-medium text-muted-foreground">
              {step.label}
            </span>
          </div>
        ))}
        
        {/* Impulse Animation */}
        <div className="group-hover:animate-impulse absolute top-[calc(50%-1rem)] left-0 opacity-0">
          <div className="from-brand-foreground/50 via-brand-foreground/10 to-brand-foreground/0 absolute top-[50%] -left-12 size-24 -translate-y-12 rounded-full bg-radial from-20% via-50% to-80%" />
          <div className="absolute top-[50%] -left-4 z-1 size-8 -translate-y-4 rounded-full bg-radial from-white/70 from-20% to-white/0 to-60%" />
        </div>
      </div>

      {/* Connecting Line */}
      <div className="via-foreground/10 dark:via-border/30 absolute top-[calc(50%-1px)] left-0 h-0.5 w-full bg-linear-to-r from-transparent to-transparent"></div>
      
      {/* Background Glow */}
      <Glow
        variant="center"
        className="opacity-20 transition-all duration-300 group-hover:opacity-30"
      />
    </div>
  );
}

export default PipelineIllustration;
