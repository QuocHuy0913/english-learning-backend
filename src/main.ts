import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Tạo admin mặc định
  const userRepository = app.get('UserRepository');
  const existing = await userRepository.findOne({ where: { email: 'admin@example.com' } });
  if (!existing) {
    const admin = userRepository.create({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL,
      password: await bcrypt.hash(process.env.ADMIN_PASSWORD as string, 10),
      role: 'admin',
      status: 'active',
    });
    await userRepository.save(admin);
    console.log('Admin mặc định đã được tạo');
  }

  app.enableCors({
    origin: '*'
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
