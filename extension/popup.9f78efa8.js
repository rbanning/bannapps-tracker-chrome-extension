parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"xgwM":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.__assign=void 0,exports.__asyncDelegator=d,exports.__asyncGenerator=v,exports.__asyncValues=b,exports.__await=h,exports.__awaiter=u,exports.__classPrivateFieldGet=O,exports.__classPrivateFieldSet=g,exports.__createBinding=f,exports.__decorate=o,exports.__exportStar=l,exports.__extends=e,exports.__generator=c,exports.__importDefault=m,exports.__importStar=x,exports.__makeTemplateObject=w,exports.__metadata=i,exports.__param=a,exports.__read=p,exports.__rest=n,exports.__spread=y,exports.__spreadArrays=_,exports.__values=s;var t=function(e,r){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])})(e,r)};function e(e,r){function n(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}var r=function(){return exports.__assign=r=Object.assign||function(t){for(var e,r=1,n=arguments.length;r<n;r++)for(var o in e=arguments[r])Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o]);return t},r.apply(this,arguments)};function n(t,e){var r={};for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&e.indexOf(n)<0&&(r[n]=t[n]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(n=Object.getOwnPropertySymbols(t);o<n.length;o++)e.indexOf(n[o])<0&&Object.prototype.propertyIsEnumerable.call(t,n[o])&&(r[n[o]]=t[n[o]])}return r}function o(t,e,r,n){var o,a=arguments.length,i=a<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(t,e,r,n);else for(var u=t.length-1;u>=0;u--)(o=t[u])&&(i=(a<3?o(i):a>3?o(e,r,i):o(e,r))||i);return a>3&&i&&Object.defineProperty(e,r,i),i}function a(t,e){return function(r,n){e(r,n,t)}}function i(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)}function u(t,e,r,n){return new(r||(r=Promise))(function(o,a){function i(t){try{c(n.next(t))}catch(e){a(e)}}function u(t){try{c(n.throw(t))}catch(e){a(e)}}function c(t){var e;t.done?o(t.value):(e=t.value,e instanceof r?e:new r(function(t){t(e)})).then(i,u)}c((n=n.apply(t,e||[])).next())})}function c(t,e){var r,n,o,a,i={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return a={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function u(a){return function(u){return function(a){if(r)throw new TypeError("Generator is already executing.");for(;i;)try{if(r=1,n&&(o=2&a[0]?n.return:a[0]?n.throw||((o=n.return)&&o.call(n),0):n.next)&&!(o=o.call(n,a[1])).done)return o;switch(n=0,o&&(a=[2&a[0],o.value]),a[0]){case 0:case 1:o=a;break;case 4:return i.label++,{value:a[1],done:!1};case 5:i.label++,n=a[1],a=[0];continue;case 7:a=i.ops.pop(),i.trys.pop();continue;default:if(!(o=(o=i.trys).length>0&&o[o.length-1])&&(6===a[0]||2===a[0])){i=0;continue}if(3===a[0]&&(!o||a[1]>o[0]&&a[1]<o[3])){i.label=a[1];break}if(6===a[0]&&i.label<o[1]){i.label=o[1],o=a;break}if(o&&i.label<o[2]){i.label=o[2],i.ops.push(a);break}o[2]&&i.ops.pop(),i.trys.pop();continue}a=e.call(t,i)}catch(u){a=[6,u],n=0}finally{r=o=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,u])}}}function f(t,e,r,n){void 0===n&&(n=r),t[n]=e[r]}function l(t,e){for(var r in t)"default"===r||e.hasOwnProperty(r)||(e[r]=t[r])}function s(t){var e="function"==typeof Symbol&&Symbol.iterator,r=e&&t[e],n=0;if(r)return r.call(t);if(t&&"number"==typeof t.length)return{next:function(){return t&&n>=t.length&&(t=void 0),{value:t&&t[n++],done:!t}}};throw new TypeError(e?"Object is not iterable.":"Symbol.iterator is not defined.")}function p(t,e){var r="function"==typeof Symbol&&t[Symbol.iterator];if(!r)return t;var n,o,a=r.call(t),i=[];try{for(;(void 0===e||e-- >0)&&!(n=a.next()).done;)i.push(n.value)}catch(u){o={error:u}}finally{try{n&&!n.done&&(r=a.return)&&r.call(a)}finally{if(o)throw o.error}}return i}function y(){for(var t=[],e=0;e<arguments.length;e++)t=t.concat(p(arguments[e]));return t}function _(){for(var t=0,e=0,r=arguments.length;e<r;e++)t+=arguments[e].length;var n=Array(t),o=0;for(e=0;e<r;e++)for(var a=arguments[e],i=0,u=a.length;i<u;i++,o++)n[o]=a[i];return n}function h(t){return this instanceof h?(this.v=t,this):new h(t)}function v(t,e,r){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var n,o=r.apply(t,e||[]),a=[];return n={},i("next"),i("throw"),i("return"),n[Symbol.asyncIterator]=function(){return this},n;function i(t){o[t]&&(n[t]=function(e){return new Promise(function(r,n){a.push([t,e,r,n])>1||u(t,e)})})}function u(t,e){try{(r=o[t](e)).value instanceof h?Promise.resolve(r.value.v).then(c,f):l(a[0][2],r)}catch(n){l(a[0][3],n)}var r}function c(t){u("next",t)}function f(t){u("throw",t)}function l(t,e){t(e),a.shift(),a.length&&u(a[0][0],a[0][1])}}function d(t){var e,r;return e={},n("next"),n("throw",function(t){throw t}),n("return"),e[Symbol.iterator]=function(){return this},e;function n(n,o){e[n]=t[n]?function(e){return(r=!r)?{value:h(t[n](e)),done:"return"===n}:o?o(e):e}:o}}function b(t){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var e,r=t[Symbol.asyncIterator];return r?r.call(t):(t="function"==typeof s?s(t):t[Symbol.iterator](),e={},n("next"),n("throw"),n("return"),e[Symbol.asyncIterator]=function(){return this},e);function n(r){e[r]=t[r]&&function(e){return new Promise(function(n,o){(function(t,e,r,n){Promise.resolve(n).then(function(e){t({value:e,done:r})},e)})(n,o,(e=t[r](e)).done,e.value)})}}}function w(t,e){return Object.defineProperty?Object.defineProperty(t,"raw",{value:e}):t.raw=e,t}function x(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}function m(t){return t&&t.__esModule?t:{default:t}}function O(t,e){if(!e.has(t))throw new TypeError("attempted to get private field on non-instance");return e.get(t)}function g(t,e,r){if(!e.has(t))throw new TypeError("attempted to set private field on non-instance");return e.set(t,r),r}exports.__assign=r;
},{}],"bONP":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.PopupComponent=void 0;var e=require("tslib");class o{run(){document.addEventListener("DOMContentLoaded",()=>(0,e.__awaiter)(this,void 0,void 0,function*(){const e=yield this.SayHello("Rob");console.log("DEBUG: say hello",e)}))}SayHello(o="Jane"){return(0,e.__awaiter)(this,void 0,void 0,function*(){return new Promise((e,t)=>{window.setTimeout(()=>{e(`Hello ${o||"unknown"}!  Glad you made it PAL`)},2e3)})})}}exports.PopupComponent=o;const t=new o;t.run();
},{"tslib":"xgwM"}]},{},["bONP"], null)