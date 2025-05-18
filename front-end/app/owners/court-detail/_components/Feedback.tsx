import React, { useEffect, useState } from "react";
import { Delete, Star } from "lucide-react";
import { feedbackAPI } from "@/app/api/court-services/feedbackAPI";
import { toast } from "react-toastify";

function Feedback({ courtID }: any) {
    const user = localStorage.getItem("user");
    const [feedbacks, setFeedbacks] = useState([]);
    const [newRating, setNewRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [newComment, setNewComment] = useState("");
    const [visibleFeedbacks, setVisibleFeedbacks] = useState(5); // State to control visible feedbacks
    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                console.log("Fetching feedbacks for court ID:", courtID);
                const response = await feedbackAPI.getFeedbacks(courtID);
                console.log("Fetched feedbacks:", response);
                setFeedbacks(response);
            } catch (error) {
                console.error("Error fetching feedbacks:", error);
            }
        };

        fetchFeedbacks();
    }, [courtID]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newRating === 0 || !newComment.trim()) {
            toast.warning("Vui lòng chọn số sao và nhập nhận xét!");
            return;
        }

        if (!user) {
            toast.warning("Vui lòng đăng nhập để gửi nhận xét!");
            return;
        }

        const newFeedback = {
            userName: user ? JSON.parse(user).name : "Người dùng",
            numberStar: newRating,
            content: newComment,
            userId: user ? JSON.parse(user).id : 0,
            courtId: courtID,
        };

        feedbackAPI
            .createFeedback(newFeedback)
            .then((createdFeedback) => {
                setFeedbacks([...feedbacks, createdFeedback]);
            })
            .catch((error) => {
                console.error("Error creating feedback:", error);
            });

        setNewRating(0);
        setNewComment("");
    };

    const totalRatings = feedbacks.reduce(
        (sum, feedback) => sum + feedback.numberStar,
        0
    );
    const averageRating =
        feedbacks.length > 0 ? (totalRatings / feedbacks.length).toFixed(1) : 0;
    const totalReviews = feedbacks.length;

    // Handle "View More" button click
    const handleViewMore = () => {
        setVisibleFeedbacks(feedbacks.length); // Show all feedbacks
    };

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
                        <div className="w-full md:w-1/4 bg-white p-6 rounded-lg border border-gray-200 max-h-96">
                            <h2 className="text-2xl font-bold mb-6 text-center">Trung bình</h2>
                            <div className="mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-4xl font-bold">{averageRating}</span>
                                    <div className="flex">
                                        {[...Array(5)].map((_, index) => (
                                            <Star
                                                key={index}
                                                className={`size-6 ${index < Math.round(averageRating)
                                                        ? "text-yellow-400"
                                                        : "text-gray-300"
                                                    }`}
                                                fill={
                                                    index < Math.round(averageRating) ? "yellow" : "none"
                                                }
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-600">Dựa trên {totalReviews} đánh giá</p>
                            </div>
                            <div className="space-y-2">
                                {[5, 4, 3, 2, 1].map((star) => {
                                    const count = feedbacks.filter(
                                        (f) => f.numberStar === star
                                    ).length;
                                    const percentage =
                                        totalReviews > 0
                                            ? ((count / totalReviews) * 100).toFixed(0)
                                            : 0;
                                    return (
                                        <div key={star} className="flex items-center gap-2">
                                            <span className="w-16">{star} sao</span>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className="bg-primary-400 h-2.5 rounded-full"
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm text-gray-500">{percentage}%</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="w-full md:w-3/4 space-y-4">
                            <div
                                className={`space-y-4 ${visibleFeedbacks >= feedbacks.length
                                        ? "max-h-[500px] overflow-y-auto"
                                        : ""
                                    }`}
                            >
                                {feedbacks.slice(0, visibleFeedbacks).map((feedback) => (
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
                                                            className={`size-6 ${index < feedback.numberStar
                                                                    ? "text-yellow-400"
                                                                    : "text-gray-300"
                                                                }`}
                                                            fill={
                                                                index < feedback.numberStar ? "yellow" : "none"
                                                            }
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {feedback.userId === JSON.parse(user)?.id && (
                                                    <button>
                                                        <Delete className="text-red-500" />
                                                    </button>
                                                )}
                                                <span className="text-sm text-gray-500">
                                                    {feedback.date}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="mt-2 text-gray-700">{feedback.content}</p>
                                    </div>
                                ))}
                            </div>
                            {visibleFeedbacks < feedbacks.length && (
                                <button
                                    onClick={handleViewMore}
                                    className="mt-4 text-teal-500 hover:text-teal-600 font-medium"
                                >
                                    Xem thêm
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-semibold mb-4">Viết nhận xét của bạn</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-lg font-medium mb-2">
                            Đánh giá của bạn
                        </label>
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
                                                    ? "text-yellow-400"
                                                    : "text-yellow-300"
                                                }`}
                                            fill={
                                                ratingValue <= (hoverRating || newRating)
                                                    ? "yellow"
                                                    : "none"
                                            }
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="content" className="block text-lg font-medium mb-2">
                            Nhận xét
                        </label>
                        <textarea
                            id="content"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                            rows={4}
                            placeholder="Chia sẻ trải nghiệm của bạn..."
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-400 transition-colors"
                    >
                        Gửi nhận xét
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Feedback;