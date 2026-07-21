import { useState } from 'react'
import { useIam } from '@hanzo/iam/react'
import { useQuery } from '@hanzo/base/react'
import { YStack, XStack, Text, Paragraph, Spinner } from '@hanzo/gui'
import { type Person, UI, teamNames, tint } from '../lib/roster'
import { Logo } from './brand'
import { Ghost } from './kit'
import { Directory } from './directory'
import { Profile } from './profile'
import { Edit } from './edit'

/** One value describes where we are — list, a profile, or the edit form. */
type Route = { k: 'list' } | { k: 'profile'; id: string } | { k: 'edit'; person: Person | null }

function Tab({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Ghost
      size="$3"
      tone={active ? UI.accent : UI.muted}
      backgroundColor={active ? tint(UI.accent, '16') : 'transparent'}
      hoverStyle={{ backgroundColor: tint(UI.accent, '12') }}
      onPress={onPress}
    >
      {label}
    </Ghost>
  )
}

/** Signed-in shell: brand bar + Directory / Add tabs, dispatching one Route. */
export function Home() {
  const { user, logout } = useIam()
  const who = user?.displayName || user?.name || user?.email || 'you'

  const peopleQ = useQuery<Person>('people', { sort: 'name', realtime: false })
  const people = peopleQ.data

  const [route, setRoute] = useState<Route>({ k: 'list' })
  const [q, setQ] = useState('')
  const [team, setTeam] = useState('')

  const open = route.k === 'profile' ? people.find((p) => p.id === route.id) ?? null : null

  return (
    <YStack flex={1} minHeight="100vh" backgroundColor={UI.page}>
      <XStack
        alignItems="center"
        justifyContent="space-between"
        gap="$4"
        paddingHorizontal="$5"
        paddingVertical="$3"
        backgroundColor={UI.card}
        borderBottomWidth={1}
        borderColor={UI.line}
        flexWrap="wrap"
      >
        <XStack alignItems="center" gap="$3">
          <Logo />
          <YStack>
            <Text fontSize={18} fontWeight="800" color={UI.ink}>
              Roster
            </Text>
            <Text fontSize={11} color={UI.muted}>
              Team Directory
            </Text>
          </YStack>
        </XStack>

        <XStack alignItems="center" gap="$2">
          <Tab label="Directory" active={route.k === 'list' || route.k === 'profile'} onPress={() => setRoute({ k: 'list' })} />
          <Tab label="Add person" active={route.k === 'edit' && route.person === null} onPress={() => setRoute({ k: 'edit', person: null })} />
          <Ghost size="$3" onPress={() => logout()}>
            Sign out
          </Ghost>
        </XStack>
      </XStack>

      <YStack padding="$5" gap="$4" maxWidth={1080} width="100%" alignSelf="center">
        <Paragraph fontSize={13} color={UI.faint}>
          Signed in as {who}
        </Paragraph>

        {peopleQ.isLoading ? (
          <XStack gap="$2" alignItems="center" justifyContent="center" paddingVertical="$8">
            <Spinner color={UI.accent} /> <Text color={UI.muted}>Loading roster…</Text>
          </XStack>
        ) : peopleQ.error ? (
          <Paragraph color="#dc2626">
            Couldn’t reach Base ({peopleQ.error.message}). Confirm VITE_HANZO_BASE_URL and that you’re signed in.
          </Paragraph>
        ) : route.k === 'edit' ? (
          <Edit
            person={route.person}
            teams={teamNames(people)}
            onSaved={(id) => {
              peopleQ.refetch()
              setRoute(id ? { k: 'profile', id } : { k: 'list' })
            }}
            onDeleted={() => {
              peopleQ.refetch()
              setRoute({ k: 'list' })
            }}
            onCancel={() => setRoute(route.person ? { k: 'profile', id: route.person.id } : { k: 'list' })}
          />
        ) : open ? (
          <Profile person={open} onBack={() => setRoute({ k: 'list' })} onEdit={() => setRoute({ k: 'edit', person: open })} />
        ) : (
          <Directory
            people={people}
            q={q}
            setQ={setQ}
            team={team}
            setTeam={setTeam}
            onOpen={(id) => setRoute({ k: 'profile', id })}
            onAdd={() => setRoute({ k: 'edit', person: null })}
          />
        )}
      </YStack>
    </YStack>
  )
}
