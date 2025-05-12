const vietnameseDays = [
    "Chủ Nhật",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
];

const formatDateWithDay = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Ngày không hợp lệ";
    const dayOfWeek = vietnameseDays[date.getDay()];
    const formattedDate = date.toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
    });
    return `${dayOfWeek} - Ngày ${formattedDate}`;
};

export { formatDateWithDay };