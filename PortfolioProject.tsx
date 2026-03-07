import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Layout } from "@/components/layout/Layout";
import { useProject } from "@/hooks/useProjects";

export default function PortfolioProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading, isError } = useProject(slug!);

  return (
    <Layout>
      <article className="container py-12 max-w-4xl mx-auto">
        <Button variant="ghost" size="sm" className="mb-8 -ml-1" asChild>
          <Link to="/portfolio">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Portfolio
          </Link>
        </Button>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-72 w-full rounded-xl" />
          </div>
        ) : isError || !project ? (
          <div className="text-center py-24 space-y-4">
            <p className="text-4xl font-bold">404</p>
            <p className="text-muted-foreground">Project not found.</p>
            <Button asChild><Link to="/portfolio">Back to Portfolio</Link></Button>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{project.title}</h1>
              <p className="text-xl text-muted-foreground">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.map((tech) => (
                  <Badge key={tech} variant="secondary">{tech}</Badge>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                {project.demo_url && (
                  <Button asChild>
                    <a href={project.demo_url} target="_blank" rel="noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                    </a>
                  </Button>
                )}
                {project.github_url && (
                  <Button variant="outline" asChild>
                    <a href={project.github_url} target="_blank" rel="noreferrer">
                      <Github className="mr-2 h-4 w-4" /> View Code
                    </a>
                  </Button>
                )}
              </div>
            </div>

            {project.cover_image && (
              <img
                src={project.cover_image}
                alt={project.title}
                className="w-full rounded-xl mb-10 aspect-video object-cover"
              />
            )}

            {project.content && (
              <div
                className="prose prose-neutral dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: project.content }}
              />
            )}
          </>
        )}
      </article>
    </Layout>
  );
}
