// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useEffect, useMemo, useRef, useState } from "react";
import MyPageSideBar from "../component/MyPageSideBar";
import { getMyInformation, modifyMember } from "../api/MyPage";
import { MyPageModifyMemberDataType } from "../type/MyPageTable";

// 타입 정의
interface FormData {
  name: string;
  email: string;
  phone: { prefix: string; number: string };
  address: { normal: string; detail: string };
  birthday: string;
  gender: string;
}

interface Passwords {
  password: string;
  confirm: string;
}

interface UiState {
  isEditing: boolean;
  showAlert: boolean;
  isExpanded: boolean;
}

const MyPage: React.FC = () => {
  // 상태 통합
  const [formData, setFormData] = useState<FormData>({
    name: "이름 없음",
    email: "이메일 없음",
    phone: { prefix: "010", number: "" },
    address: { normal: "", detail: "" },
    birthday: "",
    gender: "",
  });

  const [passwords, setPasswords] = useState<Passwords>({ password: "", confirm: "" });
  const [uiState, setUiState] = useState<UiState>({
    isEditing: false,
    showAlert: false,
    isExpanded: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const activitySectionRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // 스크립트 중복 방지
  useEffect(() => {
    // 이미 로드된 스크립트 확인
    if (document.querySelector('script[src*="postcode.v2.js"]')) return;

    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // 회원 정보 로드
  useEffect(() => {
    const fetchMemberData = async () => {
      const getData = await getMyInformation();
      const memberData = getData.data;
      const splitPhoneNumber = memberData?.phoneNumber?.split("-") || ["010", ""];
      const splitAddress = memberData?.address?.split(",") || ["", ""];

      setFormData({
        name: memberData?.name || "이름 없음",
        email: memberData?.email || "이메일 없음",
        phone: { prefix: splitPhoneNumber[0], number: splitPhoneNumber[1] || "" },
        address: { normal: splitAddress[0], detail: splitAddress[1] || "" },
        birthday: memberData?.birth || "",
        gender: memberData?.gender || "",
      });
    };
    fetchMemberData();
  }, []);

  // setTimeout cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // 파생 상태 - useMemo로 계산
  const passwordMatchMessage = useMemo(() => {
    if (!passwords.confirm) return "";
    return passwords.password === passwords.confirm
      ? "비밀번호가 일치합니다."
      : "비밀번호가 일치하지 않습니다.";
  }, [passwords]);

  const handleEdit = () => {
    setUiState(prev => ({ ...prev, isEditing: true }));
  };

  const handleSave = async () => {
    const newErrors: { [key: string]: string } = {};

    if (passwords.password.length < 6) {
      newErrors.password = "비밀번호는 6자 이상이어야 합니다.";
    }
    if (passwords.password !== passwords.confirm) {
      newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    }
    if (!formData.phone.number) {
      newErrors.phoneNumber = "연락처를 입력하세요.";
    }
    if (!formData.address.normal || !formData.address.detail) {
      newErrors.address = "주소를 입력하세요.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const phoneNumber = formData.phone.prefix + "-" + formData.phone.number;
      const address = formData.address.normal + "," + formData.address.detail;
      const modifyData: MyPageModifyMemberDataType = {
        phoneNumber,
        password: passwords.password,
        address,
      };

      try {
        await modifyMember(modifyData);
        setErrors({});
        setPasswords({ password: "", confirm: "" });
        setUiState(prev => ({ ...prev, isEditing: false, showAlert: true }));

        timeoutRef.current = setTimeout(() => {
          setUiState(prev => ({ ...prev, showAlert: false }));
        }, 3000);
      } catch {
        alert('저장 실패');
      }
    }
  };

  const handleWithdraw = () => {
    const confirmed = window.confirm("정말로 회원 탈퇴하시겠습니까? 탈퇴 시 모든 정보가 삭제됩니다.");
    if (confirmed) {
      alert("회원 탈퇴가 완료되었습니다.");
    }
  };

  const handleAddressSearch = () => {
    new (window as any).daum.Postcode({
      oncomplete: function (data: any) {
        setFormData(prev => ({
          ...prev,
          address: { ...prev.address, normal: data.address }
        }));
      },
    }).open();
  };

  const handleToggleActivity = () => {
    setUiState(prev => ({ ...prev, isExpanded: !prev.isExpanded }));
    setTimeout(() => {
      activitySectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const activities = [
    "북리뷰에 글을 등록하였습니다.",
    "댓글을 작성하였습니다.",
    "모임에 가입하였습니다.",
    "추가 활동 1",
    "추가 활동 2",
    "추가 활동 3",
    "추가 활동 4",
    "추가 활동 5",
    "추가 활동 6",
    "추가 활동 7",
    "추가 활동 8",
    "추가 활동 9",
    "추가 활동 10",
    "추가 활동 11",
    "추가 활동 12",
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 사이드바 */}
      <MyPageSideBar />
      <div className="flex-1 px-3 md:px-6 py-8 min-w-0">
        {/* 프로필 섹션 */}
        <section className="max-w-3xl mx-auto mb-10">
          <div className="flex flex-col items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
              <img
                src="https://image.fmkorea.com/files/attach/new/20200919/486263/2946049971/3101286715/f78f46341de76e76ca7441b4143569c1.jpg"
                alt="프로필 이미지"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold">{formData.name} 님</h2>
              <button onClick={handleWithdraw} className="bg-red-500 text-white px-4 py-1 rounded-lg text-sm mt-2 hover:bg-red-600">
                회원 탈퇴
              </button>
              <p className="text-sm text-gray-700 mt-2">생년월일: {formData.birthday}</p>
              <p className="text-sm text-gray-700">이메일: {formData.email}</p>
              <p className="text-sm text-gray-700">
                연락처: {formData.phone.prefix}-{formData.phone.number}
              </p>
            </div>
          </div>
        </section>

        {/* 회원 정보 수정 폼 */}
        <section className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md mb-10">
          <h3 className="text-xl font-bold mb-6">회원 정보</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-1">이메일</label>
              <input type="email" className="w-full border border-gray-300 p-2 rounded-lg focus:ring-1 focus:ring-emerald-300 focus:border-emerald-500 outline-none" value={formData.email} readOnly />
            </div>
            <div>
              <label className="block font-medium mb-1">비밀번호</label>
              <input
                type="password"
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-1 focus:ring-emerald-300 focus:border-emerald-500 outline-none"
                value={passwords.password}
                onChange={(e) => setPasswords(prev => ({ ...prev, password: e.target.value }))}
                readOnly={!uiState.isEditing}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="block font-medium mb-1">비밀번호 확인</label>
              <input
                type="password"
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-1 focus:ring-emerald-300 focus:border-emerald-500 outline-none"
                value={passwords.confirm}
                onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                readOnly={!uiState.isEditing}
              />
              {passwordMatchMessage && (
                <p
                  className={`text-sm mt-1 ${passwordMatchMessage === "비밀번호가 일치합니다." ? "text-green-500" : "text-red-500"}`}>
                  {passwordMatchMessage}
                </p>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">이름</label>
              <input type="text" className="w-full border border-gray-300 p-2 rounded-lg focus:ring-1 focus:ring-emerald-300 focus:border-emerald-500 outline-none" value={formData.name} readOnly />
            </div>
            <div className="md:col-span-2">
              <label className="block font-medium mb-1">주소</label>
              <input
                type="text"
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-1 focus:ring-emerald-300 focus:border-emerald-500 outline-none mb-2 cursor-pointer"
                value={formData.address.normal}
                placeholder="주소 검색 클릭"
                onClick={uiState.isEditing ? handleAddressSearch : undefined}
                readOnly
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              <input
                type="text"
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-1 focus:ring-emerald-300 focus:border-emerald-500 outline-none"
                value={formData.address.detail}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  address: { ...prev.address, detail: e.target.value }
                }))}
                placeholder="상세주소 입력"
                readOnly={!uiState.isEditing}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">생년월일</label>
              <input type="date" className="w-full border border-gray-300 p-2 rounded-lg focus:ring-1 focus:ring-emerald-300 focus:border-emerald-500 outline-none" value={formData.birthday} readOnly />
            </div>
            <div>
              <label className="block font-medium mb-1">연락처</label>
              <div className="flex gap-2">
                <select
                  value={formData.phone.prefix}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    phone: { ...prev.phone, prefix: e.target.value }
                  }))}
                  disabled={!uiState.isEditing}
                  className="border border-gray-300 p-2 rounded-lg focus:ring-1 focus:ring-emerald-300 focus:border-emerald-500 outline-none">
                  <option value="010">010</option>
                  <option value="011">011</option>
                  <option value="016">016</option>
                  <option value="017">017</option>
                  <option value="018">018</option>
                  <option value="019">019</option>
                </select>
                <input
                  type="text"
                  className="flex-1 border border-gray-300 p-2 rounded-lg focus:ring-1 focus:ring-emerald-300 focus:border-emerald-500 outline-none"
                  value={formData.phone.number}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    phone: { ...prev.phone, number: e.target.value }
                  }))}
                  placeholder="번호 입력"
                  readOnly={!uiState.isEditing}
                />
              </div>
              {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
            </div>
          </div>
          <div className="flex justify-end mt-6 space-x-3">
            <button
              onClick={handleEdit}
              disabled={uiState.isEditing}
              className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-emerald-200">
              정보 편집
            </button>
            <button
              onClick={handleSave}
              disabled={!uiState.isEditing}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-emerald-700">
              저장
            </button>
          </div>
        </section>

        {/* 최근 활동 */}
        <section ref={activitySectionRef} className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={handleToggleActivity}>
            <h3 className="text-lg font-bold">내 최근 활동</h3>
            <i className={`fas fa-chevron-${uiState.isExpanded ? "up" : "down"} text-gray-500`}></i>
          </div>
          <div
            className={`${uiState.isExpanded ? "max-h-96 overflow-y-scroll" : "max-h-[140px] overflow-hidden"} transition-all duration-300 space-y-2`}>
            {activities.map((activity, index) => (
              <p key={index} className="text-sm">
                {activity}
              </p>
            ))}
          </div>
        </section>
      </div>

      {/* 저장 완료 알림 */}
      {uiState.showAlert && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
          정보가 저장되었습니다.
        </div>
      )}
    </div>
  );
};

export default MyPage;
