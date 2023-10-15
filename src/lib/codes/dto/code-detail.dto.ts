export class AddressDetailDto {
    address: string;
    province: string;
    pincode: number;
}

export class CustomerDetailDto {
    id: number;
    firstName: string;
    lastName: string;
    // address: AddressDetailDto;
}

export class BoxDetailDto {
    id: number;
    name: string;
    dimension: string;
    maxWeight: number;
    cost: number;
}

export class CodeDetailDto {
    code: string;
    hash: string;
    isTagged: boolean;
    customerDetail: CustomerDetailDto;
    boxDetail: BoxDetailDto;
    // boxDetail: BoxDetailDto
}