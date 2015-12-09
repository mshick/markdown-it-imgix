# markdown-it-imgix
Apply an imgix domain and parameters to markdown images.

# Install

```sh
$ npm install markdown-it-imgix --save
```

# Usage

```js
const Markdown = require("markdown-it");
const imgix = require("markdown-it");

const md = new Markdown().use(imgix, {
  match: "/example/path",
  domain: "example.imgix.net"
});

const str = `text with\n\n![](/another/path/img.png)\n\n![](/example/path/fig.png)\n\nanother paragraph`

const res = md.render(str);

console.log(res);
```

# Options

> You can supply either a single object with the following params, or an array
  of objects to perform multiple replacements.

* `match`: (required) url / path patterns to match for replacement
* `domain`: (required) imgix domain that will replace the match
* `params`: imgix api params to apply for this match
* `secureUrl`: if you want to use https and have a ssl-enabled imgix domain
