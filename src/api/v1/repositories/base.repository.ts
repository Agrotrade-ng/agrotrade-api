import { DataSource, DeepPartial, Repository } from 'typeorm';

export class BaseRepository<T> {
    protected repository: Repository<T>;

    constructor(private dataSource: DataSource, entity: new () => T) {
        this.repository = this.dataSource.getRepository(entity);
    }

    findByID = async (id: string): Promise<T | null> => {
        return await this.repository.findOne({ where: { id } as any });
    };

    fetchAll = async (): Promise<T[]> => {
        return await this.repository.find();
    };

    create = async (data: DeepPartial<T>): Promise<T> => {
        const entity = this.repository.create(data);
        return await this.repository.save(entity);
    };

    update = async (id: string, data: DeepPartial<T>): Promise<T | null> => {
        const entity = this.findByID(id);
        if (!entity) return null;
        return await this.repository.save({ ...entity, ...data });
    };

    delete = async (id: string): Promise<boolean> => {
        const result = this.repository.delete(id);
        return (await result).affected > 0;
    };
}
