import { useState } from "react";
import { Post } from "../../../type/BoardTable";
import { PostInfo } from "../type/BoardDetail.types";

interface BoadTableProps {
  posts: PostInfo[];
  requestUrl: string;
}

const BoardTable: React.FC<BoadTableProps> = ({ posts, requestUrl }) => {
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const filteredPosts = posts.sort((a, b) => {
    if (sortField === "date") {
      return sortDirection === "asc"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortField === "views") {
      return sortDirection === "asc" ? a.views - b.views : b.views - a.views;
    } else if (sortField === "title") {
      return sortDirection === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
    }
    return 0;
  });

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
            번호
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
            onClick={() => {
              setSortField("title");
              setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
            }}>
            <div className="flex items-center">
              제목
              <span className="ml-1">
                <i
                  className={`fas fa-sort${sortField === "title" ? (sortDirection === "asc" ? "-up" : "-down") : ""} 
                        ${sortField === "title" ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`}></i>
              </span>
            </div>
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
            작성자
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28 cursor-pointer group"
            onClick={() => {
              setSortField("date");
              setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
            }}>
            <div className="flex items-center">
              작성일
              <span className="ml-1">
                <i
                  className={`fas fa-sort${sortField === "date" ? (sortDirection === "asc" ? "-up" : "-down") : ""} 
    ${sortField === "date" ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`}></i>
              </span>
            </div>
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20 cursor-pointer group"
            onClick={() => {
              setSortField("views");
              setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
            }}>
            <div className="flex items-center">
              조회수
              <span className="ml-1">
                <i
                  className={`fas fa-sort${sortField === "views" ? (sortDirection === "asc" ? "-up" : "-down") : ""} 
    ${sortField === "views" ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`}></i>
              </span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {filteredPosts.map((post, index) => (
          <tr key={post.board_code} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.board_code}</td>
            <td className="px-6 py-4 text-sm">
              {/* 커뮤니티 또는 모임으로 분기 존재함 requestPosition에 url 받아옴 */}
              <a href={`/${requestUrl}/${post.board_code}`} className="text-gray-900 hover:text-blue-600">
                {post.title}
              </a>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.author}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.date}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.views}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BoardTable;
