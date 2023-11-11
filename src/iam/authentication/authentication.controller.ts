import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res } from "@nestjs/common";
import { Response } from "express";
import { AuthenticationService } from "./authentication.service";
import { SignUpDto } from "./dto/sign-up.dto/sign-up.dto";
import { SignInDto } from "./dto/sign-in.dto/sign-in.dto";
import { Auth } from "./decorators/auth.decorator";
import { AuthType } from "./enums/auth-type.enum";
import { RefreshTokenDto } from "./dto/refresh-token.dto";

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
    response.header({ 'refreshToken': refreshToken });

    const userData = {
      id: user.id,
      email: user.email,
      roles: user.roles
    };

    return userData;
  }

  // @HttpCode(HttpStatus.OK)
  // @Post('sign-in')
  // signIn(@Body() signInDto: SignInDto) {
  //   return this.authService.signIn(signInDto);
  // }

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