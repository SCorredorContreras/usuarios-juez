import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "src/users/models/entities/user/user";
import { ApiProperty } from '@nestjs/swagger';

/**
 * Role Entity
 * 
 * @class Role
 * @description Represents user roles in the system
 * @schema public.role
 */
@Entity("role", { schema: "public" })
export class Role {
  /**
   * Primary key - role identifier
   * @type {number}
   */
  @ApiProperty({
    description: 'Unique identifier for the role',
    example: 1
  })
  @PrimaryGeneratedColumn({ name: "cod_role", type: "integer" })
  public codRole: number;

  /**
   * Name of the role
   * @type {string}
   */
  @ApiProperty({
    description: 'Name of the role',
    example: 'admin'
  })
  @Column({ name: "name", type: "varchar" })
  public name: string;

  /**
   * Description of the role (optional)
   * @type {string}
   */
  @ApiProperty({
    description: 'Description of the role',
    example: 'Administrator with full access',
    required: false
  })
  @Column({ name: "description", type: "varchar", nullable: true })
  public description: string;

  /**
   * Constructor for Role entity
   * @param {number} codRole - Role identifier
   * @param {string} name - Role name
   * @param {string} [description] - Optional role description
   */
  constructor(
    codRole: number,
    name: string,
    description?: string
  ) {
    this.codRole = codRole;
    this.name = name;
    this.description = description ?? "";
  }

  /**
   * Creation timestamp
   * @type {Date}
   */
  @ApiProperty({
    description: 'Creation timestamp',
    example: '2023-05-20T12:00:00.000Z'
  })
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Last update timestamp
   * @type {Date}
   */
  @ApiProperty({
    description: 'Last update timestamp',
    example: '2023-05-20T12:30:00.000Z'
  })
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Users associated with this role
   * @type {User[]}
   */
  @ApiProperty({
    description: 'Array of users with this role',
    type: () => [User]
  })
  @OneToMany(() => User, user => user.rolUsuario, { cascade: true })
  rolesUsuarios: User[];
}

/**
 * Role Codes Constants
 * 
 * @constant ROLE_CODES
 * @description Predefined role identifiers for the system
 */
export const ROLE_CODES = {
  ADMIN: "admin",       // Administrator role
  USER: "user",         // Regular user role
  PROFESSOR: "profesor" // Professor/teacher role
};