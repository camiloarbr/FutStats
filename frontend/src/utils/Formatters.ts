// @author: Camilo | FutStats
export class Formatters {
  private static readonly matchDateFormatter = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  static buildInitials(fullName: string): string {
    const words: string[] = fullName
      .trim()
      .split(' ')
      .filter((word: string) => word.length > 0)

    if (words.length === 0) {
      return 'NA'
    }

    const firstWord = words[0]
    if (!firstWord) {
      return 'NA'
    }

    if (words.length === 1) {
      return firstWord.slice(0, 2).toUpperCase()
    }

    const secondWord = words[1]
    if (!secondWord) {
      return firstWord.slice(0, 2).toUpperCase()
    }

    return `${firstWord[0]}${secondWord[0]}`.toUpperCase()
  }

  static resolveInitialsClass(index: number): string {
    const classes: string[] = [
      'bg-blue-100 text-[#1b69ff]',
      'bg-red-100 text-red-600',
      'bg-slate-100 text-slate-600',
      'bg-indigo-100 text-indigo-600',
      'bg-rose-50 text-rose-500',
    ]

    const resolvedClass = classes[index % classes.length]
    return resolvedClass ?? 'bg-slate-100 text-slate-600'
  }

  static formatMatchDate(date: Date | string): string {
    const resolvedDate = date instanceof Date ? date : new Date(date)
    return Formatters.matchDateFormatter.format(resolvedDate)
  }

  static formatScore(homeScore: number, awayScore: number): string {
    return `${homeScore} - ${awayScore}`
  }

  static formatPossession(home: number, away: number): string {
    return `${home}% — ${away}%`
  }

  static formatIntensity(home: number, away: number): string {
    return `${home} : ${away}`
  }

  static formatMatchLabel(date: Date | string, homeTeam: string, awayTeam: string): string {
    return `${Formatters.formatMatchDate(date)} · ${homeTeam} vs ${awayTeam}`
  }

  static formatMatchTitle(homeTeam: string, awayTeam: string): string {
    return `${homeTeam} vs ${awayTeam}`
  }

  static formatMatchResult(
    homeTeam: string,
    homeScore: number,
    awayScore: number,
    awayTeam: string,
  ): string {
    return `${homeTeam} ${homeScore}:${awayScore} ${awayTeam}`
  }

  static formatChartTooltip(value: number, unit: string): string {
    return `${value} ${unit}`
  }

  static formatFilterStatus(count: number, filtered: boolean): string {
    return filtered ? `${count} filtered` : `${count} total`
  }

  static formatPageTitle(title: string): string {
    return `FutStats | ${title}`
  }

  static formatCount(count: number): string {
    return count.toString()
  }

  static formatDecimal(value: number, fractionDigits: number = 1): string {
    return value.toFixed(fractionDigits)
  }
}
