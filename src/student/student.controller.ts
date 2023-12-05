import {
    Body,
    Controller,
    forwardRef,
    Get,
    Inject,
    Param,
    ParseUUIDPipe,
    Patch,
    UseGuards,
} from '@nestjs/common';
import {AuthGuard} from "@nestjs/passport";
import {StudentService} from "./student.service";
import {StudentProfileResponse, UpdatedStudentResponse} from "../interfaces/StudentInterface";
import {UpdateStudentDetailsDto} from "./dto/update-student-details.dto";

@Controller('student')
export class StudentController {
    constructor(
        @Inject(forwardRef(() => StudentService))
        private readonly studentService: StudentService) {
    }

    @Get('/student-profile/:id')
    @UseGuards(AuthGuard('jwt'))
    async findStudentProfile(
        @Param(
            'id',
            ParseUUIDPipe
        ) id: string,
    ): Promise<StudentProfileResponse>{
        return this.studentService.findOne(id);
    }

    @Patch('/student-profile/:id')
    @UseGuards(AuthGuard('jwt'))
    async updateStudentProfile(
        @Param (
            'id',
            ParseUUIDPipe
        ) studentId: string,
        @Body() studentProfileDetails: UpdateStudentDetailsDto
    ): Promise<UpdatedStudentResponse> {
        return this.studentService.updateOne(studentId, studentProfileDetails);
    }

}

