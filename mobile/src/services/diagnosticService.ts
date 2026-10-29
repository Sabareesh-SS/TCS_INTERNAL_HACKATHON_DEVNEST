import { DeviceType } from '../types/device';
import { DiagnosticStep, DiagnosticResponse, DiagnosticRuleNode } from '../types/diagnostic';
import { DIAGNOSTIC_RULES } from './mockData';

class DiagnosticService {
  /**
   * Generates deterministic structured diagnostic steps based on device type and symptom.
   * AI-generated or pre-compiled rule tree.
   */
  public generateSteps(deviceType: DeviceType, symptom: string, incidentId: string): DiagnosticStep[] {
    const key = `${deviceType}:${symptom}`;
    const ruleNodes: DiagnosticRuleNode[] = DIAGNOSTIC_RULES[key] || DIAGNOSTIC_RULES.default;

    return ruleNodes.map((node, index) => ({
      id: `${incidentId}-step-${index + 1}`,
      incidentId,
      stepNumber: node.stepNumber,
      totalSteps: ruleNodes.length,
      actionTitle: node.actionTitle,
      instructionText: node.instructionText,
      manualReference: node.manualReference,
      verificationPrompt: node.verificationPrompt,
    }));
  }

  /**
   * Evaluates if a given response closes the incident, continues to next step, or triggers auto-escalation.
   */
  public evaluateStepOutcome(
    currentStepIndex: number,
    totalSteps: number,
    response: DiagnosticResponse
  ): 'RESOLVED' | 'NEXT_STEP' | 'ESCALATE' {
    if (response === 'worked') {
      return 'RESOLVED';
    }

    // If faculty reports did not work on the final step, auto-escalate
    if (currentStepIndex + 1 >= totalSteps) {
      return 'ESCALATE';
    }

    return 'NEXT_STEP';
  }
}

export const diagnosticService = new DiagnosticService();
