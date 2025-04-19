// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState } from "react";
interface Category {
  id: number;
  name: string;
  isActive: boolean;
  isEditing: boolean;
  isExpanded: boolean;
  subCategories: SubCategory[];
}
interface SubCategory {
  id: number;
  name: string;
  isActive: boolean;
  isEditing: boolean;
}
const AdminCategory: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([
    ...[...Array(100)].map((_, index) => ({
      id: index + 1,
      code: `CODE${String(index + 1).padStart(3, "0")}`,
      name: ["전자기기", "의류", "식품", "가구", "도서", "스포츠용품", "화장품", "장난감", "주방용품", "자동차용품"][
        index % 10
      ],
      isActive: Math.random() > 0.3,
      isEditing: false,
      isExpanded: false,
      subCategories: [
        {
          id: index * 2 + 1000,
          code: `SUB${String(index * 2 + 1).padStart(3, "0")}`,
          name: [
            "스마트폰",
            "노트북",
            "남성복",
            "여성복",
            "과일",
            "채소",
            "마스카라",
            "립스틱",
            "프라이팬",
            "후라이팬",
          ][index % 10],
          isActive: Math.random() > 0.3,
          isEditing: false,
        },
        {
          id: index * 2 + 1001,
          code: `SUB${String(index * 2 + 2).padStart(3, "0")}`,
          name: ["태블릿", "TV", "아동복", "신발", "육류", "생선", "아이라이너", "파운데이션", "냄비", "주전자"][
            index % 10
          ],
          isActive: Math.random() > 0.3,
          isEditing: false,
        },
      ],
    })),
  ]);
  const [nextId, setNextId] = useState(1200);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: "", direction: "asc" });
  const handleSort = (field: string) => {
    setSortConfig((prev) => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };
  const sortedCategories = [...categories].sort((a, b) => {
    if (!sortConfig.field) return 0;
    const direction = sortConfig.direction === "asc" ? 1 : -1;
    switch (sortConfig.field) {
      case "code":
        return direction * a.code.localeCompare(b.code);
      case "name":
        return direction * a.name.localeCompare(b.name);
      case "isActive":
        return direction * (Number(a.isActive) - Number(b.isActive));
      default:
        return 0;
    }
  });
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedCategories.slice(indexOfFirstItem, indexOfLastItem);
  const addCategory = () => {
    const newCategory: Category = {
      id: nextId,
      code: `CAT${String(nextId).padStart(3, "0")}`,
      name: "",
      isActive: true,
      isEditing: true,
      isExpanded: true,
      subCategories: [
        {
          id: nextId + 1,
          code: `SUB${String(nextId + 1).padStart(3, "0")}`,
          name: "",
          isActive: true,
          isEditing: true,
        },
      ],
    };
    setCategories([...categories, newCategory]);
    setNextId(nextId + 2);
  };
  const addSubCategory = (categoryId: number) => {
    setCategories(
      categories.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            subCategories: [
              ...category.subCategories,
              {
                id: nextId,
                code: `SUB${String(nextId).padStart(3, "0")}`,
                name: "",
                isActive: true,
                isEditing: true,
              },
            ],
          };
        }
        return category;
      })
    );
    setNextId(nextId + 1);
  };
  const toggleExpand = (categoryId: number) => {
    setCategories(
      categories.map((category) =>
        category.id === categoryId ? { ...category, isExpanded: !category.isExpanded } : category
      )
    );
  };
  const handleCategoryChange = (categoryId: number, value: string) => {
    setCategories(categories.map((category) => (category.id === categoryId ? { ...category, name: value } : category)));
  };
  const handleSubCategoryChange = (categoryId: number, subCategoryId: number, value: string) => {
    setCategories(
      categories.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            subCategories: category.subCategories.map((subCategory) =>
              subCategory.id === subCategoryId ? { ...subCategory, name: value } : subCategory
            ),
          };
        }
        return category;
      })
    );
  };
  const toggleEdit = (categoryId: number, isMain: boolean, subCategoryId?: number) => {
    setCategories(
      categories.map((category) => {
        if (category.id === categoryId) {
          if (isMain) {
            return { ...category, isEditing: !category.isEditing };
          } else {
            return {
              ...category,
              subCategories: category.subCategories.map((subCategory) =>
                subCategory.id === subCategoryId ? { ...subCategory, isEditing: !subCategory.isEditing } : subCategory
              ),
            };
          }
        }
        return category;
      })
    );
  };
  const deleteCategory = (categoryId: number) => {
    setCategories(categories.filter((category) => category.id !== categoryId));
  };
  const deleteSubCategory = (categoryId: number, subCategoryId: number) => {
    setCategories(
      categories.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            subCategories: category.subCategories.filter((sub) => sub.id !== subCategoryId),
          };
        }
        return category;
      })
    );
  };
  const toggleActive = (categoryId: number, isMain: boolean, subCategoryId?: number) => {
    setCategories(
      categories.map((category) => {
        if (category.id === categoryId) {
          if (isMain) {
            return { ...category, isActive: !category.isActive };
          } else {
            return {
              ...category,
              subCategories: category.subCategories.map((subCategory) =>
                subCategory.id === subCategoryId ? { ...subCategory, isActive: !subCategory.isActive } : subCategory
              ),
            };
          }
        }
        return category;
      })
    );
  };
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold text-gray-800">관리자 &gt; 카테고리 관리</h1>
            <button
              onClick={addCategory}
              className="!rounded-button whitespace-nowrap bg-blue-500 text-white px-4 py-2 text-sm hover:bg-blue-600 cursor-pointer">
              추가
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4 bg-gray-100 p-3 rounded">
            <div className="flex items-center">
              <span className="font-medium">분류코드</span>
              <button onClick={() => handleSort("code")} className="ml-2">
                <i
                  className={`fas fa-sort${sortConfig.field === "code" ? (sortConfig.direction === "asc" ? "-up" : "-down") : ""}`}></i>
              </button>
            </div>
            <div className="flex items-center">
              <span className="font-medium">대분류</span>
              <button onClick={() => handleSort("name")} className="ml-2">
                <i
                  className={`fas fa-sort${sortConfig.field === "name" ? (sortConfig.direction === "asc" ? "-up" : "-down") : ""}`}></i>
              </button>
            </div>
            <div className="flex items-center">
              <span className="font-medium">소분류</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium">활성상태</span>
              <button onClick={() => handleSort("isActive")} className="ml-2">
                <i
                  className={`fas fa-sort${sortConfig.field === "isActive" ? (sortConfig.direction === "asc" ? "-up" : "-down") : ""}`}></i>
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">
          {currentItems.map((category) => (
            <div key={category.id} className="mb-4">
              <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded">
                <button onClick={() => toggleExpand(category.id)} className="text-gray-500">
                  <i className={`fas fa-chevron-${category.isExpanded ? "down" : "right"}`}></i>
                </button>
                {category.isEditing ? (
                  <input
                    type="text"
                    value={category.name}
                    onChange={(e) => handleCategoryChange(category.id, e.target.value)}
                    className="flex-1 px-3 py-2 border rounded text-sm"
                    placeholder="대분류명 입력"
                    autoFocus
                  />
                ) : (
                  <span className="flex-1">{category.name}</span>
                )}
                <select
                  value={category.isActive ? "active" : "inactive"}
                  onChange={() => toggleActive(category.id, true)}
                  className="px-3 py-2 border rounded text-sm">
                  <option value="active">활성</option>
                  <option value="inactive">비활성</option>
                </select>
                <div className="flex space-x-2">
                  <button
                    onClick={() => addSubCategory(category.id)}
                    className="!rounded-button whitespace-nowrap bg-green-500 text-white px-3 py-1 text-sm hover:bg-green-600 cursor-pointer">
                    추가
                  </button>
                  {category.isEditing ? (
                    <button
                      onClick={() => toggleEdit(category.id, true)}
                      className="!rounded-button whitespace-nowrap bg-blue-500 text-white px-3 py-1 text-sm hover:bg-blue-600 cursor-pointer">
                      저장
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleEdit(category.id, true)}
                      className="!rounded-button whitespace-nowrap bg-yellow-500 text-white px-3 py-1 text-sm hover:bg-yellow-600 cursor-pointer">
                      수정
                    </button>
                  )}
                  <button
                    onClick={() => deleteCategory(category.id)}
                    className="!rounded-button whitespace-nowrap bg-red-500 text-white px-3 py-1 text-sm hover:bg-red-600 cursor-pointer">
                    삭제
                  </button>
                </div>
              </div>
              {category.isExpanded && (
                <div className="ml-8 mt-2 space-y-2">
                  {category.subCategories.map((subCategory) => (
                    <div key={subCategory.id} className="flex items-center space-x-4 bg-gray-50 p-4 rounded">
                      {subCategory.isEditing ? (
                        <input
                          type="text"
                          value={subCategory.name}
                          onChange={(e) => handleSubCategoryChange(category.id, subCategory.id, e.target.value)}
                          className="flex-1 px-3 py-2 border rounded text-sm"
                          placeholder="소분류명 입력"
                          autoFocus
                        />
                      ) : (
                        <span className="flex-1">{subCategory.name}</span>
                      )}
                      <select
                        value={subCategory.isActive ? "active" : "inactive"}
                        onChange={() => toggleActive(category.id, false, subCategory.id)}
                        className="px-3 py-2 border rounded text-sm">
                        <option value="active">활성</option>
                        <option value="inactive">비활성</option>
                      </select>
                      <div className="flex space-x-2">
                        {subCategory.isEditing ? (
                          <button
                            onClick={() => toggleEdit(category.id, false, subCategory.id)}
                            className="!rounded-button whitespace-nowrap bg-blue-500 text-white px-3 py-1 text-sm hover:bg-blue-600 cursor-pointer">
                            저장
                          </button>
                        ) : (
                          <button
                            onClick={() => toggleEdit(category.id, false, subCategory.id)}
                            className="!rounded-button whitespace-nowrap bg-yellow-500 text-white px-3 py-1 text-sm hover:bg-yellow-600 cursor-pointer">
                            수정
                          </button>
                        )}
                        <button
                          onClick={() => deleteSubCategory(category.id, subCategory.id)}
                          className="!rounded-button whitespace-nowrap bg-red-500 text-white px-3 py-1 text-sm hover:bg-red-600 cursor-pointer">
                          삭제
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Pagination */}
        <div className="flex justify-center items-center space-x-2 p-4 border-t">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="!rounded-button whitespace-nowrap px-3 py-1 bg-gray-200 text-gray-700 disabled:opacity-50">
            <i className="fas fa-chevron-left"></i>
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`!rounded-button whitespace-nowrap px-3 py-1 ${
                currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
              }`}>
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="!rounded-button whitespace-nowrap px-3 py-1 bg-gray-200 text-gray-700 disabled:opacity-50">
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};
export default App;
