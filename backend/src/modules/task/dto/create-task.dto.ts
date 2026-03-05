import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Implementar login' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'Criar autenticação JWT com cookies' })
  @IsString()
  @IsNotEmpty()
  description!: string;
}
