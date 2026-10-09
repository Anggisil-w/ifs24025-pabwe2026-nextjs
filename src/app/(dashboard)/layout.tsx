import Providers from "@/components/Providers";
import PostLayout from "@/features/posts/layouts/PostLayout";
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <Providers>
      <PostLayout>{children}</PostLayout>
    </Providers>
  );
}
