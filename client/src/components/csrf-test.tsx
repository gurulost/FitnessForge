import { Button } from "@/components/ui/button";
import { apiRequestWithCsrf } from "@/lib/csrf";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function CsrfTest() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const testCsrf = async () => {
    setIsLoading(true);
    try {
      // This triggers our CSRF protection
      const response = await apiRequestWithCsrf('POST', '/api/csrf-test', { test: 'data' });
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
      toast({
        title: "CSRF Test Successful",
        description: "The CSRF-protected request completed successfully.",
      });
    } catch (error) {
      console.error('CSRF test failed:', error);
      setResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
      toast({
        title: "CSRF Test Failed",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4 p-4 border rounded-lg">
      <h2 className="text-xl font-bold">CSRF Protection Test</h2>
      <Button onClick={testCsrf} disabled={isLoading}>
        {isLoading ? "Testing..." : "Test CSRF Protection"}
      </Button>
      {result && (
        <div className="p-4 bg-muted rounded-md">
          <pre className="text-sm whitespace-pre-wrap break-all">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}