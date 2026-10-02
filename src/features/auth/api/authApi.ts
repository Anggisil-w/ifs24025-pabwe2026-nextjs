import {apiFetch} from "@/helpers/apiHelper";
export const loginApi=(email:string,password:string)=>apiFetch<any>("auth/login",{method:"POST",body:JSON.stringify({email,password})});
export const registerApi=(name:string,email:string,password:string)=>apiFetch<any>("auth/register",{method:"POST",body:JSON.stringify({name,email,password})});
