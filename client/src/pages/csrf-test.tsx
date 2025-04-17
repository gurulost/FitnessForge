import { Separator } from "@/components/ui/separator";
import { CsrfTest } from "@/components/csrf-test";

export default function CsrfTestPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-4">CSRF Protection Test Page</h1>
      <p className="text-muted-foreground mb-6">
        This page is for testing the CSRF protection implementation.
      </p>
      
      <Separator className="my-6" />
      
      <div className="grid gap-6 md:grid-cols-2">
        <CsrfTest />
        
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-bold mb-2">About CSRF Protection</h2>
          <p className="text-sm text-muted-foreground">
            Cross-Site Request Forgery (CSRF) protection prevents attackers from
            forcing users to execute unwanted actions on web applications where they're
            authenticated. Our implementation uses tokens in cookies and request headers
            to verify the legitimacy of requests.
          </p>
        </div>
      </div>
    </div>
  );
}