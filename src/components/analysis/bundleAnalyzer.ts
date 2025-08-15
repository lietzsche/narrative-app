// analysis/bundleAnalyzer.ts
// v2 — tuned to the provided 48‑scene counseling storyline (s1..s50)
// - Every scene id from the content is mapped.
// - Branch emphasis fixed: forgiveness (s48), gratitude (s49), commitment/hope (s50).
// - Intermediate cluster boosts (gratitude: s38–s39, forgiveness/letting‑go: s41–s42,
//   commitment/hope/action: s43–s45) for better signal.
// - Tags expanded; summary a bit richer but still compact.

export type Scores = Record<string, number>;
export type BundleResult = { scores: Scores; tags: string[]; summary: string };

// --- 1) 성향 키 목록 (UI 노출/툴팁에 사용)
export const TRAITS = [
    "planning", "emotional_awareness", "challenge_frame", "impact_energy", "impact_relation",
    "decision_latency", "change_drive", "social_anchor", "pain_origin_self", "collab_pref",
    "core_value_humane", "core_value_creative", "core_value_integrity", "risk_appetite",
    "tolerance_ambiguity", "assertiveness", "growth_drive", "follow_through",
    "legacy_meaning", "gratitude_focus", "forgiveness_focus", "commitment_focus"
] as const;

// Helper: build a zeroed score object
function zeroScores(): Scores { return Object.fromEntries(TRAITS.map(t => [t, 0])) as Scores; }

// --- 2) 씬별 센트로이드(선택 평균치)
// 주의: 이 매핑은 장면 텍스트(사용자 제공 JSON)에 맞춘 휴리스틱 평균값입니다.
// 실제 서비스에서는 사용자 선택/경로 데이터를 통해 실험적으로 보정하세요.
const C: Record<string, Partial<Scores>> = {
    // s1~s12: 문제 정의/감정 인식/초기 프레이밍
    s1:  { emotional_awareness: +0.2, planning: +0.1 },
    s2:  { emotional_awareness: +0.6 },
    s3:  { emotional_awareness: +0.2 },
    s4:  { emotional_awareness: +0.2, challenge_frame: +0.1 },
    s5:  { challenge_frame: +0.1, tolerance_ambiguity: +0.35 },
    s6:  { impact_energy: +0.33, impact_relation: +0.33, decision_latency: +0.33 },
    s7:  { change_drive: +0.2 },
    s8:  { growth_drive: +0.2, social_anchor: +0.05 },
    s9:  { core_value_humane: +0.15, core_value_creative: +0.15, follow_through: +0.08, risk_appetite: +0.08 },
    s10: { growth_drive: +0.2, risk_appetite: +0.1, social_anchor: +0.1 },
    s11: { follow_through: +0.2, gratitude_focus: +0.1, planning: +0.1 },
    s12: { emotional_awareness: +0.1, pain_origin_self: +0.05 },

    // s13~s22: 기억 탐색/관계 자원 활용
    s13: { collab_pref: +0.1, social_anchor: +0.1 },
    s14: { emotional_awareness: +0.2 },
    s15: { emotional_awareness: +0.4 },
    s16: { follow_through: +0.1, risk_appetite: +0.1, assertiveness: +0.05, decision_latency: +0.05 },
    s17: { planning: +0.1, tolerance_ambiguity: +0.1 },
    s18: { core_value_integrity: +0.1, growth_drive: +0.1, emotional_awareness: +0.1 },
    s19: { change_drive: +0.2, assertiveness: +0.1, collab_pref: +0.05 },
    s20: { social_anchor: +0.4 },
    s21: { gratitude_focus: +0.3, impact_relation: +0.2 },
    s22: { collab_pref: +0.2, assertiveness: +0.05 },

    // s23~s27: 경계/가치/후회 재구성
    s23: { assertiveness: +0.3, planning: +0.1 },
    s24: { legacy_meaning: +0.3, tolerance_ambiguity: +0.1 },
    s25: { core_value_integrity: +0.3, follow_through: +0.3, assertiveness: +0.1 },
    s26: { legacy_meaning: +0.2 },
    s27: { commitment_focus: +0.2, core_value_humane: +0.1, core_value_creative: +0.1 },

    // s28~s36: 상징/표현/외부화/인지 재구성
    s28: { core_value_creative: +0.3, tolerance_ambiguity: +0.2 },
    s29: { core_value_creative: +0.2, emotional_awareness: +0.1 },
    s30: { core_value_creative: +0.3, follow_through: +0.1 },
    s31: { growth_drive: +0.2, risk_appetite: +0.1 },
    s32: { assertiveness: +0.2, legacy_meaning: +0.1 },
    s33: { forgiveness_focus: +0.2, emotional_awareness: +0.2 },
    s34: { emotional_awareness: +0.2, planning: +0.1 },
    s35: { pain_origin_self: +0.3, core_value_integrity: +0.1 },
    s36: { challenge_frame: +0.4, tolerance_ambiguity: +0.2 },

    // s37~s45: 역할모델/감사/경계/놓아보내기/태도/행동
    s37: { growth_drive: +0.3, collab_pref: +0.1, core_value_creative: +0.1, follow_through: +0.1, tolerance_ambiguity: +0.1 },
    s38: { gratitude_focus: +0.6 },
    s39: { gratitude_focus: +0.2, social_anchor: +0.2 },
    s40: { assertiveness: +0.3, planning: +0.2, follow_through: +0.1 },
    s41: { forgiveness_focus: +0.5, tolerance_ambiguity: +0.1 },
    s42: { forgiveness_focus: +0.2, core_value_creative: +0.1 },
    s43: { commitment_focus: +0.3, legacy_meaning: +0.2, growth_drive: +0.2 },
    s44: { change_drive: +0.2, risk_appetite: +0.1, follow_through: +0.1 },
    s45: { follow_through: +0.5, planning: +0.2 },

    // s46~s50: 편지 대상/메시지 선택 및 엔딩
    s46: { forgiveness_focus: +0.1, gratitude_focus: +0.1, commitment_focus: +0.1, legacy_meaning: +0.1 },
    s47: { core_value_integrity: +0.05 },
    s48: {}, // 용서와 치유 엔딩 → BRANCH_TAGS로 강조
    s49: {}, // 감사와 사랑 엔딩 → BRANCH_TAGS로 강조
    s50: {}, // 결심/희망 엔딩 → BRANCH_TAGS로 강조
};

// --- 3) 브랜치/클러스터 보정
// 해당 씬을 밟으면 관련 성향에 베이스 가점(엔딩은 강하게, 중간 클러스터는 적당히)
const BRANCH_TAGS: Record<string, Partial<Scores>> = {
    // 감사 클러스터
    s38: { gratitude_focus: +0.3 },
    s39: { gratitude_focus: +0.3 },
    // 용서/놓아보내기 클러스터
    s41: { forgiveness_focus: +0.3 },
    s42: { forgiveness_focus: +0.3 },
    // 결심/희망/실천 클러스터
    s43: { commitment_focus: +0.3 },
    s44: { commitment_focus: +0.3 },
    s45: { commitment_focus: +0.3 },
    // 엔딩 보정(강하게)
    s48: { forgiveness_focus: +0.8 },
    s49: { gratitude_focus: +0.8 },
    s50: { commitment_focus: +0.8 },
};

// --- 4) 태그 규칙(임계값은 서비스 톤/스케일에 맞게 조절 가능)
function tagsFrom(scores: Scores): string[] {
    const t: string[] = [];
    // 계획/위험/모호함/협업
    if (scores.planning >= 0.7) t.push("전략가");
    if (scores.planning <= -0.3) t.push("즉흥가");
    if (scores.risk_appetite >= 0.8) t.push("모험가");
    if (scores.tolerance_ambiguity >= 0.8) t.push("애매함 내성 ↑");
    if (scores.collab_pref >= 0.7) t.push("팀플 선호");
    if (scores.collab_pref <= -0.5) t.push("솔플 선호");
    // 가치/정서
    if (scores.emotional_awareness >= 0.8) t.push("감정 메타인지");
    if (scores.core_value_humane >= 0.8) t.push("공감형");
    if (scores.core_value_creative >= 0.8) t.push("창의표현형");
    if (scores.core_value_integrity >= 0.8) t.push("진실성 중시");
    if (scores.legacy_meaning >= 0.8) t.push("의미 추구");
    if (scores.growth_drive >= 0.8) t.push("성장지향");
    // 경계/실행/관계/감사/용서/다짐
    if (scores.assertiveness >= 0.8) t.push("경계 분명");
    if (scores.follow_through >= 0.8) t.push("실행력 강점");
    if (scores.impact_relation >= 0.8) t.push("관계 중시");
    if (scores.gratitude_focus >= 0.8) t.push("감사 지향");
    if (scores.forgiveness_focus >= 0.8) t.push("용서 지향");
    if (scores.commitment_focus >= 0.8) t.push("다짐 지향");
    // 위험 부가/자기비판 경향(설명용 플래그)
    if (scores.pain_origin_self >= 0.7) t.push("자기비판 경향");
    return t;
}

// --- 5) 요약 생성(짧고 방향성 중심)
function summaryFrom(scores: Scores): string {
    const parts: string[] = [];
    // 변화 성향
    parts.push(scores.change_drive > 0 ? "변화 지향" : "수용/적응");
    // 성장/의미/경계
    if (scores.growth_drive >= 0.7) parts.push("성장 추구");
    if (scores.legacy_meaning >= 0.7) parts.push("의미 지향");
    if (scores.assertiveness >= 0.7) parts.push("경계 뚜렷");
    // 영향 축 요약
    if (scores.impact_relation > scores.impact_energy && scores.impact_relation >= 0.5) {
        parts.push("관계 이슈 민감");
    } else if (scores.impact_energy >= 0.7) {
        parts.push("에너지 관리 필요");
    }
    // 정서/특화 포커스
    if (scores.emotional_awareness >= 0.7) parts.push("감정 인식 높음");
    const focusFlags = [
        scores.gratitude_focus >= 0.7 ? "감사" : "",
        scores.forgiveness_focus >= 0.7 ? "용서" : "",
        scores.commitment_focus >= 0.7 ? "다짐" : "",
    ].filter(Boolean);
    if (focusFlags.length) parts.push(`핵심 포커스: ${focusFlags.join("/")}`);
    return parts.join(" · ");
}

// Optional clamp (안정성 향상을 원할 경우 주석 해제)
// function clampAll(scores: Scores, min = -1, max = 1): Scores {
//   for (const k of Object.keys(scores)) scores[k] = Math.max(min, Math.min(max, scores[k]));
//   return scores;
// }

// --- 6) 메인: 씬 아이디 묶음만으로 분석
export function analyzeBySceneIds(sceneIds: string[]): BundleResult {
    const scores: Scores = zeroScores();

    for (const sid of sceneIds) {
        // 1) base centroid
        const base = C[sid];
        if (base) {
            for (const [k, v] of Object.entries(base)) scores[k] += v as number;
        }
        // 2) branch/cluster boost
        const boost = BRANCH_TAGS[sid];
        if (boost) {
            for (const [k, v] of Object.entries(boost)) scores[k] += v as number;
        }
    }

    // clampAll(scores); // 필요시 활성화
    return { scores, tags: tagsFrom(scores), summary: summaryFrom(scores) };
}
