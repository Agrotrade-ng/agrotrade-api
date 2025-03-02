import { User } from '../models/user.model';
import { BaseRepository } from './base.repository';
import { AppDataSource } from '../../../config/typeorm.config';

export class UserRepository extends BaseRepository<User> {
    constructor() {
        super(AppDataSource, User);
    }

    findByEmail = async (email: string): Promise<User | null> => {
        return await this.repository.findOne({ where: { email } });
    };
}
