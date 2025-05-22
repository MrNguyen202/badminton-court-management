# 🏸 Quản Lý Đặt Sân Cầu Lông

**Một nền tảng web hiện đại để đặt sân cầu lông, quản lý lịch sân, và cung cấp trải nghiệm người dùng mượt mà.**

![Image](https://github.com/user-attachments/assets/2236f5c1-00ea-4814-be9c-6205c499a4f0)

## 📋 Tổng Quan Dự Án

Dự án **Quản Lý Đặt Sân Cầu Lông** là một ứng dụng web được phát triển trong khuôn khổ môn học **Kiến trúc và Thiết kế Phần mềm** tại trường đại học. Ứng dụng giúp người dùng dễ dàng đặt sân cầu lông, kiểm tra tình trạng sân theo thời gian thực, quản lý hồ sơ cá nhân, và tương tác với chatbot hỗ trợ. Với **kiến trúc microservices**, dự án đảm bảo khả năng mở rộng, bảo mật cao, và hiệu suất tối ưu.

**Link GitHub**: [badminton-court-management](https://github.com/Bao44/badminton-court-management.git)  
**Demo**: update sau

## 🎯 Mục Tiêu Dự Án

- Đơn giản hóa quy trình đặt sân cầu lông cho người dùng.  
- Cung cấp giao diện thân thiện, đáp ứng nhanh trên nhiều thiết bị.  
- Tích hợp các tính năng thông minh như chatbot và bản đồ thời gian thực.  
- Đảm bảo tính bảo mật và khả năng mở rộng của hệ thống thông qua kiến trúc microservices.

## 🚀 Tính Năng Chính

| **Tính Năng**                | **Mô Tả**                                                                 |
|------------------------------|---------------------------------------------------------------------------|
| **Quản Lý Người Dùng**       | Đăng ký, đăng nhập, quản lý hồ sơ cá nhân với xác thực JWT an toàn.       |
| **Đặt Sân Cầu Lông**         | Xem tình trạng sân (trống/đã đặt) và đặt lịch theo thời gian thực.        |
| **Quản Lý Sân**              | Quản lý thông tin sân, lịch trình, và trạng thái sân.                     |
| **Chatbot Thông Minh**        | Hỗ trợ người dùng giải đáp thắc mắc và hướng dẫn đặt sân.                 |
| **Bản Đồ Thời Gian Thực**    | Tích hợp Mapbox để hiển thị vị trí các sân cầu lông gần nhất.             |
| **Thông Báo**                | Gửi thông báo đặt sân thành công hoặc nhắc nhở lịch qua email/SMS *(tùy chọn)*. |
| **Bảo Mật API**              | Sử dụng API Gateway để định tuyến và bảo vệ giao tiếp giữa các dịch vụ.   |

## 🛠 Công Nghệ Sử Dụng

### Backend
- **Framework**: [Spring Boot](https://spring.io/projects/spring-boot) (Kiến trúc Microservices)
- **Dịch Vụ**:
  - **User Services**: Quản lý tài khoản và xác thực người dùng.
  - **Booking Services**: Xử lý đặt sân và lịch trình.
  - **Court Services**: Quản lý thông tin sân và trạng thái.
  - **Chatbot Services**: Tích hợp AI để hỗ trợ người dùng.
  - **API Gateway**: Định tuyến và bảo mật API với [Spring Cloud Gateway](https://spring.io/projects/spring-cloud-gateway).
- **Xác Thực**: [JWT (JSON Web Tokens)](https://jwt.io/) cho bảo mật.
- **Cơ Sở Dữ Liệu**: [PostgreSQL](https://www.postgresql.org/) với thiết kế quan hệ tối ưu.
- **Công Cụ Build**: [Gradle 8.10.1](https://gradle.org/) (JDK 17).
- **Containerization**: [Docker](https://www.docker.com/) và [Docker Compose](https://docs.docker.com/compose/).
- **CI/CD**: [GitLab CI/CD](https://docs.gitlab.com/ee/ci/) hoặc [GitHub Actions](https://github.com/features/actions).

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (React Framework cho SSR/SSG).
- **Giao Diện**: [Tailwind CSS](https://tailwindcss.com/) để thiết kế giao diện hiện đại, đáp ứng.
- **Tích Hợp Bản Đồ**: [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/) để hiển thị vị trí sân.
- **Quản Lý Trạng Thái**: [Redux](https://redux.js.org/) hoặc [React Query](https://tanstack.com/query/).

### Công Nghệ Khác
- **Message Broker**: [RabbitMQ](https://www.rabbitmq.com/) hoặc [Kafka](https://kafka.apache.org/) để giao tiếp bất đồng bộ giữa các microservices.
- **Monitoring**: [Prometheus](https://prometheus.io/) và [Grafana](https://grafana.com/) để giám sát hiệu suất.

## 🏛 Kiến Trúc Hệ Thống

Ứng dụng sử dụng **kiến trúc microservices** để đảm bảo tính độc lập và khả năng mở rộng của từng dịch vụ. Mỗi microservice (User, Booking, Court, Chatbot) được triển khai trong container Docker riêng, giao tiếp qua **API Gateway** với các API RESTful. JWT được tích hợp để xác thực và phân quyền, đảm bảo bảo mật cao.

### Sơ Đồ Kiến Trúc
```plaintext
[Frontend: Next.js] <--> [API Gateway: Spring Cloud Gateway]
                                    |
                                    |
      |-----------------------------|-----------------------------|
      |                             |                             |
[User Service]              [Booking Service]            [Court Service]
      |                             |                             |
  [PostgreSQL]                [PostgreSQL]                [PostgreSQL]
      |                             |                             |
   [JWT Auth]                [Chatbot Service]         [Mapbox Integration]
```

## 📂 Cấu Trúc Thư Mục
```plaintext
badminton-court-management/
├── back-end/
│   ├── user-services/          # Quản lý người dùng và xác thực
│   ├── booking-services/       # Xử lý đặt sân và lịch trình
│   ├── court-services/         # Quản lý thông tin sân
│   ├── chatbot-services/       # Tích hợp chatbot AI
│   ├── api-gateway/            # Định tuyến và bảo mật API
│   └── Dockerfile              # Cấu hình container cho backend
├── front-end/
│   ├── pages/                  # Các trang Next.js (SSR/SSG)
│   ├── components/             # Các thành phần giao diện tái sử dụng
│   ├── styles/                 # CSS tùy chỉnh và Tailwind
│   ├── public/                 # Tài nguyên tĩnh (hình ảnh, font,...)
│   └── Dockerfile              # Cấu hình container cho frontend
├── docs/                       # Tài liệu dự án (sơ đồ, hướng dẫn,...)
├── .gitlab-ci.yml              # Pipeline CI/CD (nếu dùng GitLab)
└── README.md                   # Tài liệu chính
```

## ⚙ Yêu Cầu Cài Đặt

Để chạy dự án, bạn cần cài đặt các công cụ sau:

- **Node.js**: Phiên bản 16 trở lên ([Tải về](https://nodejs.org/)).
- **Java**: JDK 17 ([Tải về](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)).
- **Docker** và **Docker Compose**: Để chạy các container ([Tải về](https://www.docker.com/get-started)).
- **PostgreSQL**: Phiên bản 13+ hoặc sử dụng Docker ([Hướng dẫn](https://hub.docker.com/_/postgres)).
- **Gradle**: Phiên bản 8.10.1 ([Tải về](https://gradle.org/install/)).
- **Git**: Để clone mã nguồn ([Tải về](https://git-scm.com/)).

### Ghi chú:
- Đảm bảo máy tính của bạn có đủ bộ nhớ (ít nhất 8GB RAM) để chạy Docker và các microservices.
- Kiểm tra các cổng (như 5432 cho PostgreSQL, 3000 cho frontend, 8080 cho API Gateway) không bị chiếm dụng.

## 📚 Hướng Dẫn Cài Đặt

1. **Clone mã nguồn**:
   ```bash
   git clone https://github.com/Bao44/badminton-court-management.git
   cd badminton-court-management
   ```

2. Cài đặt Backend:
Di chuyển vào thư mục backend và build các microservices:
    ```bash
    cd back-end
    ./gradlew build
    ```

Lệnh này sẽ build các dịch vụ User, Booking, Court, Chatbot và API Gateway.

3. Cài đặt Frontend:
Di chuyển vào thư mục frontend và cài đặt các thư viện:
    ```bash
    cd front-end
    npm install
    npm run build
    ```

Lệnh `npm install` cài đặt các thư viện cần thiết, và `npm run build` tạo bản build tối ưu cho Next.js.

4. Cấu hình Cơ Sở Dữ Liệu:
- Cài đặt PostgreSQL cục bộ hoặc chạy qua Docker:
  ```bash
  docker run -d --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=yourpassword postgres
  ```

- Tạo cơ sở dữ liệu cho từng microservice bằng SQL:
  ```bash
  CREATE DATABASE user_service;
  CREATE DATABASE booking_service;
  CREATE DATABASE court_service;
  ```

- Cập nhật thông tin kết nối trong file cấu hình của từng microservice (tìm trong `back-end/{service}/src/main/resources/application.yml`). Ví dụ:
  ```bash
  spring:
    datasource:
      url: jdbc:postgresql://localhost:5432/user_service
      username: postgres
      password: yourpassword
  ```

5. Cấu hình API Gateway:
Cập nhật file cấu hình của API Gateway (`back-end/api-gateway/src/main/resources/application.yml`) để định tuyến đến các microservices:

    ```bash
    spring:
      cloud:
        gateway:
          routes:
            - id: user-service uri: lb://USER-SERVICE predicates:
            Path=/api/users/**
            - id: booking-service uri: lb://BOOKING-SERVICE predicates:
            Path=/api/bookings/**
            - id: court-service uri: lb://COURT-SERVICE predicates:
            Path=/api/courts/**
    ```


6. Cấu hình Mapbox (Frontend):
- Tạo tài khoản trên Mapbox (https://www.mapbox.com/) để lấy Access Token.
- Thêm token vào file môi trường của frontend (`front-end/.env.local`):

  ```bash
  NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
  ```


7. Chạy ứng dụng bằng Docker Compose:
- Tạo file `docker-compose.yml` trong thư mục gốc (nếu chưa có):
  ```bash
  version: '3.8'
  services:
  postgres:
  image: postgres:latest
  environment:
  POSTGRES_PASSWORD: yourpassword
  ports:
  "5432:5432" user-service: build: ./back-end/user-services ports:
  "8081:8081" booking-service: build: ./back-end/booking-services ports:
  "8082:8082" court-service: build: ./back-end/court-services ports:
  "8083:8083" chatbot-service: build: ./back-end/chatbot-services ports:
  "8084:8084" api-gateway: build: ./back-end/api-gateway ports:
  "8080:8080" frontend: build: ./front-end ports:
  "3000:3000"
  ```

- Chạy toàn bộ ứng dụng:

  ```bash
  docker-compose up --build
  ```


8. Truy cập ứng dụng:
- Frontend: http://localhost:3000
- API Gateway: http://localhost:8080
- Các endpoint API chính:
- /api/users (User Service)
- /api/bookings (Booking Service)
- /api/courts (Court Service)

## 🔄 Quy Trình CI/CD

Dự án sử dụng pipeline CI/CD để tự động hóa quy trình xây dựng, kiểm tra và triển khai:

1. Kiểm Tra Mã Nguồn:
- Sử dụng SonarQube (https://www.sonarqube.org/) để phân tích chất lượng mã và phát hiện lỗi tiềm ẩn.
- Chạy unit test với JUnit (https://junit.org/) cho backend và Jest (https://jestjs.io/) cho frontend.

2. Build và Đóng Gói:
- Build backend với Gradle và frontend với Next.js.
- Đóng gói các microservices và frontend thành các Docker image.

3. Triển Khai:
- Đẩy Docker image lên Docker Hub (https://hub.docker.com/) hoặc registry riêng.
- Triển khai ứng dụng lên Kubernetes (https://kubernetes.io/) hoặc các nền tảng như Heroku (https://www.heroku.com/), Vercel (https://vercel.com/) (cho frontend), hoặc AWS ECS (https://aws.amazon.com/ecs/).

Ví dụ pipeline GitLab CI/CD:
  ```bash
  stages:

  build
  test
  deploy
  build_job:
  stage: build
  script:

  cd back-end && ./gradlew build
  cd front-end && npm install && npm run build
  test_job:
  stage: test
  script:

  cd back-end && ./gradlew test
  cd front-end && npm run test
  deploy_job:
  stage: deploy
  script:

  docker-compose build
  docker-compose push
  ```


## 👥 Đội Ngũ Phát Triển

### Thành Viên Nhóm
| **Họ và Tên**          | **MSSV**   | **Vai Trò**               |
|-------------------------|------------|---------------------------|
| Trương Quốc Bảo         | 21017351   | Frontend Developer, Backend Developer, DevOps  |
| Nguyễn Thanh Thuận      | 21080071   | Frontend Developer, Backend Developer, DevOps  |

### Giảng Viên Hướng Dẫn
- Nguyễn Trọng Tiến: Giảng viên môn Kiến trúc và Thiết kế Phần mềm.

## 📜 Giấy Phép

Dự án được phát hành dưới MIT License (https://opensource.org/licenses/MIT). Xem chi tiết trong file `LICENSE`.

## 🌟 Gợi Ý Cải Tiến

Dựa trên xu hướng phát triển ứng dụng web và các dự án trong tương lai, dưới đây là một số ý tưởng mà nhóm sẽ nâng cấp dự án trong thời gian sắp tới:

1. Mở Rộng Cổng Thanh Toán: Thêm cổng thanh toán như Stripe (https://stripe.com/) hoặc VNPay (https://vnpay.vn/) để xử lý phí đặt sân.
2. Thông Báo Đẩy: Sử dụng Firebase Cloud Messaging (https://firebase.google.com/docs/cloud-messaging) hoặc Socket.io để gửi thông báo đẩy về lịch đặt sân.
3. Tối Ưu Hiệu Suất: Tích hợp Redis (https://redis.io/) để lưu cache và tăng tốc truy vấn dữ liệu.
4. Phân Tích Dữ Liệu: Sử dụng Google Analytics (https://analytics.google.com/) hoặc Mixpanel (https://mixpanel.com/) để theo dõi hành vi người dùng.
5. Testing: Thêm Cypress (https://www.cypress.io/) cho end-to-end testing và Postman (https://www.postman.com/) để kiểm tra API.

## 📬 Liên Hệ

Nếu bạn có câu hỏi hoặc góp ý, vui lòng liên hệ qua:  
- Email: tqbao44@gmail.com
- GitHub Issues: Mở issue trên GitHub (https://github.com/Bao44/badminton-court-management/issues)

---
