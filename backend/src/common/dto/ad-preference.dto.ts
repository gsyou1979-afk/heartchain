import { IsBoolean, IsOptional, IsObject, IsNumber, Min, Max } from 'class-validator';

export class AdPreferenceDto {
  @IsBoolean()
  @IsOptional()
  adEnabled?: boolean;

  @IsObject()
  @IsOptional()
  preferences?: {
    projectAds?: boolean;
    charityAds?: boolean;
    commercialAds?: boolean;
  };

  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  maxDailyAds?: number;

  @IsNumber()
  @Min(1)
  @Max(50)
  @IsOptional()
  adInterval?: number;

  @IsBoolean()
  @IsOptional()
  personalizedAds?: boolean;
}

export class CreateAdPreferenceDto extends AdPreferenceDto {}
