# Prettier Plugin for Twig

Forked from [trivago/prettier-plugin-twig-melody](https://github.com/trivago/prettier-plugin-twig-melody) with focus on twig template only.

![Prettier Twig Banner](./logo/wide-dark.svg#gh-dark-mode-only)
![Prettier Twig Banner](./logo/wide-light.svg#gh-light-mode-only)

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/zackad/prettier-plugin-twig-melody/ci.yaml?branch=master&style=for-the-badge&logo=github)
![GitHub License](https://img.shields.io/github/license/zackad/prettier-plugin-twig-melody?style=for-the-badge)
![NPM Version](https://img.shields.io/npm/v/%40zackad%2Fprettier-plugin-twig?style=for-the-badge&logo=npm)
![GitHub Tag](https://img.shields.io/github/v/tag/zackad/prettier-plugin-twig-melody?style=for-the-badge)

---

This Plugin enables Prettier to format `.twig` files, as well as `.html.twig`.

## Install

```bash
yarn add --dev @zackad/prettier-plugin-twig
```

## Use

```bash
prettier --write "**/*.twig"
```

In your editor, if the plugin is not automatically picked up and invoked (e.g., if you are using format on save, but no formatting is happening when you save), try adding the plugin explicitly in your Prettier configuration (e.g., `.prettierrc.json`) using the `plugins` key:

```json
{
    "printWidth": 80,
    "tabWidth": 4,
    "plugins": ["@zackad/prettier-plugin-twig"]
}
```

## Options

This Prettier plugin comes with some options that you can add to your Prettier configuration (e.g., `prettierrc.json`).

### twigSingleQuote (default: `true`)

Values can be `true` or `false`. If `true`, single quotes will be used for string literals in Twig files.

### twigPrintWidth (default: `80`)

Because Twig files might have a lot of nesting, it can be useful to define a separate print width for Twig files. This can be done with this option. If it is not set, the standard `printWidth` option is used.

### twigAlwaysBreakObjects (default: `true`)

If set to `true`, objects will always be wrapped/broken, even if they would fit on one line:

```html
<section
    class="{{ {
        base: css.prices
    } | classes }}"
></section>
```

If set to `false` (default value), this would be printed as:

```html
<section class="{{ { base: css.prices } | classes }}"></section>
```

### twigFollowOfficialCodingStandards (default: `true`)

Follow the standards described in [https://twig.symfony.com/doc/2.x/coding_standards.html](https://twig.symfony.com/doc/2.x/coding_standards.html) exactly. If set to `false`, some slight deviations might occur, such as spaces around the filter `|` operator (`s | upper` instead of `s|upper`).

### twigOutputEndblockName (default: `false`)

Choose whether to output the block name in `{% endblock %}` tags (e.g., `{% endblock content %}`) or not. The default is not to output it.

### twigMultiTags (default: `[]`)

An array of coherent sequences of non-standard Twig tags that should be treated as belonging together. Example (inspired by [Craft CMS](https://docs.craftcms.com/v2/templating/nav.html)):

```json
twigMultiTags: [
    "nav,endnav",
    "switch,case,default,endswitch",
    "ifchildren,endifchildren",
    "cache,endcache"
]
```

Looking at the case of `nav,endnav`, this means that the Twig tags `{% nav %}` and `{% endnav %}` will be treated as a pair, and everything in between will be indented:

```twig
{% nav entry in entries %}
    <li>
        <a href="{{ entry.url }}">{{ entry.title }}</a>
    </li>
{% endnav %}
```

If we did not list the `"nav,endnav"` entry in `twigMultiTags`, this code example would be printed without indentation, because `{% nav %}` and `{% endnav %}` would be treated as unrelated, individual Twig tags:

```twig
{% nav entry in entries %}
<li>
    <a href="{{ entry.url }}">{{ entry.title }}</a>
</li>
{% endnav %}
```

Note that the order matters: It has to be `"nav,endnav"`, and it must not be `"endnav,nav"`. In general, the first and the last tag name matter. In the case of `"switch,case,default,endswitch"`, the order of `case` and `default` does not matter. However, `switch` has to come first, and `endswitch` has to come last.

## Features

### `prettier-ignore` and `prettier-ignore-start`

When you are not happy with how Prettier formats a certain element or section in the code, you can tell it to leave it in peace:

```
{# prettier-ignore #}
<div   class="weird-formatting"   >This will not be re-formatted</div>

<div   class="weird-formatting"   >But this will be</div>
```

You can also tell Prettier to leave entire regions as they are:

```
{# prettier-ignore-start #}
    ...
{# prettier-ignore-end #}
```

## Testing

-   You can call `yarn test`to test against all regular tests

## Credit

-   Author: Tom Bartel <thomas.bartel@trivago.com>
