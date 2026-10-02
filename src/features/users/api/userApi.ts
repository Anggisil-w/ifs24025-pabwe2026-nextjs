import {apiFetch} from "@/helpers/apiHelper"; import type {User} from "@/types";
export const getUsersApi=()=>apiFetch<User[]>("users"); export const getMeApi=()=>apiFetch<User>("users/me");
export const updateProfileApi=(data:{name?:string;bio?:string})=>apiFetch<User>("users/me",{method:"PUT",body:JSON.stringify(data)});
export const updatePasswordApi=(password:string)=>apiFetch<any>("users/me/password",{method:"PUT",body:JSON.stringify({password})});
export const uploadProfilePhotoApi=(file:File)=>{const fd=new FormData();fd.append("photo",file);return apiFetch<User>("users/me/photo",{method:"POST",body:fd})};
