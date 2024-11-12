import { STRING_NEEDS_QUOTES } from "../util/index.js";

const p = (node, path, print, options) => {
    node[STRING_NEEDS_QUOTES] = true;
    const printedName = path.call(print, "name");
    const printedValue = path.call(print, "value");
    const separator = options.twigFollowOfficialCodingStandards ? ": " : " = ";
    return [printedName, separator, printedValue];
};

export { p as printNamedArgumentExpression };
