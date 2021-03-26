import Clock from "src/clocks/entities/clock.entity";
import Company from "src/companies/entities/company.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Role } from "../enums/roles.enum";

@Entity()
@Unique([ 'username' ])
export default class User extends BaseEntity {

   @PrimaryGeneratedColumn()
   id: number;

   @Column()
   name: string;

   @Column()
   username: string;

   @Column({ select: false })
   password: string;

   @Column()
   roles: Role;

   @Column()
   active: boolean;

   @ManyToOne(type => Company, company => company.users, { eager: false })
   @JoinColumn({ name: 'company_id' })
   company: Company;

   @OneToMany(type => Clock, clock => clock.user, { eager: false })
   clocks: Clock[];

}