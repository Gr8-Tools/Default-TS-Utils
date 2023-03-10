export function assertNonNullable<T>(name: string, value: T | null | undefined): asserts value is NonNullable<T> {
    if (value === null || value === undefined) {
        const message = `Variable "${name}" cannot be "${String(value)}".`;

        throw new ReferenceError(message);
    }
}

export function assertInt(name: string, value: number | null | undefined) {
    if (value === null || value === undefined) {
        const message = `Variable "${name}" cannot be "${String(value)}".`;

        throw new ReferenceError(message);
    }

    if (!Number.isInteger(value)){
        const message = `Variable "${name}":"${String(value)}" is not Integer.`

        throw new TypeError(message);
    }
}

