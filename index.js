/**
 * Created by fritx on 3/28/14.
 */

(function (window, document) {

  var KID_NAME = 'kid';

  var kid = {};
  kid.callbacks = {};

  var _options = {};
  _options.base = '';
  _options.alias = {
    // name => path
  };

  function wrap(text, name) {
    var _top = [
      ';(function(window){'
    ].join('');
    var _bottom = [
      'window[\'', KID_NAME, '\'].callbacks[\'', name, '\']();\n',
      'delete window[\'', KID_NAME, '\'].callbacks[\'', name, '\'];\n',
      '})(window);\n'
    ].join('');
    return [_top, text, _bottom].join('\n')
  }

  function load(url, callback) {
    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.onreadystatechange = function () {
      if (req.readyState === 4) {
        if (req.status === 200) {
          callback(req.responseText);
        }
      }
    };
    req.send();
  }

  function evaluate(text, name) {
    var el = document.createElement('script');
    el.innerHTML = wrap(text, name);
    document.getElementsByTagName('head')[0].appendChild(el);
  }

  // config
  kid.config = function (options) {
    for (var key in options) {
      if (options.hasOwnProperty(key)) {
        _options[key] = options[key];
      }
    }
  };

  // use
  kid.use = function (deps, callback) {
    var mods = [];
    var len = deps.length;
    var loaded = 0;
    var evaludated = 0;
    deps.forEach(function (dep, i) {
      var path = _options.alias[dep] || dep;
      var url = _options.base + path;
      load(url, function (text) {
        mods[i] = {
          name: ('' + Math.random()).slice(2),
          text: text
        };
        loaded++;
        if (loaded >= len) {
          // evaluate all
          mods.forEach(function (mod, i) {
            kid.callbacks[mod.name] = function () {
              evaludated++;
              if (evaludated >= len) {
                return callback();
              }
              evaluate(mods[i + 1].text, mods[i + 1].name);
            };
          });
          evaluate(mods[0].text, mods[0].name);
        }
      });
    });
  };

  // expose
  window[KID_NAME] = kid;

})(window, document);