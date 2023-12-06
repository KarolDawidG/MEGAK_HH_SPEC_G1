import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Query,
    Param,
    ParseUUIDPipe,
    Patch,
    UseGuards,
    BadRequestException, NotAcceptableException,
} from '@nestjs/common';
import {AuthGuard} from "@nestjs/passport";
import {StudentService} from "./student.service";
import {StudentListQuery} from './dto/student.list-query';
import {StudentList} from './dto/student.list';
import {messages} from 'src/config/messages';
import {StudentInterface, StudentProfileResponse, UpdatedStudentResponse} from "../interfaces/StudentInterface";
import {UpdateStudentDetailsDto} from "./dto/update-student-details.dto";
import {UserService} from "../user/user.service";
import {StudentEntity} from "./student.entity";
import {UserEntity} from "../user/user.entity";
import {roleEnum} from "../interfaces/UserInterface";

@Controller('student')
export class StudentController {
    constructor(
        private readonly studentService: StudentService,
        private readonly userService: UserService,) {
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/')
    // @UsePipes(
    //   new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false }), // @TODO: Seems to deosn't work
    // )
    async getList(
        @Query() filterOptions: StudentListQuery,
    ): Promise<[StudentList[], number]> {
        const searchResult = await this.studentService.findAll(filterOptions);

        if (!searchResult.length) {
            throw new NotFoundException(messages.emptySearchResult);
        }

        return searchResult;
    }

    @Get('/student-profile/:id')
    @UseGuards(AuthGuard('jwt'))
    async findStudentProfile(
        @Param(
            'id',
            ParseUUIDPipe
        ) id: string,
    ): Promise<StudentProfileResponse> {
        const user = await this.userService.findById(id);
        if (!user) {
            throw new NotFoundException(messages.userIdNotFound);
        }
        if (!user.isActive) {
            throw new BadRequestException(messages.userIsNotActive);
        }
        const userProfile = await this.studentService.findOne(user.id);
        if (!userProfile.studentDetails) {
            throw new NotFoundException(messages.studentIdNotFound);
        }
        return userProfile;
    }


    @Patch('/student-profile/:id')
    @UseGuards(AuthGuard('jwt'))
    async updateStudentProfile(
        @Param(
            'id',
           ParseUUIDPipe
        ) id: string,
        @Body() studentProfileDetails: UpdateStudentDetailsDto
    ): Promise<UpdatedStudentResponse> {
        const user = await this.userService.findById(id);
        if (!user) {
            throw new NotFoundException(messages.userIdNotFound);
        }
        if (!user.email) {
            throw new BadRequestException(messages.emailNotFound);
        }
        if (!user.isActive) {
            throw new BadRequestException(messages.notActiveUserError);
        }
        if(!(user.role===roleEnum.student)){
            throw new NotAcceptableException(messages.notAcceptableRoleError);
        }

        const student = await this.studentService.findStudentById(user.id);
        if (!student) {
            throw new NotFoundException(messages.studentIdNotFound);
        }

        return this.studentService.updateOne(student, studentProfileDetails);
    }

}
