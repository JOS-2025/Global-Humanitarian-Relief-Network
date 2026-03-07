import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const schema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().max(300, "Bio must be under 300 characters").optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  avatar_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

export default function DashboardSettingsPage() {
  const { profile, updateProfile } = useAuth();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: profile?.full_name ?? "",
      bio: profile?.bio ?? "",
      website: profile?.website ?? "",
      avatar_url: profile?.avatar_url ?? "",
    },
  });

  async function onSubmit(data: FormData) {
    try {
      await updateProfile(data);
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile. Please try again.");
    }
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container py-12 max-w-2xl space-y-8">
          <div>
            <Button variant="ghost" size="sm" className="-ml-1 mb-4" asChild>
              <Link to="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
            </Button>
            <h1 className="text-2xl font-bold">Profile Settings</h1>
            <p className="text-muted-foreground text-sm mt-1">Update your public profile information.</p>
          </div>

          <Separator />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full name</Label>
              <Input id="full_name" {...register("full_name")} />
              {errors.full_name && <p className="text-xs text-destructive">{errors.full_name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" rows={4} placeholder="Tell the world a little about yourself..." {...register("bio")} />
              {errors.bio && <p className="text-xs text-destructive">{errors.bio.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" placeholder="https://yoursite.com" {...register("website")} />
              {errors.website && <p className="text-xs text-destructive">{errors.website.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar_url">Avatar URL</Label>
              <Input id="avatar_url" placeholder="https://..." {...register("avatar_url")} />
              {errors.avatar_url && <p className="text-xs text-destructive">{errors.avatar_url.message}</p>}
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save changes
            </Button>
          </form>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
