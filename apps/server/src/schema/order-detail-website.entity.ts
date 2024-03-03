import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class OrderDetailWebsiteEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty()
  @Column()
  subdomain: string;

  @ApiProperty()
  @Column()
  wbDomainId: string;
}
