import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'superuser' })
export class SuperUser {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'password' })
  password: string;
}
