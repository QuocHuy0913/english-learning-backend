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

## 👥 Chức năng Người dùng
- Đăng ký, đăng nhập, làm mới token, xem **profile**  
- Tạo, chỉnh sửa, xóa **câu hỏi**  
- Trả lời, chỉnh sửa, xóa **câu trả lời**, like/unlike, reply vào câu trả lời  
- Xem danh sách **tag phổ biến**  
- Gửi **báo cáo (report)** nội dung vi phạm  
- Nhận và quản lý **thông báo cá nhân & toàn hệ thống**  
- Nhận gợi ý **AI** khi đặt câu hỏi  

---

## 👨‍💻 Chức năng Admin
- **Quản lý người dùng**: danh sách, tìm kiếm, ban/mở khóa, xem chi tiết  
- **Quản lý câu hỏi**: danh sách, chi tiết, xóa, thống kê  
- **Quản lý câu trả lời**: danh sách, xóa, thống kê số lượng & lượt like  
- **Quản lý tag**: xem, xóa  
- **Quản lý báo cáo**: danh sách, chi tiết, cập nhật trạng thái, thống kê  
- **Quản lý thông báo**: tạo, cập nhật, xóa, gửi toàn hệ thống hoặc cho user  
- **Thống kê hệ thống**: theo dõi tăng trưởng hàng tháng  

---

## 📂 Cấu trúc thư mục

```plaintext
src/
├── entities/                 # Định nghĩa Entity (bảng database)
│   ├── answer_like.ts
│   ├── answer.entity.ts
│   ├── notification.entity.ts
│   ├── question.entity.ts
│   ├── report.entity.ts
│   ├── tag.entity.ts
│   └── user.entity.ts
│
├── guards/                   # Guards bảo vệ route
│
├── modules/
│   │ 
│   ├── admin/                # Admin API
│   │   ├── dto/
│   │   │   ├── notification.dto.ts
│   │   │   └── user.dto.ts
│   │   ├── admin.controller.ts
│   │   ├── admin.module.ts
│   │   └── admin.service.ts
│   │ 
│   ├── ai/                   # AI Suggestion API
│   │   ├── ai.controller.ts      # Endpoint /questions/ai-suggest
│   │   ├── ai.module.ts         
│   │   └── ai.service.ts         # Gọi Hugging Face API
│   │ 
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

------ Client --------

### **Auth**
| Method | Endpoint         | Mô tả                                      |
| ------ | ---------------- | ------------------------------------------ |
| POST   | `/auth/register` | Đăng ký tài khoản                          |
| POST   | `/auth/login`    | Đăng nhập (lấy access + refresh token)     |
| POST   | `/auth/refresh`  | Làm mới access token từ refresh token      |
| GET    | `/auth/profile`  | Lấy thông tin profile người dùng (cần JWT) |


---

### **Users**
| Method | Endpoint       | Mô tả                  |
| ------ | -------------- | ---------------------- |
| GET    | `/users/count` | Đếm tổng số người dùng |


---

### **Tags**
| Method | Endpoint        | Mô tả                                                          |
| ------ | --------------- | -------------------------------------------------------------- |
| GET    | `/tags/popular` | Lấy danh sách tag phổ biến (mặc định 6, có thể truyền `limit`) |


---

### **Questions**
| Method | Endpoint         | Mô tả                                                                |
| ------ | ---------------- | -------------------------------------------------------------------- |
| GET    | `/questions`     | Lấy danh sách câu hỏi (có phân trang, tìm theo `keyword` hoặc `tag`) |
| GET    | `/questions/me`  | Lấy danh sách câu hỏi của chính user (cần JWT)                       |
| GET    | `/questions/:id` | Xem chi tiết một câu hỏi                                             |
| POST   | `/questions`     | Tạo câu hỏi mới (cần JWT)                                            |
| PATCH  | `/questions/:id` | Cập nhật câu hỏi (cần JWT, chỉ owner mới được sửa)                   |
| DELETE | `/questions/:id` | Xóa câu hỏi (cần JWT, chỉ owner mới được xóa)                        |


---

### **Answers**
| Method | Endpoint                         | Mô tả                                    |
| ------ | -------------------------------- | ---------------------------------------- |
| POST   | `/answers/questions/:questionId` | Tạo câu trả lời cho câu hỏi              |
| GET    | `/answers/questions/:id`         | Lấy danh sách câu trả lời của câu hỏi    |
| PATCH  | `/answers/:id`                   | Sửa câu trả lời                          |
| DELETE | `/answers/:id`                   | Xóa câu trả lời                          |
| PATCH  | `/answers/:id/like`              | Like câu trả lời                         |
| PATCH  | `/answers/:id/unlike`            | Bỏ like câu trả lời                      |
| POST   | `/answers/:id/replies`           | Trả lời (reply) vào một câu trả lời khác |
| GET    | `/answers/likes/total`           | Tổng số lượt like trên toàn hệ thống     |


---

### **Reports**
| Method | Endpoint          | Mô tả                                                                 |
| ------ | ----------------- | --------------------------------------------------------------------- |
| POST   | `/reports/create` | Gửi báo cáo (report) về câu hỏi, câu trả lời hoặc bình luận (cần JWT) |


---

### **Notifications**
| Method | Endpoint                  | Mô tả                                                                 |
| ------ | ------------------------- | --------------------------------------------------------------------- |
| GET    | `/notifications`          | Lấy danh sách thông báo của user (filter: all/unread/personal/global) |
| GET    | `/notifications/:id`      | Xem chi tiết một thông báo (đồng thời đánh dấu đã đọc)                |
| PATCH  | `/notifications/:id/read` | Đánh dấu thông báo là đã đọc                                          |



------ Admin --------

👤 User Management

| Method | Endpoint             | Mô tả                                  |
| ------ | -------------------- | -------------------------------------- |
| GET    | `/admin/users`       | Danh sách người dùng (phân trang, lọc) |
| GET    | `/admin/users/:id`   | Xem chi tiết người dùng                |
| POST   | `/admin/users/email` | Tìm người dùng theo email              |
| PATCH  | `/admin/users/:id`   | Cập nhật trạng thái (active/banned)    |
| GET    | `/admin/users/count` | Đếm tổng số người dùng                 |


❓ Question Management
| Method | Endpoint                 | Mô tả                                    |
| ------ | ------------------------ | ---------------------------------------- |
| GET    | `/admin/questions`       | Danh sách câu hỏi (phân trang, tìm kiếm) |
| GET    | `/admin/questions/:id`   | Xem chi tiết câu hỏi                     |
| DELETE | `/admin/questions/:id`   | Xóa câu hỏi                              |
| GET    | `/admin/questions/count` | Đếm tổng số câu hỏi                      |

---------

💬 Answer Management
| Method | Endpoint                     | Mô tả                               |
| ------ | ---------------------------- | ----------------------------------- |
| GET    | `/admin/answers/all`         | Lấy tất cả câu trả lời (phân trang) |
| GET    | `/admin/answers/count`       | Đếm tổng số câu trả lời             |
| GET    | `/admin/answers/:questionId` | Danh sách câu trả lời theo câu hỏi  |
| DELETE | `/admin/answers/:id`         | Xóa câu trả lời                     |
| GET    | `/admin/answers/likes/total` | Tổng số lượt like cho tất cả answer |

----------

🏷️ Tag Management
| Method | Endpoint          | Mô tả         |
| ------ | ----------------- | ------------- |
| GET    | `/admin/tags`     | Danh sách tag |
| DELETE | `/admin/tags/:id` | Xóa tag       |

----------

🚨 Report Management
| Method | Endpoint               | Mô tả                                          |
| ------ | ---------------------- | ---------------------------------------------- |
| GET    | `/admin/reports`       | Danh sách báo cáo (lọc status, type, search)   |
| GET    | `/admin/reports/:id`   | Review chi tiết báo cáo                        |
| PATCH  | `/admin/reports/:id`   | Cập nhật trạng thái báo cáo (pending/reviewed) |
| GET    | `/admin/reports/count` | Đếm tổng số báo cáo                            |

-----------

🔔 Notification Management
| Method | Endpoint                     | Mô tả                                 |
| ------ | ---------------------------- | ------------------------------------- |
| GET    | `/admin/notifications`       | Danh sách thông báo (lọc theo userId) |
| GET    | `/admin/notifications/count` | Đếm tổng số thông báo                 |
| POST   | `/admin/notifications`       | Tạo thông báo (global hoặc 1 user)    |
| PATCH  | `/admin/notifications/:id`   | Cập nhật thông báo                    |
| DELETE | `/admin/notifications/:id`   | Xóa thông báo                         |

-----------

📊 Statistics
| Method | Endpoint        | Mô tả                  |
| ------ | --------------- | ---------------------- |
| GET    | `/admin/growth` | Tăng trưởng hàng tháng |

------------

-------- AI ----------
| Method | Endpoint      | Mô tả                                 |
| ------ | ------------- | ------------------------------------- |
| POST   | `/ai/suggest` | Gợi ý nội dung câu hỏi từ AI (prompt) |
