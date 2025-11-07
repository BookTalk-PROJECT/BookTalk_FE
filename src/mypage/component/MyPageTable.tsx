import React, { useEffect, useMemo, useState } from "react";
import { MyPageTableProps } from "../type/MyPageBoardTable";

const MyPageTable = <T extends { [key: string]: any }>({
  rows,
  renderHeader,
  renderSearchBar,
  renderRow
}: MyPageTableProps<T>) => {

  return (
    <>
    <div>
      {renderSearchBar && renderSearchBar()}
      {/* 테이블 구조 */}
      <div className="bg-white rounded-lg shadow-sm ">
        <table className="min-w-full w-full table-auto text-sm ">
          <thead className="bg-gray-50 border-b border-gray-200">
            {renderHeader && renderHeader()}
          </thead>
          <tbody>
            {renderRow && rows.map((row) => renderRow(row))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

export default MyPageTable;
