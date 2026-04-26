// @author: Camilo | FutStats
export class Formatters {
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
}
