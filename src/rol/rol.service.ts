import { Injectable } from '@nestjs/common';
import { Role } from './models/entities/role/rol';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class RolService {

    private roleRepository: Repository<Role>;
    constructor(
        private poolConexion: DataSource
    ) {
        this.roleRepository = poolConexion.getRepository(Role)
    }

    async findAll(): Promise<Role[]> {
        return this.roleRepository.find()
    }

    async findByCode(code: number): Promise<Role | null> {
        return this.roleRepository.findOne({ where: { codRole: code } })
    }

    async findById(codRole: number): Promise<Role | null> {
        return this.roleRepository.findOne({ where: { codRole } })
    }

    async create(roleData: Partial<Role>): Promise<Role> {
        const role = this.roleRepository.create(roleData)
        return this.roleRepository.save(role)
    }

    async update(codRole: number, roleData: Partial<Role>): Promise<Role | null> {
        await this.roleRepository.update(codRole, roleData)
        return this.findById(codRole)
    }

    async delete(codRole: string): Promise<boolean> {
        const result = await this.roleRepository.delete(codRole)
        return (result.affected ?? 0) > 0
    }


}
