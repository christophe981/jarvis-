import { OnboardingForm } from "@/components/auth/onboarding-form"

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f8fc] px-4">
      <div className="w-full max-w-sm">
        <OnboardingForm />
      </div>
    </div>
  )
}
