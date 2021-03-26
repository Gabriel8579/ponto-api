import User from "src/users/entities/user.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Clock extends BaseEntity{

   @PrimaryGeneratedColumn()
   id: number;

   @Column({ type: 'timestamp' })
   time: Date

   @ManyToOne(type => User, user => user.clocks, { eager: false })
   @JoinColumn({ name: 'user_id'})
   user: User;

}