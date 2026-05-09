import { ProjectAdUrgency } from '../entities/ad-project.entity';

export class GenerateProjectAdDto {
  projectId: string;
  title: string;
  description: string;
  category?: string;
  geoLocation?: {
    city: string;
    school?: string;
    address?: string;
    lat?: number;
    lng?: number;
  };
  coverImage?: string;
  urgency?: ProjectAdUrgency;
}

export class UpdateProjectAdDto {
  title?: string;
  description?: string;
  imageUrl?: string;
  geoTarget?: any;
  interestTarget?: string[];
  priorityScore?: number;
  urgency?: ProjectAdUrgency;
  quotaTotal?: number;
  status?: string;
}
