import {
  contractTypeEnum,
  workTypeEnum,
} from 'src/interfaces/StudentInterface';

/**
 * @interface StudentListFilter Interface for student list filter.
 * Any value set to null equals any.
 * @param {number[]} [cc=null] - Course Completion degree, takes Array of numbers
 * @param {number[]} [ce=null] - Coures Engagement degree, takes Array of numbers
 * @param {number[]} [pd=null] - Project Degree, takes Array of numbers
 * @param {number[]} [tpd=null] - Team Project Degree, takes Array of numbers
 * @param {number[]} [ewt=null] - Work Type, Takes Array of the following: 0 - No Preferences, 1 - On Site, 2 - Relocation, 3 - Remote, 4 - Hybrid
 * @param {number[]} [ect=null] - Contract Type, Takes Array of the following: 0 - No Preferences, 1 - UoP, 2 - B2B, 3 - UZorUoD
 * @param {[number, number]} [es=null] - Expected Salary, Takes array of two values, lower border at first and upper border on second index
 * @param {boolean, number} [cta=null] - Can Take Apprenticeship, empty = false otherwise true
 * @param {number} [moce=0] - Months of minimum commercial experiecne, takes number of months
 * @param {number} [page] - Number of page
 * @param {number} [pitems] - Number of elements per page
 */
export interface StudentListQueryRequestInterface {
  // CourseCompletion
  cc?: number[];
  // CourseEngagement
  ce?: number[];
  // ProjectDegree
  pd?: number[];
  // TeamProjectDegree
  tpd?: number[];
  // ExpectedWorkType
  ewt?: workTypeEnum[];
  // ExpectedContractType
  ect?: contractTypeEnum[];
  // ExpectedSalary
  es?: [number, number];
  // CanTakeApprenticeship
  cta?: boolean;
  // MonthsOfCommercialExperience
  moce?: number;
  // Page
  page: number;
  // ElementsPerPage
  pitems: number;
}
