import { useEffect } from "react";
import { useRouter } from "next/router";

export default function PayPalCallback() {
  const router = useRouter();
  const { paymentId, PayerID, bookingId } = router.query;

  useEffect(() => {
    if (paymentId && PayerID && bookingId) {
      fetch(`http://localhost:8083/api/paypal/success?paymentId=${paymentId}&PayerID=${PayerID}&bookingId=${bookingId}`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.redirectUrl) {
            window.location.href = data.redirectUrl; // Chuyển hướng về dashboard
          } else if (data.error) {
            alert(data.error); // Hiển thị lỗi
            router.push("/"); // Quay về trang chủ nếu lỗi
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Xử lý thanh toán thất bại");
          router.push("/");
        });
    }
  }, [paymentId, PayerID, bookingId, router]);

  return <div>Đang xử lý thanh toán, vui lòng đợi...</div>;
}