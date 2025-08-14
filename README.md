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

## 🤖 AI Suggestion

Backend tích hợp OpenAI qua Hugging Face để gợi ý nội dung câu hỏi khi người dùng tạo câu hỏi mới trên diễn đàn.

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
│   ├── users/                # API người dùng
│   │   ├── dto/
│   │   │   └── create-user.dto.ts
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   └── users.service.ts
│   │
│   └── ai/
        ├── ai.controller.ts      # Controller xử lý endpoint /questions/ai-suggest
        ├── ai.module.ts         
        └── ai.service.ts         # Service gọi Hugging Face API
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

## Nếu chạy Localhost trên XAMPP

DB_DRIVER=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=english_learning

## Nếu chạy local public trên neon.tech

DB_DRIVER=postgres
DB_HOST=<YOUR_NEON_HOST>          # ví dụ: ep-xxxxxx-pooler.ap-southeast-1.aws.neon.tech
DB_PORT=5432
DB_USER=<YOUR_NEON_USER>          # ví dụ: neondb_owner
DB_PASSWORD=<YOUR_NEON_PASSWORD>  # mật khẩu database
DB_NAME=<YOUR_NEON_DB_NAME>       # ví dụ: neondb
DB_SSL=true

Lưu ý:
- DB_PORT của Neon mặc định là 5432
- Nếu Neon yêu cầu SSL, thêm:
    + ssl: { rejectUnauthorized: false } vào cấu hình TypeOrmModule.forRoot()
- Bạn có thể bật/tắt SSL tùy môi trường bằng biến DB_SSL.

Bổ sung về các biến cho Authentication
JWT_SECRET=
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

AI_API_KEY=your_huggingface_api_key

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
