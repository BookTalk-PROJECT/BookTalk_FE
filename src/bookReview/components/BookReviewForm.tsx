import React, { useState } from "react";
import { BookReviewCreate, BookReviewDetail } from "../types/bookReview";
import CustomButton from "../../common/component/CustomButton";
import CustomInput from "../../common/component/CustomInput";
import { useNavigate } from "react-router-dom";
import BookSearchModal, { SearchResult } from "./BookSearchModal";

interface BookReviewFormProps {
  initialData?: BookReviewDetail; // For edit mode
  categoryId?: string;
  onSubmit: (data: BookReviewCreate) => void;
}

const BookReviewForm: React.FC<BookReviewFormProps> = ({ initialData, categoryId, onSubmit }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<BookReviewCreate>(
    initialData
      ? {
          categoryId: initialData.categoryId,
          book_title: initialData.book_title,
          authors: initialData.authors,
          publisher: initialData.publisher,
          isbn: initialData.isbn,
          thumbnail_url: initialData.thumbnail_url,
          title: initialData.title,
          content: initialData.content,
          rating: initialData.rating,
        }
      : {
          categoryId: categoryId ?? "",
          book_title: "",
          authors: "",
          publisher: "",
          isbn: "",
          thumbnail_url: "",
          title: "",
          content: "",
          rating: 0,
        }
  );

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const handleBookSelect = (book: SearchResult) => {
    setFormData((prev) => ({
      ...prev,
      book_title: book.title,
      authors: book._author,
      publisher: book._publisher,
      isbn: book.isbn,
      thumbnail_url: book.cover,
    }));
    setIsSearchModalOpen(false);
  };

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

  const handleValidationAndSubmit = () => {
    if (!formData.book_title || !formData.isbn) {
      alert("도서를 검색하여 선택해주세요.");
      return;
    }
    if (!formData.title.trim()) {
      alert("리뷰 제목을 입력해주세요.");
      return;
    }
    if (!formData.content.trim()) {
      alert("리뷰 내용을 입력해주세요.");
      return;
    }
    if (formData.rating === 0) {
      alert("별점을 선택해주세요.");
      return;
    }
    onSubmit(formData);
  };

  const isEditMode = !!initialData;

  return (
    <>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto my-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{isEditMode ? "리뷰 수정" : "리뷰 작성"}</h2>
        <div className="space-y-6">
          <>
            <div className="flex items-end gap-2">
              <div className="flex-grow">
                <CustomInput
                  label="도서명"
                  type="text"
                  name="bookTitle"
                  value={formData.book_title}
                  onChange={handleChange}
                  placeholder="도서 검색 버튼을 눌러 도서를 선택하세요"
                  readOnly
                />
              </div>
              <CustomButton type="button" onClick={() => setIsSearchModalOpen(true)} color="gray">
                도서 검색
              </CustomButton>
            </div>

            <CustomInput
              label="저자"
              type="text"
              name="authors"
              value={formData.authors}
              onChange={handleChange}
              placeholder="도서 검색시 자동으로 입력됩니다"
              readOnly
            />
            <CustomInput
              label="출판사"
              type="text"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
              placeholder="도서 검색시 자동으로 입력됩니다"
            />
            <CustomInput
              label="ISBN"
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              placeholder="도서 검색시 자동으로 입력됩니다"
              readOnly
            />
            <CustomInput
              label="썸네일 URL"
              type="text"
              name="thumbnail_url"
              value={formData.thumbnail_url}
              onChange={handleChange}
              placeholder="도서 검색시 자동으로 입력됩니다"
              readOnly
            />
            {formData.thumbnail_url && (
              <div className="flex justify-center">
                <img src={formData.thumbnail_url} alt="표지" className="w-32 h-44 object-cover rounded shadow-sm" />
              </div>
            )}
          </>

          <CustomInput
            label="제목"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="제목을 입력하세요"
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
              placeholder="내용을 입력하세요"></textarea>
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

          <div className="flex justify-end space-x-3">
            <CustomButton type="button" onClick={handleValidationAndSubmit} color="blue">
              {isEditMode ? "수정하기" : "작성하기"}
            </CustomButton>
            <CustomButton color="none" onClick={() => navigate(-1)}>
              취소
            </CustomButton>
          </div>
        </div>
      </div>

      <BookSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onBookSelect={handleBookSelect}
      />
    </>
  );
};

export default BookReviewForm;
