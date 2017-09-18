const indent = 2;

function space(n) {
    let s = "";
    for (let i = 0; i < n; i++) {
        s += " ";
    }
    return s;
}

/** @return true if all elements of array are primitve (ie. string, boolean, number)*/
function isAllPrimitive(array) {
    for (let o of array) {
        let type = typeof o;
        if (type !== "string" && type !== "number" && type !== "boolean") return false;
    }
    return true;
}

/** When all elements of array are primitive and user choose compact mode, return array json as one line only */
function formatArrayCompact(json, options, level) {
    let s = "[";
    let index = 0;
    for (let o of json) {
        if (index > 0) s += ",";
        s += format(o, options, level);
        index++;
    }
    s += "]";
    return s;
}

function formatArray(json, options, level) {
    console.log(json);
    if (json.length === 0) return "[]";

    if (options.compact && isAllPrimitive(json)) {
        return formatArrayCompact(json, options, level);
    }

    let s = "[\n";
    let tab = space((level + 1) * indent);
    let tabOuter = space(level * indent);
    let index = 0;
    for (let o of json) {
        s += tab + format(o, options, level + 1);
        if (index < json.length - 1) {
            s += ",";
        }
        s += "\n";
        index++;
    }
    s += tabOuter + "]";
    return s;
}

function formatObject(json, options, level) {
    let tabOuter = space(level * indent);
    let tab = space((level + 1) * indent);
    let index = 0;
    let keys = Object.keys(json);
    let s = "{\n";
    for (let key of keys) {
        let value = format(json[key], options, level + 1);
        s += `${tab}"${key}" : ${value}`;
        if (index < keys.length - 1) {
            s += ",\n";
        }
        index++;
    }
    s += "\n" + tabOuter + "}";
    return s;
}

export default function format(json, options, level = 0) {
    if (typeof json === "string") {
        return `"${json}"`;
    }
    if (typeof json === "object" && Array.isArray(json)) {
        return formatArray(json, options, level);
    }

    if (typeof json === "object" && !Array.isArray(json)) {
        return formatObject(json, options, level);
    }

    return `${json}`;
}