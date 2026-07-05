type TimelineUpdate = {
  id: string
  createdAt: string
  progressPercent: number | null
  note: string | null
  photoUrls: string[]
}

export function ChantierUpdateTimeline({ updates }: { updates: TimelineUpdate[] }) {
  if (updates.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Aucune mise à jour pour l&apos;instant.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {updates.map((update) => (
        <div key={update.id} className="rounded-xl border border-[#e3e9f0] p-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{new Date(update.createdAt).toLocaleString("fr-FR")}</span>
            {update.progressPercent !== null && (
              <span className="font-medium text-[#0f2742]">
                {update.progressPercent}% d&apos;avancement
              </span>
            )}
          </div>
          {update.note && <p className="mt-2 text-sm">{update.note}</p>}
          {update.photoUrls.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {update.photoUrls.map((url, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={url}
                  alt="Photo de chantier"
                  className="h-24 w-24 rounded-lg object-cover"
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
