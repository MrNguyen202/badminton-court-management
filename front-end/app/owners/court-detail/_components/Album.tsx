import React, { useState } from "react";

type AlbumProps = {
    src: string;
    alt: string;
};
function Album({ items }: { items: AlbumProps[] }) {
    const [isCarouselOpen, setIsCarouselOpen] = useState(false); // Trạng thái mở/đóng carousel
    const [currentIndex, setCurrentIndex] = useState(0);

    // Hàm mở carousel tại hình ảnh được chọn
    const openCarousel = (index: number) => {
        setCurrentIndex(index);
        setIsCarouselOpen(true);
    };

    // Hàm đóng carousel
    const closeCarousel = () => {
        setIsCarouselOpen(false);
    };

    // Hàm chuyển đến hình trước
    const goToPrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? items.length - 1 : prevIndex - 1
        );
    };

    // Hàm chuyển đến hình tiếp theo
    const goToNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === items.length - 1 ? 0 : prevIndex + 1
        );
    };
    return (
        <div className="w-full h-full flex">
            <div className="flex flex-col w-2/3">
                <a
                    href="#"
                    className="w-full h-2/3 p-2"
                    onClick={(e) => {
                        e.preventDefault();
                        openCarousel(0);
                    }}
                >
                    <img src={items[0]?.src} alt={items[0]?.alt} className="w-full object-cover h-full" />
                </a>
                <div className="flex h-1/3">
                    <a
                        href="#"
                        className="w-1/3 p-2"
                        onClick={(e) => {
                            e.preventDefault();
                            openCarousel(1);
                        }}
                    >
                        <img src={items[1]?.src} alt={items[1]?.alt} className="w-full object-cover h-full" />
                    </a>
                    <a
                        href="#"
                        className="w-2/3 p-2"
                        onClick={(e) => {
                            e.preventDefault();
                            openCarousel(2);
                        }}
                    >
                        <img src={items[2]?.src} alt={items[2]?.alt} className="w-full object-cover h-full" />
                    </a>
                </div>
            </div>
            <div className="w-1/3 flex flex-col">
                <a
                    href="#"
                    className="w-full p-2 h-1/3"
                    onClick={(e) => {
                        e.preventDefault();
                        openCarousel(3);
                    }}>
                    <img src={items[3]?.src} alt={items[3]?.alt} className="w-full object-cover h-full" />
                </a>
                <a
                    href="#"
                    className="w-full p-2 h-2/3"
                    onClick={(e) => {
                        e.preventDefault();
                        openCarousel(4);
                    }}>
                    <img src={items[4]?.src} alt={items[4]?.alt} className="w-full object-cover h-full" />
                </a>
            </div>

            {/* Hiển thị carousel khi được mở */}
            {isCarouselOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                    onClick={closeCarousel}
                >
                    <div
                        className="relative w-full max-w-3xl h-screen items-center justify-center flex"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Nút đóng carousel */}
                        <button
                            onClick={closeCarousel}
                            className="absolute bottom-20 text-white text-3xl z-50 border border-white px-2 rounded-full hover:bg-slate-500 bg-gray-800"
                        >
                            ×
                        </button>

                        {/* Carousel tùy chỉnh */}
                        <div className="relative flex items-center justify-center w-full h-2/3 bg-slate-100">
                            {/* Hình ảnh hiện tại */}
                            <img
                                src={items[currentIndex]?.src}
                                alt={items[currentIndex]?.alt}  
                                className="rounded-lg"
                            />

                            {/* Nút điều hướng */}
                            <button
                                onClick={goToPrevious}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75"
                            >
                                &larr;
                            </button>
                            <button
                                onClick={goToNext}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75"
                            >
                                &rarr;
                            </button>

                            {/* Chỉ số hình ảnh */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded">
                                {currentIndex + 1} / {items.length}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Album;
