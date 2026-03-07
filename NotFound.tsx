import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";

const NotFound = () => {
  return (
    <Layout>
      <main className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold">404</h1>
          <p className="text-muted-foreground text-lg">Page not found</p>
          <Link
            to="/"
            className="inline-block mt-4 underline underline-offset-4 hover:text-primary transition-colors"
          >
            Go home
          </Link>
        </div>
      </main>
    </Layout>
  );
};

export default NotFound;
