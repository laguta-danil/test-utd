import { DataSource } from 'typeorm';
import configuration from './configuration';
import { Product } from '../modules/products/entities/product.entity';

const config = configuration();

export default new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.name,
  entities: [Product],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
