import type { ComponentProps, ReactNode } from 'react'
import { YStack, XStack, Text, Input, TextArea, Button, Image } from '@hanzo/gui'
import { UI, colorForTeam, initials, tint } from '../lib/roster'

/** The atoms of Roster's light surface. Views compose these; nothing here
 *  reaches for a theme token, so the directory looks the same everywhere. */

/** A round avatar: the person's photo when `url` is set, else colored initials. */
export function PersonAvatar({
  name,
  team,
  url,
  size = 48,
}: {
  name: string
  team: string
  url?: string
  size?: number
}) {
  const color = colorForTeam(team)
  const src = (url ?? '').trim()
  return (
    <YStack
      width={size}
      height={size}
      borderRadius={999}
      overflow="hidden"
      alignItems="center"
      justifyContent="center"
      backgroundColor={tint(color, '29')}
    >
      {src ? (
        <Image source={{ uri: src }} width={size} height={size} accessibilityLabel={name} />
      ) : (
        <Text fontSize={Math.round(size * 0.36)} fontWeight="800" color={color}>
          {initials(name)}
        </Text>
      )}
    </YStack>
  )
}

/** A small team pill — a colored dot plus the team name in the team's hue. */
export function TeamChip({ team, small }: { team: string; small?: boolean }) {
  const color = colorForTeam(team)
  if (!team.trim()) return null
  return (
    <XStack
      alignItems="center"
      gap={6}
      alignSelf="flex-start"
      paddingHorizontal={small ? 8 : 10}
      paddingVertical={small ? 3 : 5}
      borderRadius={999}
      backgroundColor={tint(color, '20')}
    >
      <YStack width={7} height={7} borderRadius={999} backgroundColor={color} />
      <Text fontSize={small ? 11 : 12.5} fontWeight="600" color={color}>
        {team}
      </Text>
    </XStack>
  )
}

/** The minimal shape a card renders — real Person rows and the landing preview
 *  both satisfy it, so the same card serves live data and the hero mock. */
export interface CardPerson {
  name: string
  role: string
  team: string
  avatar?: string
}

/** An avatar card. Pressable (a directory tile) when `onPress` is given. */
export function PersonCard({ person, onPress }: { person: CardPerson; onPress?: () => void }) {
  const color = colorForTeam(person.team)
  return (
    <YStack
      flexGrow={1}
      flexBasis={228}
      minWidth={208}
      maxWidth={360}
      gap="$3"
      padding="$3.5"
      borderRadius={16}
      backgroundColor={UI.card}
      borderWidth={1}
      borderColor={UI.line}
      shadowColor="#101828"
      shadowOpacity={0.05}
      shadowRadius={12}
      shadowOffset={{ width: 0, height: 5 }}
      cursor={onPress ? 'pointer' : undefined}
      hoverStyle={onPress ? { borderColor: color, shadowOpacity: 0.12 } : undefined}
      pressStyle={onPress ? { backgroundColor: '#fbfcfe' } : undefined}
      onPress={onPress}
    >
      <XStack gap="$3" alignItems="center">
        <PersonAvatar name={person.name} team={person.team} url={person.avatar} size={46} />
        <YStack flex={1} gap={1}>
          <Text fontSize={15.5} fontWeight="700" color={UI.ink} numberOfLines={1}>
            {person.name}
          </Text>
          <Text fontSize={13} color={UI.muted} numberOfLines={1}>
            {person.role || '—'}
          </Text>
        </YStack>
      </XStack>
      <TeamChip team={person.team} />
    </YStack>
  )
}

/** A labeled form field wrapper. */
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <YStack gap="$1.5" flex={1} minWidth={150}>
      <Text fontSize={12} fontWeight="700" color={UI.muted}>
        {label}
      </Text>
      {children}
    </YStack>
  )
}

/** A light single-line text input. */
export function TInput(props: ComponentProps<typeof Input>) {
  return (
    <Input
      height={44}
      paddingHorizontal={14}
      borderRadius={12}
      borderWidth={1}
      borderColor={UI.line}
      backgroundColor={UI.field}
      color={UI.ink}
      focusStyle={{ borderColor: UI.accent, backgroundColor: UI.card }}
      {...props}
    />
  )
}

/** A light multi-line text area. */
export function TArea(props: ComponentProps<typeof TextArea>) {
  return (
    <TextArea
      minHeight={92}
      padding={14}
      borderRadius={12}
      borderWidth={1}
      borderColor={UI.line}
      backgroundColor={UI.field}
      color={UI.ink}
      focusStyle={{ borderColor: UI.accent, backgroundColor: UI.card }}
      {...props}
    />
  )
}

/** The primary (indigo) action button. Label is a Text child — this Button
 *  variant takes style props on the frame, text props on its child. */
export function Primary({
  children,
  textSize = 15,
  ...props
}: ComponentProps<typeof Button> & { textSize?: number }) {
  return (
    <Button
      borderWidth={0}
      borderRadius={12}
      backgroundColor={UI.accent}
      hoverStyle={{ backgroundColor: '#5457e8' }}
      pressStyle={{ backgroundColor: '#4a4ddb' }}
      {...props}
    >
      <Text color={UI.accentInk} fontWeight="700" fontSize={textSize}>
        {children}
      </Text>
    </Button>
  )
}

/** A quiet chromeless button (back · cancel · sign out). */
export function Ghost({
  children,
  tone = UI.muted,
  textSize = 14,
  ...props
}: ComponentProps<typeof Button> & { tone?: string; textSize?: number }) {
  return (
    <Button chromeless borderRadius={10} {...props}>
      <Text color={tone} fontWeight="600" fontSize={textSize}>
        {children}
      </Text>
    </Button>
  )
}

/** The quick search bar: a magnifier, a borderless input, and a clear button. */
export function SearchBar({
  value,
  onChange,
  placeholder = 'Search people…',
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <XStack
      flex={1}
      minWidth={220}
      alignItems="center"
      gap="$2"
      height={46}
      paddingHorizontal={14}
      borderRadius={12}
      borderWidth={1}
      borderColor={UI.line}
      backgroundColor={UI.card}
      focusWithinStyle={{ borderColor: UI.accent }}
    >
      <Text fontSize={15} opacity={0.5}>
        🔍
      </Text>
      <Input
        flex={1}
        height={44}
        borderWidth={0}
        paddingHorizontal={0}
        backgroundColor="transparent"
        color={UI.ink}
        value={value}
        placeholder={placeholder}
        onChangeText={onChange}
      />
      {value ? (
        <Button size="$2" circular chromeless onPress={() => onChange('')}>
          <Text color={UI.muted} fontSize={13}>
            ✕
          </Text>
        </Button>
      ) : null}
    </XStack>
  )
}
