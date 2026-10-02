import { DELCOM_BASEURL } from "@/lib/config";
export const getAccessToken=()=>typeof window!=="undefined"?localStorage.getItem("access_token"):null;
export const putAccessToken=(token:string)=>{if(typeof window!=="undefined") localStorage.setItem("access_token",token)};
export const removeAccessToken=()=>{if(typeof window!=="undefined") localStorage.removeItem("access_token")};
export async function apiFetch<T=any>(path:string,options:RequestInit & {params?:Record<string,string|number|boolean|undefined>}={}) : Promise<T>{
 const {params,...init}=options; const url=new URL(`${DELCOM_BASEURL.replace(/\/$/,"")}/${path.replace(/^\//,"")}`); Object.entries(params||{}).forEach(([k,v])=>v!==undefined&&url.searchParams.set(k,String(v)));
 const headers=new Headers(init.headers); if(init.body && !(init.body instanceof FormData)) headers.set("Content-Type","application/json"); const token=getAccessToken(); if(token) headers.set("Authorization",`Bearer ${token}`);
 const response=await fetch(url,{...init,headers}); const text=await response.text(); let payload:any; try{payload=text?JSON.parse(text):null}catch{payload={message:text}};
 if(!response.ok || payload?.success===false){throw new Error(payload?.message || payload?.errors?.message || `Request gagal (${response.status})`)} return payload?.data ?? payload;
}
