/**
 * 국가코드 → region 매핑
 */
export const COUNTRY_CODES: Record<string, string> = {
  kr: '+82',
  cn: '+86',
  jp: '+81',
  us: '+1',
  vn: '+84',
  th: '+66',
  sg: '+65',
  my: '+60',
  ph: '+63',
  id: '+62',
};

/**
 * region → 국가코드 반환
 */
export function getCountryCodeByRegion(region: string): string {
  return COUNTRY_CODES[region] || '';
}

/**
 * 전화번호를 E.164 국제 형식으로 변환
 * - 이미 '+'로 시작하면 그대로 반환
 * - 국가코드가 이미 포함되어 있으면 그대로 반환 (중복 방지)
 * - 그 외에는 국가코드 + 로컬번호 조합
 *
 * @param phone 사용자가 입력한 원본 전화번호
 * @param countryCode 국가코드 (예: '+82', '+86'). 빈 문자열이면 변환하지 않음.
 * @returns E.164 형식 전화번호
 */
export function formatPhone(phone: string, countryCode: string): string {
  const trimmed = phone.trim();

  // 이미 국제 형식이면 그대로 반환
  if (trimmed.startsWith('+')) {
    return trimmed;
  }

  // 국가코드가 없으면 변환하지 않음
  if (!countryCode) {
    return trimmed;
  }

  // 국가코드가 '+'로 시작하지 않으면 보정
  const code = countryCode.startsWith('+') ? countryCode : `+${countryCode}`;

  // 로컬번호가 0으로 시작하면 제거 (한국: 010 → 10)
  let localNumber = trimmed;
  if (localNumber.startsWith('0')) {
    localNumber = localNumber.slice(1);
  }

  return `${code}${localNumber}`;
}
