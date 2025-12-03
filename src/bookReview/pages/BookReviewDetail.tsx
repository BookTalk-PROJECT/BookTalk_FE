import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBookReview, deleteBookReview } from "../api/bookReviewApi";
import { PostDetail, CommuDetail } from "../../common/component/Board/type/BoardDetailTypes";
import DetailBoard from "../../common/component/Board/page/DetailBoard";
import { ApiResponse } from "../../common/type/ApiResponse";
import { BookReviewDetail as BookReviewDetailType } from "../types/bookReview";
import LoadingBar from "../../common/component/Loading";

const BookReviewDetail: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  if (!code) {
    navigate("/book-review");
    return null;
  }

  const getReviewDetail = async (bookReviewCode: string): Promise<ApiResponse<PostDetail>> => {
    setIsLoading(true);
    try {
      const response = await getBookReview(bookReviewCode);
      const review = response.data;

      const commuDetail: CommuDetail = {
        board_code: review.code,
        member_id: review.memberId,
        title: review.reviewTitle, // Use reviewTitle for main title
        content: review.content,
        author: review.author,
        views: review.views,
        likes_cnt: review.likesCnt,
        reg_date: review.regDate,
        update_date: review.updateDate,
        imageUrl: review.thumbnailUrl, // Use thumbnailUrl as imageUrl
        is_liked: review.isLiked,
        notification_yn: review.notificationYn,
        del_reason: review.delReason,
        category_id: "book-review", // Static category for book reviews
      };

      const postDetail: PostDetail = {
        post: commuDetail,
        replies: [], // Replies are not yet implemented for book reviews
      };

      return {
        msg: "성공",
        code: 200,
        data: postDetail,
      };
    } catch (error) {
      console.error("Error fetching book review detail:", error);
      throw error; // Re-throw to be caught by DetailBoard's error handling
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReview = async (bookReviewCode: string) => {
    try {
      await deleteBookReview(bookReviewCode);
      navigate("/book-review");
    } catch (error) {
      console.error("Failed to delete book review:", error);
    }
  };

  if (isLoading && !code) {
    return <LoadingBar />;
  }

  return (
    <DetailBoard
      mainTopic="책리뷰"
      subTopic="리뷰 조회"
      postCode={code}
      editPageUri={`/book-review/edit/${code}`}
      listPageUri="/book-review"
      GetBoardDetail={getReviewDetail}
      DeleteBoard={handleDeleteReview}
      // ToggleLikePost, NavigateToNextPost, NavigateToPrevPost are not implemented for book reviews yet
    />
  );
};

export default BookReviewDetail;
