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
    'jquery': 'jquery/2.0.0/jquery.js',
    'jquery.cookie': 'jquery.cookie/index.js'
  }
});
kid.use(['jquery', 'jquery.cookie'], function () {
  // modules loaded
  console.log($);
  console.log($.cookie);
});
```

Also see [test/](test/).

## TODO

- Also load less/css/coffee
- More access with modules
- Error handling