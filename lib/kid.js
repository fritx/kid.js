/**
 * Created by fritx on 3/28/14.
 */

(function (window, document) {

  var KID_NAME = 'kid';

  var kid = {};
  var _callbacks = kid.callbacks = {
    // uid  => fn
  };

  var _options = kid.options = {};
  _options.base = '';
  _options.alias = {
    // alias => name
  };

  function registerCallback(fn) {
    var uid = ('' + Math.random()).slice(2);
    _callbacks[uid] = fn;
    return uid;
  }

  function wrapScript(text, callback) {
    var uid = registerCallback(callback);
    var _top = [
      ';(function(window){'
    ].join('');
    var _bottom = [
      'window[\'', KID_NAME, '\'].callbacks[\'', uid, '\']();\n',
      'delete window[\'', KID_NAME, '\'].callbacks[\'', uid, '\'];\n',
      '})(window);\n'
    ].join('');
    return [_top, text, _bottom].join('\n');
  }

  function loadOneScript(url, callback) {
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

  function loadScripts(urls, callback) {
    var pieces = [];
    var total = urls.length;
    var loaded = 0;
    urls.forEach(function (url, i) {
      loadOneScript(url, function (piece) {
        // in order
        pieces[i] = piece;
        if (++loaded >= total) {
          // all loaded
          callback(pieces.join('\n'));
        }
      });
    });
  }

  function parseScripts(text, callback) {
    var el = document.createElement('script');
    el.innerHTML = wrapScript(text, callback);
    document.getElementsByTagName('head')[0].appendChild(el);
  }


  // config
  kid.config = function (options) {
    for (var key in options) {
      if (Object.prototype.hasOwnProperty.call(options, key)) {
        _options[key] = options[key];
      }
    }
  };


  // use
  kid.use = function (names, callback) {
    var urls = names.map(function (name) {
      var path = _options.alias[name] || name;
      return [_options.base, path].join('');
    });
    loadScripts(urls, function (text) {
      parseScripts(text, callback);
    });
  };

  // expose
  window[KID_NAME] = kid;

})(window, document);