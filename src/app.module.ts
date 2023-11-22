import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {config} from "./config/config";
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: config.dbHost,
            port: 3306,
            username: config.dbUser,
            password: config.dbPassword,
            database: config.dbDatabase,
            entities: ['dist/**/**.entity{.ts,.js}'],
            bigNumberStrings: false,
            logging: true,
            synchronize: true,
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
