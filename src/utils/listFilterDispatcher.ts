import { StudentListQueryRequestInterface } from 'src/interfaces/StudentListFilterInterface';
import { SelectQueryBuilder } from 'typeorm';

export const listFilterDispatcher = async <T>(
  query: SelectQueryBuilder<T>,
  filter: StudentListQueryRequestInterface,
) => {
  console.log(filter?.pd ? 'TRUE' : 'FALSE');
  if (filter?.pd) {
    query.andWhere('evaluation.projectDegree >= :pd', {
      pd: filter.pd,
    });
  }

  if (filter?.cc) {
    query.andWhere('evaluation.courseCompletion >= :cc', {
      cc: filter.cc,
    });
  }

  if (filter?.ce)
    query.andWhere('evaluation.courseEngagement >= :ce', {
      ce: filter.ce,
    });

  if (filter?.tpd)
    query.andWhere('evaluation.teamProjectDegree >= :tpd', {
      tpd: filter.tpd,
    });

  if (filter?.es)
    query.andWhere(
      'student.expectedSalary BETWEEN :lowerMargin AND :upperMargin',
      {
        lowerMargin: filter.es[0] || 0,
        upperMargin: filter.es[1] || 100000000,
      },
    );

  if (filter?.cta)
    query.andWhere('student.canTakeApprenticeship = :cta', {
      cta: filter.cta,
    });

  if (filter?.ect)
    query.andWhere('student.expectedContractType IN (:ect)', {
      ect: filter.ect,
    });

  if (filter?.ewt)
    query.andWhere('student.expectedContractType IN (:ewt)', {
      ewt: filter.ewt,
    });

  if (filter?.moce)
    query.andWhere('student.monthsOfCommercialExperience >= :moce', {
      moce: filter.moce,
    });

  if (filter?.srch)
    query.andWhere(
      'student.targetWorkCity LIKE :srch OR CONCAT(student.firstName, " ", student.lastName) LIKE :srch',
      {
        srch: `%${filter.srch || ''}%`,
      },
    );
};
