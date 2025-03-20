"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[340],{429:e=>{var t,r="object"==typeof Reflect?Reflect:null,n=r&&"function"==typeof r.apply?r.apply:function(e,t,r){return Function.prototype.apply.call(e,t,r)};t=r&&"function"==typeof r.ownKeys?r.ownKeys:Object.getOwnPropertySymbols?function(e){return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e))}:function(e){return Object.getOwnPropertyNames(e)};var i=Number.isNaN||function(e){return e!=e};function o(){o.init.call(this)}e.exports=o,e.exports.once=function(e,t){return new Promise(function(r,n){var i;function o(r){e.removeListener(t,a),n(r)}function a(){"function"==typeof e.removeListener&&e.removeListener("error",o),r([].slice.call(arguments))}y(e,t,a,{once:!0}),"error"!==t&&(i={once:!0},"function"==typeof e.on&&y(e,"error",o,i))})},o.EventEmitter=o,o.prototype._events=void 0,o.prototype._eventsCount=0,o.prototype._maxListeners=void 0;var a=10;function s(e){if("function"!=typeof e)throw TypeError('The "listener" argument must be of type Function. Received type '+typeof e)}function l(e){return void 0===e._maxListeners?o.defaultMaxListeners:e._maxListeners}function c(e,t,r,n){if(s(r),void 0===(o=e._events)?(o=e._events=Object.create(null),e._eventsCount=0):(void 0!==o.newListener&&(e.emit("newListener",t,r.listener?r.listener:r),o=e._events),a=o[t]),void 0===a)a=o[t]=r,++e._eventsCount;else if("function"==typeof a?a=o[t]=n?[r,a]:[a,r]:n?a.unshift(r):a.push(r),(i=l(e))>0&&a.length>i&&!a.warned){a.warned=!0;var i,o,a,c=Error("Possible EventEmitter memory leak detected. "+a.length+" "+String(t)+" listeners added. Use emitter.setMaxListeners() to increase limit");c.name="MaxListenersExceededWarning",c.emitter=e,c.type=t,c.count=a.length,console&&console.warn&&console.warn(c)}return e}function u(){if(!this.fired)return(this.target.removeListener(this.type,this.wrapFn),this.fired=!0,0==arguments.length)?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function p(e,t,r){var n={fired:!1,wrapFn:void 0,target:e,type:t,listener:r},i=u.bind(n);return i.listener=r,n.wrapFn=i,i}function f(e,t,r){var n=e._events;if(void 0===n)return[];var i=n[t];return void 0===i?[]:"function"==typeof i?r?[i.listener||i]:[i]:r?function(e){for(var t=Array(e.length),r=0;r<t.length;++r)t[r]=e[r].listener||e[r];return t}(i):m(i,i.length)}function d(e){var t=this._events;if(void 0!==t){var r=t[e];if("function"==typeof r)return 1;if(void 0!==r)return r.length}return 0}function m(e,t){for(var r=Array(t),n=0;n<t;++n)r[n]=e[n];return r}function y(e,t,r,n){if("function"==typeof e.on)n.once?e.once(t,r):e.on(t,r);else if("function"==typeof e.addEventListener)e.addEventListener(t,function i(o){n.once&&e.removeEventListener(t,i),r(o)});else throw TypeError('The "emitter" argument must be of type EventEmitter. Received type '+typeof e)}Object.defineProperty(o,"defaultMaxListeners",{enumerable:!0,get:function(){return a},set:function(e){if("number"!=typeof e||e<0||i(e))throw RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+e+".");a=e}}),o.init=function(){(void 0===this._events||this._events===Object.getPrototypeOf(this)._events)&&(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},o.prototype.setMaxListeners=function(e){if("number"!=typeof e||e<0||i(e))throw RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+e+".");return this._maxListeners=e,this},o.prototype.getMaxListeners=function(){return l(this)},o.prototype.emit=function(e){for(var t=[],r=1;r<arguments.length;r++)t.push(arguments[r]);var i="error"===e,o=this._events;if(void 0!==o)i=i&&void 0===o.error;else if(!i)return!1;if(i){if(t.length>0&&(a=t[0]),a instanceof Error)throw a;var a,s=Error("Unhandled error."+(a?" ("+a.message+")":""));throw s.context=a,s}var l=o[e];if(void 0===l)return!1;if("function"==typeof l)n(l,this,t);else for(var c=l.length,u=m(l,c),r=0;r<c;++r)n(u[r],this,t);return!0},o.prototype.addListener=function(e,t){return c(this,e,t,!1)},o.prototype.on=o.prototype.addListener,o.prototype.prependListener=function(e,t){return c(this,e,t,!0)},o.prototype.once=function(e,t){return s(t),this.on(e,p(this,e,t)),this},o.prototype.prependOnceListener=function(e,t){return s(t),this.prependListener(e,p(this,e,t)),this},o.prototype.removeListener=function(e,t){var r,n,i,o,a;if(s(t),void 0===(n=this._events)||void 0===(r=n[e]))return this;if(r===t||r.listener===t)0==--this._eventsCount?this._events=Object.create(null):(delete n[e],n.removeListener&&this.emit("removeListener",e,r.listener||t));else if("function"!=typeof r){for(i=-1,o=r.length-1;o>=0;o--)if(r[o]===t||r[o].listener===t){a=r[o].listener,i=o;break}if(i<0)return this;0===i?r.shift():function(e,t){for(;t+1<e.length;t++)e[t]=e[t+1];e.pop()}(r,i),1===r.length&&(n[e]=r[0]),void 0!==n.removeListener&&this.emit("removeListener",e,a||t)}return this},o.prototype.off=o.prototype.removeListener,o.prototype.removeAllListeners=function(e){var t,r,n;if(void 0===(r=this._events))return this;if(void 0===r.removeListener)return 0==arguments.length?(this._events=Object.create(null),this._eventsCount=0):void 0!==r[e]&&(0==--this._eventsCount?this._events=Object.create(null):delete r[e]),this;if(0==arguments.length){var i,o=Object.keys(r);for(n=0;n<o.length;++n)"removeListener"!==(i=o[n])&&this.removeAllListeners(i);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if("function"==typeof(t=r[e]))this.removeListener(e,t);else if(void 0!==t)for(n=t.length-1;n>=0;n--)this.removeListener(e,t[n]);return this},o.prototype.listeners=function(e){return f(this,e,!0)},o.prototype.rawListeners=function(e){return f(this,e,!1)},o.listenerCount=function(e,t){return"function"==typeof e.listenerCount?e.listenerCount(t):d.call(e,t)},o.prototype.listenerCount=d,o.prototype.eventNames=function(){return this._eventsCount>0?t(this._events):[]}},5565:(e,t,r)=>{r.d(t,{default:()=>i.a});var n=r(4146),i=r.n(n)},6046:(e,t,r)=>{var n=r(6658);r.o(n,"usePathname")&&r.d(t,{usePathname:function(){return n.usePathname}}),r.o(n,"useRouter")&&r.d(t,{useRouter:function(){return n.useRouter}}),r.o(n,"useSearchParams")&&r.d(t,{useSearchParams:function(){return n.useSearchParams}})},4146:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{default:function(){return l},getImageProps:function(){return s}});let n=r(306),i=r(666),o=r(7970),a=n._(r(5514));function s(e){let{props:t}=(0,i.getImgProps)(e,{defaultLoader:a.default,imgConf:{deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[16,32,48,64,96,128,256,384],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!1}});for(let[e,r]of Object.entries(t))void 0===r&&delete t[e];return{props:t}}let l=o.Image},585:(e,t,r)=>{r.d(t,{d:()=>D});var n={};r.r(n),r.d(n,{exclude:()=>A,extract:()=>E,parse:()=>v,parseUrl:()=>b,pick:()=>_,stringify:()=>g,stringifyUrl:()=>R});var i=r(429);let o="%[a-f0-9]{2}",a=RegExp("("+o+")|([^%]+?)","gi"),s=RegExp("("+o+")+","gi");function l(e,t){if(!("string"==typeof e&&"string"==typeof t))throw TypeError("Expected the arguments to be of type `string`");if(""===e||""===t)return[];let r=e.indexOf(t);return -1===r?[]:[e.slice(0,r),e.slice(r+t.length)]}let c=e=>null==e,u=e=>encodeURIComponent(e).replaceAll(/[!'()*]/g,e=>`%${e.charCodeAt(0).toString(16).toUpperCase()}`),p=Symbol("encodeFragmentIdentifier");function f(e){if("string"!=typeof e||1!==e.length)throw TypeError("arrayFormatSeparator must be single character string")}function d(e,t){return t.encode?t.strict?u(e):encodeURIComponent(e):e}function m(e,t){return t.decode?function(e){if("string"!=typeof e)throw TypeError("Expected `encodedURI` to be of type `string`, got `"+typeof e+"`");try{return decodeURIComponent(e)}catch{return function(e){let t={"%FE%FF":"��","%FF%FE":"��"},r=s.exec(e);for(;r;){try{t[r[0]]=decodeURIComponent(r[0])}catch{let e=function(e){try{return decodeURIComponent(e)}catch{let t=e.match(a)||[];for(let r=1;r<t.length;r++)t=(e=(function e(t,r){try{return[decodeURIComponent(t.join(""))]}catch{}if(1===t.length)return t;r=r||1;let n=t.slice(0,r),i=t.slice(r);return Array.prototype.concat.call([],e(n),e(i))})(t,r).join("")).match(a)||[];return e}}(r[0]);e!==r[0]&&(t[r[0]]=e)}r=s.exec(e)}for(let r of(t["%C2"]="�",Object.keys(t)))e=e.replace(RegExp(r,"g"),t[r]);return e}(e)}}(e):e}function y(e){let t=e.indexOf("#");return -1!==t&&(e=e.slice(0,t)),e}function h(e,t,r){return"string"===r&&"string"==typeof e?e:"function"==typeof r&&"string"==typeof e?r(e):t.parseBooleans&&null!==e&&("true"===e.toLowerCase()||"false"===e.toLowerCase())?"true"===e.toLowerCase():("number"!==r||Number.isNaN(Number(e))||"string"!=typeof e||""===e.trim())&&(!t.parseNumbers||Number.isNaN(Number(e))||"string"!=typeof e||""===e.trim())?e:Number(e)}function E(e){let t=(e=y(e)).indexOf("?");return -1===t?"":e.slice(t+1)}function v(e,t){f((t={decode:!0,sort:!0,arrayFormat:"none",arrayFormatSeparator:",",parseNumbers:!1,parseBooleans:!1,types:Object.create(null),...t}).arrayFormatSeparator);let r=function(e){let t;switch(e.arrayFormat){case"index":return(e,r,n)=>{if(t=/\[(\d*)]$/.exec(e),e=e.replace(/\[\d*]$/,""),!t){n[e]=r;return}void 0===n[e]&&(n[e]={}),n[e][t[1]]=r};case"bracket":return(e,r,n)=>{if(t=/(\[])$/.exec(e),e=e.replace(/\[]$/,""),!t){n[e]=r;return}if(void 0===n[e]){n[e]=[r];return}n[e]=[...n[e],r]};case"colon-list-separator":return(e,r,n)=>{if(t=/(:list)$/.exec(e),e=e.replace(/:list$/,""),!t){n[e]=r;return}if(void 0===n[e]){n[e]=[r];return}n[e]=[...n[e],r]};case"comma":case"separator":return(t,r,n)=>{let i="string"==typeof r&&r.includes(e.arrayFormatSeparator),o="string"==typeof r&&!i&&m(r,e).includes(e.arrayFormatSeparator);r=o?m(r,e):r;let a=i||o?r.split(e.arrayFormatSeparator).map(t=>m(t,e)):null===r?r:m(r,e);n[t]=a};case"bracket-separator":return(t,r,n)=>{let i=/(\[])$/.test(t);if(t=t.replace(/\[]$/,""),!i){n[t]=r?m(r,e):r;return}let o=null===r?[]:m(r,e).split(e.arrayFormatSeparator);if(void 0===n[t]){n[t]=o;return}n[t]=[...n[t],...o]};default:return(e,t,r)=>{if(void 0===r[e]){r[e]=t;return}r[e]=[...[r[e]].flat(),t]}}}(t),n=Object.create(null);if("string"!=typeof e||!(e=e.trim().replace(/^[?#&]/,"")))return n;for(let i of e.split("&")){if(""===i)continue;let e=t.decode?i.replaceAll("+"," "):i,[o,a]=l(e,"=");void 0===o&&(o=e),a=void 0===a?null:["comma","separator","bracket-separator"].includes(t.arrayFormat)?a:m(a,t),r(m(o,t),a,n)}for(let[e,r]of Object.entries(n))if("object"==typeof r&&null!==r&&"string"!==t.types[e])for(let[n,i]of Object.entries(r)){let o=t.types[e]?t.types[e].replace("[]",""):void 0;r[n]=h(i,t,o)}else"object"==typeof r&&null!==r&&"string"===t.types[e]?n[e]=Object.values(r).join(t.arrayFormatSeparator):n[e]=h(r,t,t.types[e]);return!1===t.sort?n:(!0===t.sort?Object.keys(n).sort():Object.keys(n).sort(t.sort)).reduce((e,t)=>{let r=n[t];return e[t]=r&&"object"==typeof r&&!Array.isArray(r)?function e(t){return Array.isArray(t)?t.sort():"object"==typeof t?e(Object.keys(t)).sort((e,t)=>Number(e)-Number(t)).map(e=>t[e]):t}(r):r,e},Object.create(null))}function g(e,t){if(!e)return"";f((t={encode:!0,strict:!0,arrayFormat:"none",arrayFormatSeparator:",",...t}).arrayFormatSeparator);let r=r=>t.skipNull&&c(e[r])||t.skipEmptyString&&""===e[r],n=function(e){switch(e.arrayFormat){case"index":return t=>(r,n)=>{let i=r.length;return void 0===n||e.skipNull&&null===n||e.skipEmptyString&&""===n?r:null===n?[...r,[d(t,e),"[",i,"]"].join("")]:[...r,[d(t,e),"[",d(i,e),"]=",d(n,e)].join("")]};case"bracket":return t=>(r,n)=>void 0===n||e.skipNull&&null===n||e.skipEmptyString&&""===n?r:null===n?[...r,[d(t,e),"[]"].join("")]:[...r,[d(t,e),"[]=",d(n,e)].join("")];case"colon-list-separator":return t=>(r,n)=>void 0===n||e.skipNull&&null===n||e.skipEmptyString&&""===n?r:null===n?[...r,[d(t,e),":list="].join("")]:[...r,[d(t,e),":list=",d(n,e)].join("")];case"comma":case"separator":case"bracket-separator":{let t="bracket-separator"===e.arrayFormat?"[]=":"=";return r=>(n,i)=>void 0===i||e.skipNull&&null===i||e.skipEmptyString&&""===i?n:(i=null===i?"":i,0===n.length)?[[d(r,e),t,d(i,e)].join("")]:[[n,d(i,e)].join(e.arrayFormatSeparator)]}default:return t=>(r,n)=>void 0===n||e.skipNull&&null===n||e.skipEmptyString&&""===n?r:null===n?[...r,d(t,e)]:[...r,[d(t,e),"=",d(n,e)].join("")]}}(t),i={};for(let[t,n]of Object.entries(e))r(t)||(i[t]=n);let o=Object.keys(i);return!1!==t.sort&&o.sort(t.sort),o.map(r=>{let i=e[r];return void 0===i?"":null===i?d(r,t):Array.isArray(i)?0===i.length&&"bracket-separator"===t.arrayFormat?d(r,t)+"[]":i.reduce(n(r),[]).join("&"):d(r,t)+"="+d(i,t)}).filter(e=>e.length>0).join("&")}function b(e,t){t={decode:!0,...t};let[r,n]=l(e,"#");return void 0===r&&(r=e),{url:r?.split("?")?.[0]??"",query:v(E(e),t),...t&&t.parseFragmentIdentifier&&n?{fragmentIdentifier:m(n,t)}:{}}}function R(e,t){t={encode:!0,strict:!0,[p]:!0,...t};let r=y(e.url).split("?")[0]||"",n=g({...v(E(e.url),{sort:!1}),...e.query},t);n&&=`?${n}`;let i=function(e){let t="",r=e.indexOf("#");return -1!==r&&(t=e.slice(r)),t}(e.url);if("string"==typeof e.fragmentIdentifier){let n=new URL(r);n.hash=e.fragmentIdentifier,i=t[p]?n.hash:`#${e.fragmentIdentifier}`}return`${r}${n}${i}`}function _(e,t,r){let{url:n,query:i,fragmentIdentifier:o}=b(e,r={parseFragmentIdentifier:!0,[p]:!1,...r});return R({url:n,query:function(e,t){let r={};if(Array.isArray(t))for(let n of t){let t=Object.getOwnPropertyDescriptor(e,n);t?.enumerable&&Object.defineProperty(r,n,t)}else for(let n of Reflect.ownKeys(e)){let i=Object.getOwnPropertyDescriptor(e,n);if(i.enumerable){let o=e[n];t(n,o,e)&&Object.defineProperty(r,n,i)}}return r}(i,t),fragmentIdentifier:o},r)}function A(e,t,r){return _(e,Array.isArray(t)?e=>!t.includes(e):(e,r)=>!t(e,r),r)}var S=r(3524),O=(e=>(e.DEVELOPMENT="DEVELOPMENT",e.STAGING="STAGING",e.PRODUCTION="PRODUCTION",e))(O||{}),N=(e=>(e.TRANSAK_WIDGET_INITIALISED="TRANSAK_WIDGET_INITIALISED",e.TRANSAK_ORDER_CREATED="TRANSAK_ORDER_CREATED",e.TRANSAK_ORDER_SUCCESSFUL="TRANSAK_ORDER_SUCCESSFUL",e.TRANSAK_ORDER_CANCELLED="TRANSAK_ORDER_CANCELLED",e.TRANSAK_ORDER_FAILED="TRANSAK_ORDER_FAILED",e.TRANSAK_WALLET_REDIRECTION="TRANSAK_WALLET_REDIRECTION",e.TRANSAK_WIDGET_CLOSE_REQUEST="TRANSAK_WIDGET_CLOSE_REQUEST",e.TRANSAK_WIDGET_CLOSE="TRANSAK_WIDGET_CLOSE",e.TRANSAK_USER_INFO_RECEIVED="TRANSAK_USER_INFO_RECEIVED",e.TRANSAK_GET_USER_REQUEST="TRANSAK_GET_USER_REQUEST",e.TRANSAK_LOGOUT_USER_REQUEST="TRANSAK_LOGOUT_USER_REQUEST",e))(N||{}),T={DEVELOPMENT:"https://localhost:5005/",STAGING:"https://global-stg.transak.com",PRODUCTION:"https://global.transak.com"},L={name:"@transak/transak-sdk",version:"3.2.0",description:"Transak SDK that allows you to easily integrate fiat on/off ramp",type:"module",types:"lib/index.d.ts",main:"lib/index.cjs",exports:{".":{import:{types:"./lib/index.d.ts",default:"./lib/index.js"},require:{types:"./lib/index.d.cts",default:"./lib/index.cjs"}}},engines:{node:">=18.0.0"},packageManager:"pnpm@10.0.0+sha512.b8fef5494bd3fe4cbd4edabd0745df2ee5be3e4b0b8b08fa643aa3e4c6702ccc0f00d68fa8a8c9858a735a0032485a44990ed2810526c875e416f001b17df12b",files:["lib/**/*"],scripts:{eslint:"eslint . --ext .ts","eslint:fix":"pnpm eslint --fix",build:"tsc && tsup",prepack:"pnpm build",packDev:"pnpm pack"},author:"Transak",license:"ISC",homepage:"https://docs.transak.com/docs/web-integration#transak-sdk-reactvueangularts",repository:{type:"git",url:"https://github.com/Transak/transak-sdk"},dependencies:{events:"^3.3.0",pako:"^2.1.0","query-string":"^9.1.1"},devDependencies:{"@types/events":"^3.0.3","@types/pako":"^2.0.3","@typescript-eslint/eslint-plugin":"^7.18.0","@typescript-eslint/parser":"^7.18.0",eslint:"^8.57.1","eslint-config-airbnb-base":"^15.0.0","eslint-config-airbnb-typescript":"^18.0.0","eslint-config-prettier":"^10.0.1","eslint-plugin-eslint-comments":"^3.2.0","eslint-plugin-import":"^2.31.0","eslint-plugin-no-relative-import-paths":"^1.6.1","eslint-plugin-prettier":"^5.2.3","eslint-plugin-promise":"^7.2.1",prettier:"^3.4.2",tsup:"^8.3.5",typescript:"5.5.4"},keywords:["crypto","cryptocurrency","fiat","on","off","ramp","sdk","ts","js"]};function I(e){let{name:t,version:r}=L,{environment:i="STAGING"}=e,o={sdkName:t,sdkVersion:r},a="";return Object.keys(e).forEach(t=>{if(!["environment","widgetWidth","widgetHeight"].includes(t)){if(["walletAddressesData","userData"].includes(t)){try{o[t]=JSON.stringify(e[t])}catch{}return}if(["nftData","sourceTokenData","cryptoCurrencyData","tokenData"].includes(t)){try{o[t]=btoa(JSON.stringify(e[t]))}catch{}return}if(["calldata"].includes(t)){try{o[t]=btoa(String.fromCharCode.apply(null,S.Ay.deflate(e[t])))}catch{}return}o[t]=e[t]}}),a=n.stringify(o,{arrayFormat:"comma"}),`${T[i]}?${a}`}function C(e){let t=document.createElement("iframe");return Object.assign(t,{id:"transakIframe",allow:"camera;microphone;payment",src:e}),t}var k=`
  <svg id="transakCloseIcon" viewBox="0 0 612 612" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M306,0C136.992,0,0,136.992,0,306s136.992,306,306,306c168.988,0,306-137.012,306-306S475.008,0,306,0z M414.19,387.147
    c7.478,7.478,7.478,19.584,0,27.043c-7.479,7.478-19.584,7.478-27.043,0l-81.032-81.033l-81.588,81.588
    c-7.535,7.516-19.737,7.516-27.253,0c-7.535-7.535-7.535-19.737,0-27.254l81.587-81.587l-81.033-81.033
    c-7.478-7.478-7.478-19.584,0-27.042c7.478-7.478,19.584-7.478,27.042,0l81.033,81.033l82.181-82.18
    c7.535-7.535,19.736-7.535,27.253,0c7.535,7.535,7.535,19.737,0,27.253l-82.181,82.181L414.19,387.147z" />
  </svg>
`,w=new i.EventEmitter,D=class{#e;#t;#r;#n;#i;#o=!1;static ENVIRONMENTS=O;static EVENTS=N;constructor(e){if(!e?.apiKey)throw Error("[Transak SDK] => Please enter your API Key");this.#e=e,this.#i=function(e){return function(t){if(t?.data?.event_id)switch(t.data.event_id){case"TRANSAK_WIDGET_INITIALISED":e.emit("TRANSAK_WIDGET_INITIALISED",{eventName:"TRANSAK_WIDGET_INITIALISED",status:t.data.data});break;case"TRANSAK_ORDER_CREATED":e.emit("TRANSAK_ORDER_CREATED",{eventName:"TRANSAK_ORDER_CREATED",status:t.data.data});break;case"TRANSAK_ORDER_SUCCESSFUL":e.emit("TRANSAK_ORDER_SUCCESSFUL",{eventName:"TRANSAK_ORDER_SUCCESSFUL",status:t.data.data});break;case"TRANSAK_ORDER_CANCELLED":e.emit("TRANSAK_ORDER_CANCELLED",{eventName:"TRANSAK_ORDER_CANCELLED",status:t.data.data});break;case"TRANSAK_ORDER_FAILED":e.emit("TRANSAK_ORDER_FAILED",{eventName:"TRANSAK_ORDER_FAILED",status:t.data.data});break;case"TRANSAK_WALLET_REDIRECTION":e.emit("TRANSAK_WALLET_REDIRECTION",{eventName:"TRANSAK_WALLET_REDIRECTION",status:t.data.data});break;case"TRANSAK_WIDGET_CLOSE":e.emit("TRANSAK_WIDGET_CLOSE",{eventName:"TRANSAK_WIDGET_CLOSE",status:t.data.data});break;case"TRANSAK_USER_INFO_RECEIVED":e.emit("TRANSAK_USER_INFO_RECEIVED",{eventName:"TRANSAK_USER_INFO_RECEIVED",status:t.data.data})}}}(w)}static on=(e,t)=>{"*"===e?Object.keys(N).forEach(e=>{w.on(N[e],t)}):N[e]&&w.on(e,t)};init=()=>{this.#o||(this.#a(),this.#o=!0)};cleanup=()=>{this.#t?.remove(),this.#s(),this.#n?.remove(),this.#o=!1};close=()=>{this.#t?.remove(),this.#r?.remove(),this.#s(),this.#n=void 0,this.#o=!1};getUser=()=>{this.#n?.contentWindow?.postMessage({event_id:"TRANSAK_GET_USER_REQUEST"},"*")};logoutUser=()=>{this.#n?.contentWindow?.postMessage({event_id:"TRANSAK_LOGOUT_USER_REQUEST"},"*")};#a=()=>{if(window.addEventListener("message",this.#i),this.#e.containerId){let{styleElement:e,iframeElement:t}=function(e){let t;let r=((t=document.createElement("style")).innerHTML=`
    #transakIframe{
      width: 100%;
      height: 100%;
      border: none;
    }
  `,document.getElementsByTagName("head")[0]?.appendChild(t),t),n=C(I(e));if(e.containerId){let t=document.getElementById(e.containerId);if(t)t.appendChild(n);else throw Error("[Transak SDK] => Please enter a valid containerId")}return{styleElement:r,iframeElement:n}}(this.#e);this.#t=e,this.#n=t}else{let{styleElement:e,rootElement:t,iframeElement:r}=function(e,t){let r=function(e){let{themeColor:t="1461db",widgetWidth:r="480px",widgetHeight:n="650px"}=e,i=document.createElement("style");return i.innerHTML=`
    #transakRoot {
      z-index: 9997;
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.6);
    }

    #transakModal {
      z-index: 9998;
      position: fixed;
      width: ${r};
      height: calc(${n} - 24px);
      top: 50%;
      left: 50%;
      transform: translate(-50%, calc(-50% - 12px));
      margin-top: 24px;
    }

    #transakCloseIcon {
      z-index: 9999;
      position: absolute;
      width: 36px;
      height: 36px;
      top: -24px;
      right: 0;
      transition: 0.5s;
      color: #${t};
      background: white;
      border-radius: 50%;
    }

    #transakCloseIcon:hover,
    #transakCloseIcon:focus {
      color: white;
      background: #${t};
      cursor: pointer;
    }

    #transakIframe{
      width: 100%;
      height: 100%;
      border: none;
      border-radius: 10px;
      background: white;
    }

    @media screen and (max-width: 600px) {
      #transakModal {
        width: 100%;
        height: calc(100% - 24px);
      }

      #transakIframe{
        border-radius: 10px 10px 0 0;
      }
    }
  `,document.getElementsByTagName("head")[0]?.appendChild(i),i}(e),n=document.createElement("div"),i=document.createElement("div"),o=C(I(e));return Object.assign(i,{id:"transakModal",innerHTML:k}),i.appendChild(o),Object.assign(n,{id:"transakRoot",onclick:()=>t()}),n.appendChild(i),document.getElementsByTagName("body")[0].appendChild(n),document.getElementById("transakCloseIcon")?.addEventListener("click",()=>t()),{styleElement:r,rootElement:n,iframeElement:o}}(this.#e,this.#l);this.#t=e,this.#r=t,this.#n=r}};#l=()=>{this.#n?.contentWindow?.postMessage({event_id:"TRANSAK_WIDGET_CLOSE_REQUEST"},"*")};#s=()=>{w.removeAllListeners(),window.removeEventListener("message",this.#i)}}},3435:(e,t,r)=>{r.d(t,{k5:()=>u});var n=r(2115),i={color:void 0,size:void 0,className:void 0,style:void 0,attr:void 0},o=n.createContext&&n.createContext(i),a=["attr","size","title"];function s(){return(s=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e}).apply(this,arguments)}function l(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,n)}return r}function c(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?l(Object(r),!0).forEach(function(t){var n,i;n=t,i=r[t],(n=function(e){var t=function(e,t){if("object"!=typeof e||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var n=r.call(e,t||"default");if("object"!=typeof n)return n;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:t+""}(n))in e?Object.defineProperty(e,n,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[n]=i}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):l(Object(r)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}function u(e){return t=>n.createElement(p,s({attr:c({},e.attr)},t),function e(t){return t&&t.map((t,r)=>n.createElement(t.tag,c({key:r},t.attr),e(t.child)))}(e.child))}function p(e){var t=t=>{var r,{attr:i,size:o,title:l}=e,u=function(e,t){if(null==e)return{};var r,n,i=function(e,t){if(null==e)return{};var r={};for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){if(t.indexOf(n)>=0)continue;r[n]=e[n]}return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],!(t.indexOf(r)>=0)&&Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}(e,a),p=o||t.size||"1em";return t.className&&(r=t.className),e.className&&(r=(r?r+" ":"")+e.className),n.createElement("svg",s({stroke:"currentColor",fill:"currentColor",strokeWidth:"0"},t.attr,i,u,{className:r,style:c(c({color:e.color||t.color},t.style),e.style),height:p,width:p,xmlns:"http://www.w3.org/2000/svg"}),l&&n.createElement("title",null,l),e.children)};return void 0!==o?n.createElement(o.Consumer,null,e=>t(e)):t(i)}}}]);