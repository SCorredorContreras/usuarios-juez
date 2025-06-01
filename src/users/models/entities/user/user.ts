import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/rol/models/entities/role/rol';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('users', { schema: 'public' })
export class User {
  @ApiProperty({ description: 'Unique user ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @PrimaryGeneratedColumn('uuid', { name: 'cod_user' })
  public codUser: string;

  @ApiProperty({ description: 'Username', example: 'johndoe' })
  @Column({ name: 'username', type: 'varchar', unique: true })
  public username: string;

  @ApiProperty({ description: 'Email address', example: 'johndoe@example.com' })
  @Column({ name: 'email', type: 'varchar', unique: true })
  public email: string;

  @ApiProperty({ description: 'Password (hashed)', example: '$2b$10$abcd...' })
  @Column({ name: 'password', type: 'varchar' })
  public password: string;

  @ApiProperty({ description: 'First name', example: 'John' })
  @Column({ name: 'first_name', type: 'varchar' })
  public firstName: string;

  @ApiProperty({ description: 'Last name', example: 'Doe' })
  @Column({ name: 'last_name', type: 'varchar' })
  public lastName: string;

  @ApiProperty({ description: 'Profile picture URL', example: 'https://example.com/avatar.png' })
  @Column({ name: 'profile_picture', type: 'varchar' })
  public profilePicture: string;

  @ApiProperty({ description: 'User biography', example: 'I love solving algorithms and puzzles!' })
  @Column({ name: 'bio', type: 'varchar' })
  public bio: string;

  @ApiProperty({ description: 'Role ID', example: 3, default: 3 })
  @Column({ name: 'cod_role', type: 'integer', nullable: false, default: 3 })
  public codRole: number;

  @ApiProperty({ description: 'Associated role object', type: () => Role })
  @ManyToOne(() => Role, role => role.rolesUsuarios, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn([{ name: 'cod_role', referencedColumnName: 'codRole' }])
  public rolUsuario: Role;

  @ApiProperty({ description: 'User rating', example: 1200, default: 0 })
  @Column({ name: 'rating', type: 'integer', default: 0 })
  public rating: number;

  @ApiProperty({ description: 'Total problems solved', example: 25 })
  @Column({ name: 'total_problems_solved', type: 'integer', default: 0 })
  public totalProblemsSolved: number;

  @ApiProperty({
    description: 'Array of solved problem IDs',
    example: ['d290f1ee-6c54-4b01-90e6-d701748f0851'],
    type: [String]
  })
  @Column({ name: 'solved_problems', type: 'uuid', array: true, default: [] })
  public solvedProblems: string[];

  @ApiProperty({ description: 'Whether the user is active', example: true, default: true })
  @Column({ name: 'is_active', type: 'boolean', default: true })
  public isActive: boolean;

  @ApiProperty({ description: 'Creation timestamp', example: '2023-01-01T12:00:00Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp', example: '2023-01-01T12:00:00Z' })
  @UpdateDateColumn()
  updatedAt: Date;

  constructor(
    codUser: string,
    username: string,
    email: string,
    password: string,
    codR: number,
    firstName?: string,
    lastName?: string,
    profilePicture?: string,
    bio?: string,
    rating: number = 0,
    totalProblemsSolved: number = 0,
    solvedProblems: string[] = [],
    isActive: boolean = true
  ) {
    this.codUser = codUser;
    this.username = username;
    this.email = email;
    this.password = password;
    this.firstName = firstName ?? '';
    this.lastName = lastName ?? '';
    this.profilePicture = profilePicture ?? '';
    this.bio = bio ?? '';
    this.codRole = codR;
    this.rating = rating;
    this.totalProblemsSolved = totalProblemsSolved;
    this.solvedProblems = solvedProblems;
    this.isActive = isActive;
  }
}
