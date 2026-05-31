const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// --- CONFIGURAÇÃO ---
const API_ROOT = path.join('apps', 'api');
const AUTH_DIR = path.join(API_ROOT, 'src', 'modules', 'auth');
const USERS_DIR = path.join(API_ROOT, 'src', 'modules', 'users');

console.log("🔐 Iniciando Skill: AuthArchitect (Sistema de Login Definitivo)...");

// 1. Instalação de Dependências
function installDependencies() {
    console.log("📦 Instalando pacotes de segurança e OAuth...");
    try {
        const packages = [
            '@nestjs/passport', 'passport', 'passport-jwt',
            'passport-google-oauth20', 'passport-facebook',
            'bcrypt', '@types/passport-jwt', '@types/passport-google-oauth20',
            '@types/bcrypt'
        ].join(' ');

        // Executa npm install na pasta da API
        execSync(`cd ${API_ROOT} && npm install ${packages}`, { stdio: 'inherit' });
        console.log("✅ Dependências instaladas.");
    } catch (e) {
        console.error("❌ Erro ao instalar dependências. Verifique se a pasta apps/api existe.");
    }
}

// 2. Criar Estrutura de Pastas
function createStructure() {
    [
        AUTH_DIR,
        path.join(AUTH_DIR, 'strategies'),
        path.join(AUTH_DIR, 'guards'),
        path.join(AUTH_DIR, 'decorators'),
        path.join(API_ROOT, 'src', 'common', 'enums') // Para Roles
    ].forEach(dir => {
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    });
}

// 3. Gerar Arquivos do Sistema de Auth
function generateFiles() {
    console.log("📝 Escrevendo estratégias de autenticação...");

    // --- ENUM DE ROLES ---
    const roleEnumContent = `
export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  ATTENDANT = 'ATTENDANT', // Atendente/Restaurante
  COURIER = 'COURIER',     // Entregador
}
`;
    // Check if file exists to avoid overwrite loop if content is similar
    fs.writeFileSync(path.join(API_ROOT, 'src', 'common', 'enums', 'role.enum.ts'), roleEnumContent);

    // --- GOOGLE STRATEGY ---
    const googleStrategyContent = `
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
      provider: 'google'
    };
    done(null, user);
  }
}
`;
    fs.writeFileSync(path.join(AUTH_DIR, 'strategies', 'google.strategy.ts'), googleStrategyContent);

    // --- JWT STRATEGY ---
    const jwtStrategyContent = `
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // Aqui você pode buscar no banco se o usuário ainda está ativo
    return { userId: payload.sub, email: payload.email, roles: payload.roles, tenantId: payload.tenantId };
  }
}
`;
    fs.writeFileSync(path.join(AUTH_DIR, 'strategies', 'jwt.strategy.ts'), jwtStrategyContent);

    // --- ROLES GUARD (O porteiro) ---
    const rolesGuardContent = `
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../../common/enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
`;
    fs.writeFileSync(path.join(AUTH_DIR, 'guards', 'roles.guard.ts'), rolesGuardContent);

    // --- ROLES DECORATOR ---
    const rolesDecoratorContent = `
import { SetMetadata } from '@nestjs/common';
import { Role } from '../../../common/enums/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
`;
    fs.writeFileSync(path.join(AUTH_DIR, 'decorators', 'roles.decorator.ts'), rolesDecoratorContent);

    console.log("✅ Arquivos de Auth gerados com sucesso.");
}

// Execução
try {
    installDependencies();
    createStructure();
    generateFiles();
    console.log("🏁 Skill AuthArchitect finalizada!");
    console.log("👉 PRÓXIMOS PASSOS:");
    console.log("1. Adicione GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, JWT_SECRET no seu .env");
    console.log("2. Importe o AuthModule no AppModule.");
} catch (error) {
    console.error("🔥 Falha crítica na execução:", error);
}
