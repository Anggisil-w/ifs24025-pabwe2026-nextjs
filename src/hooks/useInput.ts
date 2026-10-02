import { useState } from "react";
export function useInput<T extends string|number="string">(initial:T){const [value,setValue]=useState<T>(initial); const onChange=(e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>)=>setValue(e.target.value as T); return {value,setValue,onChange};}
