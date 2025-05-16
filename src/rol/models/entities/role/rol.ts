import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { User } from "src/users/models/entities/user/user"

@Entity("role", { schema: "public" })
export class Role {
  @PrimaryGeneratedColumn( { name: "cod_role", type: "integer" })
  public codRole: number

  @Column({ name: "name", type: "varchar" })
  public name: string

  @Column({ name: "description", type: "varchar", nullable: true })
  public description: string

  constructor(
    codRole: number,
    name: string,
    description?: string
  ) {
    this.codRole = codRole
    this.name = name
    this.description = description ?? ""
  }

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(() => User, user => user.rolUsuario, { cascade: true })
  rolesUsuarios: User[];

}

// Constantes para los códigos de roles
export const ROLE_CODES = {
  ADMIN: "admin",
  USER: "user",
  PROFESSOR: "profesor",
}

