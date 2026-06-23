import {
  Body,
  Controller,
  Get,
  Inject,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import {
  AUTH_PATTERNS,
  AUTH_SERVICE,
  AuthenticatedUser,
  CurrentUser,
  Public,
  sendRpc,
} from '@app/common';
import { LoginDto, RefreshDto, RegisterDto, UpdateProfileDto } from './dto/auth.dto';

const REFRESH_COOKIE = 'refresh_token';
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

interface AuthResult {
  user: AuthenticatedUser;
  accessToken: string;
  refreshToken: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
  ) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Create a new account' })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResult> {
    const result = await sendRpc<AuthResult>(
      this.authClient.send(AUTH_PATTERNS.REGISTER, dto),
    );
    this.setRefreshCookie(res, result.refreshToken);
    return result;
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Authenticate and receive tokens' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResult> {
    const result = await sendRpc<AuthResult>(
      this.authClient.send(AUTH_PATTERNS.LOGIN, dto),
    );
    this.setRefreshCookie(res, result.refreshToken);
    return result;
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Rotate tokens using a refresh token' })
  async refresh(
    @Body() dto: RefreshDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResult> {
    const refreshToken =
      dto.refreshToken ?? (req.cookies?.[REFRESH_COOKIE] as string | undefined);
    const result = await sendRpc<AuthResult>(
      this.authClient.send(AUTH_PATTERNS.REFRESH, { refreshToken }),
    );
    this.setRefreshCookie(res, result.refreshToken);
    return result;
  }

  @ApiBearerAuth()
  @Post('logout')
  @ApiOperation({ summary: 'Revoke all refresh tokens' })
  async logout(
    @CurrentUser('id') userId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ success: boolean }> {
    const result = await sendRpc<{ success: boolean }>(
      this.authClient.send(AUTH_PATTERNS.LOGOUT, { userId }),
    );
    res.clearCookie(REFRESH_COOKIE, { path: '/' });
    return result;
  }

  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Get the current user profile' })
  getProfile(@CurrentUser('id') userId: string) {
    return sendRpc(this.authClient.send(AUTH_PATTERNS.GET_PROFILE, { userId }));
  }

  @ApiBearerAuth()
  @Patch('me')
  @ApiOperation({ summary: 'Update the current user profile' })
  updateProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return sendRpc(
      this.authClient.send(AUTH_PATTERNS.UPDATE_PROFILE, { userId, ...dto }),
    );
  }

  private setRefreshCookie(res: Response, token: string): void {
    res.cookie(REFRESH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: REFRESH_MAX_AGE,
      path: '/',
    });
  }
}
