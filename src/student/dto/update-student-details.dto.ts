import {contractTypeEnum, StudentInterface, workTypeEnum} from "../../interfaces/StudentInterface";

import {
    IsArray,
    IsBoolean, IsDateString,
    IsEmail,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPhoneNumber,
    IsString,
    Min,
    //ValidateIf
} from "class-validator";
//import {Unique} from "typeorm";
import {Transform} from "class-transformer";

export class UpdateStudentDetailsDto implements Partial<StudentInterface>{
    @IsOptional()
    //@ValidateIf(obj=>obj.email==='value')
    @IsEmail()
    @IsNotEmpty()
    email: string | null;

    @IsOptional()
    @IsPhoneNumber()
    //@IsMobilePhone()
    phoneNumber?: string | null;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsOptional()
    //@ValidateIf(obj=>obj.githubName==='value')
    @IsNotEmpty()
    @IsString()
    githubName: string;

    @Transform(({ value }) => value.split(','))
    @IsOptional()
    @IsArray()
    portfolioUrl?: string[] | null;

    @Transform(({ value }) => value.split(','))
    @IsOptional()
    @IsNotEmpty()
    @IsArray()
    bonusProjectUrl: string[];

    @IsOptional()
    @IsString()
    bio?: string | null;

    @IsOptional()
    @IsNotEmpty()
    @IsEnum(workTypeEnum)
    expectedWorkType: workTypeEnum;

    @IsOptional()
    @IsString()
    targetWorkCity?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsEnum(contractTypeEnum)
    expectedContractType: contractTypeEnum;

    @IsOptional()
    @IsNumber()
    expectedSalary?: number | null;

    @IsOptional()
    @IsNotEmpty()
    @IsBoolean()
    canTakeApprenticeship: boolean;

    @IsOptional()
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    monthsOfCommercialExperience: number;

    @IsOptional()
    @IsString()
    education?: string | null;

    @IsOptional()
    @IsString()
    workExperience?: string | null

    @IsOptional()
    @IsString()
    courses?: string | null;

    @IsOptional()
    @IsDateString()
    updatedAt: () => string;
}

