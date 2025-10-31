# Bước 1: Chọn một image nền nhỏ gọn chứa web server Nginx
FROM nginx:alpine

# Bước 2: Đặt thư mục làm việc mặc định bên trong container
# Đây là nơi Nginx sẽ tìm các tệp HTML, CSS, JS để phục vụ
WORKDIR /usr/share/nginx/html

# Bước 3: Sao chép TOÀN BỘ mã nguồn từ máy của bạn vào thư mục làm việc trong container
COPY . .

# Bước 4: Sao chép kịch bản entrypoint.sh vào thư mục gốc của container
COPY entrypoint.sh /entrypoint.sh

# Bước 5: Cấp quyền thực thi cho kịch bản entrypoint.sh
# Nếu không có bước này, container sẽ không thể chạy kịch bản
RUN chmod +x /entrypoint.sh

# Bước 6: Định nghĩa kịch bản entrypoint.sh là thứ sẽ chạy ĐẦU TIÊN khi container khởi động
ENTRYPOINT ["/entrypoint.sh"]

# Bước 7: Lệnh mặc định sẽ được chạy SAU KHI entrypoint.sh thực thi xong
# Lệnh này dùng để khởi động Nginx ở chế độ foreground
CMD ["nginx", "-g", "daemon off;"]
