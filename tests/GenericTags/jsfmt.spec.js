run_spec(__dirname, ["twig"], {
    twigMultiTags: [
        "nav,endnav",
        "switch,case,default,endswitch",
        "ifchildren,endifchildren",
        "cache,endcache"
    ]
});
