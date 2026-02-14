import React, { useEffect, useState, useMemo, useCallback } from "react";
import MyPageSideBar from "../../mypage/component/MyPageSideBar";
import MyPageManageButton from "../../mypage/component/MyPageManageButton";
import {
  createCategory,
  deleteCategory,
  editCategory,
  getAdminCategories,
  reorderCategories,
} from "../../community/category/api/categoryApi";
import { AdminCategoryT, AdminSubCategoryT } from "../../community/category/type/category";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

interface DeleteTarget {
  type: "main" | "sub";
  categoryId: number;
  subCategoryId?: number;
}

// === Sortable row wrapper ===
function SortableRow({
  id,
  disabled,
  children,
}: {
  id: string;
  disabled?: boolean;
  children: (props: {
    attributes: DraggableAttributes;
    listeners: SyntheticListenerMap | undefined;
    setNodeRef: (node: HTMLElement | null) => void;
    style: React.CSSProperties;
  }) => React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
    disabled,
  });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return <>{children({ attributes, listeners, setNodeRef, style })}</>;
}

const AdminCategory: React.FC = () => {
  const [categories, setCategories] = useState<AdminCategoryT[]>([]);
  const [nextId, setNextId] = useState(-1);
  const [sortConfig, setSortConfig] = useState({ field: "", direction: "asc" });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [isDragMode, setIsDragMode] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const res = await getAdminCategories();
      if (res.data) {
        setCategories(res.data);
      }
    } catch {
      alert("카테고리 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSort = (field: string) => {
    if (isDragMode) return;
    setSortConfig((prev) => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // B4: useMemo 적용 + displayOrder 기본 정렬
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => {
      if (isDragMode || !sortConfig.field) {
        return (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
      }
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
  }, [categories, sortConfig, isDragMode]);

  // B5: displayOrder 초기화 — 맨 뒤에 추가
  const addCategory = () => {
    const maxOrder = categories.length > 0
      ? Math.max(...categories.map((c) => c.displayOrder ?? 0))
      : 0;
    const newCategory: AdminCategoryT = {
      categoryId: nextId,
      value: "",
      isActive: true,
      isEditing: true,
      isExpanded: true,
      displayOrder: maxOrder + 1,
      subCategories: [],
    };
    setCategories([...categories, newCategory]);
    setNextId(nextId - 1);
  };

  // B5: 소분류 displayOrder 초기화 — 맨 뒤에 추가
  const addSubCategory = (categoryId: number) => {
    setCategories(
      categories.map((category) => {
        if (category.categoryId === categoryId) {
          const maxOrder = category.subCategories.length > 0
            ? Math.max(...category.subCategories.map((s) => s.displayOrder ?? 0))
            : 0;
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
                isExpanded: true,
                displayOrder: maxOrder + 1,
              },
            ],
          };
        }
        return category;
      })
    );
    setNextId(nextId - 1);
  };

  const toggleExpand = (categoryId: number) => {
    setCategories(
      categories.map((category) =>
        category.categoryId === categoryId ? { ...category, isExpanded: !category.isExpanded } : category
      )
    );
  };

  const handleCategoryChange = (categoryId: number, value: string) => {
    setCategories(
      categories.map((category) => (category.categoryId === categoryId ? { ...category, value } : category))
    );
  };

  const handleSubCategoryChange = (categoryId: number, subCategoryId: number, value: string) => {
    setCategories(
      categories.map((category) => {
        if (category.categoryId === categoryId) {
          return {
            ...category,
            subCategories: category.subCategories.map((sub) =>
              sub.categoryId === subCategoryId ? { ...sub, value } : sub
            ),
          };
        }
        return category;
      })
    );
  };

  // F3: 부모 저장 시 미저장 자식 일괄 저장
  const toggleMainEdit = async (categoryId: number) => {
    const target = categories.find((c) => c.categoryId === categoryId);
    if (!target) return;

    if (target.isEditing) {
      if (target.value.trim() === "") {
        alert("카테고리명을 입력하세요.");
        return;
      }
    }

    setIsSaving(true);
    try {
      let newCategoryId = categoryId;

      if (target.isEditing) {
        if (categoryId > 0) {
          await editCategory(target.categoryId, target.value, target.isActive);
        } else {
          const res = await createCategory(target.value, target.isActive, undefined, target.displayOrder);
          newCategoryId = res.data;
        }

        // F3: 부모가 새로 저장된 경우, 미저장 자식 일괄 저장
        if (categoryId <= 0) {
          const unsavedSubs = target.subCategories.filter(
            (s) => s.categoryId <= 0 && s.value.trim() !== ""
          );
          const savedSubs: { oldId: number; newId: number }[] = [];
          for (const sub of unsavedSubs) {
            const subRes = await createCategory(sub.value, sub.isActive, newCategoryId, sub.displayOrder);
            savedSubs.push({ oldId: sub.categoryId, newId: subRes.data });
          }

          setCategories((prev) =>
            prev.map((c) =>
              c.categoryId === categoryId
                ? {
                    ...c,
                    categoryId: newCategoryId,
                    isEditing: false,
                    subCategories: c.subCategories.map((s) => {
                      const saved = savedSubs.find((ss) => ss.oldId === s.categoryId);
                      if (saved) {
                        return { ...s, categoryId: saved.newId, isEditing: false };
                      }
                      return s;
                    }),
                  }
                : c
            )
          );
        } else {
          setCategories((prev) =>
            prev.map((c) =>
              c.categoryId === categoryId
                ? { ...c, categoryId: newCategoryId, isEditing: false }
                : c
            )
          );
        }
      } else {
        // 수정 모드 진입
        setCategories((prev) =>
          prev.map((c) =>
            c.categoryId === categoryId
              ? { ...c, isEditing: true }
              : c
          )
        );
      }
    } catch {
      alert("카테고리 저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  // B1: 부모-자식 ID 참조 불일치 수정 + F3-2: 부모 빈 값 검증
  const toggleSubEdit = async (categoryId: number, subCategoryId: number) => {
    const parentCategory = categories.find((c) => c.categoryId === categoryId);
    if (!parentCategory) return;
    const targetSub = parentCategory.subCategories.find((s) => s.categoryId === subCategoryId);
    if (!targetSub) return;

    if (targetSub.isEditing) {
      if (targetSub.value.trim() === "") {
        alert("소분류명을 입력하세요.");
        return;
      }
    }

    setIsSaving(true);
    try {
      let newParentId = categoryId;
      let newSubId = subCategoryId;
      let parentEditingToggled = false;

      if (targetSub.isEditing) {
        if (categoryId > 0) {
          if (subCategoryId > 0) {
            await editCategory(targetSub.categoryId, targetSub.value, targetSub.isActive);
          } else {
            const res = await createCategory(targetSub.value, targetSub.isActive, categoryId, targetSub.displayOrder);
            newSubId = res.data;
          }
        } else {
          // F3-2: 부모 빈 값 검증
          if (parentCategory.value.trim() === "") {
            alert("부모 카테고리명을 먼저 입력하세요.");
            setIsSaving(false);
            return;
          }
          // 부모도 아직 미저장 → 부모 먼저 저장
          const parentRes = await createCategory(parentCategory.value, parentCategory.isActive, undefined, parentCategory.displayOrder);
          newParentId = parentRes.data;
          parentEditingToggled = true;

          const subRes = await createCategory(targetSub.value, targetSub.isActive, newParentId, targetSub.displayOrder);
          newSubId = subRes.data;
        }
      }

      // B1: 이전 음수 ID와 새 양수 ID 모두로 부모를 매칭
      setCategories((prev) =>
        prev.map((c) => {
          if (c.categoryId === newParentId || c.categoryId === categoryId) {
            return {
              ...c,
              categoryId: newParentId,
              isEditing: parentEditingToggled ? false : c.isEditing,
              subCategories: c.subCategories.map((s) =>
                s.categoryId === subCategoryId
                  ? { ...s, categoryId: newSubId, isEditing: !s.isEditing }
                  : s
              ),
            };
          }
          return c;
        })
      );
    } catch {
      alert("소분류 저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  // B2: 미저장 카테고리 삭제 시 서버 호출 방지
  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setIsSaving(true);
    try {
      if (deleteTarget.type === "main") {
        if (deleteTarget.categoryId > 0) {
          await deleteCategory(deleteTarget.categoryId);
        }
        setCategories((prev) => prev.filter((c) => c.categoryId !== deleteTarget.categoryId));
      } else {
        if (deleteTarget.subCategoryId! > 0) {
          await deleteCategory(deleteTarget.subCategoryId!);
        }
        setCategories((prev) =>
          prev.map((c) => {
            if (c.categoryId === deleteTarget.categoryId) {
              return {
                ...c,
                subCategories: c.subCategories.filter((s) => s.categoryId !== deleteTarget.subCategoryId),
              };
            }
            return c;
          })
        );
      }
    } catch {
      alert("카테고리 삭제에 실패했습니다.");
    } finally {
      setIsSaving(false);
      setDeleteTarget(null);
    }
  };

  const handleDeleteCategory = (categoryId: number) => {
    setDeleteTarget({ type: "main", categoryId });
  };

  const handleDeleteSubCategory = (categoryId: number, subCategoryId: number) => {
    setDeleteTarget({ type: "sub", categoryId, subCategoryId });
  };

  // B3: toggleActive 미저장 카테고리 처리
  const toggleActive = async (categoryId: number, isMain: boolean, subCategoryId?: number) => {
    if (isMain) {
      const target = categories.find((c) => c.categoryId === categoryId);
      if (!target) return;

      if (categoryId <= 0) {
        // 미저장: 로컬 state만 토글
        setCategories((prev) =>
          prev.map((c) =>
            c.categoryId === categoryId ? { ...c, isActive: !c.isActive } : c
          )
        );
        return;
      }

      try {
        await editCategory(target.categoryId, target.value, !target.isActive);
        setCategories((prev) =>
          prev.map((c) =>
            c.categoryId === categoryId ? { ...c, isActive: !c.isActive } : c
          )
        );
      } catch {
        alert("활성 상태 변경에 실패했습니다.");
      }
    } else {
      const parent = categories.find((c) => c.categoryId === categoryId);
      if (!parent) return;
      const target = parent.subCategories.find((s) => s.categoryId === subCategoryId);
      if (!target || !subCategoryId) return;

      if (subCategoryId <= 0) {
        // 미저장: 로컬 state만 토글
        setCategories((prev) =>
          prev.map((c) => {
            if (c.categoryId === categoryId) {
              return {
                ...c,
                subCategories: c.subCategories.map((s) =>
                  s.categoryId === subCategoryId ? { ...s, isActive: !s.isActive } : s
                ),
              };
            }
            return c;
          })
        );
        return;
      }

      try {
        await editCategory(target.categoryId, target.value, !target.isActive);
        setCategories((prev) =>
          prev.map((c) => {
            if (c.categoryId === categoryId) {
              return {
                ...c,
                subCategories: c.subCategories.map((s) =>
                  s.categoryId === subCategoryId ? { ...s, isActive: !s.isActive } : s
                ),
              };
            }
            return c;
          })
        );
      } catch {
        alert("활성 상태 변경에 실패했습니다.");
      }
    }
  };

  // DnD: 대분류 드래그 종료 핸들러
  const handleMainDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = sortedCategories.findIndex((c) => String(c.categoryId) === active.id);
      const newIndex = sortedCategories.findIndex((c) => String(c.categoryId) === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = arrayMove(sortedCategories, oldIndex, newIndex).map((c, i) => ({
        ...c,
        displayOrder: i,
      }));

      // 낙관적 업데이트
      setCategories(reordered);

      // 서버 동기화 (저장된 항목만)
      const orders = reordered
        .filter((c) => c.categoryId > 0)
        .map((c) => ({ categoryId: c.categoryId, displayOrder: c.displayOrder }));

      if (orders.length > 0) {
        try {
          await reorderCategories(orders);
        } catch {
          alert("순서 변경에 실패했습니다. 목록을 다시 불러옵니다.");
          await loadCategories();
        }
      }
    },
    [sortedCategories]
  );

  // DnD: 소분류 드래그 종료 핸들러
  const handleSubDragEnd = useCallback(
    async (parentCategoryId: number, event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const parent = categories.find((c) => c.categoryId === parentCategoryId);
      if (!parent) return;

      const subs = [...parent.subCategories].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
      const oldIndex = subs.findIndex((s) => String(s.categoryId) === active.id);
      const newIndex = subs.findIndex((s) => String(s.categoryId) === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      const reorderedSubs = arrayMove(subs, oldIndex, newIndex).map((s, i) => ({
        ...s,
        displayOrder: i,
      }));

      // 낙관적 업데이트
      setCategories((prev) =>
        prev.map((c) =>
          c.categoryId === parentCategoryId
            ? { ...c, subCategories: reorderedSubs }
            : c
        )
      );

      // 서버 동기화 (저장된 항목만)
      const orders = reorderedSubs
        .filter((s) => s.categoryId > 0)
        .map((s) => ({ categoryId: s.categoryId, displayOrder: s.displayOrder }));

      if (orders.length > 0) {
        try {
          await reorderCategories(orders);
        } catch {
          alert("순서 변경에 실패했습니다. 목록을 다시 불러옵니다.");
          await loadCategories();
        }
      }
    },
    [categories]
  );

  const toggleDragMode = () => {
    setIsDragMode((prev) => {
      if (!prev) {
        setSortConfig({ field: "", direction: "asc" });
      }
      return !prev;
    });
  };

  const mainCategoryIds = useMemo(
    () => sortedCategories.map((c) => String(c.categoryId)),
    [sortedCategories]
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MyPageSideBar />
      <div className="flex-1 max-w-7xl mx-auto bg-white rounded-lg shadow min-w-0 py-8 px-3 md:px-6 overflow-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold text-gray-800">관리자 &gt; 카테고리 관리</h1>
            <div className="flex gap-2">
              <button
                onClick={toggleDragMode}
                className={`px-3 py-1.5 text-sm font-medium rounded ${
                  isDragMode
                    ? "bg-indigo-500 text-white hover:bg-indigo-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {isDragMode ? "순서 변경 완료" : "순서 변경"}
              </button>
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
          </div>
          {/* F2: 반응형 grid 재설계 */}
          <div className="hidden md:grid grid-cols-[80px_1fr_100px_240px] gap-4 bg-gray-100 px-4 py-3 rounded font-semibold text-sm">
            <div className="flex items-center min-w-0">
              <span className="font-medium">분류코드</span>
            </div>
            <div className="flex items-center min-w-0">
              <span className="font-medium">분류명</span>
              <button onClick={() => handleSort("name")} className="ml-2">
                <i
                  className={`fas fa-sort${sortConfig.field === "name" ? (sortConfig.direction === "asc" ? "-up" : "-down") : ""}`}></i>
              </button>
            </div>
            <div className="flex items-center min-w-0">
              <span className="font-medium">활성상태</span>
              <button onClick={() => handleSort("isActive")} className="ml-2">
                <i
                  className={`fas fa-sort${sortConfig.field === "isActive" ? (sortConfig.direction === "asc" ? "-up" : "-down") : ""}`}></i>
              </button>
            </div>
            <div></div>
          </div>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-500">로딩 중...</span>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleMainDragEnd}
            >
              <SortableContext items={mainCategoryIds} strategy={verticalListSortingStrategy}>
                {sortedCategories.map((category) => (
                  <SortableRow
                    key={category.categoryId}
                    id={String(category.categoryId)}
                    disabled={!isDragMode}
                  >
                    {({ attributes, listeners, setNodeRef, style }) => (
                      <div ref={setNodeRef} style={style} className="mb-4">
                        {/* F2: 반응형 grid */}
                        <div className="flex flex-col gap-2 md:grid md:grid-cols-[80px_1fr_100px_240px] md:gap-4 items-start md:items-center bg-white p-4 border-b rounded">
                          {/* [1] 분류코드 + 확장 버튼 */}
                          <div className="flex items-center space-x-2 min-w-0">
                            {isDragMode && (
                              <button
                                {...attributes}
                                {...listeners}
                                className="cursor-grab text-gray-400 hover:text-gray-600 touch-none"
                                title="드래그하여 순서 변경"
                              >
                                ⠿
                              </button>
                            )}
                            <button onClick={() => toggleExpand(category.categoryId)} className="text-gray-500">
                              <i className={`fas fa-chevron-${category.isExpanded ? "down" : "right"}`} />
                            </button>
                            {category.categoryId > 0 && <span className="truncate">{category.categoryId}</span>}
                          </div>
                          {/* [2] 대분류명 */}
                          <div className="min-w-0 w-full">
                            {category.isEditing ? (
                              <input
                                type="text"
                                value={category.value}
                                onChange={(e) => handleCategoryChange(category.categoryId, e.target.value)}
                                className="w-full min-w-0 px-3 py-2 border rounded text-sm"
                                placeholder="대분류명 입력"
                                autoFocus
                              />
                            ) : (
                              <span className="truncate block">{category.value}</span>
                            )}
                          </div>
                          {/* [3] 활성상태 */}
                          <select
                            value={category.isActive ? "active" : "inactive"}
                            onChange={() => toggleActive(category.categoryId, true)}
                            className="px-3 py-2 border rounded text-sm">
                            <option value="active">활성</option>
                            <option value="inactive">비활성</option>
                          </select>
                          {/* [4] 액션 버튼 */}
                          <div className="justify-self-end">
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
                                  disabled: isSaving,
                                },
                                {
                                  label: "삭제",
                                  color: "red",
                                  onClick: () => handleDeleteCategory(category.categoryId),
                                  disabled: isSaving,
                                },
                              ]}
                            />
                          </div>
                        </div>
                        {/* 소분류 영역 */}
                        {category.isExpanded && (
                          <div className="mt-2 space-y-2">
                            <DndContext
                              sensors={sensors}
                              collisionDetection={closestCenter}
                              onDragEnd={(event) => handleSubDragEnd(category.categoryId, event)}
                            >
                              <SortableContext
                                items={[...category.subCategories]
                                  .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
                                  .map((s) => String(s.categoryId))}
                                strategy={verticalListSortingStrategy}
                              >
                                {[...category.subCategories]
                                  .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
                                  .map((subCategory) => (
                                    <SortableRow
                                      key={subCategory.categoryId}
                                      id={String(subCategory.categoryId)}
                                      disabled={!isDragMode}
                                    >
                                      {({ attributes: subAttrs, listeners: subListeners, setNodeRef: subRef, style: subStyle }) => (
                                        <div
                                          ref={subRef}
                                          style={subStyle}
                                          className="flex flex-col gap-2 md:grid md:grid-cols-[80px_1fr_100px_240px] md:gap-4 items-start md:items-center bg-gray-50 p-4 rounded"
                                        >
                                          {/* [1] 코드 자리 — 드래그 핸들 */}
                                          <div className="min-w-0 pl-6">
                                            {isDragMode && (
                                              <button
                                                {...subAttrs}
                                                {...subListeners}
                                                className="cursor-grab text-gray-400 hover:text-gray-600 touch-none"
                                                title="드래그하여 순서 변경"
                                              >
                                                ⠿
                                              </button>
                                            )}
                                          </div>
                                          {/* [2] 소분류명 */}
                                          <div className="min-w-0 w-full">
                                            {subCategory.isEditing ? (
                                              <input
                                                type="text"
                                                value={subCategory.value}
                                                onChange={(e) =>
                                                  handleSubCategoryChange(category.categoryId, subCategory.categoryId, e.target.value)
                                                }
                                                className="w-full min-w-0 px-3 py-2 border rounded text-sm"
                                                placeholder="소분류명 입력"
                                                autoFocus
                                              />
                                            ) : (
                                              <span className="truncate block">{subCategory.value}</span>
                                            )}
                                          </div>
                                          {/* [3] 활성상태 */}
                                          <select
                                            value={subCategory.isActive ? "active" : "inactive"}
                                            onChange={() => toggleActive(category.categoryId, false, subCategory.categoryId)}
                                            className="px-3 py-2 border rounded text-sm">
                                            <option value="active">활성</option>
                                            <option value="inactive">비활성</option>
                                          </select>
                                          {/* [4] 액션 버튼 */}
                                          <div className="justify-self-end">
                                            <MyPageManageButton
                                              actions={[
                                                {
                                                  label: subCategory.isEditing ? "저장" : "수정",
                                                  color: subCategory.isEditing ? "blue" : "yellow",
                                                  onClick: () => toggleSubEdit(category.categoryId, subCategory.categoryId),
                                                  disabled: isSaving,
                                                },
                                                {
                                                  label: "삭제",
                                                  color: "red",
                                                  onClick: () => handleDeleteSubCategory(category.categoryId, subCategory.categoryId),
                                                  disabled: isSaving,
                                                },
                                              ]}
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </SortableRow>
                                  ))}
                              </SortableContext>
                            </DndContext>
                          </div>
                        )}
                      </div>
                    )}
                  </SortableRow>
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">삭제 확인</h3>
            <p className="text-gray-600 mb-6">카테고리를 삭제하시겠습니까?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                disabled={isSaving}>
                취소
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600"
                disabled={isSaving}>
                {isSaving ? "삭제 중..." : "삭제"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminCategory;
