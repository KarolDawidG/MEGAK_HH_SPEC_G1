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
    const query = await this.studentRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.user', 'user')
      .leftJoinAndSelect('user.projectEvaluation', 'evaluation')
      .select([
        'student.firstName',
        'student.lastName',
        'student.expectedWorkType',
        'student.targetWorkCity',
        'student.expectedContractType',
        'student.expectedSalary',
        'student.canTakeApprenticeship',
        'student.monthsOfCommercialExperience',
        'user.role',
        'evaluation.projectDegree',
        'evaluation.teamProjectDegree',
        'evaluation.courseCompletion',
        'evaluation.courseEngagement',
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

    return await query
      .limit(filterParams.pitems || 15)
      .offset(
        filterParams.page * filterParams.pitems - filterParams.pitems ?? 1,
      )
      .getRawMany();
  }
}
