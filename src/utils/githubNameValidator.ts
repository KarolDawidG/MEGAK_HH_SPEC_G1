import {Injectable, NotFoundException} from '@nestjs/common';
import {catchError, lastValueFrom} from "rxjs";
import {AxiosError} from "axios";
import {Not, Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {StudentEntity} from "../student/student.entity";
import {HttpService} from "@nestjs/axios";
import {githubNameValidatorResponse} from "../interfaces/StudentInterface";

@Injectable()
export class GithubNameValidator {

    constructor(
        @InjectRepository(StudentEntity)
        private studentRepository: Repository<StudentEntity>,
        private readonly httpService: HttpService) {
    }

    async validateGithubName(id: string, githubName: string): Promise<githubNameValidatorResponse> {

        if (githubName) {
            const {data} = await lastValueFrom(
                this.httpService.get(`https://api.github.com/users/${githubName}`).pipe(
                    catchError((error: AxiosError) => {
                        console.log(`GithubValidatorError: user [ ${githubName} ]`, error.response.statusText, error.response.status, error.code);
                       throw new NotFoundException(`Użytkownik Github z loginem: ${githubName} nie istnieje`);
                    }))
            );

            const uniqueGithubUser = await this.studentRepository.count({
                where: {githubName, id: Not(id)}
            });

            return {
                isGithubUser: !!data,
                isGithubUserUnique: uniqueGithubUser === 0,
            };
        }
    }
}
