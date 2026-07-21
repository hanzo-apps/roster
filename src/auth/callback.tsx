import { useEffect, useState } from 'react'
import { useIam } from '@hanzo/iam/react'
import { YStack, Spinner, Paragraph, Button } from '@hanzo/gui'
import { UI } from '../lib/roster'

/**
 * The PKCE return leg. hanzo.id redirects here with `?code=&state=`; the SDK
 * exchanges the code for tokens, then we land on the app root. On failure we
 * show the error and a way back rather than a blank spinner.
 */
export function Callback() {
  const { handleCallback } = useIam()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    handleCallback()
      .then(() => window.location.replace('/'))
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Sign-in failed'))
  }, [handleCallback])

  return (
    <YStack flex={1} minHeight="100vh" alignItems="center" justifyContent="center" gap="$4" backgroundColor={UI.page}>
      {error ? (
        <>
          <Paragraph color="#dc2626">{error}</Paragraph>
          <Button onPress={() => window.location.replace('/')}>Back to sign in</Button>
        </>
      ) : (
        <>
          <Spinner size="large" color={UI.accent} />
          <Paragraph color={UI.muted}>Completing sign-in…</Paragraph>
        </>
      )}
    </YStack>
  )
}
