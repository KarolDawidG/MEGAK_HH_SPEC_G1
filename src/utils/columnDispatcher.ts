import { ListSortEnum } from 'src/interfaces/StudentListFilterInterface';

export const listSortDispatchColumn = (number: ListSortEnum): string => {
  switch (number) {
    case ListSortEnum.userId:
      return 'user.id';
    case ListSortEnum.firstName:
      return 'student.firstName';
    case ListSortEnum.lastName:
      return 'student.lastName';
    case ListSortEnum.expectedWorkType:
      return 'student.expectedWorkType';
    case ListSortEnum.targetWorkCity:
      return 'student.targetWorkCity';
    case ListSortEnum.expectedContractType:
      return 'student.expectedContractType';
    case ListSortEnum.expectedSalary:
      return 'student.expectedSalary';
    case ListSortEnum.canTakeApprenticeship:
      return 'student.canTakeApprenticeship';
    case ListSortEnum.monthsOfCommercialExperience:
      return 'student.monthsOfCommercialExperience';
    case ListSortEnum.projectDegree:
      return 'evaluation.projectDegree';
    case ListSortEnum.teamProjectDegree:
      return 'evaluation.teamProjectDegree';
    case ListSortEnum.courseCompletion:
      return 'evaluation.courseCompletion';
    case ListSortEnum.courseEngagement:
      return 'evaluation.courseEngagement';
    default:
      return null;
  }
};
