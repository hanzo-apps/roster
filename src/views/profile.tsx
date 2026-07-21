import { YStack, XStack, H2, Text, Paragraph, Separator, Anchor } from '@hanzo/gui'
import { type Person, UI, colorForTeam, tint } from '../lib/roster'
import { Ghost, PersonAvatar, Primary, TeamChip } from './kit'

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <YStack gap="$1.5">
      <Text fontSize={12} fontWeight="700" color={UI.faint} letterSpacing={0.6}>
        {label}
      </Text>
      {children}
    </YStack>
  )
}

/**
 * A person's profile: a color-accented header card with the avatar, name, role,
 * and team, then contact and bio. "Edit profile" jumps to the edit form.
 */
export function Profile({
  person,
  onBack,
  onEdit,
}: {
  person: Person
  onBack: () => void
  onEdit: () => void
}) {
  const color = colorForTeam(person.team)
  const email = person.email.trim()

  return (
    <YStack gap="$4" maxWidth={720} width="100%" alignSelf="center">
      <XStack>
        <Ghost size="$2" onPress={onBack}>
          ← Directory
        </Ghost>
      </XStack>

      <YStack
        borderRadius={20}
        borderWidth={1}
        borderColor={UI.line}
        backgroundColor={UI.card}
        overflow="hidden"
        shadowColor="#101828"
        shadowOpacity={0.06}
        shadowRadius={20}
        shadowOffset={{ width: 0, height: 10 }}
      >
        {/* Color band */}
        <YStack height={72} backgroundColor={tint(color, '26')} />

        <YStack padding="$5" gap="$5" marginTop={-44}>
          <XStack gap="$4" alignItems="flex-end" justifyContent="space-between" flexWrap="wrap">
            <XStack gap="$4" alignItems="flex-end">
              <YStack borderRadius={999} borderWidth={4} borderColor={UI.card} backgroundColor={UI.card}>
                <PersonAvatar name={person.name} team={person.team} url={person.avatar} size={88} />
              </YStack>
              <YStack gap="$2" paddingBottom="$1">
                <H2 fontSize={26} fontWeight="800" color={UI.ink}>
                  {person.name}
                </H2>
                {person.role.trim() ? (
                  <Text fontSize={15} color={UI.muted}>
                    {person.role}
                  </Text>
                ) : null}
                <TeamChip team={person.team} />
              </YStack>
            </XStack>
            <Primary size="$3" onPress={onEdit}>
              Edit profile
            </Primary>
          </XStack>

          <Separator borderColor={UI.line} />

          <Row label="EMAIL">
            {email ? (
              <Anchor href={`mailto:${email}`} fontSize={15} color={UI.accent}>
                {email}
              </Anchor>
            ) : (
              <Text fontSize={15} color={UI.faint}>
                No email on file
              </Text>
            )}
          </Row>

          <Separator borderColor={UI.line} />

          <Row label="ABOUT">
            <Paragraph fontSize={15} lineHeight={24} color={person.bio.trim() ? UI.ink : UI.faint}>
              {person.bio.trim() || 'No bio yet — add one from Edit profile.'}
            </Paragraph>
          </Row>
        </YStack>
      </YStack>
    </YStack>
  )
}
