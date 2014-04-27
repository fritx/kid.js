# kid.js

Another Browser-side Module Loader.

## Kid.js vs Sea.js vs Require.js

| &nbsp; | Kid.js | Sea.js | Require.js |
| :---: | :---: | :---: | :---: |
| Style | \- | CMD | AMD |
| IE Comp | IE9+ | IE5.5+ | IE6+ |
| Symbol | `kid` | `seajs` | `require` |
| Size | <1K | 6.8K | 15.2K |
| Strict Block | No | Yes | Yes |
| Dep Repack | No | Yes | Yes |

Kid.js implements only dynamically loading, no AMD/CMD.

## Usage

```js
kid.config({
  base: 'scripts/',
  alias: {
    'underscore': 'underscore.js',
    'jquery': 'jquery/2.0.0/jquery.js',
    'jquery.cookie': 'jquery.cookie/index.js'
  }
});

// they work asynchronously

kid.use(['jquery', 'jquery.cookie'], function () {
  console.log($);
  console.log($.cookie);
});

kid.use(['underscore'], function () {
  console.log(_);
});
```

Also see [examples/](examples/).

## TODO

- Also load less/css/coffee (element onload)
- Error handling