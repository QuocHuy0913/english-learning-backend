# 📚 English Learning Community - Backend

Backend API cho dự án cộng đồng trao đổi học tiếng Anh.  
Sử dụng **NestJS + TypeORM + MySQL** với xác thực **JWT**.

---

## 🚀 Công nghệ sử dụng
- [NestJS](https://nestjs.com/) - Node.js framework
- [TypeORM](https://typeorm.io/) - ORM kết nối MySQL
- [JWT](https://jwt.io/) - Authentication
- [MySQL](https://www.mysql.com/) - Database (qua XAMPP hoặc server cloud)
- [Passport.js](http://www.passportjs.org/) - Chiến lược JWT

---

## 📂 Cấu trúc thư mục
src/
├── entities/ # Định nghĩa Entity (bảng database)
│ ├── answer_like.ts
│ ├── answer.entity.ts
│ ├── question.entity.ts
│ └── user.entity.ts
│
├── guards/ # Guards bảo vệ route
│
├── modules/
│ ├── answers/ # API câu trả lời
│ │ ├── dto/
│ │ │ └── create-answer.dto.ts
│ │ ├── answers.controller.ts
│ │ ├── answers.module.ts
│ │ └── answers.service.ts
│
│ ├── auth/ # API đăng ký, đăng nhập, JWT
│ │ ├── dto/
│ │ │ ├── login.dto.ts
│ │ │ └── register.dto.ts
│ │ ├── auth.controller.ts
│ │ ├── auth.module.ts
│ │ └── auth.service.ts
│
│ ├── questions/ # API câu hỏi
│ │ ├── dto/
│ │ │ └── create-question.dto.ts
│ │ ├── questions.controller.ts
│ │ ├── questions.module.ts
│ │ └── questions.service.ts
│
│ └── users/ # API người dùng
│ ├── dto/
│ │ └── create-user.dto.ts
│ ├── users.controller.ts
│ ├── users.module.ts
│ └── users.service.ts
│
├── passports/
│ └── jwt.strategy.ts # Cấu hình chiến lược JWT
│
├── app.controller.ts
├── app.module.ts
├── app.service.ts
└── main.ts # Entry point