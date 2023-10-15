export class ErrorResultDto {
    message: string;
}

export class ScanResultDto {
    data: any;
    errors: ErrorResultDto[];
}