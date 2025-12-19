import bcryptHelper from '../helpers/bycrypt.helper';
import userRepository from '../modules/user/user.repository';
import userService from '../modules/user/user.service';
import testData from './test.data';


// Mock modules

jest.mock('../modules/user/user.repository');
jest.mock('../helpers/bycrypt.helper');

const {user,createUserpayload} = testData

describe('UserService createUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  

  it('should create a user successfully', async () => {
    jest.spyOn(userRepository, 'isExistByEmail').mockResolvedValue(false);
    jest.spyOn(userRepository, 'isExistByUsername').mockResolvedValue(false);


    (bcryptHelper.hash as jest.Mock).mockReturnValue('hashed_password');
    (userRepository.create as jest.Mock).mockResolvedValue(user);

    const result = await userService.createUser(createUserpayload);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('id');
    expect(result.name).toBe(user.name);
    expect(result.password).toBe('hashed_password');
  });

  it('should throw error if email already exists', async () => {
   jest.spyOn(userRepository, 'isExistByEmail').mockResolvedValue(true);
   jest.spyOn(userRepository, 'isExistByUsername').mockResolvedValue(false);

   await expect(userService.createUser(user)).rejects.toThrow();
  });
});


describe('UserService update user',()=>{
   beforeEach(() => {
    jest.clearAllMocks();
  });
    it('should updated successfully', async () => {
  jest.spyOn(userRepository, 'isExistByEmail').mockResolvedValue(true);
  jest.spyOn(userRepository, 'isExistByUsername').mockResolvedValue(false);
  (userRepository.updateById as jest.Mock).mockResolvedValue(user);

  const result = await userService.updateUserProfile({id:user.id},{name:user.name});
  expect(result).toBeDefined()
  expect(result).toHaveProperty('id');

  });
})