# Crawl-data-help-law
Use Playwright to crawl and export to CSV files
# Chạy chương trình
- npm i  
Mục đích là để install các lib depencies có dùng trong project
- node index start_index end_index thread  
Chạy file index.js với start_index là số của trang bắt đầu, end_index là số trang kết thúc, thread là số browser chromium sẽ mở để chạy auto (có thể mở Task Manager để xem có bị full CPU hay full disk ko mà thay đổi tham số chạy)
- git pull  
Để get code bản mới nhất về nếu đã clone code
# Lưu ý
- Chương trình sẽ ghi đè file CSV nếu bị trùng tên với trong code nên muốn có file mới thì nên đổi tên trong code hoặc đổi tên file ngoài thư mục, hoặc cần thì copy file csv đã có ra chỗ khác
- Chạy chương trình đừng mở file CSV không đọc ghi file sẽ bị lỗi nếu trùng tên file đã có
- Có thể tinh chỉnh index page chạy bắt đầu và kết thúc ở trong code: START_INDEX và END_INDEX
- Việc mở file CSV có tiếng việt bằng excel sẽ hiển thị các kí tự đặc biệt nhưng không có nghĩ là giá trị nó bị sai. Thực chất là giá trị vẫn đúng chỉ là việc mở bằng Excel làm nó bị sai. GG để fix this problem
