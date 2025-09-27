import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Building } from "lucide-react";

interface JobDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  role: {
    id: string;
    "Role Name": string | null;
    "Role description": string | null;
    created_at: string;
    role_uuid: string;
    job_identification: number;
  };
}

export function JobDetailsDialog({ isOpen, onClose, role }: JobDetailsDialogProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {role["Role Name"] || "Untitled Role"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Job Meta Information */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Posted on {formatDate(role.created_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span>Job ID: {role.job_identification}</span>
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Job Description</h3>
            <div className="prose prose-sm max-w-none">
              {role["Role description"] ? (
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {role["Role description"]}
                </p>
              ) : (
                <p className="text-muted-foreground italic">
                  No description provided for this role.
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}