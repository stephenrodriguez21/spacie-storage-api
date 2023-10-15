import { IsNotEmpty } from "class-validator";

export class CreatePackageDto {
    @IsNotEmpty()
    name: string;

    description: string;
    @IsNotEmpty()
    phone: string;

    @IsNotEmpty()
    weight: number;

    @IsNotEmpty()
    size: string;
}