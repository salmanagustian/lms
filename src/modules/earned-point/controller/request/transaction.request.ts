import { IsNotEmpty, IsNumber, IsArray, IsString, ValidateNested, ArrayMinSize } from "class-validator";

export class TransactionItemRequest {
  @IsNotEmpty()
  @IsString()
  itemName: string;

  @IsNotEmpty()
  @IsNumber()
  itemPrice: number;

  @IsNotEmpty()
  @IsNumber()
  itemQty: number;
}

export class CreateTransactionRequest {
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  items: TransactionItemRequest[];
}