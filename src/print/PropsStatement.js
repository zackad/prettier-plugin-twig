import { doc } from "prettier";

const { group, indent, join, line, indentIfBreak, ifBreak, softline } =
    doc.builders;

const printPropsStatement = (node, path, print) => {
    const itemsGroupId = Symbol("prop-items");

    const mappedItems = path.map(print, "items");
    const joinedItems = join([",", line], mappedItems);

    return group(
        [
            node.trimLeft ? "{%-" : "{%",
            " props ",
            indentIfBreak([softline, joinedItems], { groupId: itemsGroupId }),
            line,
            node.trimRight ? "-%}" : "%}"
        ],
        { id: itemsGroupId }
    );
};

export { printPropsStatement };
