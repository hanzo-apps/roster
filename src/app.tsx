import type { ReactNode } from 'react'
import { useIam } from '@hanzo/iam/react'
import { YStack, Spinner, Theme } from '@hanzo/gui'
import { UI } from './lib/roster'
import { Callback } from './auth/callback'
import { SignedOut } from './views/signed-out'
import { Home } from './views/home'

function Center({ children }: { children: ReactNode }) {
  return (
    <YStack flex={1} minHeight="100vh" alignItems="center" justifyContent="center" backgroundColor={UI.page}>
      {children}
    </YStack>
  )
}

/**
 * Top-level route + auth gate — no router dependency (one static SPA):
 *   /auth/callback  → finish the PKCE exchange, then land home
 *   signed out      → the Roster landing (sign in with Hanzo)
 *   signed in       → the directory (grid · profile · edit)
 *
 * Roster is a friendly, always-light surface, so the whole tree renders under
 * the light theme (component defaults land right; explicit UI colors do the rest).
 */
export function App() {
  const { isAuthenticated, isLoading } = useIam()

  let content: ReactNode
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/auth/callback')) {
    content = <Callback />
  } else if (isLoading) {
    content = (
      <Center>
        <Spinner size="large" color={UI.accent} />
      </Center>
    )
  } else {
    content = isAuthenticated ? <Home /> : <SignedOut />
  }

  return <Theme name="light">{content}</Theme>
}
