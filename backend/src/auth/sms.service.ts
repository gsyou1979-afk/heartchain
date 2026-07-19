import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface SmsCodeEntry {
  code: string;
  expiresAt: number;
}

@Injectable()
export class SmsService {
  /** 메모리 기반 코드 저장소 (phone -> {code, expiresAt}) */
  private readonly codeStore = new Map<string, SmsCodeEntry>();

  /** 인증번호 만료 시간 (초) */
  private readonly CODE_EXPIRES_SEC = 300;

  /** 개발 환경 고정 코드 */
  private readonly devSmsCode: string | undefined;

  constructor(private readonly configService: ConfigService) {
    this.devSmsCode = this.configService.get<string>('DEV_SMS_CODE');
    // 개발 환경 라벨 유무
    const isDev = this.isDevMode();
    console.log(
      `[SmsService] ${isDev ? 'DEV mode: ' + (this.devSmsCode ? 'fixed code active' : 'no DEV_SMS_CODE set') : 'PROD mode'}`,
    );
  }

  /** 개발 환경 여부 */
  private isDevMode(): boolean {
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    if (nodeEnv === 'development') return true;
    if (this.devSmsCode) return true;
    return false;
  }

  /**
   * 인증번호 생성 및 전송
   * 개발 환경: 실제 SMS 전송 없이 콘솔에 코드 출력 + DEV_SMS_CODE 사용
   */
  sendCode(phone: string): { message: string; expiresIn: number } {
    if (this.isDevMode()) {
      // 개발 환경: DEV_SMS_CODE 또는 기본값 123456
      const code = this.devSmsCode || '123456';
      this.codeStore.set(phone, {
        code,
        expiresAt: Date.now() + this.CODE_EXPIRES_SEC * 1000,
      });
      console.log(`[DEV SMS] Phone: ${phone}, Code: ${code}, Expires in: ${this.CODE_EXPIRES_SEC}s`);
      return {
        message: `验证码已发送（开发模式：${code}）`,
        expiresIn: this.CODE_EXPIRES_SEC,
      };
    }

    // 프로덕션: 실제 SMS 전송 로직 (Aliyun SMS 등)
    // TODO: 실제 SMS 전송 구현
    const code = this.generateRandomCode();
    this.codeStore.set(phone, {
      code,
      expiresAt: Date.now() + this.CODE_EXPIRES_SEC * 1000,
    });
    console.log(`[PROD SMS] Phone: ${phone}, Code: ${code}`);
    return { message: '验证码已发送', expiresIn: this.CODE_EXPIRES_SEC };
  }

  /**
   * 인증번호 검증
   * 개발 환경: DEV_SMS_CODE와 일치하면 통과
   */
  verifyCode(phone: string, code: string): boolean {
    // 개발 환경 고정 코드 우선 검사
    if (this.isDevMode()) {
      const fixedCode = this.devSmsCode || '123456';
      if (code === fixedCode) {
        console.log(`[DEV SMS] Verified: ${phone} with fixed code`);
        return true;
      }
    }

    // 저장된 코드 검사
    const entry = this.codeStore.get(phone);
    if (!entry) {
      console.log(`[SMS] No code found for ${phone}`);
      return false;
    }

    if (Date.now() > entry.expiresAt) {
      this.codeStore.delete(phone);
      console.log(`[SMS] Code expired for ${phone}`);
      return false;
    }

    if (entry.code !== code) {
      console.log(`[SMS] Code mismatch for ${phone}`);
      return false;
    }

    // 검증 성공 → 저장소에서 제거
    this.codeStore.delete(phone);
    console.log(`[SMS] Verified: ${phone}`);
    return true;
  }

  /** 랜덤 6자리 인증번호 생성 */
  private generateRandomCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
