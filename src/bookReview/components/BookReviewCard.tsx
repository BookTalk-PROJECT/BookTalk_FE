import React from "react";
import { BookReview } from "../types/bookReview";
import { useNavigate } from "react-router-dom";

interface BookReviewCardProps {
  review: BookReview;
  onDelete: (code: string) => void;
}

const BookReviewCard: React.FC<BookReviewCardProps> = ({ review, onDelete }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/book-review/${review.code}`);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full cursor-pointer"
      onClick={handleCardClick}>
      <img src={review.thumbnail_url} alt={review.book_title} className="w-full h-48 object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold mb-2 truncate">{review.review_title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">{review.book_title}</p>{" "}
        {/* Display book title */}
        <div className="mt-auto flex justify-between items-center">
          <div className="text-xs text-gray-500">
            <span>{review.author}</span> | <span>{review.reg_date}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookReviewCard;
