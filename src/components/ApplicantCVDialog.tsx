import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar } from "lucide-react";

interface Application {
  id: string;
  candidateName: string;
  email: string;
  appliedDate: string;
  stage: "applied" | "screened" | "first_interview" | "second_interview";
  cv?: string;
}

interface ApplicantCVDialogProps {
  isOpen: boolean;
  onClose: () => void;
  applicant: Application | null;
}

const getStageDisplay = (stage: string) => {
  switch (stage) {
    case "applied": return { label: "Applied", color: "bg-blue-100 text-blue-800" };
    case "screened": return { label: "Screened", color: "bg-yellow-100 text-yellow-800" };
    case "first_interview": return { label: "1st Interview Passed", color: "bg-orange-100 text-orange-800" };
    case "second_interview": return { label: "2nd Interview Passed", color: "bg-green-100 text-green-800" };
    default: return { label: "Applied", color: "bg-blue-100 text-blue-800" };
  }
};

export const ApplicantCVDialog = ({ isOpen, onClose, applicant }: ApplicantCVDialogProps) => {
  if (!applicant) return null;

  const stageDisplay = getStageDisplay(applicant.stage);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {applicant.candidateName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Candidate Info */}
          <div className="flex flex-col md:flex-row gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Name:</span>
              <span>{applicant.candidateName}</span>
            </div>
            
            {applicant.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Email:</span>
                <span>{applicant.email}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Applied:</span>
              <span>{new Date(applicant.appliedDate).toLocaleDateString()}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">Status:</span>
              <Badge className={stageDisplay.color}>
                {stageDisplay.label}
              </Badge>
            </div>
          </div>

          {/* CV Content */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Curriculum Vitae</h3>
            <div className="prose prose-sm max-w-none">
              {applicant.cv ? (
                <div className="bg-background border rounded-lg p-6">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
                    {applicant.cv}
                  </pre>
                </div>
              ) : (
                <div className="bg-muted/50 border rounded-lg p-6 text-center text-muted-foreground">
                  <p>No CV provided by this candidate.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};