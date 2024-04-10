run_spec(__dirname, ["melody"], {
    twigMultiTags: ["switch,case,default,endswitch"],
    twigMelodyPlugins: ["src/plugins/switch-plugin"]
});
