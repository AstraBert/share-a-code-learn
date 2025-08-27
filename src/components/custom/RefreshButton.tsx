// components/RefreshButton.tsx
'use client'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { RefreshCcw } from 'lucide-react'

export default function RefreshButton() {
  const router = useRouter()

  return (
    <Button
      onClick={() => router.refresh()}
      variant="default"
    >
      <RefreshCcw />
      Refresh the feed
    </Button>
  )
}
