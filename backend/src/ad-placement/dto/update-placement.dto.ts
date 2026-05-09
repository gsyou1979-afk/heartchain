import { PartialType } from '@nestjs/mapped-types';
import { CreateAdPlacementDto } from './create-placement.dto';

export class UpdateAdPlacementDto extends PartialType(CreateAdPlacementDto) {}
