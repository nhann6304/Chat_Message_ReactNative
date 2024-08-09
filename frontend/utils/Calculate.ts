export const calculateOfflineDuration = (lastOfflineTime: string): string => {
    console.log("Tính thời gian nè ", lastOfflineTime);
    // Chuyển đổi chuỗi thời gian thành đối tượng Date
    const lastOfflineDate = new Date(lastOfflineTime);
    const currentDate = new Date();
    // Tính toán sự khác biệt giữa thời gian hiện tại và thời gian offline
    const differenceInMilliseconds = currentDate.getTime() - lastOfflineDate.getTime();

    // Chuyển đổi sự khác biệt thành phút và giờ
    const differenceInMinutes = Math.floor(differenceInMilliseconds / (1000 * 60));
    const differenceInHours = Math.floor(differenceInMilliseconds / (1000 * 60 * 60));

    // Trả về kết quả tùy thuộc vào khoảng thời gian
    if (differenceInMinutes < 60) {
        return `${differenceInMinutes} phút trước`;
    } else if (differenceInHours < 24) {
        return `${differenceInHours} giờ trước`;
    } else {
        const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
        return `${differenceInDays} ngày trước`;
    }
};


export const formatTime = (time: string | Date): string => {
    const date = new Date(time);
    if (isNaN(date.getTime())) {
        return "Invalid date";
    }
    const options: Intl.DateTimeFormatOptions = {
        hour: "numeric",
        minute: "numeric",
        hour12: true
    };
    return date.toLocaleString("en-VN", options);
};