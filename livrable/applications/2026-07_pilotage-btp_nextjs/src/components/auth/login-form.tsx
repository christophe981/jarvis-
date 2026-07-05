"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
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
import { signIn } from "@/lib/actions/auth"
import { loginSchema, type LoginInput } from "@/lib/validations/auth"

export function LoginForm() {
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  const onSubmit = (values: LoginInput) => {
    setServerError(null)
    startTransition(async () => {
      const result = await signIn(values)
      if (result?.error) setServerError(result.error)
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connexion</CardTitle>
        <CardDescription>Accède à ton espace de pilotage.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
          {serverError && (
            <p className="text-sm text-destructive">{serverError}</p>
          )}
          <Button type="submit" disabled={isPending} className="mt-2">
            {isPending ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Pas encore de compte ?{" "}
          <Link href="/signup" className="underline">
            Créer un compte
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
