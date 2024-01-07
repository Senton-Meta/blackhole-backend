import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../users/entities/user.entity";
import { Repository } from "typeorm";
import { HashingService } from "../hashing/hashing.service";
import { SignUpDto } from "./dto/sign-up.dto/sign-up.dto";
import { SignInDto } from "./dto/sign-in.dto/sign-in.dto";
import { JwtService } from "@nestjs/jwt";
import jwtConfig from "../config/jwt.config";
import { ConfigType } from "@nestjs/config";
import { ActiveUserData } from "../interfaces/active-user-data.interface";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { Role } from "../../roles/entities/role.entity";
import { AutoLoginDto } from "./dto/auto-login.dto/auto-login.dto";

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Role) private readonly rolesRepository: Repository<Role>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY) private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
  ) {
  }

  async signUp(signUpDto: SignUpDto) {
    try {
      const user = new User();
      user.username = signUpDto.username;
      user.email = signUpDto.email;
      user.password = await this.hashingService.hash(signUpDto.password);
      user.roles = [
        await this.rolesRepository.findOneBy({ name: "user" })
      ];

      await this.usersRepository.save(user);
    } catch (err) {
      const pgUniqueViolationErrorCode = "23505";
      if (err.code === pgUniqueViolationErrorCode) {
        throw new ConflictException();
      }
      throw err;
    }
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.usersRepository.findOne({
      where: { email: signInDto.email },
      relations: { roles: true }
    });
    if (!user) {
      throw new UnauthorizedException("Пользователь не существует!");
    }
    const isEqual = await this.hashingService.compare(
      signInDto.password,
      user.password
    );
    if (!isEqual) {
      throw new UnauthorizedException("Неверный логин/пароль");
    }

    const tokens = await this.generateTokens(user);
    console.log(user);
    return { ...tokens, user };
  }

  async autoLogin(token: string) {
    console.log('- - - - TOKEN DECODE');
    console.log(`token: ${token}`);
    console.log('decoded:');
    console.dir(this.jwtService.decode(token));

    return {};
  }

  async generateTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        {
          email: user.email,
          roles: user.roles
        }
      ),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl)
    ]);

    return {
      accessToken,
      refreshToken
    };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, "sub">
      >(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer
      });

      const user = await this.usersRepository.findOneOrFail({
        where: { id: sub },
        relations: { roles: true }
      });

      return this.generateTokens(user);
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    const accessToken = await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn
      }
    );
    return accessToken;
  }
}
