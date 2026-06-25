# LamCMS - ASP.NET Core Backend & React Vite Frontend

README này hướng dẫn cách cài đặt và chạy ứng dụng **LamCMS** gồm:

- **Backend:** ASP.NET Core MVC / Web API (.NET 8)
- **Frontend:** ReactJS + Vite
- **Database:** SQL Server
- **ORM:** Entity Framework Core

---

## 1. Tổng quan dự án

LamCMS là hệ thống quản trị nội dung kết hợp chức năng thương mại điện tử cơ bản.

Các chức năng chính:

- Quản lý bài viết, danh mục bài viết
- Quản lý sản phẩm, danh mục sản phẩm
- Quản lý khách hàng, đơn hàng
- Quản lý người dùng Admin / Editor
- Cung cấp API để Frontend React gọi dữ liệu
- Hỗ trợ upload hình ảnh vào thư mục `wwwroot/uploads`

---

## 2. Công nghệ sử dụng

### Backend

- .NET 8
- ASP.NET Core MVC
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- Razor Views
- Bootstrap 5
- Cookie Authentication
- Swagger / OpenAPI

### Frontend

- ReactJS
- Vite
- JavaScript / JSX
- Axios
- React Router DOM

---

## 3. Yêu cầu môi trường

Trước khi chạy dự án, cần cài đặt:

### Backend

- Visual Studio 2022
- .NET 8 SDK
- SQL Server hoặc SQL Server Express LocalDB
- SQL Server Management Studio, khuyến nghị để kiểm tra database
- Entity Framework Core CLI

Kiểm tra .NET SDK:

```bash
dotnet --version
```

Nếu chưa có EF CLI, cài bằng lệnh:

```bash
dotnet tool install --global dotnet-ef
```

Nếu đã cài rồi, có thể cập nhật:

```bash
dotnet tool update --global dotnet-ef
```

### Frontend

- Node.js LTS
- npm

Kiểm tra Node.js và npm:

```bash
node -v
npm -v
```

---

## 4. Cấu trúc thư mục dự án

Cấu trúc tham khảo:

```text
CMS-ASP.NET/
├── CMS.Backend/
│   ├── Controllers/
│   ├── Models/
│   ├── Views/
│   ├── wwwroot/
│   │   └── uploads/
│   ├── Program.cs
│   └── appsettings.json
│
├── CMS.Data/
│   ├── Entities/
│   ├── Migrations/
│   └── ApplicationDbContext.cs
│
└── frontend/
    ├── src/
    ├── package.json
    ├── vite.config.js
    └── .env
```

> Lưu ý: Tên thư mục Frontend có thể khác nhau tùy máy, ví dụ `frontend`, `client`, `react-client`, `CMS.Frontend`. Chỉ cần mở đúng thư mục có file `package.json`.

---

## 5. Cấu hình Backend

### Bước 1: Mở project bằng Visual Studio

Mở file `.sln` của dự án bằng **Visual Studio 2022**.

Sau đó kiểm tra Solution có ít nhất 2 project:

- `CMS.Backend`
- `CMS.Data`

---

### Bước 2: Set Startup Project

Trong Visual Studio:

1. Chuột phải vào project `CMS.Backend`
2. Chọn **Set as Startup Project**

Backend cần chạy từ project `CMS.Backend` vì đây là project chứa `Program.cs`, controller, view và cấu hình khởi động ứng dụng.

---

### Bước 3: Cấu hình chuỗi kết nối Database

Mở file:

```text
CMS.Backend/appsettings.json
```

Kiểm tra hoặc thêm cấu hình `ConnectionStrings`.

Ví dụ dùng SQL Server LocalDB:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=LamCMS_DB;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
  }
}
```

Nếu dùng SQL Server Express:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.\\SQLEXPRESS;Database=LamCMS_DB;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
  }
}
```

Nếu dùng SQL Server với tài khoản đăng nhập:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=LamCMS_DB;User Id=sa;Password=YourPassword;TrustServerCertificate=True"
  }
}
```

---

### Bước 4: Restore NuGet packages

Trong Visual Studio:

```text
Build > Restore NuGet Packages
```

Hoặc chạy bằng terminal tại thư mục gốc solution:

```bash
dotnet restore
```

---

### Bước 5: Apply Migration để tạo Database

Mở terminal tại thư mục gốc solution, sau đó chạy:

```bash
dotnet ef database update -p CMS.Data -s CMS.Backend
```

Giải thích:

- `-p CMS.Data`: project chứa `DbContext`, entity và migration
- `-s CMS.Backend`: project khởi động ứng dụng
- `database update`: tạo/cập nhật database theo migration hiện có

Nếu lệnh báo chưa cài `dotnet-ef`, chạy:

```bash
dotnet tool install --global dotnet-ef
```

Nếu đã cài nhưng vẫn lỗi, thử đóng terminal, mở lại rồi chạy lại lệnh migration.

---

### Bước 6: Trust HTTPS Development Certificate

Nếu lần đầu chạy ASP.NET Core HTTPS trên máy, chạy lệnh:

```bash
dotnet dev-certs https --trust
```

Sau đó chọn **Yes** khi hệ thống hỏi xác nhận.

---

## 6. Chạy Backend bằng F5

Sau khi đã cấu hình xong:

1. Mở Visual Studio
2. Chọn project startup là `CMS.Backend`
3. Chọn launch profile HTTPS, thường là `https`
4. Nhấn **F5** để chạy Debug

Backend sẽ chạy tại một địa chỉ tương tự:

```text
https://localhost:7214
```

Trang Swagger, nếu được bật trong môi trường Development:

```text
https://localhost:7214/swagger
```

Trang Admin MVC:

```text
https://localhost:7214
```

Hoặc:

```text
https://localhost:7214/Home/Index
```

---

## 7. Chạy Backend bằng lệnh CLI

Ngoài cách chạy bằng F5, có thể chạy bằng terminal:

```bash
dotnet run --project CMS.Backend
```

Nếu muốn tự động reload khi sửa code:

```bash
dotnet watch --project CMS.Backend run
```

---

## 8. Cấu hình Frontend React Vite

### Bước 1: Di chuyển vào thư mục Frontend

Ví dụ:

```bash
cd frontend
```

Hoặc nếu thư mục Frontend của bạn có tên khác, hãy `cd` vào thư mục chứa file:

```text
package.json
```

---

### Bước 2: Cài đặt dependencies

Chạy lệnh:

```bash
npm install
```

---

### Bước 3: Cấu hình biến môi trường

Tạo file `.env` trong thư mục Frontend:

```text
VITE_API_BASE_URL=https://localhost:7214
```

Trong code Frontend, có thể dùng biến này khi tạo Axios instance:

```javascript
import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export default axiosClient;
```

---

### Bước 4: Kiểm tra port Frontend

Backend hiện cho phép CORS với React ở:

```text
http://localhost:3000
```

Nếu muốn React Vite chạy đúng port `3000`, cấu hình trong `vite.config.js`:

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
});
```

Nếu không cấu hình port, Vite thường chạy ở:

```text
http://localhost:5173
```

Khi đó cần cập nhật CORS trong Backend để cho phép origin:

```text
http://localhost:5173
```

Khuyến nghị dùng `http://localhost:3000` để khớp với cấu hình CORS hiện tại của Backend.

---

## 9. Chạy Frontend bằng npm run dev

Tại thư mục Frontend, chạy:

```bash
npm run dev
```

Sau khi chạy thành công, terminal sẽ hiển thị địa chỉ Frontend, ví dụ:

```text
http://localhost:3000
```

Hoặc:

```text
http://localhost:5173
```

Mở trình duyệt và truy cập địa chỉ đó.

---

## 10. Thứ tự chạy đúng

Nên chạy theo thứ tự sau:

### Bước 1: Chạy SQL Server

Đảm bảo SQL Server hoặc LocalDB đang hoạt động.

---

### Bước 2: Apply Migration

Chỉ cần chạy khi database chưa có hoặc có migration mới:

```bash
dotnet ef database update -p CMS.Data -s CMS.Backend
```

---

### Bước 3: Chạy Backend

Chạy bằng Visual Studio:

```text
F5
```

Hoặc CLI:

```bash
dotnet run --project CMS.Backend
```

Backend chạy tại:

```text
https://localhost:7214
```

---

### Bước 4: Chạy Frontend

Mở terminal khác:

```bash
cd frontend
npm install
npm run dev
```

Frontend chạy tại:

```text
http://localhost:3000
```

---

## 11. Các API thường dùng cho Frontend

### Base URL

```text
https://localhost:7214
```

### Orders API

Tạo đơn hàng:

```http
POST /api/Orders
```

Body mẫu:

```json
{
  "customerId": 1,
  "notes": "Giao hàng trong giờ hành chính"
}
```

Response thành công:

```json
{
  "message": "Đặt hàng thành công!",
  "orderId": 5
}
```

### Một số route Backend MVC

```text
/Account/Login
/Account/Logout
/Home/Index
/Post/Index
/Product/Index
/Category/Index
/CategoryProduct/Index
/Customer/Index
/User/Index
```

---

## 12. Upload hình ảnh

Hình ảnh bài viết và sản phẩm được lưu tại:

```text
CMS.Backend/wwwroot/uploads/
```

Đường dẫn lưu trong database thường có dạng:

```text
/uploads/ten-file.jpg
```

Ví dụ hiển thị ảnh ở Frontend:

```javascript
const imageUrl = `${import.meta.env.VITE_API_BASE_URL}${product.imageUrl}`;
```

Ví dụ:

```text
https://localhost:7214/uploads/example.jpg
```

---

## 13. Xử lý lỗi thường gặp

### Lỗi 1: Không kết nối được database

Thông báo thường gặp:

```text
Cannot open database
A network-related or instance-specific error occurred
```

Cách xử lý:

- Kiểm tra SQL Server hoặc LocalDB đã chạy chưa
- Kiểm tra lại `ConnectionStrings` trong `appsettings.json`
- Chạy lại migration:

```bash
dotnet ef database update -p CMS.Data -s CMS.Backend
```

---

### Lỗi 2: Không nhận lệnh dotnet ef

Thông báo thường gặp:

```text
Could not execute because the specified command or file was not found
```

Cách xử lý:

```bash
dotnet tool install --global dotnet-ef
```

Sau đó đóng terminal, mở lại và kiểm tra:

```bash
dotnet ef --version
```

---

### Lỗi 3: Trình duyệt báo HTTPS certificate không tin cậy

Cách xử lý:

```bash
dotnet dev-certs https --trust
```

Sau đó tắt trình duyệt và mở lại.

---

### Lỗi 4: Frontend gọi API bị CORS

Thông báo thường gặp trên Console:

```text
Access to XMLHttpRequest has been blocked by CORS policy
```

Cách xử lý:

- Kiểm tra Frontend đang chạy ở port nào
- Nếu Frontend chạy ở `http://localhost:3000`, Backend phải allow origin này
- Nếu Frontend chạy ở `http://localhost:5173`, cần thêm origin này vào CORS Backend
- Hoặc cấu hình Vite chạy ở port `3000`

Ví dụ `vite.config.js`:

```javascript
server: {
  port: 3000;
}
```

---

### Lỗi 5: Frontend gọi API bị ERR_CONNECTION_REFUSED

Nguyên nhân thường là Backend chưa chạy hoặc sai port.

Cách xử lý:

- Đảm bảo Backend đang chạy bằng F5
- Kiểm tra Backend có đúng URL không:

```text
https://localhost:7214
```

- Kiểm tra file `.env` của Frontend:

```text
VITE_API_BASE_URL=https://localhost:7214
```

---

### Lỗi 6: npm run dev bị lỗi thiếu package

Cách xử lý:

```bash
npm install
npm run dev
```

Nếu vẫn lỗi, xóa `node_modules` và `package-lock.json`, sau đó cài lại:

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

Trên Windows PowerShell:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
npm run dev
```

---

## 14. Ghi chú khi phát triển

- Luôn chạy Backend trước Frontend để tránh lỗi gọi API.
- Kiểm tra đúng URL trong `.env`.
- Khi thêm migration mới, chạy lại:

```bash
dotnet ef database update -p CMS.Data -s CMS.Backend
```

- Nếu thêm API mới cho React, nên đặt route theo dạng:

```text
/api/tên-controller
```

- Nếu Frontend cần gọi API có cookie authentication, Axios cần bật:

```javascript
withCredentials: true;
```

Ví dụ:

```javascript
axiosClient.defaults.withCredentials = true;
```

---

## 15. Checklist chạy dự án nhanh

### Backend

```bash
dotnet restore
dotnet ef database update -p CMS.Data -s CMS.Backend
dotnet run --project CMS.Backend
```

Hoặc mở Visual Studio và nhấn:

```text
F5
```

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 16. URL sau khi chạy thành công

| Thành phần     | URL                                         |
| -------------- | ------------------------------------------- |
| Backend        | `https://localhost:7214`                    |
| Swagger        | `https://localhost:7214/swagger`            |
| Admin MVC      | `https://localhost:7214/Home/Index`         |
| Frontend React | `http://localhost:3000`                     |
| Upload images  | `https://localhost:7214/uploads/{fileName}` |

---

## 17. Tóm tắt quy trình chạy

```text
1. Mở SQL Server / LocalDB
2. Cấu hình ConnectionStrings trong CMS.Backend/appsettings.json
3. Chạy migration tạo database
4. Mở Visual Studio, set CMS.Backend làm Startup Project
5. Nhấn F5 để chạy Backend
6. Mở terminal trong thư mục Frontend
7. Chạy npm install
8. Chạy npm run dev
9. Truy cập Frontend bằng trình duyệt
```

---

## 18. Tác giả

**Nguyễn Đình Lâm**

---

## 19. License

Dự án sử dụng cho mục đích học tập, thực hành ASP.NET Core MVC/API và React Vite.
