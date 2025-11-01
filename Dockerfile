# GIAI ĐOẠN 1: "Máy đóng gói" (Build Stage)
# ---------------------------------------------

# Dùng Image Node.js 18 bản Alpine (nhẹ) để build
FROM node:18-alpine AS build

# Đặt thư mục làm việc trong container
WORKDIR /app

# Copy file package.json
# (Chúng ta chỉ copy package.json v1 log lỗi của bạn không có package-lock.json)
COPY package.json ./

# Chạy npm install bên TRONG container build này (đây chính là "máy đóng gói")
RUN npm install

# Copy toàn bộ mã nguồn còn lại của dự án vào
COPY . .

# Chạy lệnh build để tạo ra thư mục /app/dist
RUN npm run build

# GIAI ĐOẠN 2: "Máy chạy chính" (Final Stage)
# ---------------------------------------------

# Dùng image Nginx bản Alpine (siêu nhẹ)
FROM nginx:alpine

# Đặt thư mục làm việc là thư mục root của Nginx
WORKDIR /usr/share/nginx/html

# Xoá các file html mặc định của Nginx
RUN rm -rf ./*

# Copy các file đã build (thư mục dist) từ GIAI ĐOẠN 1 vào
COPY --from=build /app/dist .

# (Phần entrypoint.sh không cần thiết đã được xóa)
# Image nginx:alpine gốc sẽ tự động dùng CMD mặc định
# để chạy nginx ở foreground.
