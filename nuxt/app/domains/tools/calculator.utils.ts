// 1. External imports

// 2. Internal imports

export interface ContributionInputs {
  assists: number
  goals: number
  matchesPlayed: number
}

export function calculateDirectContributions(inputs: ContributionInputs): number {
  return inputs.goals + inputs.assists
}

export function calculateContributionPerMatch(inputs: ContributionInputs): number {
  if (inputs.matchesPlayed <= 0) return 0
  return calculateDirectContributions(inputs) / inputs.matchesPlayed
}
