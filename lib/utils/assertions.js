"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertInt = exports.assertNonNullable = void 0;
function assertNonNullable(name, value) {
    if (value === null || value === undefined) {
        const message = `Variable "${name}" cannot be "${String(value)}".`;
        throw new ReferenceError(message);
    }
}
exports.assertNonNullable = assertNonNullable;
function assertInt(name, value) {
    if (value === null || value === undefined) {
        const message = `Variable "${name}" cannot be "${String(value)}".`;
        throw new ReferenceError(message);
    }
    if (!Number.isInteger(value)) {
        const message = `Variable "${name}":"${String(value)}" is not Integer.`;
        throw new TypeError(message);
    }
}
exports.assertInt = assertInt;
