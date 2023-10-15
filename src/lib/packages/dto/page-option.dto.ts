import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, Max, Min } from "class-validator";
// import { Order } from "../constants";

export enum Order {
    ASC = "ASC",
    DESC = "DESC",
  }

export class PageOptionsDto {
  @IsEnum(Order)
  @IsOptional()
  readonly order?: Order = Order.ASC;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  readonly take?: number = 100;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}