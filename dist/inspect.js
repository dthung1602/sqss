"use strict";
/**
 * A dead-simple implementation of node util.inspect
 */
Object.defineProperty(exports, "__esModule", { value: true });
const inspect = (object) => {
    if (isPrimitive(object)) {
        if (object instanceof String || typeof object === "string") {
            return object.includes("'") ? `"${object}"` : `'${object}'`;
        }
        return object + "";
    }
    if (Array.isArray(object)) {
        return "[" + object.map(inspect).join(", ") + "]";
    }
    let props = Object.entries(object)
        .map(([prop, val]) => `${prop}: ${inspect(val)}`)
        .join(", ");
    if (props)
        props = " " + props + " ";
    return object.constructor.name + " {" + props + "}";
};
function isPrimitive(val) {
    return (["number", "string", "undefined", "boolean"].includes(typeof val) ||
        val instanceof Number ||
        val instanceof String ||
        val instanceof Boolean ||
        val === null);
}
exports.default = inspect;
//# sourceMappingURL=inspect.js.map