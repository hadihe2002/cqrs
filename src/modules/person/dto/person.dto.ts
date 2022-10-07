import { Expose } from 'class-transformer'
export class PersonDto {
  @Expose()
  id: string
  @Expose()
  email: string
}