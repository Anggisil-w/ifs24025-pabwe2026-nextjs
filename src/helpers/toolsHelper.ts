import Swal from "sweetalert2";
export const showSuccessDialog=(message:string)=>Swal.fire({icon:"success",title:"Berhasil",text:message,confirmButtonColor:"#111827"});
export const showErrorDialog=(message:string)=>Swal.fire({icon:"error",title:"Terjadi Kesalahan",text:message,confirmButtonColor:"#111827"});
export const showWarningDialog=(message:string)=>Swal.fire({icon:"warning",title:"Perhatian",text:message,confirmButtonColor:"#111827"});
export const showConfirmDialog=async(message:string)=>{const r=await Swal.fire({icon:"question",title:"Konfirmasi",text:message,showCancelButton:true,confirmButtonText:"Ya, lanjutkan",cancelButtonText:"Batal",confirmButtonColor:"#111827"}); return r.isConfirmed};
export const formatDate=(value?:string)=>value?new Intl.DateTimeFormat("id-ID",{dateStyle:"medium",timeStyle:"short"}).format(new Date(value)):"-";
