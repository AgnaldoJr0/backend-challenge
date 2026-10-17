import { defineConfig } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';

export default defineConfig({
  host: '127.0.0.1',
  port: 5444,
  dbName: 'backend_challenge_db',
  user: 'postgres',
  password: 'postgres',
  entities: ['./dist/domain/entities/**/*.entity.js'],         
  entitiesTs: ['./src/domain/entities/**/*.entity.ts'],    
  extensions: [Migrator],
  migrations: {
    path: './src/infrastructure/database/migrations',
    pathTs: './src/infrastructure/database/migrations',
    glob: '!(*.d).{js,ts}',
    transactional: true,
    allOrNothing: true,
    emit: 'ts',
  },
  debug: process.env.NODE_ENV !== 'production',
});
