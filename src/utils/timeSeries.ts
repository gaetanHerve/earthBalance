export function interpolateAtYear(year: number, labels: number[], values: number[]): number {
  if (year <= labels[0]) return values[0]
  if (year >= labels[labels.length - 1]) return values[values.length - 1]
  for (let i = 0; i < labels.length - 1; i++) {
    if (year >= labels[i] && year <= labels[i + 1]) {
      const t = (year - labels[i]) / (labels[i + 1] - labels[i])
      return values[i] + t * (values[i + 1] - values[i])
    }
  }
  return values[values.length - 1]
}

export function blendedAtYear(
  year: number,
  labels: number[],
  decided: number[],
  pessimist: number[],
  blend = 0.5,
): number {
  const d = interpolateAtYear(year, labels, decided)
  const p = interpolateAtYear(year, labels, pessimist)
  return d * (1 - blend) + p * blend
}
