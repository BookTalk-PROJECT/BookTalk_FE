import React, { useState, useEffect } from "react";
import { BookReviewCreate, BookReviewUpdate, BookReviewDetail } from "../types/bookReview";
import CustomButton from "../../common/component/CustomButton";
import CustomInput from "../../common/component/CustomInput";
import { Link } from "react-router-dom";

interface BookReviewFormProps {
  initialData?: BookReviewDetail; // For edit mode
  onSubmit: (data: BookReviewCreate | BookReviewUpdate) => void;
  isEditMode?: boolean;
}

const BookReviewForm: React.FC<BookReviewFormProps> = ({ initialData, onSubmit, isEditMode = false }) => {
  const [formData, setFormData] = useState<BookReviewCreate | BookReviewUpdate>(
    initialData
      ? {
          title: initialData.reviewTitle,
          content: initialData.content,
          rating: initialData.rating,
        }
      : {
          bookTitle: "",
          authors: "",
          publisher: "",
          isbn: "",
          thumbnail: "",
          title: "",
          content: "",
          rating: 0,
          notificationYn: false,
        }
  );

  useEffect(() => {
    if (initialData && isEditMode) {
      setFormData({
        title: initialData.reviewTitle,
        content: initialData.content,
        rating: initialData.rating,
      });
    }
  }, [initialData, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({
      ...prev,
      rating: rating,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto my-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{isEditMode ? "서평 수정" : "서평 작성"}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {!isEditMode && (
          <>
            <CustomInput
              label="도서명"
              type="text"
              name="bookTitle"
              value={(formData as BookReviewCreate).bookTitle}
              onChange={handleChange}
              placeholder="도서명을 입력하세요"
              required
            />
            <CustomInput
              label="저자"
              type="text"
              name="authors"
              value={(formData as BookReviewCreate).authors}
              onChange={handleChange}
              placeholder="저자를 입력하세요"
              required
            />
            <CustomInput
              label="출판사"
              type="text"
              name="publisher"
              value={(formData as BookReviewCreate).publisher}
              onChange={handleChange}
              placeholder="출판사를 입력하세요"
              required
            />
            <CustomInput
              label="ISBN"
              type="text"
              name="isbn"
              value={(formData as BookReviewCreate).isbn}
              onChange={handleChange}
              placeholder="ISBN을 입력하세요"
              required
            />
            <CustomInput
              label="썸네일 URL"
              type="text"
              name="thumbnail"
              value={(formData as BookReviewCreate).thumbnail}
              onChange={handleChange}
              placeholder="썸네일 이미지 URL을 입력하세요"
            />
          </>
        )}

        <CustomInput
          label="서평 제목"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="서평 제목을 입력하세요"
          required
        />
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            내용
          </label>
          <textarea
            id="content"
            name="content"
            rows={8}
            value={formData.content}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="서평 내용을 입력하세요"
            required></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">별점</label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`cursor-pointer text-3xl ${
                  (formData.rating ?? 0) >= star ? "text-yellow-400" : "text-gray-300"
                }`}
                onClick={() => handleRatingChange(star)}>
                &#9733;
              </span>
            ))}
          </div>
        </div>
        {!isEditMode && (
          <div className="flex items-center">
            <input
              id="notificationYn"
              name="notificationYn"
              type="checkbox"
              checked={(formData as BookReviewCreate).notificationYn}
              onChange={handleChange}
              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="notificationYn" className="ml-2 block text-sm text-gray-900">
              공지글로 등록 (관리자 전용)
            </label>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <CustomButton type="submit" color="blue">
            {isEditMode ? "수정하기" : "작성하기"}
          </CustomButton>
          <Link to="/book-review">
            <CustomButton type="button" color="gray">
              취소
            </CustomButton>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default BookReviewForm;
