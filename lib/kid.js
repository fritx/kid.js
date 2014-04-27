/**
 * Created by fritx on 3/28/14.
 */

(function (window) {

  var KID_NAME = 'kid';
  var kid = {};

  var _handlers = {};
  var _nextHandlerId = 1;

  var _options = kid.options = {};
  _options.base = '';
  _options.alias = {};

  function registerHandler(fn) {
    var id = _nextHandlerId++;
    _handlers[id] = fn;
    return id;
  }

  function wrapCode(code, callback) {
    var id = registerHandler(callback);
    var header = [
      ';(function(window){'
    ].join('\n');
    var footer = [
      'window[\'' + KID_NAME + '\']._handle(' + id + ');',
      '})(window);'
    ].join('\n');
    return [header, code, footer].join('\n');
  }

  function fetchScript(url, callback) {
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

  function fetchScriptList(urls, callback) {
    var total = urls.length;
    if (total <= 0) {
      return callback('');
    }
    var loaded = 0;
    var pieces = [];
    urls.forEach(function (url, i) {
      fetchScript(url, function (piece) {
        // in order
        pieces[i] = piece;
        if (++loaded >= total) {
          // all loaded
          callback(pieces.join('\n;'));
        }
      });
    });
  }

  function runCode(code, callback) {
    var wrapped = wrapCode(code, callback);
    eval(wrapped);
  }

  // method handle
  kid._handle = function (id) {
    // call and remove
    _handlers[id].call(window);
    delete _handlers[id];
    return kid;
  };

  // api config
  kid.config = function (options) {
    var hasOwn = Object.prototype.hasOwnProperty;
    for (var key in options) {
      if (hasOwn.call(options, key)) {
        _options[key] = options[key];
      }
    }
  };

  // api use
  kid.use = function (deps, callback) {
    var urls = deps
      .map(function (dep) {
        var paths = _options.alias[dep] || dep;
        if (!Array.isArray(paths)) {
          paths = [paths];
        }
        return paths.map(function (path) {
          return _options.base + path;
        });
      })
      .reduce(function (list, paths) {
        return list.concat(paths);
      }, []);
    fetchScriptList(urls, function (code) {
      runCode(code, callback);
    });
  };

  // expose
  window[KID_NAME] = kid;

})(window);