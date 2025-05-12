// Hàm này sẽ tính toán sự khác biệt giữa hai thời gian (fromHour và toHour) và trả về số giờ chênh lệch
const calculateTimeDifference = (fromHour, toHour) => {
    if (!fromHour || !toHour) return 0;
  
    // Kiểm tra định dạng thời gian
    const [fromH, fromM, fromS] = fromHour.split(":").map(Number);
    const [toH, toM, toS] = toHour.split(":").map(Number);
  
    // Kiểm tra tính hợp lệ của thời gian
    const fromTotalMinutes = fromH * 60 + fromM + fromS / 60;
    const toTotalMinutes = toH * 60 + toM + toS / 60;
  
    // Nếu thời gian bắt đầu lớn hơn thời gian kết thúc, trả về 0
    const differenceInHours = (toTotalMinutes - fromTotalMinutes) / 60;
  
    return differenceInHours; // e.g., 1.5 for 1 hour 30 minutes
  };
  
  // Ham này sẽ định dạng sự khác biệt thời gian thành chuỗi "X giờ Y phút"
  const formatTimeDifference = (hours) => {
    if (hours <= 0) return "0 giờ";
  
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
  
    if (minutes === 0) {
      return `${wholeHours} giờ`;
    }
    return `${wholeHours} giờ ${minutes} phút`;
  };
  
  export { calculateTimeDifference, formatTimeDifference };