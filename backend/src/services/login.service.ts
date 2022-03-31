import { TPasswordCompare } from '../types';
import { ICredentials, ITokenData, IUsersRepository, ILoginService } from '../interfaces';

export class LoginService implements ILoginService {
  constructor(
    private usersRepository: IUsersRepository,
    private passwordCompare: TPasswordCompare,
    private jwtGenerator: (tokenData: ITokenData) => string,
  ) {}

  async login(credentials: ICredentials) {
    const user = await this.usersRepository.getUserByEmail(credentials.email);

    if (!user || !(await this.passwordCompare(credentials.password, user.password))) {
      return { code: 401, data: { message: 'Incorrect email or password' } };
    }

    const { id, email, role, username } = user;

    const token = this.jwtGenerator({ id, email, role, username });

    return { code: 200, data: { user: { id, email, role, username }, token } };
  }
}
