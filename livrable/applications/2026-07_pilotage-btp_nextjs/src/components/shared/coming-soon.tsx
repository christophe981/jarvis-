export function ComingSoon({ title, phase }: { title: string; phase: string }) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-[#0f2742]">{title}</h1>
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-[#e3e9f0] py-16 text-center">
        <p className="text-sm font-medium text-[#0f2742]">Bientôt disponible</p>
        <p className="text-sm text-muted-foreground">Cette fonctionnalité arrive en {phase}.</p>
      </div>
    </div>
  )
}
