import {forwardRef, Inject, Injectable, NotAcceptableException, NotFoundException} from '@nestjs/common';
import {StudentEntity} from "./student.entity";
import {StudentProfileResponse, UpdatedStudentResponse} from "../interfaces/StudentInterface";
import {InjectRepository} from "@nestjs/typeorm";
import {Not, Repository} from "typeorm";
import {ProjectEntity} from "../project/project.entity";
import {UpdateStudentDetailsDto} from "./dto/update-student-details.dto";
import {AxiosError} from "axios";
import {catchError, lastValueFrom} from "rxjs";
import {HttpService} from "@nestjs/axios";
import {UserEntity} from "../user/user.entity";
import {UpdateProjectUrlDto} from "../project/dto/update-project-url.dto";
import {ProjectTypeEnum} from "../interfaces/ProjectInterface";
import {GithubNameValidator} from "../utils/githubNameValidator";


@Injectable()
export class StudentService {

    constructor(
        @InjectRepository(StudentEntity)
        private studentProfileRepository: Repository<StudentEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(ProjectEntity)
        private projectRepository: Repository<ProjectEntity>,
        private githubService: GithubNameValidator,
        private readonly httpService: HttpService) {
    }

    async getUserByStudentId(studentId: string): Promise<string> {
        const userId = await this.studentProfileRepository
            .createQueryBuilder('student')
            .leftJoin('student.user', 'user')
            .select('user.id', 'userId')
            .where('student.id = :id', {id: studentId})
            .getRawOne()
        const user_id = userId.userId;

        const foundUser = await this.userRepository.findOne({where: {id: user_id}});
        //console.log(foundUser)
        return foundUser.id
    }

    async findOne(id: string): Promise<StudentProfileResponse> {
        const userId = await this.getUserByStudentId(id);

        const student = await this.studentProfileRepository.createQueryBuilder('student')
            .leftJoin('student.user', 'user')
            //.leftJoin('student.projects','projects')
            .select([
                'user.email',
                'student.phoneNumber',
                'student.firstName',
                'student.lastName',
                'student.githubName',
                'student.bio',
                'student.expectedWorkType',
                'student.targetWorkCity',
                'student.expectedContractType',
                'student.expectedSalary',
                'student.canTakeApprenticeship',
                'student.monthsOfCommercialExperience',
                'student.education',
                'student.workExperience',
                'student.courses'])
            .addSelect(subQuery => {
                return subQuery
                    .select("projects.url", 'bonusProjectUrl')
                    .from(ProjectEntity, 'projects')
                    .where('projects.user_id = :userId', {userId})
                    .andWhere('projects.type="0"')
            }, 'bonusProjectUrl')
            .addSelect(subQuery => {
                return subQuery
                    .select("projects.url", 'portfolioUrl')
                    .from(ProjectEntity, 'projects')
                    .where('projects.user_id = :userId', {userId})
                    .andWhere('projects.type="1"')
            }, 'portfolioUrl')
            .where('student.id = :id', {id})
            .getRawOne();

        if (!student) {
            throw new NotFoundException('Kursant z podanym id nie istnieje')
        }
        console.log(student)
        return {
            studentDetails: student,
        }
    };

    //TODO: walidacja na unikalny mail
    async updateOne(studentId: string, studentProfileDetails: UpdateStudentDetailsDto): Promise<UpdatedStudentResponse> {
        const student = await this.studentProfileRepository.findOne({where: {id: studentId}})
        const userId = await this.getUserByStudentId(studentId);
        const dataUpdatedAt = new Date().toLocaleDateString();

        const {
            email,
            bonusProjectUrl,
            portfolioUrl,
            githubName,
            updatedAt,
            ...restOfDetails
        } = studentProfileDetails

        const setBonusProjectUrl: UpdateProjectUrlDto = {
            url: JSON.stringify(bonusProjectUrl),
            type: ProjectTypeEnum.bonusProject,
            updatedAt: dataUpdatedAt,
        }
        const setPortfolioUrl: UpdateProjectUrlDto = {
            url: JSON.stringify(portfolioUrl),
            type: ProjectTypeEnum.portfolio,
            updatedAt: dataUpdatedAt,
        }

        if (student) {
            if (githubName) {
                const githubValidator = await this.githubService.validateGithubName(studentId, githubName)

                if (githubValidator.isGithubUser && githubValidator.isGithubUserUnique) {

                    const update1 = await this.studentProfileRepository.createQueryBuilder()
                        .update('students')
                        .set({
                            githubName,
                            ...restOfDetails,
                            updatedAt: dataUpdatedAt,
                        })
                        .where('id = :studentId', {studentId})
                        .execute()

                    const update2 = await this.userRepository.createQueryBuilder()
                        .update('users')
                        .set({
                            email,
                            //updatedAt: new Date().toLocaleDateString(),
                        })
                        .where('id = :userId', {userId})
                        .execute()

                    const urlsUpdate = this.projectRepository
                        .createQueryBuilder().update('projects')
                    if (studentProfileDetails.bonusProjectUrl && studentProfileDetails.portfolioUrl) {
                        urlsUpdate
                            .set(setBonusProjectUrl)
                            .where('projects.type = :type', {type: '0'})
                            .andWhere('projects.user_id = :id', {id: userId})
                        await urlsUpdate.execute()
                        urlsUpdate
                            .set(setPortfolioUrl)
                            .where('projects.type = :type', {type: '1'})
                    } else if (studentProfileDetails.bonusProjectUrl) {
                        urlsUpdate
                            .set(setBonusProjectUrl)
                            .where('projects.type = :type', {type: '0'})
                    } else {
                        urlsUpdate
                            .set(setPortfolioUrl)
                            .where('projects.type = :type', {type: '1'})
                    }
                    urlsUpdate.andWhere('projects.user_id = :id', {id: userId})

                    const update3 = await urlsUpdate.execute()
                }
            }
        } else {
            throw new NotFoundException('Kursant z podanym id nie istnieje')
        }


        return {
            isSuccess: true
        };
    }
}
