import { Link } from "react-router-dom";
import { ArrowRight, Github, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout/Layout";
import { useFeaturedProjects } from "@/hooks/useProjects";
import { usePosts } from "@/hooks/usePosts";

export default function HomePage() {
  const { data: projects } = useFeaturedProjects();
  const { data: posts } = usePosts();

  return (
    <Layout>
      {/* Hero */}
      <section className="container py-24 md:py-32 space-y-8">
        <div className="max-w-3xl space-y-6">
          <Badge variant="secondary">Available for freelance</Badge>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            Hi, I'm <span className="text-primary">Alex.</span>
            <br />
            I build for the web.
          </h1>
          <p className="text-xl text-muted-foreground max-w-xl">
            Full-stack developer & designer. I write about code, design, and the things I learn along the way.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button size="lg" asChild>
              <Link to="/portfolio">
                View my work <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Get in touch</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {projects && projects.length > 0 && (
        <section className="container py-16 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">Featured Projects</h2>
            <Button variant="ghost" asChild>
              <Link to="/portfolio">
                All projects <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 3).map((project) => (
              <Link
                key={project.id}
                to={`/portfolio/${project.slug}`}
                className="group rounded-xl border bg-card overflow-hidden hover:shadow-lg transition-all"
              >
                {project.cover_image && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={project.cover_image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-5 space-y-3">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.tech_stack.slice(0, 4).map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Latest Posts */}
      {posts && posts.length > 0 && (
        <section className="container py-16 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">Latest Posts</h2>
            <Button variant="ghost" asChild>
              <Link to="/blog">
                All posts <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {posts.slice(0, 4).map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group rounded-xl border bg-card p-6 hover:shadow-md transition-all space-y-3"
              >
                <div className="flex gap-2 flex-wrap">
                  {post.tags?.map((tag) => (
                    <Badge key={tag.id} variant="outline" className="text-xs">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                <p className="text-xs text-muted-foreground">
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : ""}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </Layout>
  );
}
