import { Body, Controller, Post } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { Public } from '../auth/public.decorator'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Public()
  async createUser(@Body() body: CreateUserDto) {
    return this.usersService.upsertAuthUser(body)
  }
}
