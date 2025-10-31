#!/bin/sh
# Dòng trên chỉ định rằng đây là một kịch bản shell

# Tìm đến tệp geminiService.ts trong thư mục services
TARGET_FILE="/usr/share/nginx/html/services/geminiService.ts"

# Kiểm tra xem biến môi trường API_KEY có được cung cấp hay không
if [ -z "$API_KEY" ]; then
  # Nếu không, in ra lỗi và thoát
  echo "LỖI: Biến môi trường API_KEY chưa được thiết lập."
  exit 1
fi

# Dùng lệnh 'sed' để tìm chuỗi "__GEMINI_API_KEY__" trong tệp mục tiêu
# và thay thế nó bằng giá trị thực của biến môi trường $API_KEY.
# Tùy chọn -i sẽ sửa trực tiếp trên tệp.
sed -i "s|__GEMINI_API_KEY__|${API_KEY}|g" "$TARGET_FILE"

echo "API key đã được thay thế thành công."

# Lệnh 'exec "$@"' sẽ thực thi lệnh được truyền vào từ Dockerfile (chính là CMD)
# Trong trường hợp này, nó sẽ chạy: nginx -g 'daemon off;'
# Điều này đảm bảo Nginx chỉ khởi động sau khi API key đã được thay thế.
exec "$@"
