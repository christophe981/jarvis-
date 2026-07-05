"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createOrganization } from "@/lib/actions/onboarding"
import {
  onboardingSchema,
  type OnboardingInput,
} from "@/lib/validations/auth"

export function OnboardingForm() {
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingInput>({ resolver: zodResolver(onboardingSchema) })

  const onSubmit = (values: OnboardingInput) => {
    setServerError(null)
    startTransition(async () => {
      const result = await createOrganization(values)
      if (result?.error) setServerError(result.error)
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ton entreprise</CardTitle>
        <CardDescription>
          Un dernier détail avant de découvrir ton tableau de bord.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="orgName">Nom de l&apos;entreprise</Label>
            <Input id="orgName" {...register("orgName")} />
            {errors.orgName && (
              <p className="text-sm text-destructive">
                {errors.orgName.message}
              </p>
            )}
          </div>
          {serverError && (
            <p className="text-sm text-destructive">{serverError}</p>
          )}
          <Button type="submit" disabled={isPending} className="mt-2">
            {isPending ? "Création..." : "Continuer"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
