import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested
} from 'class-validator';
import { OrderSource, PaymentMethod } from '@prisma/client';

export class CreateOrderItemDto {
  @IsUUID()
  productId!: string;

  @IsNumber()
  @Min(1)
  quantity!: number;

  @IsOptional()
  @IsString()
  observation?: string;
}

export class CustomerInputDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class AddressInputDto {
  @IsString()
  street!: string;

  @IsString()
  number!: string;

  @IsOptional()
  @IsString()
  complement?: string;

  @IsString()
  neighborhood!: string;

  @IsString()
  city!: string;

  @IsString()
  zipCode!: string;
}

export class CreateOrderDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => CustomerInputDto)
  customer?: CustomerInputDto;

  @IsOptional()
  @IsUUID()
  customerId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressInputDto)
  address?: AddressInputDto;

  @IsOptional()
  @IsUUID()
  addressId?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  deliveryFee?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  marketplaceFee?: number;

  @IsOptional()
  @IsEnum(OrderSource)
  source?: OrderSource;

  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  externalId?: string;
}

