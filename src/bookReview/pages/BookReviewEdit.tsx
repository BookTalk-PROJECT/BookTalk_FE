import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBookReview, updateBookReview } from "../api/bookReviewApi";
import { BookReviewDetail, BookReviewCreate } from "../types/bookReview";
import BookReviewForm from "../components/BookReviewForm";
import LoadingBar from "../../common/component/Loading";

const BookReviewEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<BookReviewDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      getBookReview(id)
        .then((response) => {
          setInitialData(response.data);
        })
        .catch((error) => {
          console.error("Failed to fetch book review for editing:", error);
          navigate("/book-review");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      navigate("/book-review");
    }
  }, [id, navigate]);

  const handleUpdateReview = async (formData: BookReviewCreate) => {
    if (!id) return;
    try {
      await updateBookReview(id, formData);
      navigate(`/book-review/${id}`); // Navigate to the detail page after editing
    } catch (error) {
      console.error("Failed to update book review:", error);
    }
  };

  if (isLoading) {
    return <LoadingBar />;
  }

  if (!initialData) {
    return <div>리뷰를 불러오지 못했습니다.</div>;
  }

  return <BookReviewForm initialData={initialData} onSubmit={handleUpdateReview} />;
};

export default BookReviewEdit;
