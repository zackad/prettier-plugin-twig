const printFlushStatement = (node, path, print) => {
    const dashLeft = node.trimLeft ? "-" : "";
    const dashRight = node.trimRight ? "-" : "";
    return `{%${dashLeft} flush ${dashRight}%}`;
};

export { printFlushStatement };
