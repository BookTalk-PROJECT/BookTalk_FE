import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBookReview, updateBookReview } from "../api/bookReviewApi";
import EditBoard from "../../common/component/Board/page/EditBoard";
import { CommuPostRequest } from "../../common/component/Board/type/BoardDetailTypes";
import LoadingBar from "../../common/component/Loading";

const BookReviewEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<CommuPostRequest | null>(null);

  useEffect(() => {
    if (id) {
      getBookReview(id)
        .then((response) => {
          const { title, content } = response.data;
          setInitialData({ title, content });
        })
        .catch((error) => {
          console.error("Failed to fetch book review for editing:", error);
          navigate("/book-review");
        });
    }
  }, [id, navigate]);

  const handleEditReview = async (postData: CommuPostRequest, postCode: string) => {
    try {
      const reviewId = postCode;
      await updateBookReview(reviewId, postData);
      navigate(`/book-review/${reviewId}`); // Navigate to the detail page after editing
    } catch (error) {
      console.error("Failed to update book review:", error);
    }
  };

  if (!id) {
    navigate("/book-review");
    return null;
  }

  // Render loading bar until initial data is fetched
  if (!initialData) {
    return <LoadingBar />;
  }

  // EditBoard's initialValue is not updating correctly on its own, so we control its render.
  // By only rendering EditBoard once initialData is set, we ensure it gets the correct data.
  return (
    <EditBoard
      postCode={id}
      editPost={handleEditReview}
      redirectUri={`/book-review/${id}`}
      mainTopic="책리뷰"
      subTopic="리뷰 수정"
    />
  );
};

export default BookReviewEdit;
