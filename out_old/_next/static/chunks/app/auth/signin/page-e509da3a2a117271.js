(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[680],{7944:(e,a,r)=>{Promise.resolve().then(r.bind(r,4034))},4034:(e,a,r)=>{"use strict";r.r(a),r.d(a,{default:()=>h});var s=r(5155),t=r(2115),l=r(5565),o=r(2950),n=r(6046),i=r(4241),d=r(8173),c=r.n(d),p=r(2651),u=r(734),m=r(5725);let h=()=>{let e="appearance-none flex-1 w-full h-[44px] border-2 gap-[8px] border-gray_dark/60 py-[10px] px-[14px] rounded-[8px] text-primary_text focus:border-primary focus:border-2 focus:outline-none",[a,r]=(0,t.useState)(!1),[d,h]=(0,t.useState)(null),[f,x]=(0,t.useState)(""),g=(0,u.j)(),y=(0,t.useRef)(""),b=(0,n.useRouter)(),k=(0,n.useSearchParams)(),[w,v]=(0,t.useState)({email:"",password:""}),j=(0,t.useRef)(null),C=()=>{r(e=>!e)},N=e=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e),T=e=>e.length>=6,I=async()=>{console.log("Getting the verified user data");let e=await p.A.get("https://blank-lynde-fitzgerald-ef8fba55.koyeb.app/auth/account/profile",{headers:{Authorization:"Bearer ".concat(y.current),"Content-Type":"application/json"}});console.log("The User Data Is: ",e.data.data),g((0,m.z0)(e.data.data.referral.referralCode)),g((0,m.Mp)(e.data.data.wallet.address)),g((0,m.kg)({name:e.data.data.name,surname:e.data.data.sname,email:e.data.data.email,country:e.data.data.countryCode,referralCode:e.data.data.referral.referralCode})),g((0,m.FH)(!0))},z=async e=>{e.preventDefault();let a=new FormData(j.current),r=a.get("email"),s=a.get("password");if(!N(r)){x(e=>e+" email"),console.log("Email => ",r),h("Please enter a valid email address.");return}if(!T(s)){x(e=>e+" password"),console.log("Password is => ",s),h("Password is invalid.");return}console.log("Processing submission"),h(null),x("");try{let e=await p.A.post("https://blank-lynde-fitzgerald-ef8fba55.koyeb.app/auth/account/login",{email:r,pwd:s},{headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});console.log("The token is ",e.data.data["access-token"]),y.current=e.data.data["access-token"],g((0,i.Bb)({token:e.data.data.token,expiresIn:3e5})),I()}catch(e){var t;(null===(t=e.response)||void 0===t?void 0:t.status)===500&&(console.error("Error on precessing login:",e),h("Invalid email or password"),x("email & password"))}b.push("/user/home")};(0,t.useEffect)(()=>{let e=k.get("email"),a=k.get("password");e&&a&&v({email:e,password:a})},[k]);let A=e=>{e.preventDefault();let{name:a,value:r}=e.target;v({...w,[a]:r})};return(0,s.jsxs)("div",{className:"flex flex-1 flex-col justify-center flex-1 px-[4%] sm:px-[10%] lg:px-[40px] pt-[32px] ",children:[(0,s.jsx)("div",{children:(0,s.jsxs)("div",{className:"flex flex-col items-center text-center",children:[(0,s.jsx)("h3",{className:"font-bold mt-2 text-[28px] text-purple-900 leading-12",children:"Content de vous revoir"}),(0,s.jsx)("h5",{className:"text-[17px]",children:"Lorem ipsum dolor sit amet, consectetur adipisicing elit."})]})}),(0,s.jsxs)("form",{ref:j,onSubmit:z,className:"w-full mt-6 space-y-[16px]",children:[(0,s.jsx)("input",{type:"text",name:"email",onChange:A,className:"".concat(e," ").concat(f.includes("email")?"border-2 border-red":""),placeholder:"Email"}),(0,s.jsxs)("div",{className:"relative",children:[(0,s.jsx)("input",{name:"password",type:a?"text":"password",onChange:A,className:"".concat(e," ").concat(f.includes("password")?"border-2 border-red":""),placeholder:"Mot de passe"}),a?(0,s.jsx)(o.ZT8,{onClick:C,className:"absolute top-[12px] right-[12px] size-[20px] text-gray_dark/60"}):(0,s.jsx)(o.Fnz,{onClick:C,className:"absolute top-[12px] right-[12px] size-[20px] text-gray_dark/60"})]}),(0,s.jsx)("div",{children:d&&(0,s.jsx)("h4",{className:"text-red font-bold text-center text-sm h-min",children:d})}),(0,s.jsx)("button",{type:"submit",className:"mt-6 bg-primary hover:bg-primary_dark py-[10px] rounded-[8px] text-white w-full",children:(0,s.jsx)("h6",{className:"text-center font-bold",children:"Connectez vous"})}),(0,s.jsx)("h4",{className:"font-bold text-center leading-[12px]",children:"Ou"}),(0,s.jsxs)("div",{className:"bg-white border border-gray_dark/60 flex justify-center gap-[8px] py-[10px] rounded-[8px] w-full",children:[(0,s.jsx)(l.default,{src:"/auth/googlelogo.png",alt:"",width:25,height:25,className:"size-[25px]"}),(0,s.jsx)("h6",{className:"text-center font-bold",children:"Continuer avec Google"})]})]}),(0,s.jsxs)("h4",{className:"text-center text-[14px] sm:text-[16px] leading-[24px] mt-4",children:[" Vous n'avez pas de compte ? ",(0,s.jsx)(c(),{href:"/auth/signup",className:"text-primary font-bold",children:"Inscrivez vous"})]})]})}},4241:(e,a,r)=>{"use strict";r.d(a,{Ay:()=>n,Bb:()=>t,X1:()=>o});let s=(0,r(9442).Z0)({name:"accesstoken",initialState:{token:null},reducers:{renewToken:(e,a)=>{e.token=a.payload.token,e.expiresIn=a.payload.expiresIn,console.log("Token : ",e.token+" is valid for "+e.expiresIn+" time")},clearToken:e=>{e.token=null,e.expiresIn=null},resetToken:e=>{e.token=null,e.expiresIn=null}}}),{renewToken:t,clearToken:l,resetToken:o}=s.actions,n=s.reducer},5725:(e,a,r)=>{"use strict";r.d(a,{Ay:()=>f,C$:()=>c,FH:()=>l,Gy:()=>d,Ii:()=>p,Mp:()=>o,O4:()=>i,kg:()=>t,p3:()=>h,z0:()=>n});let s=(0,r(9442).Z0)({name:"user",initialState:{name:"",surname:"",email:"",pwdhash:"",country:"",verified:!1},reducers:{createUser:(e,a)=>{console.log("Hello I am creating a user..."),e.name=a.payload.name,e.surname=a.payload.surname,e.email=a.payload.email,e.pwdhash=a.payload.pwdhash,e.country=a.payload.country,console.log("The user information are : ",e.name+e.pwdhash+e.email)},verifyUser:(e,a)=>{e.verified=a.payload,console.log("	 ###Verifying the user as ",e.verified)},setWalletAdress:(e,a)=>{e.walletAddress=a.payload,console.log("	 ### The wallet address has been set as ",e.walletAddress)},setReferralCode:(e,a)=>{e.referralCode=a.payload,console.log("	 ### The referral Code is ",e.referralCode)},setFirstReferringCode:(e,a)=>{e.firstReferringCode=a.payload,console.log("	 ### The First Referring code has been set to ",e.firstReferringCode)},setReferralList:(e,a)=>{e.referralList=a.payload,console.log("	  ### Just registered the user referrals as ",e.referralList)},setProfileImageKey:(e,a)=>{e.profileImageKey=a.payload,console.log("	  ### This user profile image has the key ",e.profileImageKey)},provideCashback:(e,a)=>{e.cashback=a.payload,console.log("	 ### The user cashback is ",e.cashback)},provideReferralGain:(e,a)=>{e.referralGain=a.payload,console.log("	 ### The user referral gain is ",e.referralGain)},provideFilleulsList:(e,a)=>{e.referralList=a.payload,console.log("	 ### The user referral list is ",e.referralList)},resetUser:e=>{e.name="",e.surname="",e.email="",e.pwdhash="",e.walletAddress="",e.country="",e.verified=!1,e.referralCode="",e.referralGain=0,e.referralList=[],e.cashback=0}}}),{createUser:t,verifyUser:l,setWalletAdress:o,setReferralCode:n,setFirstReferringCode:i,setProfileImageKey:d,setReferralList:c,provideCashback:p,provideFilleulsList:u,provideReferralGain:m,resetUser:h}=s.actions,f=s.reducer},734:(e,a,r)=>{"use strict";r.d(a,{G:()=>l,j:()=>t});var s=r(3391);let t=s.wA,l=s.d4}},e=>{var a=a=>e(e.s=a);e.O(0,[150,391,651,442,970,390,441,517,358],()=>a(7944)),_N_E=e.O()}]);