import {contractTypeEnum, StudentInterface, studentStatus, workTypeEnum} from "../../interfaces/StudentInterface";

import {
    ArrayNotEmpty,
    Contains,
    IsArray,
    IsBoolean,
    IsEmail,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPhoneNumber,
    IsString,
    Min,
//    ValidateIf
} from "class-validator";
import {Transform} from "class-transformer";
import {PartialType} from "@nestjs/mapped-types";

export class CreateStudentDetailsDto implements Partial<StudentInterface>{
    @IsEmail()
    @IsNotEmpty()
    email: string | null;

    @IsOptional()
    @IsPhoneNumber()
    //@IsMobilePhone()
    phoneNumber?: string | null;

    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsString()
    githubName: string;

    @Transform(({ value }) => value.split(','))
    @IsOptional()
    @IsArray()
    portfolioUrl?: string[] | null;

    @Transform(({ value }) => value.split(','))
    @IsArray()
    @ArrayNotEmpty()
    @IsString({each: true})
    @Contains('github.com',{each: true})
    bonusProjectUrl: string[];

    @IsOptional()
    @IsString()
    bio?: string | null;

    @IsNotEmpty()
    //@ValidateIf((obj)=>(obj.expectedWorkType!==""))
    @IsEnum(workTypeEnum)
    expectedWorkType: workTypeEnum;

    @IsString()
    targetWorkCity?: string;

    @IsNotEmpty()
    @IsEnum(contractTypeEnum)
    expectedContractType: contractTypeEnum;

    @IsOptional()
    @IsNumber()
    expectedSalary?: number | null;

    @IsNotEmpty()
    @IsBoolean()
    canTakeApprenticeship: boolean;

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
    @IsNotEmpty()
    @IsEnum(studentStatus)
    status?: studentStatus;
}

export class UpdateStudentDetailsDto extends PartialType(CreateStudentDetailsDto){}
