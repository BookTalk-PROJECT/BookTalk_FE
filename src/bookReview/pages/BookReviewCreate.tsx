import React from "react";
import { useNavigate } from "react-router-dom";
import { createBookReview } from "../api/bookReviewApi";
import BookReviewForm from "../components/BookReviewForm";
import { BookReviewCreate as BookReviewCreateType } from "../types/bookReview";
import { useParams } from "react-router";

const BookReviewCreate: React.FC = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams<string>();

  const handleCreateReview = async (formData: BookReviewCreateType) => {
    try {
      await createBookReview(formData);
      navigate("/book-review"); // Navigate to the list page after creation
    } catch (error) {
      console.error("Failed to create book review:", error);
      // Optionally, show an error message to the user
    }
  };

  return <BookReviewForm categoryId={categoryId} onSubmit={handleCreateReview} />;
};

export default BookReviewCreate;
