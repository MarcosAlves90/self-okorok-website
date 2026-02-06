// The module was created to centralize parsing rules for recipe durations so that
// we can interpret different user inputs consistently.

type DurationStrategy = {
    matches(value: string): boolean
    parse(value: string): number | null
}

const hourUnits = ['h', 'hr', 'hrs', 'hora', 'horas']
const minuteUnits = ['min', 'mins', 'minuto', 'minutos']

const colonDurationRegex = /(\d{1,2})\s*:\s*(\d{1,2})/
const compactHourMinuteRegex = /(\d+(?:[.,]\d+)?)\s*h(?:ora)?s?\s*(\d+(?:[.,]\d+)?)(?:\s*(?:min(?:uto)?s?)?)?/

function normalizeDurationInput(value: string) {
    return value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+e\s+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
}

function parseDecimalNumber(value: string) {
    const normalizedValue = value.replace(',', '.')
    const parsed = Number(normalizedValue)
    return Number.isFinite(parsed) ? parsed : null
}

function buildUnitRegex(units: string[]) {
    return new RegExp(`(\\d+(?:[.,]\\d+)?)(?:\\s*)(?:${units.join('|')})\\b`, 'g')
}

const colonStrategy: DurationStrategy = {
    matches(value) {
        return colonDurationRegex.test(value)
    },
    parse(value) {
        const match = value.match(colonDurationRegex)
        const hours = match ? parseDecimalNumber(match[1]) : null
        const minutes = match ? parseDecimalNumber(match[2]) : null
        if (hours === null || minutes === null) return null
        return Math.round(hours * 60 + minutes)
    }
}

const compactHourMinuteStrategy: DurationStrategy = {
    matches(value) {
        return compactHourMinuteRegex.test(value)
    },
    parse(value) {
        const match = value.match(compactHourMinuteRegex)
        const hours = match ? parseDecimalNumber(match[1]) : null
        const minutes = match ? parseDecimalNumber(match[2]) : null
        if (hours === null || minutes === null) return null
        return Math.round(hours * 60 + minutes)
    }
}

const unitStrategy: DurationStrategy = {
    matches(value) {
        return Boolean(
            buildUnitRegex(hourUnits).test(value) || buildUnitRegex(minuteUnits).test(value)
        )
    },
    parse(value) {
        let totalMinutes = 0
        let matched = false

        const parseUnits = (units: string[], multiplier: number) => {
            const regex = buildUnitRegex(units)
            let match: RegExpExecArray | null
            while ((match = regex.exec(value)) !== null) {
                const parsedValue = match[1] ? parseDecimalNumber(match[1]) : null
                if (parsedValue !== null) {
                    matched = true
                    totalMinutes += parsedValue * multiplier
                }
            }
        }

        parseUnits(hourUnits, 60)
        parseUnits(minuteUnits, 1)

        if (!matched) return null
        return Math.round(totalMinutes)
    }
}

const numericStrategy: DurationStrategy = {
    matches(value) {
        return /^\d+(?:[.,]\d+)?$/.test(value.replace(/\s+/g, ''))
    },
    parse(value) {
        const numericValue = parseDecimalNumber(value.replace(/\s+/g, ''))
        if (numericValue === null) return null
        return Math.round(numericValue)
    }
}

const strategies: DurationStrategy[] = [
    colonStrategy,
    compactHourMinuteStrategy,
    unitStrategy,
    numericStrategy
]

export function parseDurationToMinutes(value?: string | null) {
    if (!value) return null
    const normalized = normalizeDurationInput(value)

    for (const strategy of strategies) {
        if (!strategy.matches(normalized)) continue
        const parsed = strategy.parse(normalized)
        if (parsed !== null) return parsed
    }

    return null
}
