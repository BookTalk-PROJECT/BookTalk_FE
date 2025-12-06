import React from "react";
import { useNavigate } from "react-router-dom";
import { createBookReview } from "../api/bookReviewApi";
import BookReviewForm from "../components/BookReviewForm";
import { BookReviewCreate as BookReviewCreateType } from "../types/bookReview";

const BookReviewCreate: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateReview = async (formData: BookReviewCreateType) => {
    try {
      await createBookReview(formData);
      navigate("/book-review"); // Navigate to the list page after creation
    } catch (error) {
      console.error("Failed to create book review:", error);
      // Optionally, show an error message to the user
    }
  };

  return <BookReviewForm onSubmit={handleCreateReview} />;
};

export default BookReviewCreate;
