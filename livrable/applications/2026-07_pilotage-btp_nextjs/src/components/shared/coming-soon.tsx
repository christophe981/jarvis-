export function ComingSoon({ title, phase }: { title: string; phase: string }) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[22px] font-extrabold tracking-tight text-brand-navy">{title}</h1>
      <div className="flex flex-col items-center gap-2 rounded-[14px] border border-dashed border-brand-line py-16 text-center">
        <p className="text-sm font-medium text-brand-navy">Bientôt disponible</p>
        <p className="text-sm text-brand-muted">Cette fonctionnalité arrive en {phase}.</p>
      </div>
    </div>
  )
}
