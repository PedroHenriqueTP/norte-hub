import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { TenantContext } from '../../../common/tenant/tenant.context';

@Injectable()
export class CouponsService {
    constructor(private readonly prisma: PrismaService) { }

    async validateCoupon(code: string, cartTotal: number) {
        const tenantId = TenantContext.getTenantId();
        if (!tenantId) throw new BadRequestException('Tenant Context missing');

        const coupon = await this.prisma.extended.coupon.findUnique({
            where: { code: code.toUpperCase() }, // Ensure case-insensitive match
        });

        if (!coupon || coupon.tenantId !== tenantId) {
            // Preventing enumeration attack by returning generic error? 
            // Or explicit "Cupom não encontrado" is fine for UX? 
            // Sticking to explicit for now.
            throw new NotFoundException('Cupom inválido ou não encontrado.');
        }

        if (!coupon.isActive) {
            throw new BadRequestException('Este cupom foi desativado.');
        }

        if (coupon.expiresAt && new Date() > coupon.expiresAt) {
            throw new BadRequestException('Este cupom expirou.');
        }

        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            throw new BadRequestException('Este cupom esgotou.');
        }

        if (coupon.minOrderValue && cartTotal < Number(coupon.minOrderValue)) {
            throw new BadRequestException(`Valor mínimo para este cupom: R$ ${coupon.minOrderValue}`);
        }

        // Calculate discount
        let discountAmount = 0;
        if (coupon.discountType === 'PERCENTAGE') {
            discountAmount = (cartTotal * Number(coupon.value)) / 100;
            if (coupon.maxDiscount && discountAmount > Number(coupon.maxDiscount)) {
                discountAmount = Number(coupon.maxDiscount);
            }
        } else {
            discountAmount = Number(coupon.value);
        }

        // Ensure we don't discount more than the cart total
        if (discountAmount > cartTotal) {
            discountAmount = cartTotal;
        }

        return {
            valid: true,
            code: coupon.code,
            discountAmount,
            finalTotal: cartTotal - discountAmount
        };
    }
}
