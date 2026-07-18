import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../tasks/task.entity';

export interface EvaluationInput {
  category: string;       // errand / transport / teach / pet / repair / delivery
  educationLevel?: string; // none / highschool / college / university / professional
  estimatedHours: number;
  requiredCreditScore: number;
  requiredExperience: number;
}

export interface EvaluationResult {
  baseReward: number;
  publisherReward: number; // 发布人奖励积分（任务完成后发放给发布人）
  breakdown: {
    categoryScore: number;
    educationScore: number;
    timeScore: number;
    creditScore: number;
    experienceScore: number;
  };
}

@Injectable()
export class EvaluationService {
  // ─── 평가 기준 상수 ───────────────────────────────────────

  private readonly CATEGORY_WEIGHTS: Record<string, number> = {
    errand:    50,   // 심부름 – 비교적 단순
    delivery:  50,   // 배송
    pet:       60,   // 반려동물 – 주의 필요
    transport: 70,   // 운반/이사 – 체력 소모
    teach:     80,   // 교육 – 전문 지식 필요
    repair:    90,   // 수리 – 기술 숙련
  };

  private readonly EDUCATION_MULTIPLIERS: Record<string, number> = {
    none:          1.0,
    highschool:    1.0,
    college:       1.2,
    university:    1.4,
    professional:  1.6,
  };

  private readonly HOURLY_BASE = 10000; // 시간당 기본 포인트

  // ─── 발행인 보상 비율 (baseReward 의 N%) ──────────────────
  private readonly PUBLISHER_REWARD_RATE = 0.10; // 10%
  private readonly PUBLISHER_REWARD_MIN = 5;     // 최소 5 포인트

  // ─── 메인 평가 메서드 ─────────────────────────────────────

  evaluate(input: EvaluationInput): EvaluationResult {
    // 1. 카테고리 점수
    const categoryScore =
      this.CATEGORY_WEIGHTS[input.category] ?? 50;

    // 2. 학력/자격 배율
    const educationMultiplier =
      this.EDUCATION_MULTIPLIERS[input.educationLevel ?? 'none'];

    const educationScore = Math.round(categoryScore * (educationMultiplier - 1));

    // 3. 예상 소요 시간
    const timeScore = Math.round(input.estimatedHours * this.HOURLY_BASE);

    // 4. 신용 등급 요구치
    const creditScore = Math.max(0, (input.requiredCreditScore - 1) * 15);

    // 5. 필요 경험치
    const experienceScore = Math.round(input.requiredExperience * 0.5);

    const baseReward =
      categoryScore + educationScore + timeScore + creditScore + experienceScore;

    // 최소 보상 보장
    const finalReward = Math.max(10, baseReward);

    // 발행인 보상 계산: baseReward 의 15%, 최소 5 포인트
    const publisherReward = Math.max(
      this.PUBLISHER_REWARD_MIN,
      Math.round(finalReward * this.PUBLISHER_REWARD_RATE),
    );

    return {
      baseReward: finalReward,
      publisherReward,
      breakdown: {
        categoryScore,
        educationScore,
        timeScore,
        creditScore,
        experienceScore,
      },
    };
  }
}
