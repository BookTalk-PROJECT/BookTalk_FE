/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/static-components */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { getBookReview, deleteBookReview } from "../api/bookReviewApi";
import { BookReviewDetail as BookReviewDetailType } from "../types/bookReview";
import Loading from "../../common/component/Loading";
import CustomButton from "../../common/component/CustomButton";
import ReplyList from "../../community/reply/page/ReplyList";
import { useAuthStore } from "../../store";

const BookReviewDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userInfo } = useAuthStore();
  const [searchParams] = useSearchParams();
  const [review, setReview] = useState<BookReviewDetailType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState<string>("");

  const categoryId = searchParams.get("categoryId");
  const page = searchParams.get("page");
  const listUrl = `/book-review${categoryId
    ? `?categoryId=${categoryId}${page ? `&page=${page}` : ''}`
    : ''}`;

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      getBookReview(id)
        .then((response) => {
          setReview(response.data);
        })
        .catch((error) => {
          console.error("Failed to fetch book review:", error);
          if (axios.isAxiosError(error) && error.response?.status === 400) {
            setIsDeleted(true);
            setDeleteMessage(error.response.data?.msg || "");
          } else {
            navigate("/book-review");
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id, navigate]);

  const handleEdit = () => {
    navigate(`/book-review/edit/${id}`);
  };

  const handleDelete = async () => {
    if (id && window.confirm(`'${review?.title}' 리뷰를 삭제하시겠습니까?`)) {
      try {
        await deleteBookReview(id);
        navigate("/book-review");
      } catch (error) {
        console.error("Failed to delete book review:", error);
      }
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isDeleted) {
    return (
      <div className="bg-gray-50 min-h-screen py-10">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <i className="fas fa-ban text-5xl mb-4 text-gray-400"></i>
            <p className="text-xl font-semibold mb-2">삭제된 게시글입니다.</p>
            {deleteMessage && (
              <p className="text-sm text-gray-400 mb-6">{deleteMessage}</p>
            )}
            <CustomButton color="none" onClick={() => navigate(listUrl)}>
              목록으로
            </CustomButton>
          </div>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="text-center py-10">
        <p>리뷰를 찾을 수 없습니다.</p>
        <CustomButton color="primary" onClick={() => navigate("/book-review")}>
          목록으로
        </CustomButton>
      </div>
    );
  }

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={`text-2xl ${rating >= star ? "text-yellow-400" : "text-gray-300"}`}>
          &#9733;
        </span>
      ))}
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          {/* Header */}
          <div className="mb-6 border-b pb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{review.title}</h1>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <div>
                <span>작성자: {review.author}</span>
                <span className="mx-2">|</span>
                <span>작성일: {new Date(review.reg_date).toLocaleDateString()}</span>
                {review.update_date &&
                  new Date(review.update_date).getTime() !== new Date(review.reg_date).getTime() && (
                    <>
                      <span className="mx-2">|</span>
                      <span>수정일: {new Date(review.update_date).toLocaleDateString()}</span>
                    </>
                  )}
              </div>
              <div>
                <span>조회수: {review.views}</span>
                <span className="mx-2">|</span>
                <span>좋아요: {review.likes_cnt}</span>
              </div>
            </div>
          </div>

          {/* Book Info */}
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="md:w-1/3 flex-shrink-0">
              <img
                src={review.thumbnail_url}
                alt={review.book_title}
                className="w-full h-auto object-cover rounded-lg shadow-md"
              />
            </div>
            <div className="md:w-2/3">
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">{review.book_title}</h2>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>저자:</strong> {review.authors}
                </p>
                <p>
                  <strong>출판사:</strong> {review.publisher}
                </p>
                {/* <p>
                  <strong>출간일:</strong> {review.publication_date}
                </p> */}
                <p>
                  <strong>ISBN:</strong> {review.isbn}
                </p>
              </div>
              <div className="mt-4">
                <StarRating rating={review.rating} />
              </div>
            </div>
          </div>

          {/* Review Content */}
          <div className="prose max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap">
            <p>{review.content}</p>
          </div>
        </div>

        {/* 댓글 섹션 */}
        <div className="px-8 py-6">
          <ReplyList postCode={review.code} />
        </div>

        {/* Action Buttons */}
        <div className="px-8 py-4 bg-gray-50 border-t flex justify-between">
          <CustomButton color="none" onClick={() => navigate(listUrl)}>
            목록으로
          </CustomButton>
          {userInfo?.id != null && review.member_id === userInfo.id && (
            <div className="flex space-x-2">
              <CustomButton color="white" onClick={handleEdit}>
                수정
              </CustomButton>
              <CustomButton color="red" onClick={handleDelete}>
                삭제
              </CustomButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookReviewDetail;
