// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useEffect, useState } from "react";
import Pagenation from "../../common/component/Pagination";
import MyPageSideBar from "../../mypage/component/MyPageSideBar";
import MyPageManageButton from "../../mypage/component/MyPageManageButton";
import { createCategory, getAdminCategories, getCategories } from "../../community/category/api/categoryApi";
import { AdminCategoryT } from "../../community/category/type/category";

const AdminCategory: React.FC = () => {
  const [categories, setCategories] = useState<AdminCategoryT[]>([]);
  const [nextId, setNextId] = useState(-1);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ field: "", direction: "asc" });
  
  useEffect(() => {
    //카테고리 조회 API 호출
    getAdminCategories().then((res) => {
      //categories State Update
      if(res.data) {
        setCategories(res.data);
      }
    });
  }, [])
  
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
      case "name":
        return direction * a.value.localeCompare(b.value);
      case "isActive":
        return direction * (Number(a.isActive) - Number(b.isActive));
      default:
        return 0;
    }
  });
  const totalPages = Math.ceil(categories?.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedCategories.slice(indexOfFirstItem, indexOfLastItem);

  const addCategory = () => {
    const newCategory: AdminCategoryT = {
      categoryId: nextId,
      value: "",
      isActive: true,
      isEditing: true,
      isExpanded: true,
      subCategories: [],
    };
    setCategories([newCategory, ...categories]);
    setNextId(nextId-1);
  };

  const addSubCategory = (categoryId: number) => {
    setCategories(
      categories.map((category) => {
        if (category.categoryId === categoryId) {
          return {
            ...category,
            isExpanded: true,
            subCategories: [
              ...category.subCategories,
              {
                categoryId: nextId,
                value: "",
                isActive: true,
                isEditing: true,
                isExpanded: true
              },
            ],
          };
        }
        return category;
      })
    );
    setNextId(nextId-1);
  };
  const toggleExpand = (categoryId: number) => {
    setCategories(
      categories.map((category) =>
        category.categoryId === categoryId ? { ...category, isExpanded: !category.isExpanded } : category
      )
    );
  };
  const handleCategoryChange = (categoryId: number, value: string) => {
    setCategories(categories.map((category) => (category.categoryId === categoryId ? { ...category, value: value } : category)));
  };
  const handleSubCategoryChange = (categoryId: number, subCategoryId: number, value: string) => {
    setCategories(
      categories.map((category) => {
        if (category.categoryId === categoryId) {
          return {
            ...category,
            subCategories: category.subCategories.map((subCategory) =>
              subCategory.categoryId === subCategoryId ? { ...subCategory, value: value } : subCategory
            ),
          };
        }
        return category;
      })
    );
  };
  const toggleMainEdit = async (categoryId: number) => {
    let newCategories = [...categories]; // 기존 상태 복사

    for (let i = 0; i < newCategories.length; i++) {
      if (newCategories[i].categoryId === categoryId) {
        let category = { ...newCategories[i] };
        if(categoryId > 0) {
          // 메인 카테고리 데이터 수정 API 호출
        } else {
          const savedMainCategoryId = (await createCategory(category.value)).data;
          category.categoryId = savedMainCategoryId;
        }
        category.isEditing = !category.isEditing;
        newCategories[i] = category;
      }
    }

    setCategories(newCategories);
  };

  const toggleSubEdit = async (categoryId: number, subCategoryId: number) => {
  let newCategories = [...categories]; // 기존 상태 복사

  for (let i = 0; i < newCategories.length; i++) {
    if (newCategories[i].categoryId === categoryId) {
      let category = { ...newCategories[i] };
      let newSubCategories = [...category.subCategories];

      for (let j = 0; j < newSubCategories.length; j++) {
        if (newSubCategories[j].categoryId === subCategoryId) {
          let subCategory = { ...newSubCategories[j] };

          if (categoryId > 0) {
            if (subCategoryId > 0) {
              // 수정 API 호출 예: await updateSubCategory(...)
              // 필요 시 상태 업데이트 추가
            } else {
              const savedSubCategoryId = (await createCategory(subCategory.value, categoryId)).data;
              subCategory.categoryId = savedSubCategoryId;
            }
          } else {
            const savedMainCategoryId = (await createCategory(category.value)).data;
            category.categoryId = savedMainCategoryId;
            category.isEditing = !category.isEditing;

            const savedSubCategoryId = (await createCategory(subCategory.value, savedMainCategoryId)).data;
            subCategory.categoryId = savedSubCategoryId;
          }

          subCategory.isEditing = !subCategory.isEditing;
          newSubCategories[j] = subCategory;
        }
      }

      category.subCategories = newSubCategories;
      newCategories[i] = category;
    }
  }

  setCategories(newCategories);
};
  const deleteCategory = (categoryId: number) => {
    // 카테고리 삭제 API 호출
    setCategories(categories.filter((category) => category.categoryId !== categoryId));
  };
  const deleteSubCategory = (categoryId: number, subCategoryId: number) => {
    // 카테고리 삭제 API 호출
    setCategories(
      categories.map((category) => {
        if (category.categoryId === categoryId) {
          return {
            ...category,
            subCategories: category.subCategories.filter((sub) => sub.categoryId !== subCategoryId),
          };
        }
        return category;
      })
    );
  };
  const toggleActive = (categoryId: number, isMain: boolean, subCategoryId?: number) => {
    setCategories(
      categories.map((category) => {
        if (category.categoryId === categoryId) {
          if (isMain) {
            return { ...category, isActive: !category.isActive };
          } else {
            return {
              ...category,
              subCategories: category.subCategories.map((subCategory) =>
                subCategory.categoryId === subCategoryId ? { ...subCategory, isActive: !subCategory.isActive } : subCategory
              ),
            };
          }
        }
        return category;
      })
    );
  };
  return (
    <div className="flex min-h-screen bg-gray-50">
      <MyPageSideBar />
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold text-gray-800">관리자 &gt; 카테고리 관리</h1>
            <MyPageManageButton
              actions={[
                {
                  label: "추가",
                  color: "blue",
                  onClick: () => addCategory(),
                },
              ]}
            />
          </div>
          <div className="grid grid-cols-5 gap-4 bg-gray-100 p-3 rounded font-semibold text-sm">
            <div className="flex items-center">
              <span className="font-medium">분류코드</span>
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
            <div key={category.categoryId} className="mb-4">
              <div className="grid grid-cols-5 gap-4 items-center bg-white p-4 border-b rounded">
                {/* [1] 분류코드 + 확장 버튼 */}
                <div className="flex items-center space-x-2">
                  <button onClick={() => toggleExpand(category.categoryId)} className="text-gray-500">
                    <i className={`fas fa-chevron-${category.isExpanded ? "down" : "right"}`} />
                  </button>
                  {category.categoryId > 0 && <span>{category.categoryId}</span>}
                </div>
                {category.isEditing ? (
                  <input
                    type="text"
                    value={category.value}
                    onChange={(e) => handleCategoryChange(category.categoryId, e.target.value)}
                    className="flex-1 px-3 py-2 border rounded text-sm"
                    placeholder="대분류명 입력"
                    autoFocus
                  />
                ) : (
                  <span className="flex-1">{category.value}</span>
                )}

                {/* 3열: 소분류 자리 비우기 */}
                <div></div>
                <select
                  value={category.isActive ? "active" : "inactive"}
                  onChange={() => toggleActive(category.categoryId, true)}
                  className="px-3 py-2 border rounded text-sm">
                  <option value="active">활성</option>
                  <option value="inactive">비활성</option>
                </select>
                <MyPageManageButton
                  actions={[
                    {
                      label: "추가",
                      color: "green",
                      onClick: () => addSubCategory(category.categoryId),
                    },
                    {
                      label: category.isEditing ? "저장" : "수정",
                      color: category.isEditing ? "blue" : "yellow",
                      onClick: () => toggleMainEdit(category.categoryId),
                    },
                    {
                      label: "삭제",
                      color: "red",
                      onClick: () => deleteCategory(category.categoryId),
                    },
                  ]}
                />
              </div>
              {category.isExpanded && (
                <div className="ml-8 mt-2 space-y-2">
                  {category.subCategories.map((subCategory) => (
                    <div
                      key={subCategory.categoryId}
                      className="grid grid-cols-5 gap-4 items-center bg-gray-50 p-4 rounded ml-6">
                      {/* 1열: 코드 자리 비우기 */}
                      <div></div>
                      {/* 2열: 대분류 자리 비우기 */}
                      <div></div>
                      {subCategory.isEditing ? (
                        <input
                          type="text"
                          value={subCategory.value}
                          onChange={(e) => handleSubCategoryChange(category.categoryId, subCategory.categoryId, e.target.value)}
                          className="flex-1 px-3 py-2 border rounded text-sm"
                          placeholder="소분류명 입력"
                          autoFocus
                        />
                      ) : (
                        <span className="flex-1">{subCategory.value}</span>
                      )}
                      <select
                        value={subCategory.isActive ? "active" : "inactive"}
                        onChange={() => toggleActive(category.categoryId, false, subCategory.categoryId)}
                        className="px-3 py-2 border rounded text-sm">
                        <option value="active">활성</option>
                        <option value="inactive">비활성</option>
                      </select>
                      <MyPageManageButton
                        actions={[
                          {
                            label: subCategory.isEditing ? "저장" : "수정",
                            color: subCategory.isEditing ? "blue" : "yellow",
                            onClick: () => toggleSubEdit(category.categoryId, subCategory.categoryId),
                          },
                          {
                            label: "삭제",
                            color: "red",
                            onClick: () => deleteSubCategory(category.categoryId, subCategory.categoryId),
                          },
                        ]}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <Pagenation totalPages={12} loadPageByPageNum={(num) => {}} />
      </div>
    </div>
  );
};
export default AdminCategory;
