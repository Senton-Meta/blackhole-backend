import { Body, Controller, Get, Header, HttpCode, HttpStatus, Post, Req, Res } from "@nestjs/common";
import { Response } from "express";
import { AuthenticationService } from "./authentication.service";
import { SignUpDto } from "./dto/sign-up.dto/sign-up.dto";
import { SignInDto } from "./dto/sign-in.dto/sign-in.dto";
import { Auth } from "./decorators/auth.decorator";
import { AuthType } from "./enums/auth-type.enum";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { AutoLoginDto } from "./dto/auto-login.dto/auto-login.dto";
import { Request } from "express";

@Auth(AuthType.None)
@Controller()
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {
  }

  @Post("sign-up")
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  // Cookies realization
  @HttpCode(HttpStatus.OK)
  @Post("sign-in")
  async signIn(
    @Res({ passthrough: true }) response: Response,
    @Body() signInDto: SignInDto
  ) {
    const { accessToken, refreshToken, user } = await this.authService.signIn(signInDto);
    response.cookie("access_token", accessToken, {
      secure: true,
      httpOnly: true,
      sameSite: true
    });

    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles
    };

    return {refreshToken, userData};
  }

  @Auth(AuthType.Bearer)
  @HttpCode(HttpStatus.OK)
  @Post("autologin")
  async autoLogin(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request
  ) {
    await this.authService.autoLogin(request.cookies['access_token']);

    return {};
  }

  @HttpCode(HttpStatus.OK)
  @Post("refresh-tokens")
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get("signout")
  async logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('access_token', '', { expires: new Date() });
  }
}