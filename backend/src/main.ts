import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const session = require('express-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(
    session({
      secret: 'super-secret-key',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },
    }),
  );
  // --- AGREGA ESTA LÍNEA ---
  app.setGlobalPrefix('api'); 
  // -------------------------

  // Habilita CORS para evitar dolores de cabeza futuros
  app.enableCors();
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
