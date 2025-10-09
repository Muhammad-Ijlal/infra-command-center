import { LoginForm, MagnetLines } from "@/src/features/auth";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex items-center gap-2 font-medium">
            <span className="text-2xl font-bold tracking-tight">
              Infra Command Center
            </span>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 lg:flex lg:items-center lg:justify-center overflow-hidden">
        <MagnetLines
          rows={9}
          columns={9}
          containerSize="500px"
          lineColor="#ff6b6b"
          lineWidth="4px"
          lineHeight="60px"
          baseAngle={0}
        />
      </div>
    </div>
  );
}
