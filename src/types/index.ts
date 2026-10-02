export interface User { id:number|string; name:string; email?:string; bio?:string|null; photo?:string|null; avatar?:string|null; }
export interface PostAuthor extends User {}
export interface PostComment { id:number|string; comment?:string; content?:string; text?:string; user?:User; author?:User; created_at?:string; }
export interface Post { id:number|string; description:string; cover?:string|null; created_at?:string; updated_at?:string; user?:User; author?:User; likes_count?:number; comments_count?:number; is_liked?:boolean; comments?:PostComment[]; }
export interface ApiResult<T=unknown> { success:boolean; message?:string; data?:T; }
