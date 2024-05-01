const p = (node, path, print) => {
    return [path.call(print, "name"), " as ", path.call(print, "alias")];
};

export { p as printAliasExpression };
