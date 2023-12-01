import {
    HttpCode,
    HttpException, HttpStatus, Inject,
    Injectable,
    InternalServerErrorException,
    NotAcceptableException,
    NotFoundException
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

@Injectable()
export class StudentService {

    constructor(
        @InjectRepository(StudentEntity)
        private studentProfileRepository: Repository<StudentEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(ProjectEntity)
        private projectRepository: Repository<ProjectEntity>,
        private githubService: GithubNameValidator,) {
    }


    async create(userId): Promise<StudentEntity> {
        try {
            return await this.studentProfileRepository.save({
                userId,
                status: studentStatus.available,
            });
        } catch {
            throw new InternalServerErrorException();
        }
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
        console.log(foundUser)
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


    //@TODO dodanie do update możliwości aktualizacji statusu studenta dostępny-->zatrudniony (0-->2)
    async updateOne(studentId: string, studentProfileDetails: UpdateStudentDetailsDto): Promise<UpdatedStudentResponse> {
        const student = await this.studentProfileRepository.findOne({where: {id: studentId}})

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

        if (student) {
            const userId = await this.getUserByStudentId(studentId);
            const uniqueUserMail = await this.userRepository.find({
                where: {email, id: Not(userId)}
            })
            const githubValidator = await this.githubService.validateGithubName(studentId, githubName)

            if (!(email===undefined) && uniqueUserMail.length > 0 ){
                throw new NotAcceptableException(`Użytkownik z adresem e-mail: ${email} już istnieje w bazie`)
            }

            const update1 = (!Object.values(restOfDetails).every(detail => detail === undefined))
                ?
                await this.studentProfileRepository.createQueryBuilder()
                    .update('students')
                    .set({
                        githubName,
                        ...restOfDetails,
                        updatedAt: dataUpdatedAt,
                    })
                    .where('id = :studentId', {studentId})
                    .execute()
                :
                console.log('no [students] rows affected')
                //console.log(update1)

            const update2 = (email && uniqueUserMail.length===0)
                ?
                await this.userRepository.createQueryBuilder()
                    .update('users')
                    .set({
                        email,   //updatedAt: () => 'CURRENT_TIMESTAMP',
                    })
                    .where('id = :userId', {userId})
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
                    .andWhere('projects.user_id = :id', {id: userId})
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
            urlsUpdate.andWhere('projects.user_id = :id', {id: userId})

            const update3 = await urlsUpdate.execute()
            //console.log(update3)
        }
        if (!student) {
            throw new NotFoundException('Kursant z podanym id nie istnieje')
        }

        return {
            isSuccess: true,
            message: 'All affected records have been successfully updated'
        }

    }
}
