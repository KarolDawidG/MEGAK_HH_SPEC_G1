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
import { TransformToArray } from 'src/utils/TransformToArray';

export class StudentListQuery implements StudentListQueryRequestInterface {
  @IsOptional()
  @Transform(TransformToArray)
  @IsArray()
  cc?: number[];

  @IsOptional()
  @Transform(TransformToArray)
  @IsArray()
  ce?: number[];

  @IsOptional()
  @Transform(TransformToArray)
  @IsArray()
  pd?: number[];

  @IsOptional()
  @Transform(TransformToArray)
  @IsArray()
  tpd?: number[];

  @IsOptional()
  @Transform(TransformToArray)
  @IsArray()
  ewt?: workTypeEnum[];

  @IsOptional()
  @Transform(TransformToArray)
  @IsArray()
  ect?: contractTypeEnum[];

  @IsOptional()
  @Transform(TransformToArray)
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
  page: number;

  @IsOptional()
  @IsNumber()
  pitems?: number;
}
