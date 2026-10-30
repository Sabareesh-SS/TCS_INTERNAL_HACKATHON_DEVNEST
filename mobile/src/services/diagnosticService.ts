import { Platform } from 'react-native';
import { DeviceType } from '../types/device';
import { DiagnosticStep, DiagnosticResponse, DiagnosticRuleNode } from '../types/diagnostic';
import { DIAGNOSTIC_RULES } from './mockData';

declare const process: { env: Record<string, string | undefined> };

const DEFAULT_API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';
export const AI_ENGINE_URL = process.env.AI_ENGINE_URL || DEFAULT_API_URL;

export interface AIDiagnosticStepRequest {
  incident_id: string;
  device_id: string;
  device_type?: string;
  manufacturer?: string;
  model?: string;
  classroom_id?: string;
  room_no?: string;
  symptom: string;
  power_status?: string;
  input_source?: string;
  cable_status?: string;
  previous_action_id?: string | null;
  previous_step_result?: 'SUCCESS' | 'FAILED' | 'CANNOT_PERFORM' | null;
  step_number?: number;
}

export interface AIDiagnosticStepResult {
  step: DiagnosticStep;
  status: 'IN_PROGRESS' | 'RESOLVED' | 'ESCALATED';
  escalationRecommended: boolean;
  technicianSummary?: any;
  faultCategory?: string;
  probableCause?: string;
}

class DiagnosticService {
  /**
   * Generates deterministic structured diagnostic steps based on device type and symptom.
   * Local rule tree fallback.
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

  /**
   * Calls the FastAPI AI Diagnostic Engine (RAG + Gemini LLM + ML Classifier).
   * Gracefully falls back to local rules if backend is unreachable.
   */
  public async fetchNextStepFromAI(params: AIDiagnosticStepRequest): Promise<AIDiagnosticStepResult> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(`${AI_ENGINE_URL}/api/diagnostics/next-step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const stepNum = data.step_number || params.step_number || 1;
        const actionTitle = (data.next_action_id || 'INSPECT_DEVICE').replace(/_/g, ' ');

        let manualRef: string | undefined = undefined;
        if (data.manual_reference?.title) {
          manualRef = `${data.manual_reference.title}${data.manual_reference.section ? ` - ${data.manual_reference.section}` : ''}`;
        }

        const instructionText = data.probable_cause
          ? `[Probable Cause: ${data.probable_cause}]\n\n${data.instruction}`
          : data.instruction;

        return {
          step: {
            id: `${params.incident_id}-step-${stepNum}`,
            incidentId: params.incident_id,
            stepNumber: stepNum,
            totalSteps: 3,
            actionTitle,
            instructionText,
            manualReference: manualRef || 'Campus AV Standard Operating Procedures (SOP)',
            verificationPrompt: data.expected_result || 'Did this procedure resolve the problem?',
          },
          status: data.status,
          escalationRecommended: Boolean(data.escalation_recommended),
          technicianSummary: data.technician_summary,
          faultCategory: data.fault_category,
          probableCause: data.probable_cause,
        };
      }
    } catch (e) {
      // Backend offline or timeout — fall back to deterministic local rule engine
    }

    // Deterministic Fallback
    const fallbackSteps = this.generateSteps(
      (params.device_type?.toLowerCase() || 'projector') as DeviceType,
      params.symptom,
      params.incident_id
    );
    const stepIdx = Math.min((params.step_number || 1) - 1, fallbackSteps.length - 1);
    const fallbackStep = fallbackSteps[stepIdx] || fallbackSteps[0];
    const isEscalated = (params.step_number || 1) >= fallbackSteps.length;

    return {
      step: fallbackStep,
      status: isEscalated ? 'ESCALATED' : 'IN_PROGRESS',
      escalationRecommended: isEscalated,
      technicianSummary: isEscalated
        ? {
            incident_id: params.incident_id,
            device_id: params.device_id,
            symptom: params.symptom,
            escalation_reason: 'Exceeded maximum automated diagnostic steps.',
          }
        : undefined,
    };
  }
}

export const diagnosticService = new DiagnosticService();
