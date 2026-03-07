import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { useAllPosts, useCreatePost, useUpdatePost } from "@/hooks/usePosts";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  cover_image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  published: z.boolean(),
  featured: z.boolean(),
});
type FormData = z.infer<typeof schema>;

export default function AdminPostEditorPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: posts } = useAllPosts();
  const { mutate: createPost, isPending: creating } = useCreatePost();
  const { mutate: updatePost, isPending: updating } = useUpdatePost();
  const isPending = creating || updating;

  const existing = posts?.find((p) => p.id === id);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { published: false, featured: false },
  });

  useEffect(() => {
    if (existing) {
      reset({
        title: existing.title,
        slug: existing.slug,
        excerpt: existing.excerpt ?? "",
        content: existing.content,
        cover_image: existing.cover_image ?? "",
        published: existing.published,
        featured: existing.featured,
      });
    }
  }, [existing, reset]);

  function onSubmit(data: FormData) {
    if (isNew) {
      createPost(
        { ...data, author_id: user!.id, published_at: data.published ? new Date().toISOString() : null },
        {
          onSuccess: () => { toast.success("Post created!"); navigate("/admin"); },
          onError: () => toast.error("Failed to create post."),
        }
      );
    } else {
      updatePost(
        { id: id!, ...data },
        {
          onSuccess: () => { toast.success("Post updated!"); navigate("/admin"); },
          onError: () => toast.error("Failed to update post."),
        }
      );
    }
  }

  return (
    <ProtectedRoute adminOnly>
      <Layout>
        <div className="container py-12 max-w-3xl space-y-8">
          <div>
            <Button variant="ghost" size="sm" className="-ml-1 mb-4" asChild>
              <Link to="/admin"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Admin</Link>
            </Button>
            <h1 className="text-2xl font-bold">{isNew ? "New Post" : "Edit Post"}</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register("title")} />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" placeholder="my-post-title" {...register("slug")} />
              {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea id="excerpt" rows={2} {...register("excerpt")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover_image">Cover Image URL</Label>
              <Input id="cover_image" placeholder="https://..." {...register("cover_image")} />
              {errors.cover_image && <p className="text-xs text-destructive">{errors.cover_image.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content (HTML)</Label>
              <Textarea id="content" rows={16} className="font-mono text-sm" {...register("content")} />
              {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
            </div>

            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Switch id="published" checked={watch("published")} onCheckedChange={(v) => setValue("published", v)} />
                <Label htmlFor="published">Published</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="featured" checked={watch("featured")} onCheckedChange={(v) => setValue("featured", v)} />
                <Label htmlFor="featured">Featured</Label>
              </div>
            </div>

            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isNew ? "Create post" : "Save changes"}
            </Button>
          </form>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
