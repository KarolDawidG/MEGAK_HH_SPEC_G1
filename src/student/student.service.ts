import { Injectable } from '@nestjs/common';
import { StudentEntity } from './student.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentListQueryRequestInterface } from '../interfaces/StudentListFilterInterface';
import { roleEnum } from 'src/interfaces/UserInterface';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(StudentEntity)
    private studentRepository: Repository<StudentEntity>,
  ) {}

  async findAll(filterParams: StudentListQueryRequestInterface) {
    const limit = (filterParams.pitems <= 90 && filterParams.pitems) || 15;
    const offset = filterParams.page * limit - limit ?? 1;

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

    return await query.limit(limit).offset(offset).getRawMany();
  }
}
