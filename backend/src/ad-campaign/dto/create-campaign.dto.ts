import { AdType, PricingModel } from '../entities/ad-campaign.entity';

export class CreateAdCampaignDto {
  advertiserId: string;
  name: string;
  adType?: AdType;
  pricingModel: PricingModel;
  budgetDaily?: number;
  budgetTotal?: number;
  startDate: string;
  endDate?: string;
  targeting?: {
    geo?: { countries?: string[]; provinces?: string[]; cities?: string[]; schools?: string[] };
    interests?: string[];
    ageGroups?: string[];
    frequency?: { daily?: number; weekly?: number; monthly?: number };
    schedule?: { hours?: number[]; daysOfWeek?: number[] };
  };
  placements?: string[];
}

export class UpdateAdCampaignDto {
  name?: string;
  status?: string;
  budgetDaily?: number;
  budgetTotal?: number;
  startDate?: string;
  endDate?: string;
  targeting?: any;
  placements?: string[];
}
