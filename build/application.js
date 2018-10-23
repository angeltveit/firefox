(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Attribute = Attribute;

var _utils = require("../utils.js");

function Attribute(name, type) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    default: ''
  };
  var property = (0, _utils.camelCase)(name);
  var attribute = (0, _utils.kebabCase)(name);
  return function define(Class) {
    if (!Class.observedAttributes) {
      Class.observedAttributes = [];
    }

    Class.observedAttributes.push(attribute);
    Object.defineProperty(Class.prototype, property, {
      enumerable: true,
      configurable: true,
      get: function get() {
        if (type === Boolean) {
          return this.hasAttribute(attribute);
        }

        var value = this.getAttribute(attribute);

        if (type.instance) {
          return type.instance(value === null ? options.default : value);
        } else {
          return type(value === null ? options.default : value);
        }
      },
      set: function set(value) {
        if (type === Boolean) {
          if (value) {
            this.setAttribute(attribute, '');
          } else {
            this.removeAttribute(attribute);
          }
        } else {
          this.setAttribute(attribute, value);
        }
      }
    });
  };
}

},{"../utils.js":7}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = Component;
exports.getTagName = getTagName;
exports.register = register;
exports.bootstrap = bootstrap;

var _utils = require("../utils.js");

var COMPONENTS = [];
var sggWidgets = Symbol.for('sggWidgets');

function Component(namespace) {
  return function define(Class) {
    Class.namespace = namespace;

    if (customElements[sggWidgets]) {
      return register(Class);
    }

    COMPONENTS.push(Class);
  };
}

function getTagName(Class) {
  if (Class.tagName) return Class.tagName;
  var namespace = Class.namespace,
      className = Class.className;
  var name = className || Class.name;
  return Class.tagName = (0, _utils.kebabCase)(namespace + name);
}

function register(component) {
  var tagName = getTagName(component);
  var plugins = customElements[sggWidgets];
  var Component = (0, _utils.define)(plugins, component);
  var Element = customElements.get(tagName);

  if (Element) {
    return (0, _utils.transfer)(Element, Component);
  }

  customElements.define(tagName, Component);
}

function bootstrap() {
  var plugins = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  customElements[sggWidgets] = plugins;

  for (var _i = 0; _i < COMPONENTS.length; _i++) {
    var component = COMPONENTS[_i];
    register(component);
  }
}

},{"../utils.js":7}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Template = Template;

function Template(template) {
  return function define(Class) {
    Class.prototype.template = template;
  };
}

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  Component: true,
  bootstrap: true,
  Template: true,
  Attribute: true
};
Object.defineProperty(exports, "Component", {
  enumerable: true,
  get: function get() {
    return _component.Component;
  }
});
Object.defineProperty(exports, "bootstrap", {
  enumerable: true,
  get: function get() {
    return _component.bootstrap;
  }
});
Object.defineProperty(exports, "Template", {
  enumerable: true,
  get: function get() {
    return _template.Template;
  }
});
Object.defineProperty(exports, "Attribute", {
  enumerable: true,
  get: function get() {
    return _attribute.Attribute;
  }
});

var _component = require("./decorators/component.js");

var _template = require("./decorators/template.js");

var _attribute = require("./decorators/attribute.js");

var _utils = require("./utils.js");

Object.keys(_utils).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _utils[key];
    }
  });
});

},{"./decorators/attribute.js":1,"./decorators/component.js":2,"./decorators/template.js":3,"./utils.js":7}],5:[function(require,module,exports){
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hyper = hyper;

var _utils = require("../utils.js");

var _queue = require("./queue.js");

function hyper(_ref) {
  var bind = _ref.bind;
  var shedule = (0, _queue.queue)(function render(node) {
    return node.template(node.html);
  });
  return function renderer(Class) {
    (0, _utils.plugin)(Class.prototype, {
      attributeChangedCallback: function attributeChangedCallback(args, next) {
        this.render();
        return next();
      },
      connectedCallback: function connectedCallback(args, next) {
        this.render();
        return next();
      },
      render: function render(_ref2, next) {
        var _ref3 = _slicedToArray(_ref2, 1),
            callback = _ref3[0];

        if (!this.html) {
          this.attachShadow({
            mode: 'open'
          });
          this.html = bind(this.shadowRoot);
        }

        shedule(this, function () {
          if (typeof callback === 'function') {
            callback.apply(void 0, arguments);
          }

          next();
        });
      }
    });
  };
}

},{"../utils.js":7,"./queue.js":6}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queue = queue;

var _utils = require("../utils.js");

function queue(render) {
  var queue = new Set();
  var cache = new WeakMap();
  var callbacks = new Set();

  function apply() {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = queue[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var node = _step.value;
        render(node, cache);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }

  function attempt() {
    try {
      apply();
    } catch (error) {
      throw error;
    } finally {
      queue.clear();
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = callbacks[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var callback = _step2.value;
          callback();
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      callbacks.clear();
    }
  }

  return function shedule(element, callback) {
    if (!queue.size) {
      requestAnimationFrame(attempt);
    }

    if (typeof callback === 'function') {
      callbacks.add(callback);
    }

    queue.add(element);
  };
}

},{"../utils.js":7}],7:[function(require,module,exports){
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.kebabCase = kebabCase;
exports.camelCase = camelCase;
exports.define = define;
exports.middleware = middleware;
exports.plugin = plugin;
exports.transfer = transfer;
var UPPER = /.[A-Z]/g;

function kebabCase(string) {
  return string.replace(UPPER, function (c) {
    return c[0] + '-' + c[1].toLowerCase();
  });
}

function camelCase(string) {
  return string.replace(/-./g, function (c) {
    return c[1].toUpperCase();
  });
}

function define() {
  var decorators = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : decorators.pop();
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = decorators.reverse()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var transform = _step.value;
      target = transform(target) || target;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return target;
}

function middleware(done) {
  var middleware = [];
  Object.assign(pipeline, {
    use: function use() {
      return middleware.push.apply(middleware, arguments), this;
    }
  });

  function pipeline() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var context = {
      self: this,
      index: 0
    };

    function next() {
      var method = middleware[context.index++];

      if (method) {
        return method.call(context.self, args, next);
      } else if (done) {
        return done.apply(context.self, args);
      }
    }

    return next();
  }

  return pipeline;
}

function plugin(target) {
  for (var _len2 = arguments.length, sources = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    sources[_key2 - 1] = arguments[_key2];
  }

  for (var _i = 0; _i < sources.length; _i++) {
    var source = sources[_i];

    var _arr = Object.entries(source);

    for (var _i2 = 0; _i2 < _arr.length; _i2++) {
      var _arr$_i = _slicedToArray(_arr[_i2], 2),
          property = _arr$_i[0],
          method = _arr$_i[1];

      if (typeof method !== 'function') continue;

      if (!target[property]) {
        target[property] = middleware();
      } else if (!target[property].use) {
        target[property] = middleware(target[property]);
      }

      target[property].use(method);
    }
  }

  return target;
}

function transfer(target) {
  for (var _len3 = arguments.length, sources = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    sources[_key3 - 1] = arguments[_key3];
  }

  for (var _i3 = 0; _i3 < sources.length; _i3++) {
    var source = sources[_i3];
    var properties = Object.getOwnPropertyDescriptors(source);

    var _arr2 = Object.entries(properties);

    for (var _i4 = 0; _i4 < _arr2.length; _i4++) {
      var _arr2$_i = _slicedToArray(_arr2[_i4], 2),
          name = _arr2$_i[0],
          descriptor = _arr2$_i[1];

      if (name === 'prototype') {
        transfer(target.prototype, source.prototype);
      }

      if (descriptor.configurable) {
        Object.defineProperty(target, name, descriptor);
      }
    }
  }
}

},{}],8:[function(require,module,exports){
'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _require = require('../shared/poorlyfills.js'),
    Map = _require.Map,
    WeakMap = _require.WeakMap; // hyperHTML.Component is a very basic class
// able to create Custom Elements like components
// including the ability to listen to connect/disconnect
// events via onconnect/ondisconnect attributes
// Components can be created imperatively or declaratively.
// The main difference is that declared components
// will not automatically render on setState(...)
// to simplify state handling on render.


function Component() {
  return this; // this is needed in Edge !!!
}

Object.defineProperty(exports, '__esModule', {
  value: true
}).default = Component; // Component is lazily setup because it needs
// wire mechanism as lazy content

function setup(content) {
  // there are various weakly referenced variables in here
  // and mostly are to use Component.for(...) static method.
  var children = new WeakMap();
  var create = Object.create;

  var createEntry = function createEntry(wm, id, component) {
    wm.set(id, component);
    return component;
  };

  var get = function get(Class, info, context, id) {
    var relation = info.get(Class) || relate(Class, info);

    switch (_typeof(id)) {
      case 'object':
      case 'function':
        var wm = relation.w || (relation.w = new WeakMap());
        return wm.get(id) || createEntry(wm, id, new Class(context));

      default:
        var sm = relation.p || (relation.p = create(null));
        return sm[id] || (sm[id] = new Class(context));
    }
  };

  var relate = function relate(Class, info) {
    var relation = {
      w: null,
      p: null
    };
    info.set(Class, relation);
    return relation;
  };

  var set = function set(context) {
    var info = new Map();
    children.set(context, info);
    return info;
  }; // The Component Class


  Object.defineProperties(Component, {
    // Component.for(context[, id]) is a convenient way
    // to automatically relate data/context to children components
    // If not created yet, the new Component(context) is weakly stored
    // and after that same instance would always be returned.
    for: {
      configurable: true,
      value: function value(context, id) {
        return get(this, children.get(context) || set(context), context, id == null ? 'default' : id);
      }
    }
  });
  Object.defineProperties(Component.prototype, {
    // all events are handled with the component as context
    handleEvent: {
      value: function value(e) {
        var ct = e.currentTarget;
        this['getAttribute' in ct && ct.getAttribute('data-call') || 'on' + e.type](e);
      }
    },
    // components will lazily define html or svg properties
    // as soon as these are invoked within the .render() method
    // Such render() method is not provided by the base class
    // but it must be available through the Component extend.
    // Declared components could implement a
    // render(props) method too and use props as needed.
    html: lazyGetter('html', content),
    svg: lazyGetter('svg', content),
    // the state is a very basic/simple mechanism inspired by Preact
    state: lazyGetter('state', function () {
      return this.defaultState;
    }),
    // it is possible to define a default state that'd be always an object otherwise
    defaultState: {
      get: function get() {
        return {};
      }
    },
    // dispatch a bubbling, cancelable, custom event
    // through the first known/available node
    dispatch: {
      value: function value(type, detail) {
        var _wire$ = this._wire$;

        if (_wire$) {
          var event = new CustomEvent(type, {
            bubbles: true,
            cancelable: true,
            detail: detail
          });
          event.component = this;
          return (_wire$.dispatchEvent ? _wire$ : _wire$.childNodes[0]).dispatchEvent(event);
        }

        return false;
      }
    },
    // setting some property state through a new object
    // or a callback, triggers also automatically a render
    // unless explicitly specified to not do so (render === false)
    setState: {
      value: function value(state, render) {
        var target = this.state;
        var source = typeof state === 'function' ? state.call(this, target) : state;

        for (var key in source) {
          target[key] = source[key];
        }

        if (render !== false) this.render();
        return this;
      }
    }
  });
}

exports.setup = setup; // instead of a secret key I could've used a WeakMap
// However, attaching a property directly will result
// into better performance with thousands of components
// hanging around, and less memory pressure caused by the WeakMap

var lazyGetter = function lazyGetter(type, fn) {
  var secret = '_' + type + '$';
  return {
    get: function get() {
      return this[secret] || setValue(this, secret, fn.call(this, type));
    },
    set: function set(value) {
      setValue(this, secret, value);
    }
  };
}; // shortcut to set value on get or set(value)


var setValue = function setValue(self, secret, value) {
  return Object.defineProperty(self, secret, {
    configurable: true,
    value: typeof value === 'function' ? function () {
      return self._wire$ = value.apply(this, arguments);
    } : value
  })[secret];
};

},{"../shared/poorlyfills.js":21}],9:[function(require,module,exports){
'use strict';

var _require = require('../shared/utils.js'),
    append = _require.append;

var _require2 = require('../shared/easy-dom.js'),
    doc = _require2.doc,
    fragment = _require2.fragment;

function Wire(childNodes) {
  this.childNodes = childNodes;
  this.length = childNodes.length;
  this.first = childNodes[0];
  this.last = childNodes[this.length - 1];
}

Object.defineProperty(exports, '__esModule', {
  value: true
}).default = Wire; // when a wire is inserted, all its nodes will follow

Wire.prototype.insert = function insert() {
  var df = fragment(this.first);
  append(df, this.childNodes);
  return df;
}; // when a wire is removed, all its nodes must be removed as well


Wire.prototype.remove = function remove() {
  var first = this.first;
  var last = this.last;

  if (this.length === 2) {
    last.parentNode.removeChild(last);
  } else {
    var range = doc(first).createRange();
    range.setStartBefore(this.childNodes[1]);
    range.setEndAfter(last);
    range.deleteContents();
  }

  return first;
};

},{"../shared/easy-dom.js":19,"../shared/utils.js":23}],10:[function(require,module,exports){
'use strict';

var _require = require('../shared/poorlyfills.js'),
    Map = _require.Map,
    WeakMap = _require.WeakMap;

var _require2 = require('../shared/constants.js'),
    G = _require2.G,
    UIDC = _require2.UIDC,
    VOID_ELEMENTS = _require2.VOID_ELEMENTS;

var Updates = function (m) {
  return m.__esModule ? m.default : m;
}(require('../objects/Updates.js'));

var _require3 = require('../shared/utils.js'),
    createFragment = _require3.createFragment,
    importNode = _require3.importNode,
    unique = _require3.unique,
    TemplateMap = _require3.TemplateMap;

var _require4 = require('../shared/re.js'),
    selfClosing = _require4.selfClosing; // a weak collection of contexts that
// are already known to hyperHTML


var bewitched = new WeakMap(); // all unique template literals

var templates = TemplateMap(); // better known as hyper.bind(node), the render is
// the main tag function in charge of fully upgrading
// or simply updating, contexts used as hyperHTML targets.
// The `this` context is either a regular DOM node or a fragment.

function render(template) {
  var wicked = bewitched.get(this);

  if (wicked && wicked.template === unique(template)) {
    update.apply(wicked.updates, arguments);
  } else {
    upgrade.apply(this, arguments);
  }

  return this;
} // an upgrade is in charge of collecting template info,
// parse it once, if unknown, to map all interpolations
// as single DOM callbacks, relate such template
// to the current context, and render it after cleaning the context up


function upgrade(template) {
  template = unique(template);
  var info = templates.get(template) || createTemplate.call(this, template);
  var fragment = importNode(this.ownerDocument, info.fragment);
  var updates = Updates.create(fragment, info.paths);
  bewitched.set(this, {
    template: template,
    updates: updates
  });
  update.apply(updates, arguments);
  this.textContent = '';
  this.appendChild(fragment);
} // an update simply loops over all mapped DOM operations


function update() {
  var length = arguments.length;

  for (var i = 1; i < length; i++) {
    this[i - 1](arguments[i]);
  }
} // a template can be used to create a document fragment
// aware of all interpolations and with a list
// of paths used to find once those nodes that need updates,
// no matter if these are attributes, text nodes, or regular one


function createTemplate(template) {
  var paths = [];
  var html = template.join(UIDC).replace(SC_RE, SC_PLACE);
  var fragment = createFragment(this, html);
  Updates.find(fragment, paths, template.slice());
  var info = {
    fragment: fragment,
    paths: paths
  };
  templates.set(template, info);
  return info;
} // some node could be special though, like a custom element
// with a self closing tag, which should work through these changes.


var SC_RE = selfClosing;

var SC_PLACE = function SC_PLACE($0, $1, $2) {
  return VOID_ELEMENTS.test($1) ? $0 : '<' + $1 + $2 + '></' + $1 + '>';
};

Object.defineProperty(exports, '__esModule', {
  value: true
}).default = render;

},{"../objects/Updates.js":16,"../shared/constants.js":17,"../shared/poorlyfills.js":21,"../shared/re.js":22,"../shared/utils.js":23}],11:[function(require,module,exports){
'use strict';

var _require = require('../shared/constants.js'),
    ELEMENT_NODE = _require.ELEMENT_NODE,
    SVG_NAMESPACE = _require.SVG_NAMESPACE;

var _require2 = require('../shared/poorlyfills.js'),
    WeakMap = _require2.WeakMap,
    trim = _require2.trim;

var _require3 = require('../shared/easy-dom.js'),
    fragment = _require3.fragment;

var _require4 = require('../shared/utils.js'),
    append = _require4.append,
    slice = _require4.slice,
    unique = _require4.unique;

var Wire = function (m) {
  return m.__esModule ? m.default : m;
}(require('../classes/Wire.js'));

var render = function (m) {
  return m.__esModule ? m.default : m;
}(require('./render.js')); // all wires used per each context


var wires = new WeakMap(); // A wire is a callback used as tag function
// to lazily relate a generic object to a template literal.
// hyper.wire(user)`<div id=user>${user.name}</div>`; => the div#user
// This provides the ability to have a unique DOM structure
// related to a unique JS object through a reusable template literal.
// A wire can specify a type, as svg or html, and also an id
// via html:id or :id convention. Such :id allows same JS objects
// to be associated to different DOM structures accordingly with
// the used template literal without losing previously rendered parts.

var wire = function wire(obj, type) {
  return obj == null ? content(type || 'html') : weakly(obj, type || 'html');
}; // A wire content is a virtual reference to one or more nodes.
// It's represented by either a DOM node, or an Array.
// In both cases, the wire content role is to simply update
// all nodes through the list of related callbacks.
// In few words, a wire content is like an invisible parent node
// in charge of updating its content like a bound element would do.


var content = function content(type) {
  var wire, container, content, template, updates;
  return function (statics) {
    statics = unique(statics);
    var setup = template !== statics;

    if (setup) {
      template = statics;
      content = fragment(document);
      container = type === 'svg' ? document.createElementNS(SVG_NAMESPACE, 'svg') : content;
      updates = render.bind(container);
    }

    updates.apply(null, arguments);

    if (setup) {
      if (type === 'svg') {
        append(content, slice.call(container.childNodes));
      }

      wire = wireContent(content);
    }

    return wire;
  };
}; // wires are weakly created through objects.
// Each object can have multiple wires associated
// and this is thanks to the type + :id feature.


var weakly = function weakly(obj, type) {
  var i = type.indexOf(':');
  var wire = wires.get(obj);
  var id = type;

  if (-1 < i) {
    id = type.slice(i + 1);
    type = type.slice(0, i) || 'html';
  }

  if (!wire) wires.set(obj, wire = {});
  return wire[id] || (wire[id] = content(type));
}; // a document fragment loses its nodes as soon
// as it's appended into another node.
// This would easily lose wired content
// so that on a second render call, the parent
// node wouldn't know which node was there
// associated to the interpolation.
// To prevent hyperHTML to forget about wired nodes,
// these are either returned as Array or, if there's ony one entry,
// as single referenced node that won't disappear from the fragment.
// The initial fragment, at this point, would be used as unique reference.


var wireContent = function wireContent(node) {
  var childNodes = node.childNodes;
  var length = childNodes.length;
  var wireNodes = [];

  for (var i = 0; i < length; i++) {
    var child = childNodes[i];

    if (child.nodeType === ELEMENT_NODE || trim.call(child.textContent).length !== 0) {
      wireNodes.push(child);
    }
  }

  return wireNodes.length === 1 ? wireNodes[0] : new Wire(wireNodes);
};

exports.content = content;
exports.weakly = weakly;
Object.defineProperty(exports, '__esModule', {
  value: true
}).default = wire;

},{"../classes/Wire.js":9,"../shared/constants.js":17,"../shared/easy-dom.js":19,"../shared/poorlyfills.js":21,"../shared/utils.js":23,"./render.js":10}],12:[function(require,module,exports){
'use strict';
/*! (c) Andrea Giammarchi (ISC) */

var Component = function (m) {
  return m.__esModule ? m.default : m;
}(require('./classes/Component.js'));

var _require = require('./classes/Component.js'),
    setup = _require.setup;

var Intent = function (m) {
  return m.__esModule ? m.default : m;
}(require('./objects/Intent.js'));

var wire = function (m) {
  return m.__esModule ? m.default : m;
}(require('./hyper/wire.js'));

var _require2 = require('./hyper/wire.js'),
    content = _require2.content,
    weakly = _require2.weakly;

var render = function (m) {
  return m.__esModule ? m.default : m;
}(require('./hyper/render.js'));

var diff = function (m) {
  return m.__esModule ? m.default : m;
}(require('./shared/domdiff.js')); // all functions are self bound to the right context
// you can do the following
// const {bind, wire} = hyperHTML;
// and use them right away: bind(node)`hello!`;


var bind = function bind(context) {
  return render.bind(context);
};

var define = Intent.define;
hyper.Component = Component;
hyper.bind = bind;
hyper.define = define;
hyper.diff = diff;
hyper.hyper = hyper;
hyper.wire = wire; // the wire content is the lazy defined
// html or svg property of each hyper.Component

setup(content); // everything is exported directly or through the
// hyperHTML callback, when used as top level script

exports.Component = Component;
exports.bind = bind;
exports.define = define;
exports.diff = diff;
exports.hyper = hyper;
exports.wire = wire; // by default, hyperHTML is a smart function
// that "magically" understands what's the best
// thing to do with passed arguments

function hyper(HTML) {
  return arguments.length < 2 ? HTML == null ? content('html') : typeof HTML === 'string' ? hyper.wire(null, HTML) : 'raw' in HTML ? content('html')(HTML) : 'nodeType' in HTML ? hyper.bind(HTML) : weakly(HTML, 'html') : ('raw' in HTML ? content('html') : hyper.wire).apply(null, arguments);
}

Object.defineProperty(exports, '__esModule', {
  value: true
}).default = hyper;

},{"./classes/Component.js":8,"./hyper/render.js":10,"./hyper/wire.js":11,"./objects/Intent.js":13,"./shared/domdiff.js":18}],13:[function(require,module,exports){
'use strict';

var attributes = {};
var intents = {};
var keys = [];
var hasOwnProperty = intents.hasOwnProperty;
var length = 0;
Object.defineProperty(exports, '__esModule', {
  value: true
}).default = {
  // used to invoke right away hyper:attributes
  attributes: attributes,
  // hyperHTML.define('intent', (object, update) => {...})
  // can be used to define a third parts update mechanism
  // when every other known mechanism failed.
  // hyper.define('user', info => info.name);
  // hyper(node)`<p>${{user}}</p>`;
  define: function define(intent, callback) {
    if (intent.indexOf('-') < 0) {
      if (!(intent in intents)) {
        length = keys.push(intent);
      }

      intents[intent] = callback;
    } else {
      attributes[intent] = callback;
    }
  },
  // this method is used internally as last resort
  // to retrieve a value out of an object
  invoke: function invoke(object, callback) {
    for (var i = 0; i < length; i++) {
      var key = keys[i];

      if (hasOwnProperty.call(object, key)) {
        return intents[key](object[key], callback);
      }
    }
  }
};

},{}],14:[function(require,module,exports){
'use strict';

var _require = require('../shared/constants.js'),
    COMMENT_NODE = _require.COMMENT_NODE,
    DOCUMENT_FRAGMENT_NODE = _require.DOCUMENT_FRAGMENT_NODE,
    ELEMENT_NODE = _require.ELEMENT_NODE; // every template literal interpolation indicates
// a precise target in the DOM the template is representing.
// `<p id=${'attribute'}>some ${'content'}</p>`
// hyperHTML finds only once per template literal,
// hence once per entire application life-cycle,
// all nodes that are related to interpolations.
// These nodes are stored as indexes used to retrieve,
// once per upgrade, nodes that will change on each future update.
// A path example is [2, 0, 1] representing the operation:
// node.childNodes[2].childNodes[0].childNodes[1]
// Attributes are addressed via their owner node and their name.


var createPath = function createPath(node) {
  var path = [];
  var parentNode;

  switch (node.nodeType) {
    case ELEMENT_NODE:
    case DOCUMENT_FRAGMENT_NODE:
      parentNode = node;
      break;

    case COMMENT_NODE:
      parentNode = node.parentNode;
      prepend(path, parentNode, node);
      break;

    default:
      parentNode = node.ownerElement;
      break;
  }

  for (node = parentNode; parentNode = parentNode.parentNode; node = parentNode) {
    prepend(path, parentNode, node);
  }

  return path;
};

var prepend = function prepend(path, parent, node) {
  path.unshift(path.indexOf.call(parent.childNodes, node));
};

Object.defineProperty(exports, '__esModule', {
  value: true
}).default = {
  create: function create(type, node, name) {
    return {
      type: type,
      name: name,
      node: node,
      path: createPath(node)
    };
  },
  find: function find(node, path) {
    var length = path.length;

    for (var i = 0; i < length; i++) {
      node = node.childNodes[path[i]];
    }

    return node;
  }
};

},{"../shared/constants.js":17}],15:[function(require,module,exports){
'use strict'; // from https://github.com/developit/preact/blob/33fc697ac11762a1cb6e71e9847670d047af7ce5/src/constants.js

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i; // style is handled as both string and object
// even if the target is an SVG element (consistency)

Object.defineProperty(exports, '__esModule', {
  value: true
}).default = function (node, original, isSVG) {
  if (isSVG) {
    var style = original.cloneNode(true);
    style.value = '';
    node.setAttributeNode(style);
    return update(style, isSVG);
  }

  return update(node.style, isSVG);
}; // the update takes care or changing/replacing
// only properties that are different or
// in case of string, the whole node


var update = function update(style, isSVG) {
  var oldType, oldValue;
  return function (newValue) {
    switch (_typeof(newValue)) {
      case 'object':
        if (newValue) {
          if (oldType === 'object') {
            if (!isSVG) {
              if (oldValue !== newValue) {
                for (var key in oldValue) {
                  if (!(key in newValue)) {
                    style[key] = '';
                  }
                }
              }
            }
          } else {
            if (isSVG) style.value = '';else style.cssText = '';
          }

          var info = isSVG ? {} : style;

          for (var _key in newValue) {
            var value = newValue[_key];
            info[_key] = typeof value === 'number' && !IS_NON_DIMENSIONAL.test(_key) ? value + 'px' : value;
          }

          oldType = 'object';
          if (isSVG) style.value = toStyle(oldValue = info);else oldValue = newValue;
          break;
        }

      default:
        if (oldValue != newValue) {
          oldType = 'string';
          oldValue = newValue;
          if (isSVG) style.value = newValue || '';else style.cssText = newValue || '';
        }

        break;
    }
  };
};

var hyphen = /([^A-Z])([A-Z]+)/g;

var ized = function ized($0, $1, $2) {
  return $1 + '-' + $2.toLowerCase();
};

var toStyle = function toStyle(object) {
  var css = [];

  for (var key in object) {
    css.push(key.replace(hyphen, ized), ':', object[key], ';');
  }

  return css.join('');
};

},{}],16:[function(require,module,exports){
'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _require = require('../shared/constants.js'),
    CONNECTED = _require.CONNECTED,
    DISCONNECTED = _require.DISCONNECTED,
    COMMENT_NODE = _require.COMMENT_NODE,
    DOCUMENT_FRAGMENT_NODE = _require.DOCUMENT_FRAGMENT_NODE,
    ELEMENT_NODE = _require.ELEMENT_NODE,
    TEXT_NODE = _require.TEXT_NODE,
    OWNER_SVG_ELEMENT = _require.OWNER_SVG_ELEMENT,
    SHOULD_USE_TEXT_CONTENT = _require.SHOULD_USE_TEXT_CONTENT,
    UID = _require.UID,
    UIDC = _require.UIDC;

var Component = function (m) {
  return m.__esModule ? m.default : m;
}(require('../classes/Component.js'));

var Wire = function (m) {
  return m.__esModule ? m.default : m;
}(require('../classes/Wire.js'));

var Path = function (m) {
  return m.__esModule ? m.default : m;
}(require('./Path.js'));

var Style = function (m) {
  return m.__esModule ? m.default : m;
}(require('./Style.js'));

var Intent = function (m) {
  return m.__esModule ? m.default : m;
}(require('./Intent.js'));

var domdiff = function (m) {
  return m.__esModule ? m.default : m;
}(require('../shared/domdiff.js')); // see /^script$/i.test(nodeName) bit down here
// import { create as createElement, text } from '../shared/easy-dom.js';


var _require2 = require('../shared/easy-dom.js'),
    text = _require2.text;

var _require3 = require('../shared/poorlyfills.js'),
    Event = _require3.Event,
    WeakSet = _require3.WeakSet,
    isArray = _require3.isArray,
    trim = _require3.trim;

var _require4 = require('../shared/utils.js'),
    createFragment = _require4.createFragment,
    getChildren = _require4.getChildren,
    slice = _require4.slice; // hyper.Component have a connected/disconnected
// mechanism provided by MutationObserver
// This weak set is used to recognize components
// as DOM node that needs to trigger connected/disconnected events


var components = new WeakSet(); // a basic dictionary used to filter already cached attributes
// while looking for special hyperHTML values.

function Cache() {}

Cache.prototype = Object.create(null); // returns an intent to explicitly inject content as html

var asHTML = function asHTML(html) {
  return {
    html: html
  };
}; // returns nodes from wires and components


var asNode = function asNode(item, i) {
  return 'ELEMENT_NODE' in item ? item : item.constructor === Wire ? // in the Wire case, the content can be
  // removed, post-pended, inserted, or pre-pended and
  // all these cases are handled by domdiff already

  /* istanbul ignore next */
  1 / i < 0 ? i ? item.remove() : item.last : i ? item.insert() : item.first : asNode(item.render(), i);
}; // returns true if domdiff can handle the value


var canDiff = function canDiff(value) {
  return 'ELEMENT_NODE' in value || value instanceof Wire || value instanceof Component;
}; // updates are created once per context upgrade
// within the main render function (../hyper/render.js)
// These are an Array of callbacks to invoke passing
// each interpolation value.
// Updates can be related to any kind of content,
// attributes, or special text-only cases such <style>
// elements or <textarea>


var create = function create(root, paths) {
  var updates = [];
  var length = paths.length;

  for (var i = 0; i < length; i++) {
    var info = paths[i];
    var node = Path.find(root, info.path);

    switch (info.type) {
      case 'any':
        updates.push(setAnyContent(node, []));
        break;

      case 'attr':
        updates.push(setAttribute(node, info.name, info.node));
        break;

      case 'text':
        updates.push(setTextContent(node));
        node.textContent = '';
        break;
    }
  }

  return updates;
}; // finding all paths is a one-off operation performed
// when a new template literal is used.
// The goal is to map all target nodes that will be
// used to update content/attributes every time
// the same template literal is used to create content.
// The result is a list of paths related to the template
// with all the necessary info to create updates as
// list of callbacks that target directly affected nodes.


var find = function find(node, paths, parts) {
  var childNodes = node.childNodes;
  var length = childNodes.length;

  for (var i = 0; i < length; i++) {
    var child = childNodes[i];

    switch (child.nodeType) {
      case ELEMENT_NODE:
        findAttributes(child, paths, parts);
        find(child, paths, parts);
        break;

      case COMMENT_NODE:
        if (child.textContent === UID) {
          parts.shift();
          paths.push( // basicHTML or other non standard engines
          // might end up having comments in nodes
          // where they shouldn't, hence this check.
          SHOULD_USE_TEXT_CONTENT.test(node.nodeName) ? Path.create('text', node) : Path.create('any', child));
        }

        break;

      case TEXT_NODE:
        // the following ignore is actually covered by browsers
        // only basicHTML ends up on previous COMMENT_NODE case
        // instead of TEXT_NODE because it knows nothing about
        // special style or textarea behavior

        /* istanbul ignore if */
        if (SHOULD_USE_TEXT_CONTENT.test(node.nodeName) && trim.call(child.textContent) === UIDC) {
          parts.shift();
          paths.push(Path.create('text', node));
        }

        break;
    }
  }
}; // attributes are searched via unique hyperHTML id value.
// Despite HTML being case insensitive, hyperHTML is able
// to recognize attributes by name in a caseSensitive way.
// This plays well with Custom Elements definitions
// and also with XML-like environments, without trusting
// the resulting DOM but the template literal as the source of truth.
// IE/Edge has a funny bug with attributes and these might be duplicated.
// This is why there is a cache in charge of being sure no duplicated
// attributes are ever considered in future updates.


var findAttributes = function findAttributes(node, paths, parts) {
  var cache = new Cache();
  var attributes = node.attributes;
  var array = slice.call(attributes);
  var remove = [];
  var length = array.length;

  for (var i = 0; i < length; i++) {
    var attribute = array[i];

    if (attribute.value === UID) {
      var name = attribute.name; // the following ignore is covered by IE
      // and the IE9 double viewBox test

      /* istanbul ignore else */

      if (!(name in cache)) {
        var realName = parts.shift().replace(/^(?:|[\S\s]*?\s)(\S+?)=['"]?$/, '$1');
        cache[name] = attributes[realName] || // the following ignore is covered by browsers
        // while basicHTML is already case-sensitive

        /* istanbul ignore next */
        attributes[realName.toLowerCase()];
        paths.push(Path.create('attr', cache[name], realName));
      }

      remove.push(attribute);
    }
  }

  var len = remove.length;

  for (var _i = 0; _i < len; _i++) {
    // Edge HTML bug #16878726
    var _attribute = remove[_i];
    if (/^id$/i.test(_attribute.name)) node.removeAttribute(_attribute.name); // standard browsers would work just fine here
    else node.removeAttributeNode(remove[_i]);
  } // This is a very specific Firefox/Safari issue
  // but since it should be a not so common pattern,
  // it's probably worth patching regardless.
  // Basically, scripts created through strings are death.
  // You need to create fresh new scripts instead.
  // TODO: is there any other node that needs such nonsense?


  var nodeName = node.nodeName;

  if (/^script$/i.test(nodeName)) {
    // this used to be like that
    // const script = createElement(node, nodeName);
    // then Edge arrived and decided that scripts created
    // through template documents aren't worth executing
    // so it became this ... hopefully it won't hurt in the wild
    var script = document.createElement(nodeName);

    for (var _i2 = 0; _i2 < attributes.length; _i2++) {
      script.setAttributeNode(attributes[_i2].cloneNode(true));
    }

    script.textContent = node.textContent;
    node.parentNode.replaceChild(script, node);
  }
}; // when a Promise is used as interpolation value
// its result must be parsed once resolved.
// This callback is in charge of understanding what to do
// with a returned value once the promise is resolved.


var invokeAtDistance = function invokeAtDistance(value, callback) {
  callback(value.placeholder);

  if ('text' in value) {
    Promise.resolve(value.text).then(String).then(callback);
  } else if ('any' in value) {
    Promise.resolve(value.any).then(callback);
  } else if ('html' in value) {
    Promise.resolve(value.html).then(asHTML).then(callback);
  } else {
    Promise.resolve(Intent.invoke(value, callback)).then(callback);
  }
}; // quick and dirty way to check for Promise/ish values


var isPromise_ish = function isPromise_ish(value) {
  return value != null && 'then' in value;
}; // in a hyper(node)`<div>${content}</div>` case
// everything could happen:
//  * it's a JS primitive, stored as text
//  * it's null or undefined, the node should be cleaned
//  * it's a component, update the content by rendering it
//  * it's a promise, update the content once resolved
//  * it's an explicit intent, perform the desired operation
//  * it's an Array, resolve all values if Promises and/or
//    update the node with the resulting list of content


var setAnyContent = function setAnyContent(node, childNodes) {
  var diffOptions = {
    node: asNode,
    before: node
  };
  var fastPath = false;
  var oldValue;

  var anyContent = function anyContent(value) {
    switch (_typeof(value)) {
      case 'string':
      case 'number':
      case 'boolean':
        if (fastPath) {
          if (oldValue !== value) {
            oldValue = value;
            childNodes[0].textContent = value;
          }
        } else {
          fastPath = true;
          oldValue = value;
          childNodes = domdiff(node.parentNode, childNodes, [text(node, value)], diffOptions);
        }

        break;

      case 'object':
      case 'undefined':
        if (value == null) {
          fastPath = false;
          childNodes = domdiff(node.parentNode, childNodes, [], diffOptions);
          break;
        }

      default:
        fastPath = false;
        oldValue = value;

        if (isArray(value)) {
          if (value.length === 0) {
            if (childNodes.length) {
              childNodes = domdiff(node.parentNode, childNodes, [], diffOptions);
            }
          } else {
            switch (_typeof(value[0])) {
              case 'string':
              case 'number':
              case 'boolean':
                anyContent({
                  html: value
                });
                break;

              case 'object':
                if (isArray(value[0])) {
                  value = value.concat.apply([], value);
                }

                if (isPromise_ish(value[0])) {
                  Promise.all(value).then(anyContent);
                  break;
                }

              default:
                childNodes = domdiff(node.parentNode, childNodes, value, diffOptions);
                break;
            }
          }
        } else if (canDiff(value)) {
          childNodes = domdiff(node.parentNode, childNodes, value.nodeType === DOCUMENT_FRAGMENT_NODE ? slice.call(value.childNodes) : [value], diffOptions);
        } else if (isPromise_ish(value)) {
          value.then(anyContent);
        } else if ('placeholder' in value) {
          invokeAtDistance(value, anyContent);
        } else if ('text' in value) {
          anyContent(String(value.text));
        } else if ('any' in value) {
          anyContent(value.any);
        } else if ('html' in value) {
          childNodes = domdiff(node.parentNode, childNodes, slice.call(createFragment(node, [].concat(value.html).join('')).childNodes), diffOptions);
        } else if ('length' in value) {
          anyContent(slice.call(value));
        } else {
          anyContent(Intent.invoke(value, anyContent));
        }

        break;
    }
  };

  return anyContent;
}; // there are four kind of attributes, and related behavior:
//  * events, with a name starting with `on`, to add/remove event listeners
//  * special, with a name present in their inherited prototype, accessed directly
//  * regular, accessed through get/setAttribute standard DOM methods
//  * style, the only regular attribute that also accepts an object as value
//    so that you can style=${{width: 120}}. In this case, the behavior has been
//    fully inspired by Preact library and its simplicity.


var setAttribute = function setAttribute(node, name, original) {
  var isSVG = OWNER_SVG_ELEMENT in node;
  var oldValue; // if the attribute is the style one
  // handle it differently from others

  if (name === 'style') {
    return Style(node, original, isSVG);
  } // the name is an event one,
  // add/remove event listeners accordingly
  else if (/^on/.test(name)) {
      var type = name.slice(2);

      if (type === CONNECTED || type === DISCONNECTED) {
        if (notObserving) {
          notObserving = false;
          observe();
        }

        components.add(node);
      } else if (name.toLowerCase() in node) {
        type = type.toLowerCase();
      }

      return function (newValue) {
        if (oldValue !== newValue) {
          if (oldValue) node.removeEventListener(type, oldValue, false);
          oldValue = newValue;
          if (newValue) node.addEventListener(type, newValue, false);
        }
      };
    } // the attribute is special ('value' in input)
    // and it's not SVG *or* the name is exactly data,
    // in this case assign the value directly
    else if (name === 'data' || !isSVG && name in node) {
        return function (newValue) {
          if (oldValue !== newValue) {
            oldValue = newValue;

            if (node[name] !== newValue) {
              node[name] = newValue;

              if (newValue == null) {
                node.removeAttribute(name);
              }
            }
          }
        };
      } else if (name in Intent.attributes) {
        return function (any) {
          oldValue = Intent.attributes[name](node, any);
          node.setAttribute(name, oldValue == null ? '' : oldValue);
        };
      } // in every other case, use the attribute node as it is
      // update only the value, set it as node only when/if needed
      else {
          var owner = false;
          var attribute = original.cloneNode(true);
          return function (newValue) {
            if (oldValue !== newValue) {
              oldValue = newValue;

              if (attribute.value !== newValue) {
                if (newValue == null) {
                  if (owner) {
                    owner = false;
                    node.removeAttributeNode(attribute);
                  }

                  attribute.value = newValue;
                } else {
                  attribute.value = newValue;

                  if (!owner) {
                    owner = true;
                    node.setAttributeNode(attribute);
                  }
                }
              }
            }
          };
        }
}; // style or textareas don't accept HTML as content
// it's pointless to transform or analyze anything
// different from text there but it's worth checking
// for possible defined intents.


var setTextContent = function setTextContent(node) {
  var oldValue;

  var textContent = function textContent(value) {
    if (oldValue !== value) {
      oldValue = value;

      if (_typeof(value) === 'object' && value) {
        if (isPromise_ish(value)) {
          value.then(textContent);
        } else if ('placeholder' in value) {
          invokeAtDistance(value, textContent);
        } else if ('text' in value) {
          textContent(String(value.text));
        } else if ('any' in value) {
          textContent(value.any);
        } else if ('html' in value) {
          textContent([].concat(value.html).join(''));
        } else if ('length' in value) {
          textContent(slice.call(value).join(''));
        } else {
          textContent(Intent.invoke(value, textContent));
        }
      } else {
        node.textContent = value == null ? '' : value;
      }
    }
  };

  return textContent;
};

Object.defineProperty(exports, '__esModule', {
  value: true
}).default = {
  create: create,
  find: find
}; // hyper.Components might need connected/disconnected notifications
// used by components and their onconnect/ondisconnect callbacks.
// When one of these callbacks is encountered,
// the document starts being observed.

var notObserving = true;

function observe() {
  // when hyper.Component related DOM nodes
  // are appended or removed from the live tree
  // these might listen to connected/disconnected events
  // This utility is in charge of finding all components
  // involved in the DOM update/change and dispatch
  // related information to them
  var dispatchAll = function dispatchAll(nodes, type) {
    var event = new Event(type);
    var length = nodes.length;

    for (var i = 0; i < length; i++) {
      var node = nodes[i];

      if (node.nodeType === ELEMENT_NODE) {
        dispatchTarget(node, event);
      }
    }
  }; // the way it's done is via the components weak set
  // and recursively looking for nested components too


  var dispatchTarget = function dispatchTarget(node, event) {
    if (components.has(node)) {
      node.dispatchEvent(event);
    }
    /* istanbul ignore next */


    var children = node.children || getChildren(node);
    var length = children.length;

    for (var i = 0; i < length; i++) {
      dispatchTarget(children[i], event);
    }
  }; // The MutationObserver is the best way to implement that
  // but there is a fallback to deprecated DOMNodeInserted/Removed
  // so that even older browsers/engines can help components life-cycle


  try {
    new MutationObserver(function (records) {
      var length = records.length;

      for (var i = 0; i < length; i++) {
        var record = records[i];
        dispatchAll(record.removedNodes, DISCONNECTED);
        dispatchAll(record.addedNodes, CONNECTED);
      }
    }).observe(document, {
      subtree: true,
      childList: true
    });
  } catch (o_O) {
    document.addEventListener('DOMNodeRemoved', function (event) {
      dispatchAll([event.target], DISCONNECTED);
    }, false);
    document.addEventListener('DOMNodeInserted', function (event) {
      dispatchAll([event.target], CONNECTED);
    }, false);
  }
}

},{"../classes/Component.js":8,"../classes/Wire.js":9,"../shared/constants.js":17,"../shared/domdiff.js":18,"../shared/easy-dom.js":19,"../shared/poorlyfills.js":21,"../shared/utils.js":23,"./Intent.js":13,"./Path.js":14,"./Style.js":15}],17:[function(require,module,exports){
'use strict';

var G = document.defaultView;
exports.G = G; // Node.CONSTANTS
// 'cause some engine has no global Node defined
// (i.e. Node, NativeScript, basicHTML ... )

var ELEMENT_NODE = 1;
exports.ELEMENT_NODE = ELEMENT_NODE;
var ATTRIBUTE_NODE = 2;
exports.ATTRIBUTE_NODE = ATTRIBUTE_NODE;
var TEXT_NODE = 3;
exports.TEXT_NODE = TEXT_NODE;
var COMMENT_NODE = 8;
exports.COMMENT_NODE = COMMENT_NODE;
var DOCUMENT_FRAGMENT_NODE = 11;
exports.DOCUMENT_FRAGMENT_NODE = DOCUMENT_FRAGMENT_NODE; // HTML related constants

var VOID_ELEMENTS = /^area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr$/i;
exports.VOID_ELEMENTS = VOID_ELEMENTS; // SVG related constants

var OWNER_SVG_ELEMENT = 'ownerSVGElement';
exports.OWNER_SVG_ELEMENT = OWNER_SVG_ELEMENT;
var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
exports.SVG_NAMESPACE = SVG_NAMESPACE; // Custom Elements / MutationObserver constants

var CONNECTED = 'connected';
exports.CONNECTED = CONNECTED;
var DISCONNECTED = 'dis' + CONNECTED;
exports.DISCONNECTED = DISCONNECTED; // hyperHTML related constants

var EXPANDO = '_hyper: ';
exports.EXPANDO = EXPANDO;
var SHOULD_USE_TEXT_CONTENT = /^style|textarea$/i;
exports.SHOULD_USE_TEXT_CONTENT = SHOULD_USE_TEXT_CONTENT;
var UID = EXPANDO + (Math.random() * new Date() | 0) + ';';
exports.UID = UID;
var UIDC = '<!--' + UID + '-->';
exports.UIDC = UIDC;

},{}],18:[function(require,module,exports){
'use strict';
/* AUTOMATICALLY IMPORTED, DO NOT MODIFY */

/*! (c) 2017 Andrea Giammarchi (ISC) */

/**
 * This code is a revisited port of the snabbdom vDOM diffing logic,
 * the same that fuels as fork Vue.js or other libraries.
 * @credits https://github.com/snabbdom/snabbdom
 */

var eqeq = function eqeq(a, b) {
  return a == b;
};

var identity = function identity(O) {
  return O;
};

var remove = function remove(get, parentNode, before, after) {
  if (after == null) {
    parentNode.removeChild(get(before, -1));
  } else {
    var range = parentNode.ownerDocument.createRange();
    range.setStartBefore(get(before, -1));
    range.setEndAfter(get(after, -1));
    range.deleteContents();
  }
};

var domdiff = function domdiff(parentNode, // where changes happen
currentNodes, // Array of current items/nodes
futureNodes, // Array of future items/nodes
options // optional object with one of the following properties
//  before: domNode
//  compare(generic, generic) => true if same generic
//  node(generic) => Node
) {
  if (!options) options = {};
  var compare = options.compare || eqeq;
  var get = options.node || identity;
  var before = options.before == null ? null : get(options.before, 0);
  var currentStart = 0,
      futureStart = 0;
  var currentEnd = currentNodes.length - 1;
  var currentStartNode = currentNodes[0];
  var currentEndNode = currentNodes[currentEnd];
  var futureEnd = futureNodes.length - 1;
  var futureStartNode = futureNodes[0];
  var futureEndNode = futureNodes[futureEnd];

  while (currentStart <= currentEnd && futureStart <= futureEnd) {
    if (currentStartNode == null) {
      currentStartNode = currentNodes[++currentStart];
    } else if (currentEndNode == null) {
      currentEndNode = currentNodes[--currentEnd];
    } else if (futureStartNode == null) {
      futureStartNode = futureNodes[++futureStart];
    } else if (futureEndNode == null) {
      futureEndNode = futureNodes[--futureEnd];
    } else if (compare(currentStartNode, futureStartNode)) {
      currentStartNode = currentNodes[++currentStart];
      futureStartNode = futureNodes[++futureStart];
    } else if (compare(currentEndNode, futureEndNode)) {
      currentEndNode = currentNodes[--currentEnd];
      futureEndNode = futureNodes[--futureEnd];
    } else if (compare(currentStartNode, futureEndNode)) {
      parentNode.insertBefore(get(currentStartNode, 1), get(currentEndNode, -0).nextSibling);
      currentStartNode = currentNodes[++currentStart];
      futureEndNode = futureNodes[--futureEnd];
    } else if (compare(currentEndNode, futureStartNode)) {
      parentNode.insertBefore(get(currentEndNode, 1), get(currentStartNode, 0));
      currentEndNode = currentNodes[--currentEnd];
      futureStartNode = futureNodes[++futureStart];
    } else {
      var index = currentNodes.indexOf(futureStartNode);

      if (index < 0) {
        parentNode.insertBefore(get(futureStartNode, 1), get(currentStartNode, 0));
        futureStartNode = futureNodes[++futureStart];
      } else {
        var i = index;
        var f = futureStart;

        while (i <= currentEnd && f <= futureEnd && currentNodes[i] === futureNodes[f]) {
          i++;
          f++;
        }

        if (1 < i - index) {
          if (--index === currentStart) {
            parentNode.removeChild(get(currentStartNode, -1));
          } else {
            remove(get, parentNode, currentStartNode, currentNodes[index]);
          }

          currentStart = i;
          futureStart = f;
          currentStartNode = currentNodes[i];
          futureStartNode = futureNodes[f];
        } else {
          var el = currentNodes[index];
          currentNodes[index] = null;
          parentNode.insertBefore(get(el, 1), get(currentStartNode, 0));
          futureStartNode = futureNodes[++futureStart];
        }
      }
    }
  }

  if (currentStart <= currentEnd || futureStart <= futureEnd) {
    if (currentStart > currentEnd) {
      var pin = futureNodes[futureEnd + 1];
      var place = pin == null ? before : get(pin, 0);

      if (futureStart === futureEnd) {
        parentNode.insertBefore(get(futureNodes[futureStart], 1), place);
      } else {
        var fragment = parentNode.ownerDocument.createDocumentFragment();

        while (futureStart <= futureEnd) {
          fragment.appendChild(get(futureNodes[futureStart++], 1));
        }

        parentNode.insertBefore(fragment, place);
      }
    } else {
      if (currentNodes[currentStart] == null) currentStart++;

      if (currentStart === currentEnd) {
        parentNode.removeChild(get(currentNodes[currentStart], -1));
      } else {
        remove(get, parentNode, currentNodes[currentStart], currentNodes[currentEnd]);
      }
    }
  }

  return futureNodes;
};

Object.defineProperty(exports, '__esModule', {
  value: true
}).default = domdiff;

},{}],19:[function(require,module,exports){
'use strict'; // these are tiny helpers to simplify most common operations needed here

var create = function create(node, type) {
  return doc(node).createElement(type);
};

exports.create = create;

var doc = function doc(node) {
  return node.ownerDocument || node;
};

exports.doc = doc;

var fragment = function fragment(node) {
  return doc(node).createDocumentFragment();
};

exports.fragment = fragment;

var text = function text(node, _text) {
  return doc(node).createTextNode(_text);
};

exports.text = text;

},{}],20:[function(require,module,exports){
'use strict';

var _require = require('./easy-dom.js'),
    create = _require.create,
    fragment = _require.fragment,
    text = _require.text;

var testFragment = fragment(document); // DOM4 node.append(...many)

var hasAppend = 'append' in testFragment;
exports.hasAppend = hasAppend; // detect old browsers without HTMLTemplateElement content support

var hasContent = 'content' in create(document, 'template');
exports.hasContent = hasContent; // IE 11 has problems with cloning templates: it "forgets" empty childNodes

testFragment.appendChild(text(testFragment, 'g'));
testFragment.appendChild(text(testFragment, ''));
var hasDoomedCloneNode = testFragment.cloneNode(true).childNodes.length === 1;
exports.hasDoomedCloneNode = hasDoomedCloneNode; // old browsers need to fallback to cloneNode
// Custom Elements V0 and V1 will work polyfilled
// but native implementations need importNode instead
// (specially Chromium and its old V0 implementation)

var hasImportNode = 'importNode' in document;
exports.hasImportNode = hasImportNode;

},{"./easy-dom.js":19}],21:[function(require,module,exports){
'use strict';

var _require = require('./constants.js'),
    G = _require.G,
    UID = _require.UID; // you know that kind of basics you need to cover
// your use case only but you don't want to bloat the library?
// There's even a package in here:
// https://www.npmjs.com/package/poorlyfills
// used to dispatch simple events


var Event = G.Event;

try {
  new Event('Event');
} catch (o_O) {
  Event = function Event(type) {
    var e = document.createEvent('Event');
    e.initEvent(type, false, false);
    return e;
  };
}

exports.Event = Event; // used to store template literals

/* istanbul ignore next */

var Map = G.Map || function Map() {
  var keys = [],
      values = [];
  return {
    get: function get(obj) {
      return values[keys.indexOf(obj)];
    },
    set: function set(obj, value) {
      values[keys.push(obj) - 1] = value;
    }
  };
};

exports.Map = Map; // used to store wired content

var ID = 0;

var WeakMap = G.WeakMap || function WeakMap() {
  var key = UID + ID++;
  return {
    get: function get(obj) {
      return obj[key];
    },
    set: function set(obj, value) {
      Object.defineProperty(obj, key, {
        configurable: true,
        value: value
      });
    }
  };
};

exports.WeakMap = WeakMap; // used to store hyper.Components

var WeakSet = G.WeakSet || function WeakSet() {
  var wm = new WeakMap();
  return {
    add: function add(obj) {
      wm.set(obj, true);
    },
    has: function has(obj) {
      return wm.get(obj) === true;
    }
  };
};

exports.WeakSet = WeakSet; // used to be sure IE9 or older Androids work as expected

var isArray = Array.isArray || function (toString) {
  return function (arr) {
    return toString.call(arr) === '[object Array]';
  };
}({}.toString);

exports.isArray = isArray;

var trim = UID.trim || function () {
  return this.replace(/^\s+|\s+$/g, '');
};

exports.trim = trim;

},{"./constants.js":17}],22:[function(require,module,exports){
'use strict'; // TODO:  I'd love to code-cover RegExp too here
//        these are fundamental for this library

var spaces = ' \\f\\n\\r\\t';
var almostEverything = '[^ ' + spaces + '\\/>"\'=]+';
var attrName = '[ ' + spaces + ']+' + almostEverything;
var tagName = '<([A-Za-z]+[A-Za-z0-9:_-]*)((?:';
var attrPartials = '(?:=(?:\'[^\']*?\'|"[^"]*?"|<[^>]*?>|' + almostEverything + '))?)';
var attrSeeker = new RegExp(tagName + attrName + attrPartials + '+)([ ' + spaces + ']*/?>)', 'g');
var selfClosing = new RegExp(tagName + attrName + attrPartials + '*)([ ' + spaces + ']*/>)', 'g');
exports.attrName = attrName;
exports.attrSeeker = attrSeeker;
exports.selfClosing = selfClosing;

},{}],23:[function(require,module,exports){
'use strict';

var _require = require('./re.js'),
    attrName = _require.attrName,
    attrSeeker = _require.attrSeeker;

var _require2 = require('./constants.js'),
    G = _require2.G,
    ELEMENT_NODE = _require2.ELEMENT_NODE,
    OWNER_SVG_ELEMENT = _require2.OWNER_SVG_ELEMENT,
    SVG_NAMESPACE = _require2.SVG_NAMESPACE,
    UID = _require2.UID,
    UIDC = _require2.UIDC;

var _require3 = require('./features-detection.js'),
    hasAppend = _require3.hasAppend,
    hasContent = _require3.hasContent,
    hasDoomedCloneNode = _require3.hasDoomedCloneNode,
    hasImportNode = _require3.hasImportNode;

var _require4 = require('./easy-dom.js'),
    create = _require4.create,
    doc = _require4.doc,
    fragment = _require4.fragment;

var _require5 = require('./poorlyfills.js'),
    Map = _require5.Map,
    WeakMap = _require5.WeakMap; // appends an array of nodes
// to a generic node/fragment
// When available, uses append passing all arguments at once
// hoping that's somehow faster, even if append has more checks on type


var append = hasAppend ? function (node, childNodes) {
  node.append.apply(node, childNodes);
} : function (node, childNodes) {
  var length = childNodes.length;

  for (var i = 0; i < length; i++) {
    node.appendChild(childNodes[i]);
  }
};
exports.append = append;
var findAttributes = new RegExp('(' + attrName + '=)([\'"]?)' + UIDC + '\\2', 'gi');

var comments = function comments($0, $1, $2, $3) {
  return '<' + $1 + $2.replace(findAttributes, replaceAttributes) + $3;
};

var replaceAttributes = function replaceAttributes($0, $1, $2) {
  return $1 + ($2 || '"') + UID + ($2 || '"');
}; // given a node and a generic HTML content,
// create either an SVG or an HTML fragment
// where such content will be injected


var createFragment = function createFragment(node, html) {
  return (OWNER_SVG_ELEMENT in node ? SVGFragment : HTMLFragment)(node, html.replace(attrSeeker, comments));
};

exports.createFragment = createFragment; // IE/Edge shenanigans proof cloneNode
// it goes through all nodes manually
// instead of relying the engine to suddenly
// merge nodes together

var cloneNode = hasDoomedCloneNode ? function (node) {
  var clone = node.cloneNode();
  var childNodes = node.childNodes || // this is an excess of caution
  // but some node, in IE, might not
  // have childNodes property.
  // The following fallback ensure working code
  // in older IE without compromising performance
  // or any other browser/engine involved.

  /* istanbul ignore next */
  [];
  var length = childNodes.length;

  for (var i = 0; i < length; i++) {
    clone.appendChild(cloneNode(childNodes[i]));
  }

  return clone;
} : // the following ignore is due code-coverage
// combination of not having document.importNode
// but having a working node.cloneNode.
// This shenario is common on older Android/WebKit browsers
// but basicHTML here tests just two major cases:
// with document.importNode or with broken cloneNode.

/* istanbul ignore next */
function (node) {
  return node.cloneNode(true);
}; // IE and Edge do not support children in SVG nodes

/* istanbul ignore next */

var getChildren = function getChildren(node) {
  var children = [];
  var childNodes = node.childNodes;
  var length = childNodes.length;

  for (var i = 0; i < length; i++) {
    if (childNodes[i].nodeType === ELEMENT_NODE) children.push(childNodes[i]);
  }

  return children;
};

exports.getChildren = getChildren; // used to import html into fragments

var importNode = hasImportNode ? function (doc, node) {
  return doc.importNode(node, true);
} : function (doc, node) {
  return cloneNode(node);
};
exports.importNode = importNode; // just recycling a one-off array to use slice
// in every needed place

var slice = [].slice;
exports.slice = slice; // lazy evaluated, returns the unique identity
// of a template literal, as tempalte literal itself.
// By default, ES2015 template literals are unique
// tag`a${1}z` === tag`a${2}z`
// even if interpolated values are different
// the template chunks are in a frozen Array
// that is identical each time you use the same
// literal to represent same static content
// around its own interpolations.

var unique = function unique(template) {
  return _TL(template);
};

exports.unique = unique; // TL returns a unique version of the template
// it needs lazy feature detection
// (cannot trust literals with transpiled code)

var _TL = function TL(t) {
  if ( // TypeScript template literals are not standard
  t.propertyIsEnumerable('raw') || // Firefox < 55 has not standard implementation neither
  /Firefox\/(\d+)/.test((G.navigator || {}).userAgent) && parseFloat(RegExp.$1) < 55) {
    var T = {};

    _TL = function TL(t) {
      var k = '^' + t.join('^');
      return T[k] || (T[k] = t);
    };
  } else {
    // make TL an identity like function
    _TL = function TL(t) {
      return t;
    };
  }

  return _TL(t);
}; // used to store templates objects
// since neither Map nor WeakMap are safe


var TemplateMap = function TemplateMap() {
  try {
    var wm = new WeakMap();
    var o_O = Object.freeze([]);
    wm.set(o_O, true);
    if (!wm.get(o_O)) throw o_O;
    return wm;
  } catch (o_O) {
    // inevitable legacy code leaks due
    // https://github.com/tc39/ecma262/pull/890
    return new Map();
  }
};

exports.TemplateMap = TemplateMap; // create document fragments via native template
// with a fallback for browsers that won't be able
// to deal with some injected element such <td> or others

var HTMLFragment = hasContent ? function (node, html) {
  var container = create(node, 'template');
  container.innerHTML = html;
  return container.content;
} : function (node, html) {
  var container = create(node, 'template');
  var content = fragment(node);

  if (/^[^\S]*?<(col(?:group)?|t(?:head|body|foot|r|d|h))/i.test(html)) {
    var selector = RegExp.$1;
    container.innerHTML = '<table>' + html + '</table>';
    append(content, slice.call(container.querySelectorAll(selector)));
  } else {
    container.innerHTML = html;
    append(content, slice.call(container.childNodes));
  }

  return content;
}; // creates SVG fragment with a fallback for IE that needs SVG
// within the HTML content

var SVGFragment = hasContent ? function (node, html) {
  var content = fragment(node);
  var container = doc(node).createElementNS(SVG_NAMESPACE, 'svg');
  container.innerHTML = html;
  append(content, slice.call(container.childNodes));
  return content;
} : function (node, html) {
  var content = fragment(node);
  var container = create(node, 'div');
  container.innerHTML = '<svg xmlns="' + SVG_NAMESPACE + '">' + html + '</svg>';
  append(content, slice.call(container.firstChild.childNodes));
  return content;
};

},{"./constants.js":17,"./easy-dom.js":19,"./features-detection.js":20,"./poorlyfills.js":21,"./re.js":22}],24:[function(require,module,exports){
(function (process){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.page = factory();
})(void 0, function () {
  'use strict';

  var isarray = Array.isArray || function (arr) {
    return Object.prototype.toString.call(arr) == '[object Array]';
  };
  /**
   * Expose `pathToRegexp`.
   */


  var pathToRegexp_1 = pathToRegexp;
  var parse_1 = parse;
  var compile_1 = compile;
  var tokensToFunction_1 = tokensToFunction;
  var tokensToRegExp_1 = tokensToRegExp;
  /**
   * The main path matching regexp utility.
   *
   * @type {RegExp}
   */

  var PATH_REGEXP = new RegExp([// Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)', // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))'].join('|'), 'g');
  /**
   * Parse a string for the raw tokens.
   *
   * @param  {String} str
   * @return {Array}
   */

  function parse(str) {
    var tokens = [];
    var key = 0;
    var index = 0;
    var path = '';
    var res;

    while ((res = PATH_REGEXP.exec(str)) != null) {
      var m = res[0];
      var escaped = res[1];
      var offset = res.index;
      path += str.slice(index, offset);
      index = offset + m.length; // Ignore already escaped sequences.

      if (escaped) {
        path += escaped[1];
        continue;
      } // Push the current path onto the tokens.


      if (path) {
        tokens.push(path);
        path = '';
      }

      var prefix = res[2];
      var name = res[3];
      var capture = res[4];
      var group = res[5];
      var suffix = res[6];
      var asterisk = res[7];
      var repeat = suffix === '+' || suffix === '*';
      var optional = suffix === '?' || suffix === '*';
      var delimiter = prefix || '/';
      var pattern = capture || group || (asterisk ? '.*' : '[^' + delimiter + ']+?');
      tokens.push({
        name: name || key++,
        prefix: prefix || '',
        delimiter: delimiter,
        optional: optional,
        repeat: repeat,
        pattern: escapeGroup(pattern)
      });
    } // Match any characters still remaining.


    if (index < str.length) {
      path += str.substr(index);
    } // If the path exists, push it onto the end.


    if (path) {
      tokens.push(path);
    }

    return tokens;
  }
  /**
   * Compile a string to a template function for the path.
   *
   * @param  {String}   str
   * @return {Function}
   */


  function compile(str) {
    return tokensToFunction(parse(str));
  }
  /**
   * Expose a method for transforming tokens into the path function.
   */


  function tokensToFunction(tokens) {
    // Compile all the tokens into regexps.
    var matches = new Array(tokens.length); // Compile all the patterns before compilation.

    for (var i = 0; i < tokens.length; i++) {
      if (_typeof(tokens[i]) === 'object') {
        matches[i] = new RegExp('^' + tokens[i].pattern + '$');
      }
    }

    return function (obj) {
      var path = '';
      var data = obj || {};

      for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];

        if (typeof token === 'string') {
          path += token;
          continue;
        }

        var value = data[token.name];
        var segment;

        if (value == null) {
          if (token.optional) {
            continue;
          } else {
            throw new TypeError('Expected "' + token.name + '" to be defined');
          }
        }

        if (isarray(value)) {
          if (!token.repeat) {
            throw new TypeError('Expected "' + token.name + '" to not repeat, but received "' + value + '"');
          }

          if (value.length === 0) {
            if (token.optional) {
              continue;
            } else {
              throw new TypeError('Expected "' + token.name + '" to not be empty');
            }
          }

          for (var j = 0; j < value.length; j++) {
            segment = encodeURIComponent(value[j]);

            if (!matches[i].test(segment)) {
              throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"');
            }

            path += (j === 0 ? token.prefix : token.delimiter) + segment;
          }

          continue;
        }

        segment = encodeURIComponent(value);

        if (!matches[i].test(segment)) {
          throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"');
        }

        path += token.prefix + segment;
      }

      return path;
    };
  }
  /**
   * Escape a regular expression string.
   *
   * @param  {String} str
   * @return {String}
   */


  function escapeString(str) {
    return str.replace(/([.+*?=^!:${}()[\]|\/])/g, '\\$1');
  }
  /**
   * Escape the capturing group by escaping special characters and meaning.
   *
   * @param  {String} group
   * @return {String}
   */


  function escapeGroup(group) {
    return group.replace(/([=!:$\/()])/g, '\\$1');
  }
  /**
   * Attach the keys as a property of the regexp.
   *
   * @param  {RegExp} re
   * @param  {Array}  keys
   * @return {RegExp}
   */


  function attachKeys(re, keys) {
    re.keys = keys;
    return re;
  }
  /**
   * Get the flags for a regexp from the options.
   *
   * @param  {Object} options
   * @return {String}
   */


  function flags(options) {
    return options.sensitive ? '' : 'i';
  }
  /**
   * Pull out keys from a regexp.
   *
   * @param  {RegExp} path
   * @param  {Array}  keys
   * @return {RegExp}
   */


  function regexpToRegexp(path, keys) {
    // Use a negative lookahead to match only capturing groups.
    var groups = path.source.match(/\((?!\?)/g);

    if (groups) {
      for (var i = 0; i < groups.length; i++) {
        keys.push({
          name: i,
          prefix: null,
          delimiter: null,
          optional: false,
          repeat: false,
          pattern: null
        });
      }
    }

    return attachKeys(path, keys);
  }
  /**
   * Transform an array into a regexp.
   *
   * @param  {Array}  path
   * @param  {Array}  keys
   * @param  {Object} options
   * @return {RegExp}
   */


  function arrayToRegexp(path, keys, options) {
    var parts = [];

    for (var i = 0; i < path.length; i++) {
      parts.push(pathToRegexp(path[i], keys, options).source);
    }

    var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));
    return attachKeys(regexp, keys);
  }
  /**
   * Create a path regexp from string input.
   *
   * @param  {String} path
   * @param  {Array}  keys
   * @param  {Object} options
   * @return {RegExp}
   */


  function stringToRegexp(path, keys, options) {
    var tokens = parse(path);
    var re = tokensToRegExp(tokens, options); // Attach keys back to the regexp.

    for (var i = 0; i < tokens.length; i++) {
      if (typeof tokens[i] !== 'string') {
        keys.push(tokens[i]);
      }
    }

    return attachKeys(re, keys);
  }
  /**
   * Expose a function for taking tokens and returning a RegExp.
   *
   * @param  {Array}  tokens
   * @param  {Array}  keys
   * @param  {Object} options
   * @return {RegExp}
   */


  function tokensToRegExp(tokens, options) {
    options = options || {};
    var strict = options.strict;
    var end = options.end !== false;
    var route = '';
    var lastToken = tokens[tokens.length - 1];
    var endsWithSlash = typeof lastToken === 'string' && /\/$/.test(lastToken); // Iterate over the tokens and create our regexp string.

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (typeof token === 'string') {
        route += escapeString(token);
      } else {
        var prefix = escapeString(token.prefix);
        var capture = token.pattern;

        if (token.repeat) {
          capture += '(?:' + prefix + capture + ')*';
        }

        if (token.optional) {
          if (prefix) {
            capture = '(?:' + prefix + '(' + capture + '))?';
          } else {
            capture = '(' + capture + ')?';
          }
        } else {
          capture = prefix + '(' + capture + ')';
        }

        route += capture;
      }
    } // In non-strict mode we allow a slash at the end of match. If the path to
    // match already ends with a slash, we remove it for consistency. The slash
    // is valid at the end of a path match, not in the middle. This is important
    // in non-ending mode, where "/test/" shouldn't match "/test//route".


    if (!strict) {
      route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?';
    }

    if (end) {
      route += '$';
    } else {
      // In non-ending mode, we need the capturing groups to match as much as
      // possible by using a positive lookahead to the end or next path segment.
      route += strict && endsWithSlash ? '' : '(?=\\/|$)';
    }

    return new RegExp('^' + route, flags(options));
  }
  /**
   * Normalize the given path string, returning a regular expression.
   *
   * An empty array can be passed in for the keys, which will hold the
   * placeholder key descriptions. For example, using `/user/:id`, `keys` will
   * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
   *
   * @param  {(String|RegExp|Array)} path
   * @param  {Array}                 [keys]
   * @param  {Object}                [options]
   * @return {RegExp}
   */


  function pathToRegexp(path, keys, options) {
    keys = keys || [];

    if (!isarray(keys)) {
      options = keys;
      keys = [];
    } else if (!options) {
      options = {};
    }

    if (path instanceof RegExp) {
      return regexpToRegexp(path, keys, options);
    }

    if (isarray(path)) {
      return arrayToRegexp(path, keys, options);
    }

    return stringToRegexp(path, keys, options);
  }

  pathToRegexp_1.parse = parse_1;
  pathToRegexp_1.compile = compile_1;
  pathToRegexp_1.tokensToFunction = tokensToFunction_1;
  pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;
  /**
     * Module dependencies.
     */

  /**
   * Short-cuts for global-object checks
   */

  var hasDocument = 'undefined' !== typeof document;
  var hasWindow = 'undefined' !== typeof window;
  var hasHistory = 'undefined' !== typeof history;
  var hasProcess = typeof process !== 'undefined';
  /**
   * Detect click event
   */

  var clickEvent = hasDocument && document.ontouchstart ? 'touchstart' : 'click';
  /**
   * To work properly with the URL
   * history.location generated polyfill in https://github.com/devote/HTML5-History-API
   */

  var isLocation = hasWindow && !!(window.history.location || window.location);
  /**
   * The page instance
   * @api private
   */

  function Page(options) {
    // public things
    this.callbacks = [];
    this.exits = [];
    this.current = '';
    this.len = 0; // private things

    this._dispatch = true;
    this._decodeURLComponents = true;
    this._base = '';
    this._strict = false;
    this._running = false;
    this._hashbang = false; // bound functions

    this._onclick = this._onclick.bind(this);
    this._onpopstate = this._onpopstate.bind(this);
    this.configure(options);
  }
  /**
   * Configure the instance of page. This can be called multiple times.
   *
   * @param {Object} options
   * @api public
   */


  Page.prototype.configure = function (options) {
    var opts = options || {};
    this._window = opts.window || hasWindow && window;
    this._dispatch = opts.dispatch !== false;
    this._decodeURLComponents = opts.decodeURLComponents !== false;
    this._popstate = opts.popstate !== false && hasWindow;
    this._click = opts.click !== false && hasDocument;
    this._hashbang = !!opts.hashbang;
    var _window = this._window;

    if (this._popstate) {
      _window.addEventListener('popstate', this._onpopstate, false);
    } else if (hasWindow) {
      _window.removeEventListener('popstate', this._onpopstate, false);
    }

    if (this._click) {
      _window.document.addEventListener(clickEvent, this._onclick, false);
    } else if (hasDocument) {
      _window.document.removeEventListener(clickEvent, this._onclick, false);
    }

    if (this._hashbang && hasWindow && !hasHistory) {
      _window.addEventListener('hashchange', this._onpopstate, false);
    } else if (hasWindow) {
      _window.removeEventListener('hashchange', this._onpopstate, false);
    }
  };
  /**
   * Get or set basepath to `path`.
   *
   * @param {string} path
   * @api public
   */


  Page.prototype.base = function (path) {
    if (0 === arguments.length) return this._base;
    this._base = path;
  };
  /**
   * Gets the `base`, which depends on whether we are using History or
   * hashbang routing.
    * @api private
   */


  Page.prototype._getBase = function () {
    var base = this._base;
    if (!!base) return base;
    var loc = hasWindow && this._window && this._window.location;
    return hasWindow && this._hashbang && loc && loc.protocol === 'file:' ? loc.pathname : base;
  };
  /**
   * Get or set strict path matching to `enable`
   *
   * @param {boolean} enable
   * @api public
   */


  Page.prototype.strict = function (enable) {
    if (0 === arguments.length) return this._strict;
    this._strict = enable;
  };
  /**
   * Bind with the given `options`.
   *
   * Options:
   *
   *    - `click` bind to click events [true]
   *    - `popstate` bind to popstate [true]
   *    - `dispatch` perform initial dispatch [true]
   *
   * @param {Object} options
   * @api public
   */


  Page.prototype.start = function (options) {
    this.configure(options);
    if (!this._dispatch) return;
    this._running = true;
    var url;

    if (isLocation) {
      var window = this._window;
      var loc = window.location;

      if (this._hashbang && ~loc.hash.indexOf('#!')) {
        url = loc.hash.substr(2) + loc.search;
      } else if (this._hashbang) {
        url = loc.search + loc.hash;
      } else {
        url = loc.pathname + loc.search + loc.hash;
      }
    }

    this.replace(url, null, true, this._dispatch);
  };
  /**
   * Unbind click and popstate event handlers.
   *
   * @api public
   */


  Page.prototype.stop = function () {
    if (!this._running) return;
    this.current = '';
    this.len = 0;
    this._running = false;
    var window = this._window;
    hasDocument && window.document.removeEventListener(clickEvent, this._onclick, false);
    hasWindow && window.removeEventListener('popstate', this._onpopstate, false);
    hasWindow && window.removeEventListener('hashchange', this._onpopstate, false);
  };
  /**
   * Show `path` with optional `state` object.
   *
   * @param {string} path
   * @param {Object=} state
   * @param {boolean=} dispatch
   * @param {boolean=} push
   * @return {!Context}
   * @api public
   */


  Page.prototype.show = function (path, state, dispatch, push) {
    var ctx = new Context(path, state, this),
        prev = this.prevContext;
    this.prevContext = ctx;
    this.current = ctx.path;
    if (this._dispatch) this.dispatch(ctx, prev);
    if (false !== ctx.handled && false !== push) ctx.pushState();
    return ctx;
  };
  /**
   * Goes back in the history
   * Back should always let the current route push state and then go back.
   *
   * @param {string} path - fallback path to go back if no more history exists, if undefined defaults to page.base
   * @param {Object=} state
   * @api public
   */


  Page.prototype.back = function (path, state) {
    var page = this;

    if (this.len > 0) {
      var window = this._window; // this may need more testing to see if all browsers
      // wait for the next tick to go back in history

      hasHistory && window.history.back();
      this.len--;
    } else if (path) {
      setTimeout(function () {
        page.show(path, state);
      });
    } else {
      setTimeout(function () {
        page.show(page._getBase(), state);
      });
    }
  };
  /**
   * Register route to redirect from one path to other
   * or just redirect to another route
   *
   * @param {string} from - if param 'to' is undefined redirects to 'from'
   * @param {string=} to
   * @api public
   */


  Page.prototype.redirect = function (from, to) {
    var inst = this; // Define route from a path to another

    if ('string' === typeof from && 'string' === typeof to) {
      page.call(this, from, function (e) {
        setTimeout(function () {
          inst.replace(
          /** @type {!string} */
          to);
        }, 0);
      });
    } // Wait for the push state and replace it with another


    if ('string' === typeof from && 'undefined' === typeof to) {
      setTimeout(function () {
        inst.replace(from);
      }, 0);
    }
  };
  /**
   * Replace `path` with optional `state` object.
   *
   * @param {string} path
   * @param {Object=} state
   * @param {boolean=} init
   * @param {boolean=} dispatch
   * @return {!Context}
   * @api public
   */


  Page.prototype.replace = function (path, state, init, dispatch) {
    var ctx = new Context(path, state, this),
        prev = this.prevContext;
    this.prevContext = ctx;
    this.current = ctx.path;
    ctx.init = init;
    ctx.save(); // save before dispatching, which may redirect

    if (false !== dispatch) this.dispatch(ctx, prev);
    return ctx;
  };
  /**
   * Dispatch the given `ctx`.
   *
   * @param {Context} ctx
   * @api private
   */


  Page.prototype.dispatch = function (ctx, prev) {
    var i = 0,
        j = 0,
        page = this;

    function nextExit() {
      var fn = page.exits[j++];
      if (!fn) return nextEnter();
      fn(prev, nextExit);
    }

    function nextEnter() {
      var fn = page.callbacks[i++];

      if (ctx.path !== page.current) {
        ctx.handled = false;
        return;
      }

      if (!fn) return unhandled.call(page, ctx);
      fn(ctx, nextEnter);
    }

    if (prev) {
      nextExit();
    } else {
      nextEnter();
    }
  };
  /**
   * Register an exit route on `path` with
   * callback `fn()`, which will be called
   * on the previous context when a new
   * page is visited.
   */


  Page.prototype.exit = function (path, fn) {
    if (typeof path === 'function') {
      return this.exit('*', path);
    }

    var route = new Route(path, null, this);

    for (var i = 1; i < arguments.length; ++i) {
      this.exits.push(route.middleware(arguments[i]));
    }
  };
  /**
   * Handle "click" events.
   */

  /* jshint +W054 */


  Page.prototype._onclick = function (e) {
    if (1 !== this._which(e)) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (e.defaultPrevented) return; // ensure link
    // use shadow dom when available if not, fall back to composedPath()
    // for browsers that only have shady

    var el = e.target;
    var eventPath = e.path || (e.composedPath ? e.composedPath() : null);

    if (eventPath) {
      for (var i = 0; i < eventPath.length; i++) {
        if (!eventPath[i].nodeName) continue;
        if (eventPath[i].nodeName.toUpperCase() !== 'A') continue;
        if (!eventPath[i].href) continue;
        el = eventPath[i];
        break;
      }
    } // continue ensure link
    // el.nodeName for svg links are 'a' instead of 'A'


    while (el && 'A' !== el.nodeName.toUpperCase()) {
      el = el.parentNode;
    }

    if (!el || 'A' !== el.nodeName.toUpperCase()) return; // check if link is inside an svg
    // in this case, both href and target are always inside an object

    var svg = _typeof(el.href) === 'object' && el.href.constructor.name === 'SVGAnimatedString'; // Ignore if tag has
    // 1. "download" attribute
    // 2. rel="external" attribute

    if (el.hasAttribute('download') || el.getAttribute('rel') === 'external') return; // ensure non-hash for the same path

    var link = el.getAttribute('href');
    if (!this._hashbang && this._samePath(el) && (el.hash || '#' === link)) return; // Check for mailto: in the href

    if (link && link.indexOf('mailto:') > -1) return; // check target
    // svg target is an object and its desired value is in .baseVal property

    if (svg ? el.target.baseVal : el.target) return; // x-origin
    // note: svg links that are not relative don't call click events (and skip page.js)
    // consequently, all svg links tested inside page.js are relative and in the same origin

    if (!svg && !this.sameOrigin(el.href)) return; // rebuild path
    // There aren't .pathname and .search properties in svg links, so we use href
    // Also, svg href is an object and its desired value is in .baseVal property

    var path = svg ? el.href.baseVal : el.pathname + el.search + (el.hash || '');
    path = path[0] !== '/' ? '/' + path : path; // strip leading "/[drive letter]:" on NW.js on Windows

    if (hasProcess && path.match(/^\/[a-zA-Z]:\//)) {
      path = path.replace(/^\/[a-zA-Z]:\//, '/');
    } // same page


    var orig = path;

    var pageBase = this._getBase();

    if (path.indexOf(pageBase) === 0) {
      path = path.substr(pageBase.length);
    }

    if (this._hashbang) path = path.replace('#!', '');
    if (pageBase && orig === path) return;
    e.preventDefault();
    this.show(orig);
  };
  /**
   * Handle "populate" events.
   * @api private
   */


  Page.prototype._onpopstate = function () {
    var loaded = false;

    if (!hasWindow) {
      return function () {};
    }

    if (hasDocument && document.readyState === 'complete') {
      loaded = true;
    } else {
      window.addEventListener('load', function () {
        setTimeout(function () {
          loaded = true;
        }, 0);
      });
    }

    return function onpopstate(e) {
      if (!loaded) return;
      var page = this;

      if (e.state) {
        var path = e.state.path;
        page.replace(path, e.state);
      } else if (isLocation) {
        var loc = page._window.location;
        page.show(loc.pathname + loc.search + loc.hash, undefined, undefined, false);
      }
    };
  }();
  /**
   * Event button.
   */


  Page.prototype._which = function (e) {
    e = e || hasWindow && this._window.event;
    return null == e.which ? e.button : e.which;
  };
  /**
   * Convert to a URL object
   * @api private
   */


  Page.prototype._toURL = function (href) {
    var window = this._window;

    if (typeof URL === 'function' && isLocation) {
      return new URL(href, window.location.toString());
    } else if (hasDocument) {
      var anc = window.document.createElement('a');
      anc.href = href;
      return anc;
    }
  };
  /**
   * Check if `href` is the same origin.
   * @param {string} href
   * @api public
   */


  Page.prototype.sameOrigin = function (href) {
    if (!href || !isLocation) return false;

    var url = this._toURL(href);

    var window = this._window;
    var loc = window.location;
    return loc.protocol === url.protocol && loc.hostname === url.hostname && loc.port === url.port;
  };
  /**
   * @api private
   */


  Page.prototype._samePath = function (url) {
    if (!isLocation) return false;
    var window = this._window;
    var loc = window.location;
    return url.pathname === loc.pathname && url.search === loc.search;
  };
  /**
   * Remove URL encoding from the given `str`.
   * Accommodates whitespace in both x-www-form-urlencoded
   * and regular percent-encoded form.
   *
   * @param {string} val - URL component to decode
   * @api private
   */


  Page.prototype._decodeURLEncodedURIComponent = function (val) {
    if (typeof val !== 'string') {
      return val;
    }

    return this._decodeURLComponents ? decodeURIComponent(val.replace(/\+/g, ' ')) : val;
  };
  /**
   * Create a new `page` instance and function
   */


  function createPage(options) {
    var pageInstance = new Page();

    function pageFn()
    /* args */
    {
      return page.apply(pageInstance, arguments);
    } // Copy all of the things over. In 2.0 maybe we use setPrototypeOf


    pageFn.callbacks = pageInstance.callbacks;
    pageFn.exits = pageInstance.exits;
    pageFn.base = pageInstance.base.bind(pageInstance);
    pageFn.strict = pageInstance.strict.bind(pageInstance);
    pageFn.start = pageInstance.start.bind(pageInstance);
    pageFn.stop = pageInstance.stop.bind(pageInstance);
    pageFn.show = pageInstance.show.bind(pageInstance);
    pageFn.back = pageInstance.back.bind(pageInstance);
    pageFn.redirect = pageInstance.redirect.bind(pageInstance);
    pageFn.replace = pageInstance.replace.bind(pageInstance);
    pageFn.dispatch = pageInstance.dispatch.bind(pageInstance);
    pageFn.exit = pageInstance.exit.bind(pageInstance);
    pageFn.configure = pageInstance.configure.bind(pageInstance);
    pageFn.sameOrigin = pageInstance.sameOrigin.bind(pageInstance);
    pageFn.create = createPage;
    Object.defineProperty(pageFn, 'len', {
      get: function get() {
        return pageInstance.len;
      },
      set: function set(val) {
        pageInstance.len = val;
      }
    });
    Object.defineProperty(pageFn, 'current', {
      get: function get() {
        return pageInstance.current;
      },
      set: function set(val) {
        pageInstance.current = val;
      }
    }); // In 2.0 these can be named exports

    pageFn.Context = Context;
    pageFn.Route = Route;
    return pageFn;
  }
  /**
   * Register `path` with callback `fn()`,
   * or route `path`, or redirection,
   * or `page.start()`.
   *
   *   page(fn);
   *   page('*', fn);
   *   page('/user/:id', load, user);
   *   page('/user/' + user.id, { some: 'thing' });
   *   page('/user/' + user.id);
   *   page('/from', '/to')
   *   page();
   *
   * @param {string|!Function|!Object} path
   * @param {Function=} fn
   * @api public
   */


  function page(path, fn) {
    // <callback>
    if ('function' === typeof path) {
      return page.call(this, '*', path);
    } // route <path> to <callback ...>


    if ('function' === typeof fn) {
      var route = new Route(
      /** @type {string} */
      path, null, this);

      for (var i = 1; i < arguments.length; ++i) {
        this.callbacks.push(route.middleware(arguments[i]));
      } // show <path> with [state]

    } else if ('string' === typeof path) {
      this['string' === typeof fn ? 'redirect' : 'show'](path, fn); // start [options]
    } else {
      this.start(path);
    }
  }
  /**
   * Unhandled `ctx`. When it's not the initial
   * popstate then redirect. If you wish to handle
   * 404s on your own use `page('*', callback)`.
   *
   * @param {Context} ctx
   * @api private
   */


  function unhandled(ctx) {
    if (ctx.handled) return;
    var current;
    var page = this;
    var window = page._window;

    if (page._hashbang) {
      current = isLocation && this._getBase() + window.location.hash.replace('#!', '');
    } else {
      current = isLocation && window.location.pathname + window.location.search;
    }

    if (current === ctx.canonicalPath) return;
    page.stop();
    ctx.handled = false;
    isLocation && (window.location.href = ctx.canonicalPath);
  }
  /**
   * Initialize a new "request" `Context`
   * with the given `path` and optional initial `state`.
   *
   * @constructor
   * @param {string} path
   * @param {Object=} state
   * @api public
   */


  function Context(path, state, pageInstance) {
    var _page = this.page = pageInstance || page;

    var window = _page._window;
    var hashbang = _page._hashbang;

    var pageBase = _page._getBase();

    if ('/' === path[0] && 0 !== path.indexOf(pageBase)) path = pageBase + (hashbang ? '#!' : '') + path;
    var i = path.indexOf('?');
    this.canonicalPath = path;
    this.path = path.replace(pageBase, '') || '/';
    if (hashbang) this.path = this.path.replace('#!', '') || '/';
    this.title = hasDocument && window.document.title;
    this.state = state || {};
    this.state.path = path;
    this.querystring = ~i ? _page._decodeURLEncodedURIComponent(path.slice(i + 1)) : '';
    this.pathname = _page._decodeURLEncodedURIComponent(~i ? path.slice(0, i) : path);
    this.params = {}; // fragment

    this.hash = '';

    if (!hashbang) {
      if (!~this.path.indexOf('#')) return;
      var parts = this.path.split('#');
      this.path = this.pathname = parts[0];
      this.hash = _page._decodeURLEncodedURIComponent(parts[1]) || '';
      this.querystring = this.querystring.split('#')[0];
    }
  }
  /**
   * Push state.
   *
   * @api private
   */


  Context.prototype.pushState = function () {
    var page = this.page;
    var window = page._window;
    var hashbang = page._hashbang;
    page.len++;

    if (hasHistory) {
      window.history.pushState(this.state, this.title, hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
    }
  };
  /**
   * Save the context state.
   *
   * @api public
   */


  Context.prototype.save = function () {
    var page = this.page;

    if (hasHistory && page._window.location.protocol !== 'file:') {
      page._window.history.replaceState(this.state, this.title, page._hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
    }
  };
  /**
   * Initialize `Route` with the given HTTP `path`,
   * and an array of `callbacks` and `options`.
   *
   * Options:
   *
   *   - `sensitive`    enable case-sensitive routes
   *   - `strict`       enable strict matching for trailing slashes
   *
   * @constructor
   * @param {string} path
   * @param {Object=} options
   * @api private
   */


  function Route(path, options, page) {
    var _page = this.page = page || globalPage;

    var opts = options || {};
    opts.strict = opts.strict || page._strict;
    this.path = path === '*' ? '(.*)' : path;
    this.method = 'GET';
    this.regexp = pathToRegexp_1(this.path, this.keys = [], opts);
  }
  /**
   * Return route middleware with
   * the given callback `fn()`.
   *
   * @param {Function} fn
   * @return {Function}
   * @api public
   */


  Route.prototype.middleware = function (fn) {
    var self = this;
    return function (ctx, next) {
      if (self.match(ctx.path, ctx.params)) return fn(ctx, next);
      next();
    };
  };
  /**
   * Check if this route matches `path`, if so
   * populate `params`.
   *
   * @param {string} path
   * @param {Object} params
   * @return {boolean}
   * @api private
   */


  Route.prototype.match = function (path, params) {
    var keys = this.keys,
        qsIndex = path.indexOf('?'),
        pathname = ~qsIndex ? path.slice(0, qsIndex) : path,
        m = this.regexp.exec(decodeURIComponent(pathname));
    if (!m) return false;

    for (var i = 1, len = m.length; i < len; ++i) {
      var key = keys[i - 1];

      var val = this.page._decodeURLEncodedURIComponent(m[i]);

      if (val !== undefined || !hasOwnProperty.call(params, key.name)) {
        params[key.name] = val;
      }
    }

    return true;
  };
  /**
   * Module exports.
   */


  var globalPage = createPage();
  var page_js = globalPage;
  page.default = globalPage;
  return page_js;
});

}).call(this,require('_process'))
},{"_process":25}],25:[function(require,module,exports){
"use strict";

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};

},{}],26:[function(require,module,exports){
"use strict";

function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PageRouter = void 0;

var _widgets = require("@scoutgg/widgets");

var _component = require("@scoutgg/widgets/cjs/decorators/component");

var _decorator = require("./decorator");

var _page = _interopRequireDefault(require("page"));

var _dec, _dec2, _dec3, _class;

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

function _typeof(obj) {
  if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
    _typeof = function _typeof(obj) {
      return _typeof2(obj);
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

function isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["", ""]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }

  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
}

var PageRouter = (_dec = (0, _widgets.Component)('ang'), _dec2 = (0, _widgets.Attribute)('hashbang', Boolean, {
  default: false
}), _dec3 = (0, _widgets.Template)(function (html) {
  html(_templateObject(), this.route);
}), _dec(_class = _dec2(_class = _dec3(_class =
/*#__PURE__*/
function (_HTMLElement) {
  _inherits(PageRouter, _HTMLElement);

  function PageRouter() {
    _classCallCheck(this, PageRouter);

    return _possibleConstructorReturn(this, _getPrototypeOf(PageRouter).apply(this, arguments));
  }

  _createClass(PageRouter, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      var _this = this;

      this.route = '';

      _decorator.routes.forEach(function (route) {
        (0, _page.default)(route.route, function (context, next) {
          var elem = document.createElement((0, _component.getTagName)(route.self));
          Object.keys(context.params).forEach(function (attribute) {
            if (!isNaN(attribute)) return;
            elem.setAttribute(attribute, context.params[attribute]);
          });
          _this.route = elem;

          _this.render();
        });
      });

      (0, _page.default)({
        hashbang: this.hashbang
      });
    }
  }]);

  return PageRouter;
}(_wrapNativeSuper(HTMLElement))) || _class) || _class) || _class);
exports.PageRouter = PageRouter;

},{"./decorator":27,"@scoutgg/widgets":4,"@scoutgg/widgets/cjs/decorators/component":2,"page":24}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Route = Route;
exports.routes = void 0;
var routes = new Set();
exports.routes = routes;

function Route(route, element) {
  return function run(self) {
    routes.add({
      route: route,
      self: self
    });
  };
}

},{}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "router", {
  enumerable: true,
  get: function get() {
    return _router.page;
  }
});
Object.defineProperty(exports, "PageRouter", {
  enumerable: true,
  get: function get() {
    return _component.PageRouter;
  }
});
Object.defineProperty(exports, "Route", {
  enumerable: true,
  get: function get() {
    return _decorator.Route;
  }
});
Object.defineProperty(exports, "routes", {
  enumerable: true,
  get: function get() {
    return _decorator.routes;
  }
});

var _router = require("./router");

var _component = require("./component");

var _decorator = require("./decorator");

},{"./component":26,"./decorator":27,"./router":29}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "page", {
  enumerable: true,
  get: function get() {
    return _page.default;
  }
});

var _decorator = require("./decorator");

var _page = _interopRequireDefault(require("page"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

},{"./decorator":27,"page":24}],30:[function(require,module,exports){
"use strict";

function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _widgets = require("@scoutgg/widgets");

var _dec, _dec2, _class;

function _typeof(obj) {
  if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
    _typeof = function _typeof(obj) {
      return _typeof2(obj);
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

function isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n    <style>\n      :host {\n        display: flex;\n      }\n      h1 {\n        font-family: var(--accent-font);\n        font-weight: 300;\n        filter: var(--filter, drop-shadow(1px 1px 1px rgba(0,0,0,0.5)));\n        color: var(--h1-color, auto);\n        margin-right: 1em;\n      }\n      h1:last-child {\n        margin-right: 0;\n      }\n      .seconds {\n        color: var(--h1-seconds-color, orange);\n      }\n    </style>\n    <h1>", "D</h1>\n    <h1>", "H</h1>\n    <h1>", "M</h1>\n    <h1 class=\"seconds\">", "S</h1>\n  "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }

  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
}

var CountDown = (_dec = (0, _widgets.Component)('sgg'), _dec2 = (0, _widgets.Template)(function (html) {
  html(_templateObject(), this.countdown.days || '00', this.countdown.hours || '00', this.countdown.minutes || '00', this.countdown.seconds || '00');
}), _dec(_class = _dec2(_class =
/*#__PURE__*/
function (_HTMLElement) {
  _inherits(CountDown, _HTMLElement);

  function CountDown() {
    _classCallCheck(this, CountDown);

    return _possibleConstructorReturn(this, _getPrototypeOf(CountDown).apply(this, arguments));
  }

  _createClass(CountDown, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      var _this = this;

      this.countdown = this.countify;
      this.time = this.attributes.time.value;

      var rerender = function rerender() {
        _this.countdown = _this.countify;

        _this.render();

        if (_this.countdown.time) {
          setTimeout(rerender, 1000);
        } else {
          var event = new CustomEvent('done');

          _this.dispatchEvent(event);
        }
      };

      rerender();
    }
  }, {
    key: "padded",
    value: function padded(num) {
      if (num < 10) return '0' + num;
      return num;
    }
  }, {
    key: "countify",
    get: function get() {
      var t = this.time - Date.now();
      if (t <= 0) return {};
      return {
        time: t,
        seconds: this.padded(Math.floor(t / 1000 % 60)),
        minutes: this.padded(Math.floor(t / 1000 / 60 % 60)),
        hours: this.padded(Math.floor(t / (1000 * 60 * 60) % 24)),
        days: this.padded(Math.floor(t / (1000 * 60 * 60 * 24)))
      };
    }
  }]);

  return CountDown;
}(_wrapNativeSuper(HTMLElement))) || _class) || _class);
exports.default = CountDown;

},{"@scoutgg/widgets":4}],31:[function(require,module,exports){
"use strict";

function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _widgets = require("@scoutgg/widgets");

var _widgetsRouter = require("widgets-router");

var _hyperhtml = require("hyperhtml");

var _dec, _dec2, _dec3, _class;

function _typeof(obj) {
  if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
    _typeof = function _typeof(obj) {
      return _typeof2(obj);
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

function isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["<demo-pyro></demo-pyro>"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  <style>\n    :host {\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n      justify-content: center;\n      font-family: 'Ubuntu', sans-serif;\n      min-height: 100vh;\n      --filter: none;\n      --h1-seconds-color: #cd5022;\n      background: #fcfcfc; /* Old browsers */\n      background: -moz-linear-gradient(top, #fcfcfc 0%, #eeeeee 100%); /* FF3.6-15 */\n      background: -webkit-linear-gradient(top, #fcfcfc 0%,#eeeeee 100%); /* Chrome10-25,Safari5.1-6 */\n      background: linear-gradient(to bottom, #fcfcfc 0%,#eeeeee 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */\n      filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#fcfcfc', endColorstr='#eeeeee',GradientType=0 ); /* IE6-9 */\n    }\n    .firefox-emblem {\n      background-image: url(public/birds.jpeg);\n      background-position: bottom right;\n      background-size: cover;\n      animation-duration: 5s;\n      animation-iteration-count: infinite;\n      -webkit-mask-box-image: url(public/firefox.svg);\n      height: 400px;\n      width: 400px;\n      max-width: 100%;\n    }\n    .firefox-emblem.shadowdom {\n      background-image: url(public/upsidedown.gif);\n    }\n    h1 {\n      font-size: 3em;\n      font-weight: 300;\n      color: #cd5022;\n    }\n    p {\n      font-weight: 100;\n      color: rgba(0,0,0,0.5);\n    }\n    demo-pyro {\n      position: fixed;\n      top: 0;\n      left: 0;\n      width: 100vw;\n      height: 100vh;\n    }\n    .upsidedown {\n      color: #0c49ad;\n      border-bottom: 2px solid #0c49ad;\n    }\n  </style>\n  <sgg-count-down ondone=", " time=\"1540303200502\"></sgg-count-down>\n  <div class=", "></div>\n  <h1>Firefox grows up</h1>\n  <p>Firefox 63 - The <span class=\"upsidedown\" onmouseover=", " onmouseout=", ">Shadow DOM</span> (bug 1471947) and Custom Elements (bug 1471948) APIs have been enabled by default; See Web components for more details.</p>\n\n  ", "\n  "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }

  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
}

var Firefox = (_dec = (0, _widgetsRouter.Route)('/'), _dec2 = (0, _widgets.Component)('sgg'), _dec3 = (0, _widgets.Template)(function (html) {
  var _this = this;

  html(_templateObject(), function () {
    return _this.setDone();
  }, this.firefoxClass, function () {
    return _this.toggleShadow();
  }, function () {
    return _this.toggleShadow();
  }, this.done ? (0, _hyperhtml.wire)()(_templateObject2()) : '');
}), _dec(_class = _dec2(_class = _dec3(_class =
/*#__PURE__*/
function (_HTMLElement) {
  _inherits(Firefox, _HTMLElement);

  function Firefox() {
    _classCallCheck(this, Firefox);

    return _possibleConstructorReturn(this, _getPrototypeOf(Firefox).apply(this, arguments));
  }

  _createClass(Firefox, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      this.audio = new Audio('public/strange.mp3');
      this.audio.loop = true;
    }
  }, {
    key: "setDone",
    value: function setDone() {
      var _this2 = this;

      this.done = true;
      setTimeout(function () {
        return _this2.render();
      });
    }
  }, {
    key: "toggleShadow",
    value: function toggleShadow() {
      this.shadow = !this.shadow;

      if (this.shadow) {
        this.audio.play();
      } else {
        this.audio.pause();
      }

      this.render();
    }
  }, {
    key: "firefoxClass",
    get: function get() {
      if (this.shadow) return 'firefox-emblem shadowdom';
      return 'firefox-emblem';
    }
  }]);

  return Firefox;
}(_wrapNativeSuper(HTMLElement))) || _class) || _class) || _class);
exports.default = Firefox;

},{"@scoutgg/widgets":4,"hyperhtml":12,"widgets-router":28}],32:[function(require,module,exports){
"use strict";

function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _widgets = require("@scoutgg/widgets");

var _dec, _dec2, _class;

function _typeof(obj) {
  if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
    _typeof = function _typeof(obj) {
      return _typeof2(obj);
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

function isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n    <style>\n    body {\n    margin: 0;\n    padding: 0;\n    background: #000;\n    overflow: hidden;\n    }\n\n    .pyro > .before, .pyro > .after {\n    position: absolute;\n    width: 5px;\n    height: 5px;\n    border-radius: 50%;\n    box-shadow: 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff;\n    -moz-animation: 1s bang ease-out infinite backwards, 1s gravity ease-in infinite backwards, 5s position linear infinite backwards;\n    -webkit-animation: 1s bang ease-out infinite backwards, 1s gravity ease-in infinite backwards, 5s position linear infinite backwards;\n    -o-animation: 1s bang ease-out infinite backwards, 1s gravity ease-in infinite backwards, 5s position linear infinite backwards;\n    -ms-animation: 1s bang ease-out infinite backwards, 1s gravity ease-in infinite backwards, 5s position linear infinite backwards;\n    animation: 1s bang ease-out infinite backwards, 1s gravity ease-in infinite backwards, 5s position linear infinite backwards;\n    }\n\n    .pyro > .after {\n    -moz-animation-delay: 1.25s, 1.25s, 1.25s;\n    -webkit-animation-delay: 1.25s, 1.25s, 1.25s;\n    -o-animation-delay: 1.25s, 1.25s, 1.25s;\n    -ms-animation-delay: 1.25s, 1.25s, 1.25s;\n    animation-delay: 1.25s, 1.25s, 1.25s;\n    -moz-animation-duration: 1.25s, 1.25s, 6.25s;\n    -webkit-animation-duration: 1.25s, 1.25s, 6.25s;\n    -o-animation-duration: 1.25s, 1.25s, 6.25s;\n    -ms-animation-duration: 1.25s, 1.25s, 6.25s;\n    animation-duration: 1.25s, 1.25s, 6.25s;\n    }\n\n    @-webkit-keyframes bang {\n    to {\n      box-shadow: -200px -48.66667px #eeff00, -92px -247.66667px #44ff00, -66px -127.66667px #00fff2, 214px -351.66667px #0088ff, 241px -387.66667px #bf00ff, -130px -288.66667px #001eff, -82px -282.66667px #00ff11, -19px -401.66667px #ff001a, 248px -22.66667px #ff3700, 35px 62.33333px #5500ff, -55px -363.66667px #ff00dd, 41px -44.66667px #c8ff00, -134px -0.66667px #00ff1a, 228px -360.66667px #ff0073, -198px -288.66667px #00ff44, 57px -132.66667px #4800ff, 92px -230.66667px #a200ff, 165px 42.33333px #0011ff, -119px -100.66667px #0091ff, 83px -10.66667px #ff00b7, -136px -366.66667px #ffb300, -91px -100.66667px #8800ff, -177px -244.66667px #ff0099, 234px -357.66667px #5900ff, -205px -252.66667px #0066ff, 88px -88.66667px #26ff00, 56px -392.66667px #0026ff, 98px -354.66667px #80ff00, -38px -201.66667px #00ff80, -63px 32.33333px #006aff, 55px -120.66667px #73ff00, -193px -99.66667px #ff0073, 35px -166.66667px #04ff00, -139px -35.66667px #00ffc4, -67px -357.66667px #00ff7b, 212px -350.66667px #ff1100, 200px -58.66667px #0d00ff, 76px 6.33333px #b300ff, 245px -373.66667px #ff006a, 0px -382.66667px #00ffdd, 205px -23.66667px #00ff62, -118px -170.66667px #a2ff00, 203px -261.66667px #ff0088, -167px -30.66667px #11ff00, -189px -293.66667px magenta, -93px -280.66667px #f200ff, -109px -16.66667px #00ccff, -113px -206.66667px #ff0900, 235px -365.66667px #ff4d00, 219px -249.66667px #00ffaa, 179px -21.66667px #0048ff;\n    }\n    }\n    @-moz-keyframes bang {\n    to {\n      box-shadow: -200px -48.66667px #eeff00, -92px -247.66667px #44ff00, -66px -127.66667px #00fff2, 214px -351.66667px #0088ff, 241px -387.66667px #bf00ff, -130px -288.66667px #001eff, -82px -282.66667px #00ff11, -19px -401.66667px #ff001a, 248px -22.66667px #ff3700, 35px 62.33333px #5500ff, -55px -363.66667px #ff00dd, 41px -44.66667px #c8ff00, -134px -0.66667px #00ff1a, 228px -360.66667px #ff0073, -198px -288.66667px #00ff44, 57px -132.66667px #4800ff, 92px -230.66667px #a200ff, 165px 42.33333px #0011ff, -119px -100.66667px #0091ff, 83px -10.66667px #ff00b7, -136px -366.66667px #ffb300, -91px -100.66667px #8800ff, -177px -244.66667px #ff0099, 234px -357.66667px #5900ff, -205px -252.66667px #0066ff, 88px -88.66667px #26ff00, 56px -392.66667px #0026ff, 98px -354.66667px #80ff00, -38px -201.66667px #00ff80, -63px 32.33333px #006aff, 55px -120.66667px #73ff00, -193px -99.66667px #ff0073, 35px -166.66667px #04ff00, -139px -35.66667px #00ffc4, -67px -357.66667px #00ff7b, 212px -350.66667px #ff1100, 200px -58.66667px #0d00ff, 76px 6.33333px #b300ff, 245px -373.66667px #ff006a, 0px -382.66667px #00ffdd, 205px -23.66667px #00ff62, -118px -170.66667px #a2ff00, 203px -261.66667px #ff0088, -167px -30.66667px #11ff00, -189px -293.66667px magenta, -93px -280.66667px #f200ff, -109px -16.66667px #00ccff, -113px -206.66667px #ff0900, 235px -365.66667px #ff4d00, 219px -249.66667px #00ffaa, 179px -21.66667px #0048ff;\n    }\n    }\n    @-o-keyframes bang {\n    to {\n      box-shadow: -200px -48.66667px #eeff00, -92px -247.66667px #44ff00, -66px -127.66667px #00fff2, 214px -351.66667px #0088ff, 241px -387.66667px #bf00ff, -130px -288.66667px #001eff, -82px -282.66667px #00ff11, -19px -401.66667px #ff001a, 248px -22.66667px #ff3700, 35px 62.33333px #5500ff, -55px -363.66667px #ff00dd, 41px -44.66667px #c8ff00, -134px -0.66667px #00ff1a, 228px -360.66667px #ff0073, -198px -288.66667px #00ff44, 57px -132.66667px #4800ff, 92px -230.66667px #a200ff, 165px 42.33333px #0011ff, -119px -100.66667px #0091ff, 83px -10.66667px #ff00b7, -136px -366.66667px #ffb300, -91px -100.66667px #8800ff, -177px -244.66667px #ff0099, 234px -357.66667px #5900ff, -205px -252.66667px #0066ff, 88px -88.66667px #26ff00, 56px -392.66667px #0026ff, 98px -354.66667px #80ff00, -38px -201.66667px #00ff80, -63px 32.33333px #006aff, 55px -120.66667px #73ff00, -193px -99.66667px #ff0073, 35px -166.66667px #04ff00, -139px -35.66667px #00ffc4, -67px -357.66667px #00ff7b, 212px -350.66667px #ff1100, 200px -58.66667px #0d00ff, 76px 6.33333px #b300ff, 245px -373.66667px #ff006a, 0px -382.66667px #00ffdd, 205px -23.66667px #00ff62, -118px -170.66667px #a2ff00, 203px -261.66667px #ff0088, -167px -30.66667px #11ff00, -189px -293.66667px magenta, -93px -280.66667px #f200ff, -109px -16.66667px #00ccff, -113px -206.66667px #ff0900, 235px -365.66667px #ff4d00, 219px -249.66667px #00ffaa, 179px -21.66667px #0048ff;\n    }\n    }\n    @-ms-keyframes bang {\n    to {\n      box-shadow: -200px -48.66667px #eeff00, -92px -247.66667px #44ff00, -66px -127.66667px #00fff2, 214px -351.66667px #0088ff, 241px -387.66667px #bf00ff, -130px -288.66667px #001eff, -82px -282.66667px #00ff11, -19px -401.66667px #ff001a, 248px -22.66667px #ff3700, 35px 62.33333px #5500ff, -55px -363.66667px #ff00dd, 41px -44.66667px #c8ff00, -134px -0.66667px #00ff1a, 228px -360.66667px #ff0073, -198px -288.66667px #00ff44, 57px -132.66667px #4800ff, 92px -230.66667px #a200ff, 165px 42.33333px #0011ff, -119px -100.66667px #0091ff, 83px -10.66667px #ff00b7, -136px -366.66667px #ffb300, -91px -100.66667px #8800ff, -177px -244.66667px #ff0099, 234px -357.66667px #5900ff, -205px -252.66667px #0066ff, 88px -88.66667px #26ff00, 56px -392.66667px #0026ff, 98px -354.66667px #80ff00, -38px -201.66667px #00ff80, -63px 32.33333px #006aff, 55px -120.66667px #73ff00, -193px -99.66667px #ff0073, 35px -166.66667px #04ff00, -139px -35.66667px #00ffc4, -67px -357.66667px #00ff7b, 212px -350.66667px #ff1100, 200px -58.66667px #0d00ff, 76px 6.33333px #b300ff, 245px -373.66667px #ff006a, 0px -382.66667px #00ffdd, 205px -23.66667px #00ff62, -118px -170.66667px #a2ff00, 203px -261.66667px #ff0088, -167px -30.66667px #11ff00, -189px -293.66667px magenta, -93px -280.66667px #f200ff, -109px -16.66667px #00ccff, -113px -206.66667px #ff0900, 235px -365.66667px #ff4d00, 219px -249.66667px #00ffaa, 179px -21.66667px #0048ff;\n    }\n    }\n    @keyframes bang {\n    to {\n      box-shadow: -200px -48.66667px #eeff00, -92px -247.66667px #44ff00, -66px -127.66667px #00fff2, 214px -351.66667px #0088ff, 241px -387.66667px #bf00ff, -130px -288.66667px #001eff, -82px -282.66667px #00ff11, -19px -401.66667px #ff001a, 248px -22.66667px #ff3700, 35px 62.33333px #5500ff, -55px -363.66667px #ff00dd, 41px -44.66667px #c8ff00, -134px -0.66667px #00ff1a, 228px -360.66667px #ff0073, -198px -288.66667px #00ff44, 57px -132.66667px #4800ff, 92px -230.66667px #a200ff, 165px 42.33333px #0011ff, -119px -100.66667px #0091ff, 83px -10.66667px #ff00b7, -136px -366.66667px #ffb300, -91px -100.66667px #8800ff, -177px -244.66667px #ff0099, 234px -357.66667px #5900ff, -205px -252.66667px #0066ff, 88px -88.66667px #26ff00, 56px -392.66667px #0026ff, 98px -354.66667px #80ff00, -38px -201.66667px #00ff80, -63px 32.33333px #006aff, 55px -120.66667px #73ff00, -193px -99.66667px #ff0073, 35px -166.66667px #04ff00, -139px -35.66667px #00ffc4, -67px -357.66667px #00ff7b, 212px -350.66667px #ff1100, 200px -58.66667px #0d00ff, 76px 6.33333px #b300ff, 245px -373.66667px #ff006a, 0px -382.66667px #00ffdd, 205px -23.66667px #00ff62, -118px -170.66667px #a2ff00, 203px -261.66667px #ff0088, -167px -30.66667px #11ff00, -189px -293.66667px magenta, -93px -280.66667px #f200ff, -109px -16.66667px #00ccff, -113px -206.66667px #ff0900, 235px -365.66667px #ff4d00, 219px -249.66667px #00ffaa, 179px -21.66667px #0048ff;\n    }\n    }\n    @-webkit-keyframes gravity {\n    to {\n      transform: translateY(200px);\n      -moz-transform: translateY(200px);\n      -webkit-transform: translateY(200px);\n      -o-transform: translateY(200px);\n      -ms-transform: translateY(200px);\n      opacity: 0;\n    }\n    }\n    @-moz-keyframes gravity {\n    to {\n      transform: translateY(200px);\n      -moz-transform: translateY(200px);\n      -webkit-transform: translateY(200px);\n      -o-transform: translateY(200px);\n      -ms-transform: translateY(200px);\n      opacity: 0;\n    }\n    }\n    @-o-keyframes gravity {\n    to {\n      transform: translateY(200px);\n      -moz-transform: translateY(200px);\n      -webkit-transform: translateY(200px);\n      -o-transform: translateY(200px);\n      -ms-transform: translateY(200px);\n      opacity: 0;\n    }\n    }\n    @-ms-keyframes gravity {\n    to {\n      transform: translateY(200px);\n      -moz-transform: translateY(200px);\n      -webkit-transform: translateY(200px);\n      -o-transform: translateY(200px);\n      -ms-transform: translateY(200px);\n      opacity: 0;\n    }\n    }\n    @keyframes gravity {\n    to {\n      transform: translateY(200px);\n      -moz-transform: translateY(200px);\n      -webkit-transform: translateY(200px);\n      -o-transform: translateY(200px);\n      -ms-transform: translateY(200px);\n      opacity: 0;\n    }\n    }\n    @-webkit-keyframes position {\n    0%, 19.9% {\n      margin-top: 10%;\n      margin-left: 40%;\n    }\n    20%, 39.9% {\n      margin-top: 40%;\n      margin-left: 30%;\n    }\n    40%, 59.9% {\n      margin-top: 20%;\n      margin-left: 70%;\n    }\n    60%, 79.9% {\n      margin-top: 30%;\n      margin-left: 20%;\n    }\n    80%, 99.9% {\n      margin-top: 30%;\n      margin-left: 80%;\n    }\n    }\n    @-moz-keyframes position {\n    0%, 19.9% {\n      margin-top: 10%;\n      margin-left: 40%;\n    }\n    20%, 39.9% {\n      margin-top: 40%;\n      margin-left: 30%;\n    }\n    40%, 59.9% {\n      margin-top: 20%;\n      margin-left: 70%;\n    }\n    60%, 79.9% {\n      margin-top: 30%;\n      margin-left: 20%;\n    }\n    80%, 99.9% {\n      margin-top: 30%;\n      margin-left: 80%;\n    }\n    }\n    @-o-keyframes position {\n    0%, 19.9% {\n      margin-top: 10%;\n      margin-left: 40%;\n    }\n    20%, 39.9% {\n      margin-top: 40%;\n      margin-left: 30%;\n    }\n    40%, 59.9% {\n      margin-top: 20%;\n      margin-left: 70%;\n    }\n    60%, 79.9% {\n      margin-top: 30%;\n      margin-left: 20%;\n    }\n    80%, 99.9% {\n      margin-top: 30%;\n      margin-left: 80%;\n    }\n    }\n    @-ms-keyframes position {\n    0%, 19.9% {\n      margin-top: 10%;\n      margin-left: 40%;\n    }\n    20%, 39.9% {\n      margin-top: 40%;\n      margin-left: 30%;\n    }\n    40%, 59.9% {\n      margin-top: 20%;\n      margin-left: 70%;\n    }\n    60%, 79.9% {\n      margin-top: 30%;\n      margin-left: 20%;\n    }\n    80%, 99.9% {\n      margin-top: 30%;\n      margin-left: 80%;\n    }\n    }\n    @keyframes position {\n    0%, 19.9% {\n      margin-top: 10%;\n      margin-left: 40%;\n    }\n    20%, 39.9% {\n      margin-top: 40%;\n      margin-left: 30%;\n    }\n    40%, 59.9% {\n      margin-top: 20%;\n      margin-left: 70%;\n    }\n    60%, 79.9% {\n      margin-top: 30%;\n      margin-left: 20%;\n    }\n    80%, 99.9% {\n      margin-top: 30%;\n      margin-left: 80%;\n    }\n    }\n\n  </style>\n  <div class=\"pyro\">\n    <div class=\"before\"></div>\n    <div class=\"after\"></div>\n  </div>\n  "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }

  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
}

var Pyro = (_dec = (0, _widgets.Component)('demo'), _dec2 = (0, _widgets.Template)(function (html) {
  html(_templateObject());
}), _dec(_class = _dec2(_class =
/*#__PURE__*/
function (_HTMLElement) {
  _inherits(Pyro, _HTMLElement);

  function Pyro() {
    _classCallCheck(this, Pyro);

    return _possibleConstructorReturn(this, _getPrototypeOf(Pyro).apply(this, arguments));
  }

  return Pyro;
}(_wrapNativeSuper(HTMLElement))) || _class) || _class);
exports.default = Pyro;

},{"@scoutgg/widgets":4}],33:[function(require,module,exports){
"use strict";

var _widgets = require("@scoutgg/widgets");

var _hyper = require("@scoutgg/widgets/cjs/renderers/hyper");

var _widgetsRouter = require("widgets-router");

var _hyperhtml = _interopRequireDefault(require("hyperhtml"));

require("./components/count-down/count-down");

require("./components/firefox/firefox");

require("./components/pyro/pyro");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
} // Import the components you want to use
// Bootstrap Widgets (Start it)


(0, _widgets.bootstrap)([(0, _hyper.hyper)(_hyperhtml.default)]);

},{"./components/count-down/count-down":30,"./components/firefox/firefox":31,"./components/pyro/pyro":32,"@scoutgg/widgets":4,"@scoutgg/widgets/cjs/renderers/hyper":5,"hyperhtml":12,"widgets-router":28}]},{},[33]);
