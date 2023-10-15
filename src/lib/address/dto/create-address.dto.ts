import { IsNotEmpty } from "class-validator";

export class CreateAddressDto {
    @IsNotEmpty()
    firstName: string;
    
    @IsNotEmpty()
    lastName: string;

    description: string;
    @IsNotEmpty()
    phone: string;

    @IsNotEmpty()
    latitude: number;

    @IsNotEmpty()
    longitude: number;

    @IsNotEmpty()
    district: string;

    @IsNotEmpty()
    province: string;

    @IsNotEmpty()
    zipCode: string;
}