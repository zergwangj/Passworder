/* empty css              *//* empty css              *//* empty css              *//* empty css              */import{s,i as e}from"./main-1ad2265a.js";import{i as t}from"./ipcRenderer-5e19eaee.js";import{_ as a,o,b as n,i,a as r,w as d,l as p,q as l,g as c,t as u,p as m,h,B as v}from"./index-c35ca83b.js";const f={data:()=>({status:0,progress:"",percentNumber:0}),mounted(){this.init()},methods:{init(){t.removeAllListeners(s.appUpdater),t.on(s.appUpdater,((s,e)=>{e=JSON.parse(e),this.status=e.status,3==e.status?(this.progress=e.desc,this.percentNumber=e.percentNumber):this.$message.info(e.desc)}))},checkForUpdater(){t.invoke(e.checkForUpdater).then((s=>{console.log(s)}))},download(){1===this.status?t.invoke(e.downloadApp).then((s=>{console.log(s)})):this.$message.info("没有可用版本")}}},k=s=>(m("data-v-9d289348"),s=s(),h(),s),b={id:"app-demo-window"},g=k((()=>i("div",{class:"one-block-1"},[i("span",null," 1. 自动更新 ")],-1))),j={class:"one-block-2"},_=k((()=>i("div",{class:"one-block-1"},[i("span",null," 2. 下载进度 ")],-1))),w={class:"one-block-2"};const x=a(f,[["render",function(s,e,t,a,m,h){const f=v,k=p,x=l;return o(),n("div",b,[g,i("div",j,[r(k,null,{default:d((()=>[r(f,{onClick:e[0]||(e[0]=s=>h.checkForUpdater())},{default:d((()=>[c("检查更新")])),_:1}),r(f,{onClick:e[1]||(e[1]=s=>h.download())},{default:d((()=>[c("下载并安装")])),_:1})])),_:1})]),_,i("div",w,[r(x,{percent:m.percentNumber,status:"active"},null,8,["percent"]),r(k,null,{default:d((()=>[c(u(m.progress),1)])),_:1})])])}],["__scopeId","data-v-9d289348"]]);export{x as default};