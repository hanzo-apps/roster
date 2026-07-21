import { XStack, YStack } from '@hanzo/gui'
import { PALETTE } from '../lib/roster'

/**
 * The Roster mark — a little cluster of overlapping avatar dots, echoing the
 * directory. Each dot wears a white ring so the overlaps read on any surface.
 */
export function Logo({ size = 30 }: { size?: number }) {
  const dot = size * 0.66
  const dots = [PALETTE[0], PALETTE[2], PALETTE[3]] // indigo · emerald · amber
  return (
    <XStack height={size} alignItems="center">
      {dots.map((c, i) => (
        <YStack
          key={c}
          width={dot}
          height={dot}
          borderRadius={999}
          backgroundColor={c}
          borderWidth={2}
          borderColor="#ffffff"
          marginLeft={i === 0 ? 0 : -dot * 0.4}
        />
      ))}
    </XStack>
  )
}
