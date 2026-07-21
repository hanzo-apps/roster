import { useState } from 'react'
import { useMutation } from '@hanzo/base/react'
import { YStack, XStack, H2, Text, Button, Paragraph, Separator } from '@hanzo/gui'
import { type Person, type PersonInput, UI, colorForTeam, tint } from '../lib/roster'
import { Field, Ghost, PersonAvatar, Primary, TArea, TInput } from './kit'

/**
 * Add a teammate or edit an existing one. A live avatar preview tracks the form;
 * existing team names are one-tap chips. Saving writes an org-scoped `people`
 * row to Base (create or update); editing also exposes a destructive delete.
 */
export function Edit({
  person,
  teams,
  onSaved,
  onDeleted,
  onCancel,
}: {
  person: Person | null
  teams: string[]
  onSaved: (editedId: string | null) => void
  onDeleted: () => void
  onCancel: () => void
}) {
  const editing = person !== null
  const [name, setName] = useState(person?.name ?? '')
  const [role, setRole] = useState(person?.role ?? '')
  const [team, setTeam] = useState(person?.team ?? '')
  const [email, setEmail] = useState(person?.email ?? '')
  const [avatar, setAvatar] = useState(person?.avatar ?? '')
  const [bio, setBio] = useState(person?.bio ?? '')
  const [confirmDel, setConfirmDel] = useState(false)

  const create = useMutation('people', 'create')
  const update = useMutation('people', 'update')
  const remove = useMutation('people', 'delete')
  const busy = create.isLoading || update.isLoading || remove.isLoading
  const err = create.error || update.error || remove.error

  async function save() {
    const clean = name.trim()
    if (!clean || busy) return
    const data: PersonInput = {
      name: clean,
      role: role.trim(),
      team: team.trim(),
      email: email.trim(),
      avatar: avatar.trim(),
      bio: bio.trim(),
    }
    if (editing && person) {
      await update.mutate({ id: person.id, ...data })
      onSaved(person.id)
    } else {
      await create.mutate({ ...data })
      onSaved(null)
    }
  }

  async function del() {
    if (!editing || !person || busy) return
    await remove.mutate({ id: person.id })
    onDeleted()
  }

  return (
    <YStack gap="$4" maxWidth={640} width="100%" alignSelf="center">
      <XStack>
        <Ghost size="$2" onPress={onCancel}>
          ← {editing ? 'Cancel' : 'Directory'}
        </Ghost>
      </XStack>

      <YStack
        gap="$5"
        padding="$5"
        borderRadius={20}
        borderWidth={1}
        borderColor={UI.line}
        backgroundColor={UI.card}
        shadowColor="#101828"
        shadowOpacity={0.05}
        shadowRadius={16}
        shadowOffset={{ width: 0, height: 8 }}
      >
        <XStack gap="$4" alignItems="center">
          <PersonAvatar name={name || '?'} team={team} url={avatar} size={64} />
          <YStack flex={1} gap={2}>
            <H2 fontSize={20} fontWeight="800" color={UI.ink}>
              {editing ? 'Edit profile' : 'Add person'}
            </H2>
            <Text fontSize={13} color={UI.muted}>
              {name.trim() || 'The card updates as you type.'}
            </Text>
          </YStack>
        </XStack>

        <Separator borderColor={UI.line} />

        <XStack gap="$3" flexWrap="wrap">
          <Field label="Name">
            <TInput value={name} placeholder="Full name" onChangeText={setName} />
          </Field>
          <Field label="Role">
            <TInput value={role} placeholder="e.g. Product Designer" onChangeText={setRole} />
          </Field>
        </XStack>

        <Field label="Team">
          <TInput value={team} placeholder="e.g. Design" onChangeText={setTeam} />
          {teams.length > 0 ? (
            <XStack gap="$2" flexWrap="wrap" marginTop="$1">
              {teams.map((name) => {
                const c = colorForTeam(name)
                const on = team.trim().toLowerCase() === name.toLowerCase()
                return (
                  <Button
                    key={name}
                    size="$1"
                    paddingHorizontal={10}
                    borderRadius={999}
                    borderWidth={1}
                    borderColor={on ? c : UI.line}
                    backgroundColor={on ? tint(c, '1c') : UI.field}
                    onPress={() => setTeam(name)}
                  >
                    <Text fontSize={12} fontWeight="600" color={on ? c : UI.muted}>
                      {name}
                    </Text>
                  </Button>
                )
              })}
            </XStack>
          ) : null}
        </Field>

        <XStack gap="$3" flexWrap="wrap">
          <Field label="Email">
            <TInput
              value={email}
              placeholder="name@company.com"
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={setEmail}
            />
          </Field>
          <Field label="Avatar URL">
            <TInput value={avatar} placeholder="https://… (optional)" autoCapitalize="none" onChangeText={setAvatar} />
          </Field>
        </XStack>

        <Field label="Bio">
          <TArea value={bio} placeholder="A sentence or two about this teammate." onChangeText={setBio} />
        </Field>

        {err ? <Paragraph color="#dc2626">{err.message}</Paragraph> : null}

        <XStack alignItems="center" justifyContent="space-between" flexWrap="wrap" gap="$3">
          <Primary size="$4" disabled={!name.trim() || busy} onPress={save}>
            {busy ? 'Saving…' : editing ? 'Save changes' : 'Add to roster'}
          </Primary>

          {editing ? (
            confirmDel ? (
              <XStack gap="$2" alignItems="center">
                <Text fontSize={13} color={UI.muted}>
                  Remove {person?.name}?
                </Text>
                <Ghost size="$3" onPress={() => setConfirmDel(false)}>
                  Keep
                </Ghost>
                <Button
                  size="$3"
                  borderWidth={0}
                  borderRadius={12}
                  backgroundColor="#dc2626"
                  hoverStyle={{ backgroundColor: '#c11f1f' }}
                  disabled={busy}
                  onPress={del}
                >
                  <Text color="#ffffff" fontWeight="700" fontSize={14}>
                    Delete
                  </Text>
                </Button>
              </XStack>
            ) : (
              <Ghost size="$3" tone="#dc2626" onPress={() => setConfirmDel(true)}>
                Delete
              </Ghost>
            )
          ) : null}
        </XStack>
      </YStack>
    </YStack>
  )
}
