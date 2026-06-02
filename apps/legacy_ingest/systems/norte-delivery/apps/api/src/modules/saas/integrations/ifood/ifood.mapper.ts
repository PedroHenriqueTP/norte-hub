import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderSource, PaymentMethod } from '@prisma/client';
import { CreateOrderDto } from '../../orders/dto/create-order.dto';

export interface IfoodItemPayload {
  productId?: string;
  sku?: string;
  name?: string;
  quantity: number;
  price?: number;
  observation?: string;
}

export interface IfoodAddressPayload {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  zipCode: string;
}

export interface IfoodCustomerPayload {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  address?: IfoodAddressPayload;
}

export interface IfoodOrderPayload {
  orderId: string;
  externalId?: string;
  notes?: string;
  deliveryFee?: number;
  discount?: number;
  marketplaceFee?: number;
  paymentMethod?: PaymentMethod;
  customer?: IfoodCustomerPayload;
  items: IfoodItemPayload[];
}

@Injectable()
export class IfoodMapper {
  toCreateOrderDto(payload: IfoodOrderPayload): CreateOrderDto {
    if (!payload.items?.length) {
      throw new BadRequestException('O payload do iFood precisa conter pelo menos um item.');
    }

    const normalizedItems = payload.items.map((item) => {
      const productId = item.productId ?? item.sku;
      if (!productId) {
        throw new BadRequestException('Cada item do iFood precisa ter um identificador de produto.');
      }

      return {
        productId,
        quantity: item.quantity,
        observation: item.observation
      };
    });

    const customer = payload.customer
      ? {
          name: payload.customer.name,
          email: payload.customer.email,
          phone: payload.customer.phone
        }
      : undefined;

    const address = payload.customer?.address
      ? {
          street: payload.customer.address.street,
          number: payload.customer.address.number,
          complement: payload.customer.address.complement,
          neighborhood: payload.customer.address.neighborhood,
          city: payload.customer.address.city,
          zipCode: payload.customer.address.zipCode
        }
      : undefined;

    return {
      externalId: payload.externalId ?? payload.orderId,
      source: OrderSource.IFOOD,
      items: normalizedItems,
      customer,
      address,
      deliveryFee: payload.deliveryFee,
      discount: payload.discount,
      marketplaceFee: payload.marketplaceFee,
      notes: payload.notes,
      paymentMethod: payload.paymentMethod ?? PaymentMethod.CREDIT_CARD
    };
  }
}

