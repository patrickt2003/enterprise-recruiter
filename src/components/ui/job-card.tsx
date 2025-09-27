import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MapPin, Clock, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    department: string;
    location: string;
    type: string;
    postedDate: string;
    applicants: number;
    priority: "high" | "medium" | "low";
  };
  className?: string;
}

export function JobCard({ job, className }: JobCardProps) {
  return (
    <Card className={cn("bg-gradient-card border shadow-card hover:shadow-elevated transition-all duration-200", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-card-foreground leading-tight">{job.title}</h3>
            <p className="text-sm text-muted-foreground">{job.department}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{job.postedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="text-xs bg-secondary px-2 py-1 rounded">{job.type}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-4 border-t border-border">
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="sm" className="flex-1">
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          <Button size="sm" className="flex-1 bg-hr-primary hover:bg-hr-primary-dark">
            Manage Applications
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}