import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import {
  workTypeEnum,
  contractTypeEnum,
} from 'src/interfaces/StudentInterface';
import { StudentListQueryRequestInterface } from 'src/interfaces/StudentListFilterInterface';
import { transformToArray } from 'src/utils/transformToArray';

export class StudentListQuery implements StudentListQueryRequestInterface {
  @IsOptional()
  @Transform(transformToArray)
  @IsArray()
  cc?: number[];

  @IsOptional()
  @Transform(transformToArray)
  @IsArray()
  ce?: number[];

  @IsOptional()
  @Transform(transformToArray)
  @IsArray()
  pd?: number[];

  @IsOptional()
  @Transform(transformToArray)
  @IsArray()
  tpd?: number[];

  @IsOptional()
  @Transform(transformToArray)
  @IsArray()
  ewt?: workTypeEnum[];

  @IsOptional()
  @Transform(transformToArray)
  @IsArray()
  ect?: contractTypeEnum[];

  @IsOptional()
  @Transform(transformToArray)
  @IsArray()
  es?: [number, number];

  @IsOptional()
  @IsBoolean()
  cta?: boolean;

  @IsOptional()
  @IsNumber()
  moce?: number;

  @IsOptional()
  @IsString()
  srch?: string;

  @IsOptional()
  @IsNumber()
  @IsNumber({ allowNaN: false })
  @Min(1)
  page?: number;

  @IsOptional()
  @IsNumber()
  pitems?: number;
}
