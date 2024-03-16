const p = (node, path, print) => {
    return [
        node.trimLeft ? "{%-" : "{%",
        " do ",
        path.call(print, "value"),
        node.trimRight ? " -%}" : " %}"
    ];
};

export { p as printDoStatement };
