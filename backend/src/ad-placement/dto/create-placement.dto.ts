export class CreateAdPlacementDto {
  code: string;
  name: string;
  description?: string;
  platform: 'web' | 'ios' | 'android';
  page: string;
  position: string;
  width: number;
  height: number;
  supportedTypes?: string[];
  floorCpm?: number;
  isActive?: boolean;
}
