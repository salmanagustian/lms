export type TransactionItems =  {
  itemName: string;
  itemPrice: number;
  itemQty: number;
}

export interface ICreateTransactionDTO {
  items: TransactionItems[];
}