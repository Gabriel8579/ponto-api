import User from "src/users/entities/user.entity";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique([ 'cnpj' ])
export default class Company extends BaseEntity {

   @PrimaryGeneratedColumn()
   id: number;

   @Column()
   cnpj: string;

   @Column()
   name: string;

   @Column()
   active: boolean;

   @OneToMany(type => User, user => user.company, { eager: false })
   users: User[];

}