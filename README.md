# 📚 English Learning Community - Backend

Backend API cho dự án **cộng đồng trao đổi học tiếng Anh**  
Sử dụng **NestJS + TypeORM + MySQL** với xác thực **JWT**.

---

## 🚀 Công nghệ sử dụng
- [NestJS](https://nestjs.com/) — Node.js framework
- [TypeORM](https://typeorm.io/) — ORM kết nối MySQL
- [JWT](https://jwt.io/) — Authentication
- [MySQL](https://www.mysql.com/) — Database (XAMPP hoặc Cloud)
- [Passport.js](http://www.passportjs.org/) — Chiến lược JWT

---

## 📂 Cấu trúc thư mục

```plaintext
src/
├── entities/                 # Định nghĩa Entity (bảng database)
│   ├── answer_like.ts
│   ├── answer.entity.ts
│   ├── question.entity.ts
│   └── user.entity.ts
│
├── guards/                   # Guards bảo vệ route
│
├── modules/
│   ├── answers/              # API câu trả lời
│   │   ├── dto/
│   │   │   └── create-answer.dto.ts
│   │   ├── answers.controller.ts
│   │   ├── answers.module.ts
│   │   └── answers.service.ts
│   │
│   ├── auth/                 # API đăng ký, đăng nhập, JWT
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   └── register.dto.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   └── auth.service.ts
│   │
│   ├── questions/            # API câu hỏi
│   │   ├── dto/
│   │   │   └── create-question.dto.ts
│   │   ├── questions.controller.ts
│   │   ├── questions.module.ts
│   │   └── questions.service.ts
│   │
│   └── users/                # API người dùng
│       ├── dto/
│       │   └── create-user.dto.ts
│       ├── users.controller.ts
│       ├── users.module.ts
│       └── users.service.ts
│
├── passports/
│   └── jwt.strategy.ts        # Cấu hình chiến lược JWT
│
├── app.controller.ts
├── app.module.ts
├── app.service.ts
└── main.ts                    # Entry point

--------------------------------------------------------------------------------------------------------

⚙️ Cài đặt
1️⃣ Clone project
git clone https://github.com/QuocHuy0913/english-learning-backend.git
cd english-learning-backend

2️⃣ Cài dependencies
npm install

3️⃣ Tạo file .env
DB_DRIVER=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=english_learning

JWT_SECRET=
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

💡 Tạo JWT_SECRET ngẫu nhiên:
Bạn có thể dùng Node.js:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

Hoặc dùng OpenSSL:
openssl rand -hex 32

--------------------------------------------------------------------------------------------------------

🛠 Chạy Local
1️⃣ Khởi động MySQL
Nếu dùng XAMPP → Start Apache & MySQL.

Tạo database:
CREATE DATABASE english_community;

2️⃣ Chạy server
npm run start:dev

----------------------------------------------------------------------------------------------------------

## 🔑 API chính

### **Auth**
| Method | Endpoint         | Mô tả           |
|--------|------------------|-----------------|
| POST   | `/auth/register` | Đăng ký         |
| POST   | `/auth/login`    | Đăng nhập       |
| POST   | `/auth/refresh`  | Làm mới token   |

---

### **Users**
| Method | Endpoint      | Mô tả                   |
|--------|---------------|-------------------------|
| GET    | `/users/:id`  | Lấy thông tin người dùng|
| PATCH  | `/users/:id`  | Cập nhật thông tin      |
| DELETE | `/users/:id`  | Xóa người dùng          |

---

### **Questions**
| Method | Endpoint         | Mô tả                                           |
|--------|------------------|-------------------------------------------------|
| GET    | `/questions`     | Lấy danh sách câu hỏi (phân trang & tìm kiếm)   |
| POST   | `/questions`     | Tạo câu hỏi                                     |
| PATCH  | `/questions/:id` | Sửa câu hỏi                                     |
| DELETE | `/questions/:id` | Xóa câu hỏi                                     |

---

### **Answers**
| Method | Endpoint                       | Mô tả                      |
|--------|--------------------------------|----------------------------|
| GET    | `/questions/:id/answers`       | Lấy câu trả lời của câu hỏi|
| POST   | `/questions/:id/answers`       | Trả lời câu hỏi            |
| PATCH  | `/answers/:id`                 | Sửa câu trả lời            |
| DELETE | `/answers/:id`                 | Xóa câu trả lời            |
| POST   | `/answers/:id/like`            | Like câu trả lời           |
| POST   | `/answers/:id/unlike`          | Bỏ like câu trả lời        |
