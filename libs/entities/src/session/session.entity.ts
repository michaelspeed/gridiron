import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, TableInheritance, UpdateDateColumn} from 'typeorm';

@Entity({name: 'session'})
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class Session extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // @Index({ unique: true })
    @Column()
    token: string;

}
