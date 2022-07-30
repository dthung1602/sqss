/**
 * A dead-simple implementation of node util.inspect
 */

const inspect: (obj: any) => string = (object) => {
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
    if (props) props = " " + props + " ";
    return object.constructor.name + " {" + props + "}";
};

function isPrimitive(val: any): boolean {
    return (
        ["number", "string", "undefined", "boolean"].includes(typeof val) ||
        val instanceof Number ||
        val instanceof String ||
        val instanceof Boolean ||
        val === null
    );
}

export default inspect;
