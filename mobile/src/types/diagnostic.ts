export type DiagnosticResponse = 'worked' | 'did_not_work' | 'skipped';

export interface DiagnosticStep {
  id: string;
  incidentId: string;
  stepNumber: number;
  totalSteps: number;
  actionTitle: string;
  instructionText: string;
  manualReference: string;
  verificationPrompt: string;
  facultyResponse?: DiagnosticResponse;
  responseTimestamp?: string;
}

export interface DiagnosticRuleNode {
  stepNumber: number;
  totalSteps: number;
  actionTitle: string;
  instructionText: string;
  verificationPrompt: string;
  manualReference: string;
}
