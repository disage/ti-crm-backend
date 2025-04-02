import { Controller, Post, Body, Res, Req, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/create-user.dto';
import { UserDto } from '../users/user.dto';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(
      createUserDto.email,
      createUserDto.password,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true, // Использовать true в продакшне с HTTPS
      sameSite: 'strict',
    });

    return res.json({ accessToken });
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      return res.status(401).json({ message: 'Необходим refresh токен' });
    }

    try {
      const { accessToken, refreshToken: newRefreshToken } =
        await this.authService.refreshTokens(refreshToken);

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });

      return res.json({ accessToken });
    } catch (err) {
      return res.status(401).json({ message: 'Невалидный refresh токен' });
    }
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Res() res: Response) {
    res.clearCookie('refreshToken');
    return res.json({ message: 'Выход выполнен' });
  }
}
