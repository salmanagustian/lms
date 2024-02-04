export type ReferralPersons =  {
  name: string;
  phoneNumber: string;
  email: string;
}

export interface ICreateReferralDTO {
  persons: ReferralPersons[];
}