import { Injectable } from '@nestjs/common';
import { Role } from './models/entities/role/rol';
import { DataSource, Repository } from 'typeorm';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Injectable()
export class RolService {
    private roleRepository: Repository<Role>;

    constructor(private poolConexion: DataSource) {
        this.roleRepository = poolConexion.getRepository(Role);
    }

    /**
     * Retrieves all roles from the database
     * @returns {Promise<Role[]>} Array of all roles
     * 
     * @ApiOperation Get all roles
     * @ApiResponse 200 Returns all roles successfully
     * @ApiResponse 500 Internal server error
     */
    async findAll(): Promise<Role[]> {
        return this.roleRepository.find();
    }

    /**
     * Finds a role by its code (alias for findById)
     * @param {number} code - The role code to search for
     * @returns {Promise<Role | null>} Found role or null if not found
     * 
     * @ApiOperation Get role by code
     * @ApiResponse 200 Returns the requested role
     * @ApiResponse 404 Role not found
     */
    async findByCode(code: number): Promise<Role | null> {
        return this.roleRepository.findOne({ where: { codRole: code } });
    }

    /**
     * Finds a role by its ID
     * @param {number} codRole - The role ID to search for
     * @returns {Promise<Role | null>} Found role or null if not found
     * 
     * @ApiOperation Get role by ID
     * @ApiResponse 200 Returns the requested role
     * @ApiResponse 404 Role not found
     */
    async findById(codRole: number): Promise<Role | null> {
        return this.roleRepository.findOne({ where: { codRole } });
    }

    /**
     * Creates a new role
     * @param {Partial<Role>} roleData - Data for the new role
     * @returns {Promise<Role>} The created role
     * 
     * @ApiOperation Create new role
     * @ApiResponse 201 Role created successfully
     * @ApiResponse 400 Invalid role data
     */
    async create(roleData: Partial<Role>): Promise<Role> {
        const role = this.roleRepository.create(roleData);
        return this.roleRepository.save(role);
    }

    /**
     * Updates an existing role
     * @param {number} codRole - ID of the role to update
     * @param {Partial<Role>} roleData - New role data
     * @returns {Promise<Role | null>} Updated role or null if not found
     * 
     * @ApiOperation Update role
     * @ApiResponse 200 Role updated successfully
     * @ApiResponse 404 Role not found
     */
    async update(codRole: number, roleData: Partial<Role>): Promise<Role | null> {
        await this.roleRepository.update(codRole, roleData);
        return this.findById(codRole);
    }

    /**
     * Deletes a role by its ID
     * @param {string} codRole - ID of the role to delete
     * @returns {Promise<boolean>} True if deleted successfully, false otherwise
     * 
     * @ApiOperation Delete role
     * @ApiResponse 200 Role deleted successfully
     * @ApiResponse 404 Role not found
     */
    async delete(codRole: string): Promise<boolean> {
        const result = await this.roleRepository.delete(codRole);
        return (result.affected ?? 0) > 0;
    }
}