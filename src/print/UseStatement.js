import { doc } from "prettier";

const { group, indent, join, line } = doc.builders;

const printUseStatement = (node, path, print) => {
    const docs = [
        node.trimLeft ? "{%-" : "{%",
        ' use "',
        path.call(print, "source"),
        '"'
    ];
    const hasAliases = node.aliases && node.aliases.length > 0;
    if (hasAliases) {
        docs.push(" with");
        const mappedAliases = path.map(print, "aliases");
        docs.push(indent([line, join([",", line], mappedAliases)]));
        docs.push(line);
    } else {
        docs.push(" ");
    }
    docs.push(node.trimRight ? "-%}" : "%}");
    return group(docs);
};

export { printUseStatement };
