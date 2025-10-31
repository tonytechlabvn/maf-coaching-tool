# MAF HO CHI MINH RUNNING COACHING

Ứng dụng huấn luyện viên chạy bộ AI, sử dụng Gemini API để tạo ra các giáo án luyện tập được cá nhân hóa cao dựa trên mục tiêu, tuổi tác, VO2 Max, và tình trạng thể chất hiện tại của người dùng.

## Tính năng chính

-   **Tạo giáo án cá nhân hóa**: Dựa trên các chỉ số chi tiết của người dùng để đưa ra kế hoạch phù hợp nhất.
-   **Đánh giá tính khả thi**: AI sẽ phân tích mục tiêu của bạn có thực tế và an toàn hay không trước khi tạo giáo án.
-   **Phương pháp MAF**: Tập trung vào việc xây dựng nền tảng hiếu khí bền vững, an toàn.
-   **Toàn diện**: Giáo án bao gồm lịch tập hàng tuần, bài tập bổ trợ, và hướng dẫn dinh dưỡng.
-   **Xuất dữ liệu**: Dễ dàng tải giáo án dưới dạng file CSV hoặc xuất từng giai đoạn ra ảnh.
-   **Hỗ trợ 2 Model AI**: Tùy chọn giữa Gemini Flash (nhanh) và Gemini Pro (chi tiết).
-   **Quản lý API Key**: Giao diện an toàn để người dùng nhập và lưu trữ Gemini API Key ngay trên trình duyệt.

---

## Hướng dẫn cài đặt

### Chạy ở môi trường Local (Development)

Ứng dụng này là một trang web tĩnh (static web app) và không yêu cầu các bước build phức tạp để chạy thử.

1.  **Tải mã nguồn**: Tải toàn bộ các file của ứng dụng về máy tính của bạn.
2.  **Mở ứng dụng**: Mở file `index.html` trực tiếp bằng trình duyệt web của bạn (ví dụ: Google Chrome, Firefox).
3.  **Nhập API Key**:
    *   Khi mở lần đầu, một hộp thoại sẽ hiện ra yêu cầu bạn nhập **Gemini API Key**.
    *   Key của bạn sẽ được lưu vào `localStorage` của trình duyệt để sử dụng cho các lần sau.
    *   Nếu bạn chưa có key, hãy xem video hướng dẫn trong hộp thoại để tạo key mới.

---

## Hướng dẫn triển khai (Production với Docker)

Để triển khai ứng dụng lên server một cách chuyên nghiệp, bạn nên sử dụng Docker. Dưới đây là hướng dẫn chi tiết.

### Bước 1: Chuẩn bị mã nguồn

Đảm bảo bạn có đầy đủ các file của ứng dụng trong một thư mục.

### Bước 2: Tạo file `Dockerfile`

Trong thư mục gốc của dự án, tạo một file tên là `Dockerfile` (không có đuôi file) và dán nội dung sau vào:

```Dockerfile
# Stage 1: Build a simple static file server using Nginx
FROM nginx:alpine

# Copy the static application files to the Nginx html directory
COPY . /usr/share/nginx/html

# Copy the entrypoint script
COPY entrypoint.sh /entrypoint.sh

# Make the entrypoint script executable
RUN chmod +x /entrypoint.sh

# Expose port 80 for the Nginx server
EXPOSE 80

# The entrypoint script will run when the container starts
ENTRYPOINT ["/entrypoint.sh"]

# The command to start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
```

### Bước 3: Tạo file `entrypoint.sh`

Tạo một file tên là `entrypoint.sh` và dán nội dung sau:

```sh
#!/bin/sh
# entrypoint.sh

# If API_KEY environment variable is set and not empty, replace the placeholder in index.html
if [ -n "$API_KEY" ]; then
  echo "Found API_KEY environment variable. Injecting key..."
  # Use sed to replace the placeholder. The '#' separator is used to avoid conflicts with special characters in the key.
  sed -i "s#__GEMINI_API_KEY__#${API_KEY}#g" /usr/share/nginx/html/index.html
else
  echo "API_KEY not set. The app will prompt the user for a key."
  # If no API key is provided, replace the placeholder with an empty string.
  sed -i 's#__GEMINI_API_KEY__##g' /usr/share/nginx/html/index.html
fi

# Execute the CMD from the Dockerfile (starts nginx)
exec "$@"
```
**Quan trọng**: Sau khi tạo file, hãy cấp quyền thực thi cho nó bằng lệnh sau trên terminal (Linux/macOS):
```bash
chmod +x entrypoint.sh
```

### Bước 4: Build Docker Image

Mở terminal trong thư mục dự án và chạy lệnh sau để build image:
```bash
docker build -t maf-coach-frontend .
```

### Bước 5: Chạy Docker Container

Sau khi build xong, bạn có thể chạy container.

**Cách 1: Không cung cấp API Key mặc định (Người dùng tự nhập)**
Ứng dụng sẽ luôn hiện hộp thoại yêu cầu người dùng nhập key.

```bash
docker run -d -p 8888:80 --name maf-coach maf-coach-frontend
```

**Cách 2: Cung cấp API Key mặc định**
Ứng dụng sẽ sử dụng key này. Hộp thoại sẽ không hiện ra trừ khi key không hợp lệ.

```bash
docker run -d -p 8888:80 --name maf-coach -e API_KEY="your_gemini_api_key_here" maf-coach-frontend
```
*   Thay `your_gemini_api_key_here` bằng Gemini API Key của bạn.
*   Bây giờ bạn có thể truy cập ứng dụng tại `http://localhost:8888`.

---

### (Tùy chọn) Triển khai bằng `docker-compose.yml`

Để quản lý dễ dàng hơn, bạn có thể tạo file `docker-compose.yml`:

```yaml
version: '3.8'

services:
  maf-coach-frontend:
    build: .
    container_name: maf-coach-frontend
    ports:
      - "8888:80"
    environment:
      # API_KEY có thể được đọc từ file .env hoặc đặt trực tiếp tại đây
      - API_KEY=${API_KEY}
    restart: unless-stopped
```

**Cách sử dụng:**
1.  Tạo một file tên là `.env` trong cùng thư mục và thêm vào nội dung:
    ```
    API_KEY=your_gemini_api_key_here
    ```
2.  Chạy lệnh:
    ```bash
    docker-compose up -d
    ```
3.  Để dừng, chạy lệnh:
    ```bash
    docker-compose down
    ```
