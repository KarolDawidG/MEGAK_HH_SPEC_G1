import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {ProjectEntity} from './project.entity';
import {projectTypeEnum} from "../interfaces/ProjectInterface";

@Injectable()
export class ProjectService {
    constructor(
        @InjectRepository(ProjectEntity)
        private projectRepository: Repository<ProjectEntity>,
    ) {
    }

    async create(userId, url, type): Promise<ProjectEntity> {
        return await this.projectRepository.save({
            userId,
            type,
            url,
        });
    }

    async updateProject(userId: string, url: string[], type: projectTypeEnum) {
        try {
            if (url) {
                return await this.projectRepository.createQueryBuilder()
                    .update('projects')
                    .set({
                        url: JSON.stringify(url),
                        type,
                        updatedAt: () => 'CURRENT_TIMESTAMP',
                    })
                    .where('projects.type = :type', {type})
                    .andWhere('projects.user_id = :userId', {userId})
                    .execute();
            }
        } catch {
            throw new InternalServerErrorException();
        }
    }

}
