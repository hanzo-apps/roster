import { YStack, XStack, Text, Button } from '@hanzo/gui'
import { type Person, UI, colorForTeam, matches, peopleCount, teamNames, tint } from '../lib/roster'
import { PersonCard, Primary, SearchBar } from './kit'

/** One team filter pill (plus the "All" pseudo-team). */
function FilterPill({
  label,
  color,
  active,
  onPress,
}: {
  label: string
  color: string
  active: boolean
  onPress: () => void
}) {
  return (
    <Button
      size="$2"
      paddingHorizontal={12}
      borderRadius={999}
      borderWidth={1}
      borderColor={active ? color : UI.line}
      backgroundColor={active ? tint(color, '1c') : UI.card}
      hoverStyle={{ borderColor: color }}
      onPress={onPress}
    >
      <Text fontSize={13} fontWeight={active ? '700' : '600'} color={active ? color : UI.muted}>
        {label}
      </Text>
    </Button>
  )
}

function Empty({ icon, title, hint, action }: { icon: string; title: string; hint: string; action?: () => void }) {
  return (
    <YStack
      alignItems="center"
      justifyContent="center"
      gap="$3"
      paddingVertical="$9"
      paddingHorizontal="$6"
      borderRadius={18}
      borderWidth={1}
      borderColor={UI.line}
      backgroundColor={UI.card}
    >
      <Text fontSize={40}>{icon}</Text>
      <Text fontSize={17} fontWeight="800" color={UI.ink}>
        {title}
      </Text>
      <Text fontSize={14} textAlign="center" maxWidth={380} color={UI.muted}>
        {hint}
      </Text>
      {action ? (
        <Primary size="$3" marginTop="$2" onPress={action}>
          Add someone
        </Primary>
      ) : null}
    </YStack>
  )
}

/**
 * The directory: a quick search bar, team filter pills, and a fluid grid of
 * avatar cards. Search spans name/role/team/email/bio; a team pill narrows to
 * one team. Cards open a profile.
 */
export function Directory({
  people,
  q,
  setQ,
  team,
  setTeam,
  onOpen,
  onAdd,
}: {
  people: Person[]
  q: string
  setQ: (v: string) => void
  team: string
  setTeam: (v: string) => void
  onOpen: (id: string) => void
  onAdd: () => void
}) {
  const teams = teamNames(people)
  const inTeam = (p: Person) => (team ? p.team.trim().toLowerCase() === team.toLowerCase() : true)
  const shown = people.filter((p) => inTeam(p) && matches(p, q))
  const filtering = q.trim() !== '' || team !== ''

  return (
    <YStack gap="$4">
      <XStack gap="$3" alignItems="center" flexWrap="wrap">
        <SearchBar value={q} onChange={setQ} />
        <Primary size="$4" onPress={onAdd}>
          + Add person
        </Primary>
      </XStack>

      {teams.length > 0 ? (
        <XStack gap="$2" flexWrap="wrap" alignItems="center">
          <FilterPill label="All" color={UI.accent} active={team === ''} onPress={() => setTeam('')} />
          {teams.map((name) => (
            <FilterPill
              key={name}
              label={name}
              color={colorForTeam(name)}
              active={team.toLowerCase() === name.toLowerCase()}
              onPress={() => setTeam(name)}
            />
          ))}
        </XStack>
      ) : null}

      {people.length === 0 ? (
        <Empty
          icon="👋"
          title="Your directory is empty"
          hint="Add your first teammate — name, role, team, and a short bio. Everyone lands here as a searchable avatar card."
          action={onAdd}
        />
      ) : shown.length === 0 ? (
        <Empty
          icon="🔍"
          title="No matches"
          hint={`Nobody matches ${q.trim() ? `“${q.trim()}”` : 'that filter'}${team ? ` in ${team}` : ''}. Try a different search or clear the filters.`}
        />
      ) : (
        <YStack gap="$3">
          <Text fontSize={13} color={UI.muted}>
            {peopleCount(shown.length)}
            {filtering ? ` · filtered from ${people.length}` : ''}
          </Text>
          <XStack flexWrap="wrap" gap="$3">
            {shown.map((p) => (
              <PersonCard key={p.id} person={p} onPress={() => onOpen(p.id)} />
            ))}
          </XStack>
        </YStack>
      )}
    </YStack>
  )
}
