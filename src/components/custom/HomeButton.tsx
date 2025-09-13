// components/RefreshButton.tsx
'use client'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { Home } from 'lucide-react'

export default function HomeButton() {
  const router = useRouter()

  return (
    <Button
      onClick={() => router.push("/")}
      variant="default"
    >
      <Home />
      Home Page
    </Button>
  )
}
