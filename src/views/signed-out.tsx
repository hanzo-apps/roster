import { useIam } from '@hanzo/iam/react'
import { YStack, XStack, H1, Text, Paragraph } from '@hanzo/gui'
import { UI, tint } from '../lib/roster'
import { Logo } from './brand'
import { type CardPerson, PersonCard, Primary } from './kit'

// An illustrative team — the same avatar cards the real directory renders, so
// the hero shows the product faithfully (not live data). Initials, no photos,
// so it draws instantly and offline.
const PREVIEW: CardPerson[] = [
  { name: 'Maya Chen', role: 'Product Designer', team: 'Design' },
  { name: 'Ravi Patel', role: 'Principal Engineer', team: 'Platform' },
  { name: 'Sofia Alvarez', role: 'Engineering Manager', team: 'Platform' },
  { name: 'Amara Okafor', role: 'Research Lead', team: 'AI' },
  { name: 'Jordan Blake', role: 'Data Scientist', team: 'Data' },
  { name: 'Noah Kim', role: 'DevOps Engineer', team: 'Infrastructure' },
]

function Chip({ children }: { children: string }) {
  return (
    <XStack
      alignItems="center"
      gap={7}
      paddingHorizontal={12}
      paddingVertical={7}
      borderRadius={999}
      borderWidth={1}
      borderColor={UI.line}
      backgroundColor={UI.card}
    >
      <Text fontSize={13} color={UI.muted}>
        {children}
      </Text>
    </XStack>
  )
}

/** The preview directory card — a faux search bar over the avatar-card grid. */
function PreviewDirectory() {
  return (
    <YStack
      gap="$3.5"
      padding="$4"
      borderRadius={20}
      borderWidth={1}
      borderColor={UI.line}
      backgroundColor={UI.page}
      shadowColor="#0b1220"
      shadowOpacity={0.14}
      shadowRadius={34}
      shadowOffset={{ width: 0, height: 22 }}
    >
      <XStack
        alignItems="center"
        gap="$2"
        height={46}
        paddingHorizontal={14}
        borderRadius={12}
        borderWidth={1}
        borderColor={UI.line}
        backgroundColor={UI.card}
      >
        <Text fontSize={15} opacity={0.5}>
          🔍
        </Text>
        <Text fontSize={14} color={UI.faint}>
          Search people…
        </Text>
      </XStack>

      <XStack gap="$2" flexWrap="wrap">
        {['All', 'Design', 'Platform', 'AI'].map((t, i) => (
          <XStack
            key={t}
            paddingHorizontal={12}
            paddingVertical={5}
            borderRadius={999}
            borderWidth={1}
            borderColor={i === 0 ? UI.accent : UI.line}
            backgroundColor={i === 0 ? tint(UI.accent, '1c') : UI.card}
          >
            <Text fontSize={12.5} fontWeight="600" color={i === 0 ? UI.accent : UI.muted}>
              {t}
            </Text>
          </XStack>
        ))}
      </XStack>

      <XStack flexWrap="wrap" gap="$3">
        {PREVIEW.map((p) => (
          <PersonCard key={p.name} person={p} />
        ))}
      </XStack>
    </YStack>
  )
}

/**
 * Signed-out landing — the honest public view (the directory itself needs
 * sign-in). One action: PKCE sign-in with Hanzo (hanzo.id). No credential form.
 */
export function SignedOut() {
  const { login, isLoading } = useIam()

  return (
    <YStack flex={1} minHeight="100vh" alignItems="center" justifyContent="center" padding="$6" backgroundColor={UI.page}>
      <XStack maxWidth={1180} width="100%" gap="$9" flexWrap="wrap" alignItems="center" justifyContent="center">
        <YStack flex={1} minWidth={330} gap="$5" paddingVertical="$4">
          <XStack alignItems="center" gap="$3">
            <Logo size={38} />
            <YStack>
              <Text fontSize={22} fontWeight="800" color={UI.ink}>
                Roster
              </Text>
              <Text fontSize={12} color={UI.muted}>
                Team Directory
              </Text>
            </YStack>
          </XStack>

          <H1 fontSize={46} lineHeight={51} fontWeight="900" color={UI.ink}>
            Everyone on the team, one search away.
          </H1>

          <Paragraph fontSize={17} lineHeight={26} color={UI.muted} maxWidth={520}>
            A friendly company directory. Browse teammates as avatar cards, filter
            by team, and open anyone for their role, contact, and bio — all stored
            per-org in Hanzo Base.
          </Paragraph>

          <XStack gap="$2" flexWrap="wrap">
            <Chip>Avatar cards</Chip>
            <Chip>Instant search</Chip>
            <Chip>Rich profiles</Chip>
          </XStack>

          <XStack gap="$3" alignItems="center" flexWrap="wrap">
            <Primary size="$5" textSize={17} disabled={isLoading} onPress={() => login()}>
              {isLoading ? 'Loading…' : 'Sign in with Hanzo'}
            </Primary>
            <Text fontSize={13} color={UI.faint}>
              People stored per-org in Hanzo Base.
            </Text>
          </XStack>
        </YStack>

        <YStack flex={1} minWidth={360} gap="$2" paddingVertical="$4">
          <Text fontSize={11} fontWeight="700" color={UI.faint} letterSpacing={1}>
            PREVIEW
          </Text>
          <PreviewDirectory />
        </YStack>
      </XStack>
    </YStack>
  )
}
