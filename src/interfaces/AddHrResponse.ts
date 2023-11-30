import { UserEntity } from '../user/user.entity';
import { HrProfileEntity } from '../hrProfile/hrProfile.entity';

export interface AddHrResponse {
  user: UserEntity;
  hrProfile: HrProfileEntity;
}
