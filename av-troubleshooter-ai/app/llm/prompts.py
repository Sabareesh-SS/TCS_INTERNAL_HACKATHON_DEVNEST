DIAGNOSTIC_SYSTEM_PROMPT = """You are the AI Diagnostic Engine for a Smart Classroom AV Troubleshooting Assistant.
Your job is to provide actionable, step-by-step troubleshooting instructions to a faculty member in a classroom based ONLY on verified OEM equipment manuals.

CRITICAL OPERATIONAL RULES:
1. Grounding: You must ONLY suggest diagnostic actions supported by the provided manual excerpts. Do not invent or hallucinate physical troubleshooting procedures.
2. Direct Actionable Language: Do NOT write conversational greetings, disclaimers, or polite filler (e.g., do NOT say "Hello professor! I can help you with that"). Provide direct, concise instructions suitable for display on a mobile card.
3. Safety Guardrails: Never suggest opening internal electronic components, disassembling ceiling mounts, or tampering with mains power lines. If such work is required, immediately set escalation_recommended to true.
4. Step Progression: Look at the step_number and previous actions. Never suggest an action that has already been attempted and reported as FAILED.
5. Structured Output: You must return the response matching the specified JSON schema.
"""

def build_diagnostic_prompt(
    device_type: str,
    manufacturer: str,
    model: str,
    symptom: str,
    power_status: str,
    input_source: str,
    cable_status: str,
    step_number: int,
    previous_action_id: str,
    previous_step_result: str,
    retrieved_passages: list,
    ml_predicted_fault: str = None
) -> str:
    """Builds the context-augmented diagnostic prompt for the LLM."""
    passages_text = ""
    for idx, p in enumerate(retrieved_passages, 1):
        passages_text += f"\n--- EXCERPT {idx} ---\n"
        passages_text += f"Manual: {p['manual_reference']['title']} ({p['manual_reference']['section']})\n"
        passages_text += f"Fault Category: {p['issue_category']}\n"
        passages_text += f"Probable Cause: {p['probable_cause']}\n"
        passages_text += f"Action ID: {p['action_id']}\n"
        passages_text += f"Instruction: {p['instruction']}\n"
        passages_text += f"Expected Result: {p['expected_result']}\n"
        passages_text += f"Escalation Condition: {p['escalation_condition']}\n"

    ml_context = f"\nML Prior Fault Category (from Member 4's classifier): {ml_predicted_fault}\n" if ml_predicted_fault else ""

    prompt = f"""DEVICE & INCIDENT TELEMETRY:
- Device: {manufacturer} {model} ({device_type})
- Reported Symptom: {symptom}
- Power Status: {power_status}
- Input Source: {input_source}
- Cable Status: {cable_status}
- Current Diagnostic Step: {step_number}
- Previous Action Attempted: {previous_action_id or 'None (Initial Request)'}
- Previous Step Result: {previous_step_result or 'None'}
{ml_context}
VERIFIED MANUAL TROUBLESHOOTING EXCERPTS (RAG GROUNDING):
{passages_text}

TASK:
Determine the most probable cause and recommend the next concrete troubleshooting action.
Return your decision matching the DiagnosticResponse JSON schema with:
- fault_category
- probable_cause
- next_action_id
- step_number: {step_number}
- instruction (clear imperative directive for faculty member)
- expected_result (observable outcome if action fixes the issue)
- manual_reference (title, section, page, source_url from the matched excerpt)
- escalation_recommended (true if 3+ steps failed, or if hardware defect/safety risk is detected)
"""
    return prompt

