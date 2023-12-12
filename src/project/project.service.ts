import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {ProjectEntity} from './project.entity';
import {projectTypeEnum} from '../interfaces/ProjectInterface';

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

    async createMany(
        projects: { userId: string; url: string; type: number }[],
    ): Promise<ProjectEntity[]> {
        return await this.projectRepository.save(projects);
    }

    async updateProject(userId: string, urls: string[], type: projectTypeEnum) {
        try {
            await this.projectRepository
                .createQueryBuilder()
                .delete()
                .from(ProjectEntity)
                .where('userId = :userId', { userId })
                .andWhere('type = :type', { type })
                .execute();

            const newProjects = urls.map((url) => {
                const project = new ProjectEntity();
                project.userId = userId;
                project.url = url;
                project.type = type;
                return project;
            });

            await this.projectRepository.save(newProjects);

            return { affected: newProjects.length };
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException();
        }
    }
}
