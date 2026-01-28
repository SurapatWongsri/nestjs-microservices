import { Controller, Get } from '@nestjs/common'
import { AuthService } from './auth.service'
import type { UserContext } from './auth.types'
import { CurrentUser } from './current-user.decorator'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  me(@CurrentUser() user: UserContext) {
    return { user }
  }
}
