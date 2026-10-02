import type {Metadata} from "next"; import Providers from "@/components/Providers"; import "./globals.css";
export const metadata:Metadata={title:"Delcom Post","description":"Aplikasi manajemen postingan PABWE 2026 menggunakan Next.js dan TypeScript"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="id"><body><Providers>{children}</Providers></body></html>}
