const printAliasExpression = (node, path, print) => {
    return [path.call(print, "name"), " as ", path.call(print, "alias")];
};

export { printAliasExpression };
