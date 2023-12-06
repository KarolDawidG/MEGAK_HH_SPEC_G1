import {
    HttpStatus,
    Injectable,
    InternalServerErrorException, NotAcceptableException,
} from '@nestjs/common';
import {StudentEntity} from "./student.entity";
import {StudentProfileResponse, studentStatus, UpdatedStudentResponse} from "../interfaces/StudentInterface";
import {InjectRepository} from "@nestjs/typeorm";
import {Not, Repository, UpdateResult} from "typeorm";
import {ProjectEntity} from "../project/project.entity";
import {UpdateStudentDetailsDto} from "./dto/update-student-details.dto";
import {UserEntity} from "../user/user.entity";
import {UpdateProjectUrlDto} from "../project/dto/update-project-url.dto";
import {projectTypeEnum} from "../interfaces/ProjectInterface";
import {GithubNameValidator} from "../utils/githubNameValidator";
import {StudentListQueryRequestInterface} from '../interfaces/StudentListFilterInterface';
import {roleEnum} from 'src/interfaces/UserInterface';
import {StudentListResponse} from 'src/interfaces/StudentListResponse';
import {messages} from "../config/messages";


@Injectable()
export class StudentService {

    constructor(
        @InjectRepository(StudentEntity)
        private studentRepository: Repository<StudentEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(ProjectEntity)
        private projectRepository: Repository<ProjectEntity>,
        private githubService: GithubNameValidator,
    ) {
    }

    async create(userId): Promise<StudentEntity> {
        try {
            return await this.studentRepository.save({
                userId,
                status: studentStatus.available,
            });
        } catch {
            throw new InternalServerErrorException();
        }

    }

    async findAll(
        filterParams: StudentListQueryRequestInterface,
    ): Promise<[StudentListResponse[], number]> {
        const limit = (filterParams.pitems <= 90 && filterParams.pitems) || 15;
        const offset = (filterParams.page ?? 1) * limit - limit ?? 1;

        const query = await this.studentRepository
            .createQueryBuilder('student')
            .leftJoinAndSelect('student.user', 'user')
            .leftJoinAndSelect('user.projectEvaluation', 'evaluation')
            .select([
                'student.firstName AS firstName',
                'student.lastName AS lastName',
                'student.expectedWorkType AS expectedWorkType',
                'student.targetWorkCity AS targetWorkCity',
                'student.expectedContractType AS expectedContractType',
                'student.expectedSalary AS expectedSalary',
                'student.canTakeApprenticeship AS canTakeApprenticeship',
                'student.monthsOfCommercialExperience AS monthsOfCommercialExperience',
                // 'user.role AS role', // Uncomment to debug role type
                'evaluation.projectDegree AS projectDegree',
                'evaluation.teamProjectDegree AS teamProjectDegree',
                'evaluation.courseCompletion AS courseCompletion',
                'evaluation.courseEngagement AS courseEngagemnet',
            ])
            .where(`user.role = ${roleEnum.student}`)
            .andWhere('user.isActive = 1');

        if (filterParams?.pd) {
            query.andWhere('evaluation.projectDegree IN (:val)', {
                val: filterParams.pd,
            });
        }

        if (filterParams?.cc) {
            query.andWhere('evaluation.courseCompletion IN (:val)', {
                val: filterParams.cc,
            });
        }

        if (filterParams?.ce)
            query.andWhere('evaluation.courseEngagement IN (:val)', {
                val: filterParams.ce,
            });

        if (filterParams?.tpd)
            query.andWhere('evaluation.teamProjectDegree IN (:val)', {
                val: filterParams.tpd,
            });

        if (filterParams?.es)
            query.andWhere(
                'student.expectedSalary BETWEEN :lowerMargin AND :upperMargin',
                {
                    lowerMargin: filterParams.es[0] || 0,
                    upperMargin: filterParams.es[1] || 100000000,
                },
            );

        if (filterParams?.cta)
            query.andWhere('student.canTakeApprenticeship = :val', {
                val: filterParams.cta,
            });

        if (filterParams?.ect)
            query.andWhere('student.expectedContractType IN (:val)', {
                val: filterParams.ect,
            });

        if (filterParams?.ewt)
            query.andWhere('student.expectedContractType IN (:val)', {
                val: filterParams.ewt,
            });

        if (filterParams?.moce)
            query.andWhere('student.monthsOfCommercialExperience >= :val', {
                val: filterParams.moce,
            });

        if (filterParams?.srch)
            query.andWhere('student.targetWorkCity LIKE :val', {
                val: `%${filterParams.srch}%`,
            });

        return [
            await query.limit(limit).offset(offset).getRawMany(),
            await query.getCount(),
        ];

    }

    async findOne(userId: string): Promise<StudentProfileResponse> {
        try {
            const student = await this.studentRepository
                .createQueryBuilder('student')
                .leftJoin('student.user', 'user')
                //.leftJoin('user.student','projects')
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
                    'student.courses',
                ])
                .where('student.user_id = :userId', {userId})
                .addSelect((subQuery) => {
                    return subQuery
                        .select('projects.url', 'bonusProjectUrl')
                        .from(ProjectEntity, 'projects')
                        .where('projects.user_id = :userId', {userId})
                        .andWhere('projects.type="0"');
                }, 'bonusProjectUrl')
                .addSelect((subQuery) => {
                    return subQuery
                        .select('projects.url', 'portfolioUrl')
                        .from(ProjectEntity, 'projects')
                        .where('projects.user_id = :userId', {userId})
                        .andWhere('projects.type="1"');
                }, 'portfolioUrl')
                .getRawOne();
            console.log(student);
            return {
                studentDetails: student,
            };
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async findStudentById(id: string): Promise<StudentEntity> {
        try {
            return await this.studentRepository.findOne({where: {userId: id}})
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async updateOne(student, studentProfileDetails: UpdateStudentDetailsDto): Promise<UpdatedStudentResponse> {
        try {
            const dataUpdatedAt = () => 'CURRENT_TIMESTAMP';

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
                type: projectTypeEnum.bonusProject,
                updatedAt: dataUpdatedAt,
            }
            const setPortfolioUrl: UpdateProjectUrlDto = {
                url: JSON.stringify(portfolioUrl),
                type: projectTypeEnum.portfolio,
                updatedAt: dataUpdatedAt,
            }

            const githubValidator = await this.githubService.validateGithubName(student.id, githubName)

            const update1 = (!Object.values({...restOfDetails, githubName}).every(detail => detail === undefined)) || githubName
                ?
                await this.studentRepository.createQueryBuilder()
                    .update('students')
                    .set({
                        githubName,
                        ...restOfDetails,
                        updatedAt: dataUpdatedAt,
                    })
                    .where('id = :id', {id: student.id})
                    .execute()
                :
                console.log('no [students] rows affected')
            //console.log(update1)

            const update2 = (email)
                ?
                await this.userRepository.createQueryBuilder()
                    .update('users')
                    .set({
                        email,   //updatedAt: () => 'CURRENT_TIMESTAMP',
                    })
                    .where('id = :id', {id: student.userId})
                    .execute()
                :
                console.log('no [users] rows affected');
            //console.log(update2)

            const urlsUpdate = this.projectRepository.createQueryBuilder()
                .update('projects')
            if (studentProfileDetails.bonusProjectUrl && studentProfileDetails.portfolioUrl) {
                urlsUpdate
                    .set(setBonusProjectUrl)
                    .where('projects.type = :type', {type: projectTypeEnum.bonusProject})
                    .andWhere('projects.user_id = :id', {id: student.userId})
                await urlsUpdate.execute()
                urlsUpdate
                    .set(setPortfolioUrl)
                    .where('projects.type = :type', {type: projectTypeEnum.portfolio})
            } else if (studentProfileDetails.bonusProjectUrl) {
                urlsUpdate
                    .set(setBonusProjectUrl)
                    .where('projects.type = :type', {type: projectTypeEnum.bonusProject})
            } else if (studentProfileDetails.portfolioUrl) {
                urlsUpdate
                    .set(setPortfolioUrl)
                    .where('projects.type = :type', {type: projectTypeEnum.portfolio})
            } else {
                console.log('no [projects] rows affected');
                return {
                    isSuccess: !!(update1 as UpdateResult || update2 as UpdateResult),
                    message: (update1 as UpdateResult || update2 as UpdateResult) ? 'All affected records' +
                        ' have been successfully updated' : 'no [students/users/projects] rows affected'
                }
            }
            urlsUpdate.andWhere('projects.user_id = :id', {id: student.userId})

            const update3 = await urlsUpdate.execute()
            //console.log(update3)

            return {
                isSuccess: true,
                message: 'All affected records have been successfully updated'
            };
        } catch (e) {
            if (e.code === 'ER_DUP_ENTRY') {
                throw new NotAcceptableException(messages.updatedUserEmailExist);
            }
            throw new InternalServerErrorException();
        }

    }

}
