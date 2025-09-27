import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Calendar, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useState } from "react";
import { JobDetailsDialog } from "@/components/JobDetailsDialog";

interface JobCardProps {
  role: {
    id: string;
    "Role Name": string | null;
    "Role description": string | null;
    created_at: string;
    role_uuid: string;
    job_identification: number;
  };
  className?: string;
}

export function JobCard({ role, className }: JobCardProps) {
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "1 day ago";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} week${Math.floor(diffInDays / 7) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffInDays / 30)} month${Math.floor(diffInDays / 30) > 1 ? 's' : ''} ago`;
  };

  return (
    <Card className={cn("bg-gradient-card border shadow-card hover:shadow-elevated transition-all duration-200", className)}>
      <CardHeader className="pb-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-card-foreground leading-tight">
            {role["Role Name"] || "Untitled Role"}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Posted {formatDate(role.created_at)}</span>
          </div>
        </div>
      </CardHeader>
      
      {role["Role description"] && (
        <CardContent className="pb-4">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {role["Role description"]}
          </p>
        </CardContent>
      )}
      
      <CardFooter className="pt-4 border-t border-border">
        <div className="flex gap-2 w-full">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => setIsDetailsDialogOpen(true)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          <Button size="sm" className="flex-1" asChild>
            <Link to={`/applications/${role.job_identification}`}>
              Manage Applications
            </Link>
          </Button>
        </div>
      </CardFooter>
      
      <JobDetailsDialog
        isOpen={isDetailsDialogOpen}
        onClose={() => setIsDetailsDialogOpen(false)}
        role={role}
      />
    </Card>
  );
}