import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateWaitingListDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsString()
    @IsOptional()
    email?: string;

    @IsNumber()
    @IsNotEmpty()
    partySize!: number;

    @IsString()
    @IsOptional()
    userId?: string;
}
