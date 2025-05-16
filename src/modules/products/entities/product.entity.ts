import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  externalId: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 5, scale: 2 })
  discountPercentage: number;

  @Column('decimal', { precision: 3, scale: 2 })
  rating: number;

  @Column()
  stock: number;

  @Column()
  brand: string;

  @Column()
  category: string;

  @Column()
  thumbnail: string;

  @Column('text', { array: true })
  images: string[];
}
