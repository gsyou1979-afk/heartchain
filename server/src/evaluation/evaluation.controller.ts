import { Controller, Post, Body } from '@nestjs/common';
import { EvaluationService, EvaluationInput } from './evaluation.service';

@Controller('evaluation')
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Post('calculate')
  calculate(@Body() input: EvaluationInput) {
    return this.evaluationService.evaluate(input);
  }
}
