export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: Date;
}

export interface CreateUserDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// In-memory database (would be a real database in production)
class UserStorage {
  private users: User[] = [
    {
      id: '1',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@gmail.com',
      password: 'Password123!', // In production, this would be hashed
      createdAt: new Date('2024-01-01'),
    },
  ];

  findByEmail(email: string): User | undefined {
    return this.users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  }

  create(userData: CreateUserDTO): User {
    const user: User = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date(),
    };

    this.users.push(user);
    return user;
  }

  getAll(): User[] {
    return this.users;
  }

  clear(): void {
    this.users = [];
  }
}

export const userStorage = new UserStorage();
