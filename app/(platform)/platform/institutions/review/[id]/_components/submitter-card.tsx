// app/(platform)/institutions/review/[id]/_components/submitter-card.tsx
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// This type should match the 'createdBy' object from our API response
type Submitter = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
} | null;

interface SubmitterCardProps {
  submitter: Submitter;
}

export function SubmitterCard({ submitter }: SubmitterCardProps) {
  // Handle the case where the submitter might be null (e.g., user was deleted)
  if (!submitter) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Submitter Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Submitter details are unavailable.</p>
        </CardContent>
      </Card>
    );
  }

  // Get the user's initials for the avatar fallback
  const initials = submitter.name
    ? submitter.name.split(' ').map(n => n[0]).join('')
    : submitter.email.substring(0, 2).toUpperCase();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submitted By</CardTitle>
        <CardDescription>The user who initiated this application.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={submitter.image || undefined} alt={submitter.name || "User Avatar"} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="grid gap-1 text-sm">
            <p className="font-semibold text-foreground">{submitter.name || "Unnamed User"}</p>
            <p className="text-muted-foreground">{submitter.email}</p>
          </div>
        </div>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/users/view/${submitter.id}`}>View User Profile</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
