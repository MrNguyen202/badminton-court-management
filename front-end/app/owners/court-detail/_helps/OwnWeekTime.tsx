// Lấy ngày thứ Bảy tiếp theo
export function getNextSevenDay(currentDate: Date): Date {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + 6); 
    return date;
}