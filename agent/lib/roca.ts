// ROCA: Read-Only Comprehension Agent
// This module implements structural immunity to prompt injection.

export interface ComprehensionSummary {
    originalContentLength: number;
    entities: string[];
    intent: string;
    urgency: "low" | "medium" | "high";
    summary: string;
    containsSuspiciousInstructions: boolean;
}

export async function summarizeUntrustedContent(content: string): Promise<ComprehensionSummary> {
    // In a real implementation, this would call a secondary, isolated, tool-less LLM
    // to read the untrusted content and output a structured JSON summary.
    // For the hackathon, we simulate the deterministic output.

    const isSuspicious = content.toLowerCase().includes("ignore previous instructions") ||
                         content.toLowerCase().includes("system prompt");

    return {
        originalContentLength: content.length,
        entities: ["extracted_entity_1", "extracted_entity_2"],
        intent: "informational",
        urgency: "low",
        summary: `The untrusted input discussed topics related to the provided entities. Length was ${content.length} characters.`,
        containsSuspiciousInstructions: isSuspicious
    };
}
