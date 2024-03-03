import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { CategoryEntity } from './category.entity';
import { OrderDetailEntity } from './order-detail.entity';
import { ProductRetalOptionEntity } from './product-retal-option.entity';

@Entity()
export class ProductEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ nullable: true })
  description: string;

  @ApiProperty()
  @ManyToOne(() => CategoryEntity, (category) => category.products)
  @JoinColumn()
  category: CategoryEntity;

  @ApiProperty()
  @OneToMany(() => OrderDetailEntity, (orderDetail) => orderDetail.product)
  orderDetails: OrderDetailEntity[];

  @ApiProperty()
  @OneToMany(
    () => ProductRetalOptionEntity,
    (producRetalOption) => producRetalOption.product,
  )
  productRetalOptions: ProductRetalOptionEntity[];

  @ApiProperty()
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
