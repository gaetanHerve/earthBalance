import { describe, it, expect } from 'vitest'
import { interpolateAtYear, blendedAtYear } from '@/utils/timeSeries'

const labels = [2024, 2030, 2050, 2100]
const values = [100, 130, 200, 400]

describe('interpolateAtYear', () => {
  it('clamps to first value when year is before range', () => {
    expect(interpolateAtYear(2020, labels, values)).toBe(100)
  })

  it('clamps to last value when year is after range', () => {
    expect(interpolateAtYear(2110, labels, values)).toBe(400)
  })

  it('returns exact value at a label boundary', () => {
    expect(interpolateAtYear(2030, labels, values)).toBe(130)
    expect(interpolateAtYear(2024, labels, values)).toBe(100)
    expect(interpolateAtYear(2100, labels, values)).toBe(400)
  })

  it('linearly interpolates between two points', () => {
    // Midpoint between 2024 (100) and 2030 (130): t = 3/6 = 0.5 → 115
    expect(interpolateAtYear(2027, labels, values)).toBeCloseTo(115)
  })
})

describe('blendedAtYear', () => {
  const decided   = [100, 200]
  const pessimist = [100, 300]

  it('blends at 50% by default', () => {
    // At 2100: decided=200, pessimist=300 → 200*0.5 + 300*0.5 = 250
    expect(blendedAtYear(2100, [2024, 2100], decided, pessimist)).toBeCloseTo(250)
  })

  it('returns pure decided when blend = 0', () => {
    expect(blendedAtYear(2100, [2024, 2100], decided, pessimist, 0)).toBeCloseTo(200)
  })

  it('returns pure pessimist when blend = 1', () => {
    expect(blendedAtYear(2100, [2024, 2100], decided, pessimist, 1)).toBeCloseTo(300)
  })
})
