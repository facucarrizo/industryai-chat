import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Chat } from "@/components/chat";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-background">
      <div className="w-full max-w-2xl">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary font-headline">IndustryAI Chat</CardTitle>
            <CardDescription>Your smart assistant for instant answers and lead generation.</CardDescription>
          </CardHeader>
          <CardContent>
            <Chat />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
