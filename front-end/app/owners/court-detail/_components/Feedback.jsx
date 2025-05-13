import React, { useState } from "react";
import { Star } from "lucide-react";

function Feedback() {
    const [feedbacks, setFeedbacks] = useState([
        {
            id: 1,
            userName: "Nguyen Van A",
            rating: 4,
            comment: "Sân rất đẹp, dịch vụ tốt nhưng giá hơi cao.",
            date: "2025-05-10",
        },
        {
            id: 2,
            userName: "Tran Thi B",
            rating: 5,
            comment: "Trải nghiệm tuyệt vời, nhân viên thân thiện!",
            date: "2025-05-08",
        },
    ]);

    const [newRating, setNewRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [newComment, setNewComment] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newRating === 0 || !newComment.trim()) {
            alert("Vui lòng chọn số sao và nhập nhận xét!");
            return;
        }

        const newFeedback = {
            id: feedbacks.length + 1,
            userName: "Anonymous",
            rating: newRating,
            comment: newComment,
            date: new Date().toISOString().split("T")[0],
        };

        setFeedbacks([...feedbacks, newFeedback]);
        setNewRating(0);
        setNewComment("");
    };

    const totalRatings = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
    const averageRating = feedbacks.length > 0 ? (totalRatings / feedbacks.length).toFixed(1) : 0;
    const totalReviews = feedbacks.length;

    return (
        <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold border-l-4 border-orange-300 pl-3 mb-6">
                Đánh giá và Nhận xét
            </h2>
            <div className="mb-8">
                {feedbacks.length === 0 ? (
                    <p className="text-gray-500">Chưa có nhận xét nào.</p>
                ) : (
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Rating Summary */}
                        <div className="w-full md:w-1/4 bg-white p-6 rounded-lg border border-gray-200 max-h-96">
                            <h2 className="text-2xl font-bold mb-6 text-center">Trung bình</h2>
                            <div className="mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-4xl font-bold text-orange-500">
                                        {averageRating}
                                    </span>
                                    <div className="flex">
                                        {[...Array(5)].map((_, index) => (
                                            <Star
                                                key={index}
                                                className={`size-6 ${index < Math.round(averageRating)
                                                        ? "text-orange-400"
                                                        : "text-gray-300"
                                                    }`}
                                                fill={
                                                    index < Math.round(averageRating)
                                                        ? "orange"
                                                        : "none"
                                                }
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-600">Dựa trên {totalReviews} đánh giá</p>
                            </div>
                            <div className="space-y-2">
                                {[5, 4, 3, 2, 1].map((star) => {
                                    const count = feedbacks.filter((f) => f.rating === star).length;
                                    const percentage =
                                        totalReviews > 0
                                            ? ((count / totalReviews) * 100).toFixed(0)
                                            : 0;
                                    return (
                                        <div key={star} className="flex items-center gap-2">
                                            <span className="w-16">{star} sao</span>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className="bg-orange-400 h-2.5 rounded-full"
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm text-gray-500">{percentage}%</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        {/* Feedback List with Scroll */}
                        <div className="w-full md:w-3/4 space-y-4 max-h-[500px] overflow-y-auto">
                            {feedbacks.map((feedback) => (
                                <div
                                    key={feedback.id}
                                    className="border-b border-gray-200 pb-4 last:border-b-0"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-lg">
                                                {feedback.userName}
                                            </span>
                                            <div className="flex">
                                                {[...Array(5)].map((_, index) => (
                                                    <Star
                                                        key={index}
                                                        className={`size-6 ${index < feedback.rating
                                                                ? "text-orange-400"
                                                                : "text-gray-300"
                                                            }`}
                                                        fill={
                                                            index < feedback.rating
                                                                ? "orange"
                                                                : "none"
                                                        }
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            {feedback.date}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-gray-700">{feedback.comment}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-semibold mb-4">Viết nhận xét của bạn</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-lg font-medium mb-2">Đánh giá của bạn</label>
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, index) => {
                                const ratingValue = index + 1;
                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => setNewRating(ratingValue)}
                                        onMouseEnter={() => setHoverRating(ratingValue)}
                                        onMouseLeave={() => setHoverRating(0)}
                                    >
                                        <Star
                                            className={`size-6 ${ratingValue <= (hoverRating || newRating)
                                                    ? "text-orange-400"
                                                    : "text-gray-300"
                                                }`}
                                            fill={
                                                ratingValue <= (hoverRating || newRating)
                                                    ? "orange"
                                                    : "none"
                                            }
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="comment" className="block text-lg font-medium mb-2">
                            Nhận xét
                        </label>
                        <textarea
                            id="comment"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                            rows={4}
                            placeholder="Chia sẻ trải nghiệm của bạn..."
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-orange-400 text-white px-6 py-2 rounded-md hover:bg-orange-500 transition-colors"
                    >
                        Gửi nhận xét
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Feedback;