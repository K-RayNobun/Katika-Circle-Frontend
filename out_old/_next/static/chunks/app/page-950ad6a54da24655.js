(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[974],{8372:(e,t,n)=>{Promise.resolve().then(n.bind(n,489))},489:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>S});var o,s=n(5155),i=n(2115),r=n(6046),a=n(6041),c=n.n(a),l=function(e){var t=e.condition,n=e.wrapper,o=e.children;return t?n(o):o};function u(){return(u=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e}).apply(this,arguments)}function d(e,t){return(d=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e})(e,t)}var p={TOP:"top",BOTTOM:"bottom"};!function(e){e.STRICT="strict",e.LAX="lax",e.NONE="none"}(o||(o={}));var b={HIDDEN:"hidden",BY_COOKIE_VALUE:"byCookieValue"},h="CookieConsent",m=["children"],f={disableStyles:!1,hideOnAccept:!0,hideOnDecline:!0,location:p.BOTTOM,visible:b.BY_COOKIE_VALUE,onAccept:function(e){},onDecline:function(){},cookieName:h,cookieValue:"true",declineCookieValue:"false",setDeclineCookie:!0,buttonText:"I understand",declineButtonText:"I decline",debug:!1,expires:365,containerClasses:"CookieConsent",contentClasses:"",buttonClasses:"",buttonWrapperClasses:"",declineButtonClasses:"",buttonId:"rcc-confirm-button",declineButtonId:"rcc-decline-button",extraCookieOptions:{},disableButtonStyles:!1,enableDeclineButton:!1,flipButtons:!1,sameSite:o.LAX,ButtonComponent:function(e){var t=e.children,n=function(e,t){if(null==e)return{};var n,o,s={},i=Object.keys(e);for(o=0;o<i.length;o++)n=i[o],t.indexOf(n)>=0||(s[n]=e[n]);return s}(e,m);return i.createElement("button",Object.assign({},n),t)},overlay:!1,overlayClasses:"",onOverlayClick:function(){},acceptOnOverlayClick:!1,ariaAcceptLabel:"Accept cookies",ariaDeclineLabel:"Decline cookies",acceptOnScroll:!1,acceptOnScrollPercentage:25,customContentAttributes:{},customContainerAttributes:{},customButtonProps:{},customDeclineButtonProps:{},customButtonWrapperAttributes:{},style:{},buttonStyle:{},declineButtonStyle:{},contentStyle:{},overlayStyle:{}},v={visible:!1,style:{alignItems:"baseline",background:"#353535",color:"white",display:"flex",flexWrap:"wrap",justifyContent:"space-between",left:"0",position:"fixed",width:"100%",zIndex:"999"},buttonStyle:{background:"#ffd42d",border:"0",borderRadius:"0px",boxShadow:"none",color:"black",cursor:"pointer",flex:"0 0 auto",padding:"5px 10px",margin:"15px"},declineButtonStyle:{background:"#c12a2a",border:"0",borderRadius:"0px",boxShadow:"none",color:"#e5e5e5",cursor:"pointer",flex:"0 0 auto",padding:"5px 10px",margin:"15px"},contentStyle:{flex:"1 0 300px",margin:"15px"},overlayStyle:{position:"fixed",left:0,top:0,width:"100%",height:"100%",zIndex:"999",backgroundColor:"rgba(0,0,0,0.3)"}},x=function(e){void 0===e&&(e=h);var t=c().get(e);return void 0===t?c().get(g(e)):t},g=function(e){return e+"-legacy"},y=function(e){function t(){var t;return t=e.apply(this,arguments)||this,t.state=v,t.handleScroll=function(){var e=u({},f,t.props).acceptOnScrollPercentage,n=document.documentElement,o=document.body,s="scrollTop",i="scrollHeight";(n[s]||o[s])/((n[i]||o[i])-n.clientHeight)*100>e&&t.accept(!0)},t.removeScrollListener=function(){t.props.acceptOnScroll&&window.removeEventListener("scroll",t.handleScroll)},t}t.prototype=Object.create(e.prototype),t.prototype.constructor=t,d(t,e);var n=t.prototype;return n.componentDidMount=function(){var e=this.props.debug;(void 0===this.getCookieValue()||e)&&(this.setState({visible:!0}),this.props.acceptOnScroll&&window.addEventListener("scroll",this.handleScroll,{passive:!0}))},n.componentWillUnmount=function(){this.removeScrollListener()},n.accept=function(e){void 0===e&&(e=!1);var t,n=u({},f,this.props),o=n.cookieName,s=n.cookieValue,i=n.hideOnAccept,r=n.onAccept;this.setCookie(o,s),r(null!=(t=e)&&t),i&&(this.setState({visible:!1}),this.removeScrollListener())},n.overlayClick=function(){var e=u({},f,this.props),t=e.acceptOnOverlayClick,n=e.onOverlayClick;t&&this.accept(),n()},n.decline=function(){var e=u({},f,this.props),t=e.cookieName,n=e.declineCookieValue,o=e.hideOnDecline,s=e.onDecline;e.setDeclineCookie&&this.setCookie(t,n),s(),o&&this.setState({visible:!1})},n.setCookie=function(e,t){var n=this.props,s=n.extraCookieOptions,i=n.expires,r=n.sameSite,a=this.props.cookieSecurity;void 0===a&&(a=!window.location||"https:"===window.location.protocol);var l=u({expires:i},s,{sameSite:r,secure:a});r===o.NONE&&c().set(g(e),t,l),c().set(e,t,l)},n.getCookieValue=function(){return x(this.props.cookieName)},n.render=function(){var e=this;switch(this.props.visible){case b.HIDDEN:return null;case b.BY_COOKIE_VALUE:if(!this.state.visible)return null}var t=this.props,n=t.location,o=t.style,s=t.buttonStyle,r=t.declineButtonStyle,a=t.contentStyle,c=t.disableStyles,d=t.buttonText,h=t.declineButtonText,m=t.containerClasses,f=t.contentClasses,v=t.buttonClasses,x=t.buttonWrapperClasses,g=t.declineButtonClasses,y=t.buttonId,C=t.declineButtonId,O=t.disableButtonStyles,k=t.enableDeclineButton,S=t.flipButtons,j=t.ButtonComponent,w=t.overlay,N=t.overlayClasses,B=t.overlayStyle,E=t.ariaAcceptLabel,D=t.ariaDeclineLabel,A=t.customContainerAttributes,I=t.customContentAttributes,P=t.customButtonProps,T=t.customDeclineButtonProps,_=t.customButtonWrapperAttributes,L={},R={},U={},V={},W={};switch(c?(L=Object.assign({},o),R=Object.assign({},s),U=Object.assign({},r),V=Object.assign({},a),W=Object.assign({},B)):(L=Object.assign({},u({},this.state.style,o)),V=Object.assign({},u({},this.state.contentStyle,a)),W=Object.assign({},u({},this.state.overlayStyle,B)),O?(R=Object.assign({},s),U=Object.assign({},r)):(R=Object.assign({},u({},this.state.buttonStyle,s)),U=Object.assign({},u({},this.state.declineButtonStyle,r)))),n){case p.TOP:L.top="0";break;case p.BOTTOM:L.bottom="0"}var z=[];return k&&z.push(i.createElement(j,Object.assign({key:"declineButton",style:U,className:g,id:C,"aria-label":D,onClick:function(){e.decline()}},T),h)),z.push(i.createElement(j,Object.assign({key:"acceptButton",style:R,className:v,id:y,"aria-label":E,onClick:function(){e.accept()}},P),d)),S&&z.reverse(),i.createElement(l,{condition:w,wrapper:function(t){return i.createElement("div",{style:W,className:N,onClick:function(){e.overlayClick()}},t)}},i.createElement("div",Object.assign({className:""+m,style:L},A),i.createElement("div",Object.assign({style:V,className:f},I),this.props.children),i.createElement("div",Object.assign({className:""+x},_),z.map(function(e){return e}))))},t}(i.Component);y.defaultProps=f;var C=n(2651),O=n(734),k=n(5224);let S=()=>{let[e,t]=(0,i.useState)(!1),[n,o]=(0,i.useState)(!1),[a,l]=(0,i.useState)(""),[u,d]=(0,i.useState)(!1),[p,b]=(0,i.useState)(0),h=(0,O.j)(),m=(0,O.G)(e=>e.counter.value),f=async()=>{await c().set("userIp",a,{path:"/"}),d(!0)},v=async()=>{let e=await C.A.get("https://api.ipify.org/?format=json");await l(e.data.ip)};(0,i.useEffect)(()=>{let e=c().get("userIp");e?(l(e),d(!0),console.log("Cookie is: ",e)):v()},[l]);let x=(0,r.useRouter)();return(0,i.useEffect)(()=>{let e=setTimeout(()=>{t(!0)},500);return()=>clearTimeout(e)},[]),(0,s.jsxs)("div",{className:"min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center p-4",children:[(0,s.jsxs)("h5",{className:"text-4xl font-bold tet-center my-6",children:["Counter: ",m]}),(0,s.jsxs)("div",{className:"flex gap-4 mt-4",children:[(0,s.jsx)("button",{onClick:()=>h((0,k.GV)()),className:"px-4 py-2 bg-blue-500 text-white rounded",children:"Increment"}),(0,s.jsx)("button",{onClick:()=>h((0,k.Kt)()),className:"px-4 py-2 bg-red-500 text-white rounded",children:"Decrement"}),(0,s.jsxs)("div",{className:"mt-4 flex items-center gap-2",children:[(0,s.jsx)("input",{type:"number",value:p,onChange:e=>b(Number(e.target.value)),className:"border px-2 py-1 rounded w-20 text-center"}),(0,s.jsxs)("button",{onClick:()=>h((0,k.P4)(p)),className:"px-4 py-2 bg-green-500 text-white rounded",children:["Increment by ",p]})]})]}),u?(0,s.jsxs)("div",{children:[(0,s.jsx)("div",{className:"w-full max-w-2xl bg-blue-500 text-white p-4 rounded-lg mb-8 transition-all duration-700 ease-in-out transform ".concat(e?"translate-y-0 opacity-100":"-translate-y-10 opacity-0"),children:(0,s.jsx)("p",{className:"text-center",children:"\uD83D\uDCB1 Taux de change actuel : 1 EUR = 1.10 USD"})}),(0,s.jsxs)("div",{className:"w-full max-w-2xl space-y-6",children:[(0,s.jsxs)("div",{className:"bg-white p-6 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-xl",style:{animation:"slideUpFadeIn 0.8s ease-in-out"},children:[(0,s.jsx)("h2",{className:"text-xl font-bold text-blue-800",children:"Cashback"}),(0,s.jsx)("p",{className:"text-gray-600",children:"Gagnez jusqu'\xe0 5% de cashback sur vos transactions."})]}),(0,s.jsxs)("div",{className:"bg-white p-6 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-xl",style:{animation:"slideUpFadeIn 1s ease-in-out"},children:[(0,s.jsx)("h2",{className:"text-xl font-bold text-purple-800",children:"Bonus de Parrainage"}),(0,s.jsx)("p",{className:"text-gray-600",children:"Parrainez un ami et obtenez un bonus de 10€."})]})]}),(0,s.jsx)("button",{onClick:()=>{o(!0),setTimeout(()=>{console.log("Navigating to the next screen...")},300),o(!1),x.push("/tranzak")},className:"mt-8 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg shadow-md transition-all duration-300 ease-in-out ".concat(n?"animate-dance":"active:animate-dance hover:shadow-lg hover:from-blue-700 hover:to-purple-700"),children:"Envoyer de l'argent"})]}):a.length>=1&&(0,s.jsx)(y,{debug:!0,onAccept:()=>f(),style:{backgroundColor:"#4e0a8e",color:"white",fontSize:"13px"},buttonText:"Accept Cookies",buttonStyle:{color:"#4e0a8e",backgroundColor:"#fff",borderRadius:"30px",padding:"12px 20px",fontWeight:"bolder"},contentStyle:{fontWeight:"medium",fontSize:16,padding:"15px 50px"},expires:150,children:"We use cookies to ensure you have the best browsing experience on our website."})]})}},5224:(e,t,n)=>{"use strict";n.d(t,{Ay:()=>a,GV:()=>s,Kt:()=>i,P4:()=>r});let o=(0,n(9442).Z0)({name:"counter",initialState:{value:10},reducers:{increment:e=>{e.value+=1},decrement:e=>{e.value-=1},incrementByAmount:(e,t)=>{e.value+=t.payload}}}),{increment:s,decrement:i,incrementByAmount:r}=o.actions,a=o.reducer},734:(e,t,n)=>{"use strict";n.d(t,{G:()=>i,j:()=>s});var o=n(3391);let s=o.wA,i=o.d4},6041:(e,t,n)=>{var o,s;!function(i){void 0!==(s="function"==typeof(o=i)?o.call(t,n,t,e):o)&&(e.exports=s),e.exports=i()}(function(){function e(){for(var e=0,t={};e<arguments.length;e++){var n=arguments[e];for(var o in n)t[o]=n[o]}return t}function t(e){return e.replace(/(%[0-9A-Z]{2})+/g,decodeURIComponent)}return function n(o){function s(){}function i(t,n,i){if("undefined"!=typeof document){"number"==typeof(i=e({path:"/"},s.defaults,i)).expires&&(i.expires=new Date(new Date*1+864e5*i.expires)),i.expires=i.expires?i.expires.toUTCString():"";try{var r=JSON.stringify(n);/^[\{\[]/.test(r)&&(n=r)}catch(e){}n=o.write?o.write(n,t):encodeURIComponent(String(n)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),t=encodeURIComponent(String(t)).replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent).replace(/[\(\)]/g,escape);var a="";for(var c in i)i[c]&&(a+="; "+c,!0!==i[c]&&(a+="="+i[c].split(";")[0]));return document.cookie=t+"="+n+a}}function r(e,n){if("undefined"!=typeof document){for(var s={},i=document.cookie?document.cookie.split("; "):[],r=0;r<i.length;r++){var a=i[r].split("="),c=a.slice(1).join("=");n||'"'!==c.charAt(0)||(c=c.slice(1,-1));try{var l=t(a[0]);if(c=(o.read||o)(c,l)||t(c),n)try{c=JSON.parse(c)}catch(e){}if(s[l]=c,e===l)break}catch(e){}}return e?s[e]:s}}return s.set=i,s.get=function(e){return r(e,!1)},s.getJSON=function(e){return r(e,!0)},s.remove=function(t,n){i(t,"",e(n,{expires:-1}))},s.defaults={},s.withConverter=n,s}(function(){})})},6046:(e,t,n)=>{"use strict";var o=n(6658);n.o(o,"usePathname")&&n.d(t,{usePathname:function(){return o.usePathname}}),n.o(o,"useRouter")&&n.d(t,{useRouter:function(){return o.useRouter}}),n.o(o,"useSearchParams")&&n.d(t,{useSearchParams:function(){return o.useSearchParams}})}},e=>{var t=t=>e(e.s=t);e.O(0,[391,651,442,441,517,358],()=>t(8372)),_N_E=e.O()}]);