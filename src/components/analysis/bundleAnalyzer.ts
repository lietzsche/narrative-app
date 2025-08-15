// analysis/bundleAnalyzer.ts
type Scores = Record<string, number>;
type BundleResult = { scores: Scores; tags: string[]; summary: string };

// --- 1) 성향 키 목록 (UI 노출/툴팁에 사용)
export const TRAITS = [
    "planning","emotional_awareness","challenge_frame","impact_energy","impact_relation",
    "decision_latency","change_drive","social_anchor","pain_origin_self","collab_pref",
    "core_value_humane","core_value_creative","core_value_integrity","risk_appetite",
    "tolerance_ambiguity","assertiveness","growth_drive","follow_through",
    "legacy_meaning","gratitude_focus","forgiveness_focus","commitment_focus"
] as const;

// --- 2) 씬별 센트로이드(선택 평균치). 필요시 숫자 미세조정하면 됨.
// 최소 핵심 축만 반영(가벼운 룰): 실제 서비스에선 persona_scene_centroids.json 로드로 대체 가능.
const C: Record<string, Partial<Scores>> = {
    s1:  { planning: +0.3 }, // s1은 평균적으로 계획성에 소폭 플러스
    s2:  { emotional_awareness: +0.6 },
    s3:  { emotional_awareness: +0.2 },
    s4:  { emotional_awareness: +0.2 },
    s5:  { challenge_frame: +0.1, tolerance_ambiguity: +0.35 },
    s6:  { impact_energy: +0.33, impact_relation: +0.33, decision_latency: +0.33 },
    s7:  { change_drive: +0.2 }, // 평균적으로 변화 의지 약간 플러스
    s8:  { social_anchor: +0.1 },
    s9:  { impact_relation: +0.27, pain_origin_self: +0.27 },
    s10: { }, s11: { }, s12: { },
    s13: { collab_pref: -0.07 },  // 혼자/도움/진행중 평균치
    s14: { collab_pref: +0.22 },
    s15: { core_value_integrity: +0.33, core_value_creative: +0.33, core_value_humane: +0.33 },
    s16: { follow_through: +0.27, risk_appetite: +0.2 },
    s17: { risk_appetite: +0.33, tolerance_ambiguity: +0.13 },
    s18: { risk_appetite: +0.13, tolerance_ambiguity: +0.2, planning: +0.1 },
    s19: { assertiveness: +0.13, emotional_awareness: +0.1, gratitude_focus: +0.07 },
    s20: { assertiveness: +0.33, gratitude_focus: +0.3, forgiveness_focus: +0.17 },
    s21: { assertiveness: +0.17, planning: -0.07, tolerance_ambiguity: +0.07 },
    s22: { follow_through: +0.33, risk_appetite: +0.17, emotional_awareness: +0.07 },
    s23: { growth_drive: +0.55, core_value_creative: +0.08, risk_appetite: +0.08 },
    s24: { risk_appetite: -0.1, follow_through: -0.1, assertiveness: -0.1, planning: -0.05, tolerance_ambiguity:+0.08 },
    s25: { planning: +0.17, follow_through: +0.43, collab_pref: +0.1 },
    s26: { legacy_meaning: +0.4 },
    s27: { legacy_meaning: +0.43, core_value_creative: +0.05, core_value_humane: +0.08 },
    // s28 이후는 브랜치 보정이 핵심(아래 BRANCH_TAGS 참고)
    s28: {},
    s29: {}, s30: {}, s31: {}, s32: {}, // 용서 브랜치
    s33: {}, s34: {}, s35: {}, s36: {}, // 감사 브랜치
    s37: {}, s38: {}, s39: {}, s40: {}  // 다짐 브랜치
};

// --- 3) 브랜치 보정: 해당 씬이 포함되면 관련 성향에 베이스 가점
const BRANCH_TAGS: Record<string, Partial<Scores>> = {
    // 용서 s29~s32
    s29: { forgiveness_focus: +0.6 }, s30: { forgiveness_focus: +0.6 },
    s31: { forgiveness_focus: +0.6 }, s32: { forgiveness_focus: +0.6 },
    // 감사 s33~s36
    s33: { gratitude_focus: +0.6 }, s34: { gratitude_focus: +0.6 },
    s35: { gratitude_focus: +0.6 }, s36: { gratitude_focus: +0.6 },
    // 다짐 s37~s40
    s37: { commitment_focus: +0.6 }, s38: { commitment_focus: +0.6 },
    s39: { commitment_focus: +0.6 }, s40: { commitment_focus: +0.6 }
};

// --- 4) 태그 규칙(임계값은 서비스 톤에 맞게 조절)
function tagsFrom(scores: Scores): string[] {
    const tags: string[] = [];
    if (scores.planning >= 0.7) tags.push("전략가");
    if (scores.planning <= -0.3) tags.push("즉흥가");
    if (scores.risk_appetite >= 0.8) tags.push("모험가");
    if (scores.tolerance_ambiguity >= 0.8) tags.push("애매함 내성 ↑");
    if (scores.collab_pref >= 0.7) tags.push("팀플 선호");
    if (scores.collab_pref <= -0.5) tags.push("솔플 선호");
    if (scores.core_value_humane >= 0.8) tags.push("공감형");
    if (scores.core_value_creative >= 0.8) tags.push("창의표현형");
    if (scores.core_value_integrity >= 0.8) tags.push("진실성 중시");
    if (scores.forgiveness_focus >= 0.8) tags.push("용서 지향");
    if (scores.gratitude_focus >= 0.8) tags.push("감사 지향");
    if (scores.commitment_focus >= 0.8) tags.push("다짐 지향");
    if (scores.follow_through >= 0.8) tags.push("실행력 강점");
    if (scores.assertiveness >= 0.8) tags.push("경계 분명");
    return tags;
}

// --- 5) 요약 생성
function summaryFrom(scores: Scores): string {
    const parts: string[] = [];
    parts.push(scores.change_drive > 0 ? "변화 지향" : "수용/적응");
    if (scores.growth_drive >= 0.7) parts.push("성장 추구");
    if (scores.legacy_meaning >= 0.7) parts.push("의미/유산 지향");
    if (scores.impact_relation > scores.impact_energy) parts.push("관계 이슈 민감");
    else if (scores.impact_energy > 0.7) parts.push("에너지 관리 필요");
    return parts.join(" · ");
}

// --- 6) 메인: 씬 아이디 묶음만으로 분석
export function analyzeBySceneIds(sceneIds: string[]): BundleResult {
    const scores: Scores = Object.fromEntries(TRAITS.map(t => [t, 0]));
    for (const sid of sceneIds) {
        const base = C[sid] || {};
        for (const [k, v] of Object.entries(base)) scores[k] += v as number;
        const branch = BRANCH_TAGS[sid];
        if (branch) for (const [k, v] of Object.entries(branch)) scores[k] += v as number;
    }
    return { scores, tags: tagsFrom(scores), summary: summaryFrom(scores) };
}
