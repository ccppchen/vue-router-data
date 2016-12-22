'use strict';

//获取历史状态的key值
var getHistoryStateKey = function getHistoryStateKey() {
    return isObject(history.state) && typeof history.state.key == 'string' ? history.state.key : new Date().getTime();
};

//判断是否是对象
var isObject = function isObject(obj) {
    return !!obj && Object.prototype.toString.call(obj) == '[object Object]';
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var VueRouterData = function () {
    function VueRouterData(options) {
        classCallCheck(this, VueRouterData);

        options.mode = 'data' + options.mode.replace(/\w/, function (v) {
            return v.toUpperCase();
        });
        this.options = _extends({}, options);
        this.store = {}; //存储数据
    }
    /**
     * 初始化组件数据
     * component 组件实例对象
     */


    createClass(VueRouterData, [{
        key: 'componentInitData',
        value: function componentInitData(component) {
            var $route = component.$route;

            var mode = this.options.mode;
            var modeData = component.$options[mode];
            if (typeof modeData !== 'function') return {};
            var _scopeId = component.$options._scopeId;

            var key = _scopeId + '-' + this.options.getKey($route);
            var history = this.store[key];
            if (isObject(history)) {
                //数据已经存在，还原数据
                return history;
            }
            var data = modeData.call(component);
            var keys = [];
            Object.keys(data).forEach(function (k) {
                return keys.push(k);
            });
            modeData.__key__ = key;
            modeData.__keys__ = keys;
            return data;
        }
        /**
         * 组件保存数据
         * component 组件实例对象
         */

    }, {
        key: 'componentSaveData',
        value: function componentSaveData(component) {
            var mode = this.options.mode;
            var modeData = component.$options[mode];
            if (typeof modeData !== 'function') return false;
            var data = {};
            modeData.__keys__.forEach(function (k) {
                data[k] = component.$data[k];
            });
            this.store[modeData.__key__] = data;
        }
    }, {
        key: 'mixin',
        value: function mixin() {
            var self = this;
            return {
                data: function data() {
                    return self.componentInitData(this);
                },
                destroyed: function destroyed() {
                    self.componentSaveData(this);
                },

                watch: {
                    $route: function $route() {
                        self.componentSaveData(this);
                        _extends(this.$data, self.componentInitData(this));
                    }
                }
            };
        }
    }]);
    return VueRouterData;
}();

var index = function (Vue, option) {
    // history mode
    var history = {
        mode: 'history',
        getKey: function getKey($route) {
            return getHistoryStateKey();
        }
    };
    _extends(history, option);
    Vue.mixin(new VueRouterData(history).mixin());

    // path mode
    var path = {
        mode: 'path',
        getKey: function getKey($route) {
            return $route.path;
        }
    };
    _extends(path, option);
    Vue.mixin(new VueRouterData(path).mixin());
    // url mode
    var url = {
        mode: 'url',
        getKey: function getKey($route) {
            var query = $route.query;

            var getSearch = function getSearch() {
                var arr = [];
                Object.keys(query).forEach(function (k) {
                    return arr.push(k + '=' + query[k]);
                });
                return arr.join('&');
            };
            return $route.path + '?' + getSearch();
        }
    };
    _extends(url, option);
    Vue.mixin(new VueRouterData(url).mixin());
};

module.exports = index;
