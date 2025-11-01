# -----------------------------------------------
# GIAI ĐOẠN 1: "Máy đóng gói" (Build Stage)
# -----------------------------------------------
# Dùng image Node.js 18 bản Alpine (nhẹ) để build
FROM node:18-alpine AS build

# Đặt thư mục làm việc trong container
WORKDIR /app

# Copy file package.json
# (Chúng ta chỉ copy package.json vì log lỗi của bạn báo không có package-lock.json)
COPY package.json ./

# Chạy npm install BÊN TRONG container build này (đây chính là "máy đóng gói")
RUN npm install

# Copy toàn bộ mã nguồn còn lại của dự án vào
COPY . .

# Chạy lệnh build để tạo ra thư mục /app/dist
RUN npm run build

# -----------------------------------------------
# GIAI ĐOẠN 2: "Máy chạy chính" (Final Stage)
# -----------------------------------------------
# Dùng image Nginx bản Alpine (siêu nhẹ)
FROM nginx:alpine

# Đặt thư mục làm việc là thư mục root của Nginx
WORKDIR /usr/share/nginx/html

# Xoá các file HTML mặc định của Nginx
RUN rm -rf ./*

# Copy các file đã build (thư mục dist) từ GIAI ĐOẠN 1 vào
COPY --from=build /app/dist .

# Copy script entrypoint vào
COPY entrypoint.sh /entrypoint.sh

# SỬA LỖI CRLF (Windows line endings):
# Đảm bảo script chạy được trên Linux
RUN sed -i 's/\r$//' /entrypoint.sh

# Cấp quyền thực thi cho script
RUN chmod +x /entrypoint.sh

# Đặt script này làm lệnh khởi động
ENTRYPOINT ["/entrypoint.sh"]

# Lệnh mặc định sẽ được truyền cho ENTRYPOINT
# (nginx sẽ chạy ở foreground)
CMD ["nginx", "-g", "daemon off;"]
