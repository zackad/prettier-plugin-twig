import { STRING_NEEDS_QUOTES } from "../util/index.js";

const p = (node, path, print) => {
    node[STRING_NEEDS_QUOTES] = true;
    const printedName = path.call(print, "name");
    const printedValue = path.call(print, "value");
    return [printedName, " = ", printedValue];
};

export { p as printNamedArgumentExpression };
