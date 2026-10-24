import type { L2EpisodicMemory, L3SemanticMemory, L4ProceduralMemory } from "../../shared/types/memory.js";
import type { UserProfile } from "../../shared/types/profile.js";

// PIE: Proactive Intelligence Engine

export interface Pattern {
    patternId: string;
    type: "temporal" | "sequential" | "conditional";
    description: string;
    evidence: string;
    confidence: number;
    lastObserved: string;
    action: string;
}

export interface AnticipationCandidate {
    anticipationId: string;
    trigger: string;
    suggestion: string;
    urgency: "low" | "medium" | "high";
    actionIfApproved: string;
    actionIfIgnored: string;
    confidence: number;
}

export function analyzePatterns(l2Episodes: L2EpisodicMemory[]): Pattern[] {
    // Deterministic Pattern Engine (No LLM)
    // Tracks behavioral patterns over time based on L2 episodic memory.
    const patterns: Pattern[] = [];

    // Example: Track flights booked on Tuesdays
    const flightBookings = l2Episodes.filter(e =>
        e.summary.toLowerCase().includes("book") &&
        e.summary.toLowerCase().includes("flight")
    );

    if (flightBookings.length >= 3) {
        patterns.push({
            patternId: "PAT-FLIGHTS",
            type: "temporal",
            description: "Books flights frequently",
            evidence: `${flightBookings.length} occurrences observed`,
            confidence: Math.min(flightBookings.length * 0.2, 0.95),
            lastObserved: flightBookings[flightBookings.length - 1].timestamp,
            action: "suggest_flight_search"
        });
    }

    return patterns;
}

export function generateAnticipationCandidates(
    patterns: Pattern[],
    context: { l3: L3SemanticMemory[], profile: UserProfile, mockDate?: Date }
): AnticipationCandidate[] {
    // Deterministic Anticipation Engine
    const candidates: AnticipationCandidate[] = [];
    const now = context.mockDate || new Date();

    for (const pat of patterns) {
        if (pat.action === "suggest_flight_search" && pat.confidence > 0.8) {
            candidates.push({
                anticipationId: `ANT-${now.getTime()}`,
                trigger: `pattern: ${pat.patternId} + calendar context`,
                suggestion: `Your pattern shows frequent flight bookings. Want me to start watching prices?`,
                urgency: "medium",
                actionIfApproved: "set_price_alert",
                actionIfIgnored: "retry_later",
                confidence: pat.confidence
            });
        }
    }

    return candidates;
}

export function evaluateAutonomyGate(
    domain: "flights" | "emails" | "banking" | "groceries",
    actionLevel: number,
    trustScores: Record<string, number>
): boolean {
    const score = trustScores[domain] || 0;

    // Level 0: Suggest (0-0.3)
    // Level 1: Confirm (0.3-0.5)
    // Level 2: Notify (0.5-0.7)
    // Level 3: Delegate (0.7-0.9)
    // Level 4: Full (0.9+)

    let allowedLevel = 0;
    if (score >= 0.9) allowedLevel = 4;
    else if (score >= 0.7) allowedLevel = 3;
    else if (score >= 0.5) allowedLevel = 2;
    else if (score >= 0.3) allowedLevel = 1;

    return actionLevel <= allowedLevel;
}
