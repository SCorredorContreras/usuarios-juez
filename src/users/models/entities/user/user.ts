import { Role } from "src/rol/models/entities/role/rol";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity("users", { schema: "public" })
export class User {
    @PrimaryGeneratedColumn("uuid", { name: "cod_user" })
    public codUser: string;

    @Column({ name: "username", type: "varchar", unique: true })
    public username: string;

    @Column({ name: "email", type: "varchar", unique: true })
    public email: string;

    @Column({ name: "password", type: "varchar" })
    public password: string;

    @Column({ name: "first_name", type: "varchar" })
    public firstName: string;

    @Column({ name: "last_name", type: "varchar" })
    public lastName: string;

    @Column({ name: "profile_picture", type: "varchar" })
    public profilePicture: string;

    @Column({ name: "bio", type: "varchar" })
    public bio: string;

    @Column({ name: "cod_role", type: "integer", nullable: false , default: 3})
    public codRole: number;

    @ManyToOne(() => Role, role => role.rolesUsuarios, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
    @JoinColumn([{ name: "cod_role", referencedColumnName: "codRole" }])
    public rolUsuario: Role;


    @Column({ name: "rating", type: "integer", default: 0 })
    public rating: number;

    @Column({ name: "total_problems_solved", type: "integer", default: 0 })
    public totalProblemsSolved: number;

    @Column({ name: "solved_problems", type: "uuid", array: true, default: [] })
    public solvedProblems: string[];

    @Column({ name: "is_active", type: "boolean", default: true })
    public isActive: boolean;

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
        this.firstName = firstName ?? "";
        this.lastName = lastName ?? "";
        this.profilePicture = profilePicture ?? "";
        this.bio = bio ?? "";
        this.codRole = codR;
        this.rating = rating;
        this.totalProblemsSolved = totalProblemsSolved;
        this.solvedProblems = solvedProblems;
        this.isActive = isActive;
    }

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
