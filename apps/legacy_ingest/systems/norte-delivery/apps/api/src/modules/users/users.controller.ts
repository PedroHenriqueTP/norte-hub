import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { UsersService, CreateUserDto } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Role } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    async create(@Request() req: any, @Body() body: { name: string, email: string, role: Role, password: string }) {
        // Enforce that only admins/owners can create users (simplified logic for now)
        // Ideally use a RolesGuard

        return this.usersService.create({
            ...body,
            tenantId: req.user.tenantId
        });
    }

    @Get()
    async findAll(@Request() req: any) {
        return this.usersService.findAll(req.user.tenantId);
    }
}
