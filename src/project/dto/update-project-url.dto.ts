import {projectTypeEnum} from "../../interfaces/ProjectInterface";
import {IsArray, IsDateString, IsEnum, IsOptional} from "class-validator";
import {Transform} from "class-transformer";

export class UpdateProjectUrlDto {
    @Transform(({ value }) => value.split(','))
    @IsOptional()
    @IsArray()
    url: string;

    @IsOptional()
    @IsEnum(projectTypeEnum)
    type: projectTypeEnum;

    @IsOptional()
    @IsDateString()
    updatedAt: () => string;
}
