# Hi there 👋

## Kiến trúc và thiết kế phần mềm

#### Giảng viên hướng dẫn: Nguyễn Trọng Tiến

#### Đề tài: `Website đặt sân cầu lông`

### Danh sách thành viên.

| **Họ và tên**      | **MSSV** |
|-----------------|:-------------------:|
| Trương Quốc Bảo |      21017351       |
| Nguyễn Thanh Thuận|      21080071     |


# Quản Lý Sân Cầu Lông 🏸

Một ứng dụng web để quản lý việc đặt sân cầu lông, được thiết kế nhằm đơn giản hóa quá trình đặt lịch, quản lý thông tin người dùng và cung cấp thông tin về tình trạng sân theo thời gian thực.

## Mục Lục
- [Tổng Quan Dự Án](#tổng-quan-dự-án)
- [Tính Năng](#tính-năng)
- [Công Nghệ Sử Dụng](#công-nghệ-sử-dụng)
- [Kiến Trúc](#kiến-trúc)
- [Cấu Trúc Thư Mục](#cấu-trúc-thư-mục)
- [Yêu Cầu Cài Đặt](#yêu-cầu-cài-đặt)
- [Hướng Dẫn Cài Đặt](#hướng-dẫn-cài-đặt)
- [Chạy Ứng Dụng](#chạy-ứng-dụng)
- [Quy Trình CI/CD](#quy-trình-cicd)
- [Thành Viên Nhóm](#thành-viên-nhóm)
- [Giảng Viên Hướng Dẫn](#giảng-viên-hướng-dẫn)
- [Giấy Phép](#giấy-phép)

## Tổng Quan Dự Án
Dự án này là một nền tảng web để đặt sân cầu lông, được phát triển trong khuôn khổ một dự án đại học. Ứng dụng cho phép người dùng xem danh sách sân, đặt lịch, quản lý hồ sơ cá nhân và tương tác với chatbot hỗ trợ. Backend được xây dựng theo **kiến trúc microservices** sử dụng Spring Boot, trong khi frontend được phát triển bằng **NextJS** để mang lại giao diện người dùng đáp ứng và linh hoạt.

**Link GitHub**: [badminton-court-management](https://github.com/Bao44/badminton-court-management.git)

## Tính Năng
- **Quản Lý Người Dùng**: Đăng ký, đăng nhập và quản lý hồ sơ người dùng với xác thực dựa trên JWT.
- **Đặt Sân**: Xem tình trạng sân trống và đặt lịch.
- **Quản Lý Sân**: Quản lý thông tin chi tiết và lịch trình của sân.
- **Chatbot**: Chatbot thông minh hỗ trợ người dùng.
- **Bản Đồ Thời Gian Thực**: Tích hợp Mapbox để hiển thị vị trí sân.
- **API Bảo Mật**: API Gateway để định tuyến và bảo mật giao tiếp giữa các microservices.

## Công Nghệ Sử Dụng
### Backend
- **Framework**: Spring Boot (Kiến trúc Microservices)
- **Các Dịch Vụ**:
  - User Services
  - Booking Services
  - Court Services
  - Chatbot Services
  - API Gateway
- **Xác Thực**: JWT
- **Cơ Sở Dữ Liệu**: PostgreSQL
- **Công Cụ Build**: Gradle 8.10.1 (JDK 17)
- **Containerization**: Docker
- **CI/CD**: GitLab CI/CD

### Frontend
- **Framework**: NextJS
- **Giao Diện**: Tailwind CSS
- **Tích Hợp Bản Đồ**: Mapbox

## Kiến Trúc
Ứng dụng được xây dựng theo **kiến trúc microservices**, trong đó mỗi dịch vụ (User, Booking, Court, Chatbot) hoạt động độc lập và giao tiếp thông qua **API Gateway**. JWT được sử dụng để xác thực và phân quyền bảo mật. Frontend tương tác với backend thông qua các API RESTful, và Mapbox được tích hợp để hỗ trợ các tính năng dựa trên vị trí.

![Sơ Đồ Kiến Trúc](docs/architecture-diagram.png)  
*(Lưu ý: Vui lòng thêm sơ đồ kiến trúc vào thư mục `docs/` để minh họa rõ hơn.)*

## Cấu Trúc Thư Mục
badminton-court-management/
├── back-end/
│   ├── user-services/
│   ├── booking-services/
│   ├── court-services/
│   ├── chatbot-services/
│   ├── api-gateway/
│   └── Dockerfile
├── front-end/
│   ├── pages/
│   ├── components/
│   ├── styles/
│   └── Dockerfile
├── docs/
└── README.md


## Yêu Cầu Cài Đặt
Đảm bảo bạn đã cài đặt các công cụ sau:
- **Node.js** (phiên bản 16 trở lên) cho frontend
- **Java** (JDK 17) cho backend
- **Docker** và **Docker Compose** cho containerization
- **PostgreSQL** (hoặc chạy qua Docker)
- **Gradle** (8.10.1)
- **Git** để clone kho lưu trữ

## Hướng Dẫn Cài Đặt
1. Clone kho lưu trữ:
   ```bash
    git clone https://github.com/Bao44/badminton-court-management.git
   ```
 