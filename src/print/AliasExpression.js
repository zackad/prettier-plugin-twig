const p = (node, path, print) => {
    return [
        path.call(print, "name"),
        " as ",
        path.call(print, "alias")
    ];
};

module.exports = {
    printAliasExpression: p
};
