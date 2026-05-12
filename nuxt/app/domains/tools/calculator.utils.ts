export interface ContributionInputs {
  assists: number
  goals: number
  matchesPlayed: number
}

export function calculateDirectContributions(
  inputs: ContributionInputs,
): number {
  return inputs.goals + inputs.assists
}

export function calculateContributionPerMatch(
  inputs: ContributionInputs,
): string {
  if (inputs.matchesPlayed <= 0) {
    return '0.00'
  }

  return (calculateDirectContributions(inputs) / inputs.matchesPlayed).toFixed(
    2,
  )
}
