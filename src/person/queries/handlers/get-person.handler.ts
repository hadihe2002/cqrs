import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from '../../../entities/person';
import { Repository } from 'typeorm';
import { GetPersonQuery } from '../impl/get-person';

@QueryHandler(GetPersonQuery)
export class GetPersonsHandler implements IQueryHandler<GetPersonQuery> {
  constructor(@InjectRepository(Person) private repo: Repository<Person>) {}

  async execute(query: GetPersonQuery): Promise<Person[]> {
    return await this.repo.find();
  }
}
