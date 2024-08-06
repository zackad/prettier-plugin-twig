import { doc } from "prettier";
const { group, indent, join, line, softline } = doc.builders;

const p = (node, path, print) => {
    const args = node.args;
    const body = path.call(print, "body");

    const parts = [];

    // Args
    if (args.length > 1) {
        // Multiple args
        parts.push(
            group([
                "(",
                join(
                    ", ",
                    args.map(arg => arg.name)
                ),
                ")"
            ])
        );
    } else {
        // Single arg
        parts.push(args[0].name);
    }

    // Arrow
    parts.push(" => ");

    // Body
    parts.push(body);

    return group(parts);
};

export { p as printArrowFunction };
