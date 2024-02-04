export enum EEarnedPoint {
  TRANSACTIONAL = 'transactional',
  COMMUNITY = 'community',
}

export enum EHistoryPointType {
  EARNED = 'earned',
  REDEEMED = 'redeemed',
}

export enum EEarnedPointCode {
  /**
   * change format this code, can caused error on format_transaction_id_fn.
   * you also need to adjust function postgre `format_transaction_id_fn`
   */
  TRANSACTIONAL = 'TRINV',
  COMMUNITY_REFERRAL = 'TRMGM',
  COMMUNITY_ACTIVITY= 'TRACT'
}