import { IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  priority: string;

  @IsString()
  deliveryDate: string;

  @IsString()
  projectId: string;
}
