import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'

export function AlertDestructive() {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>Por favor, insira um ID válido</AlertDescription>
    </Alert>
  )
}
