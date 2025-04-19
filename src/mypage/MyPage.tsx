// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useEffect, useRef, useState } from "react";
import MyPageSideBar from "../common/component/MyPageSideBar";

const MyPage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showSavedAlert, setShowSavedAlert] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordMatchMessage, setPasswordMatchMessage] = useState("");
  const [phonePrefix, setPhonePrefix] = useState("010");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [isActivityExpanded, setIsActivityExpanded] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const activitySectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (passwordConfirm) {
      if (password === passwordConfirm) {
        setPasswordMatchMessage("비밀번호가 일치합니다.");
      } else {
        setPasswordMatchMessage("비밀번호가 일치하지 않습니다.");
      }
    } else {
      setPasswordMatchMessage("");
    }
  }, [password, passwordConfirm]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const newErrors: { [key: string]: string } = {};

    if (password.length < 6) {
      newErrors.password = "비밀번호는 6자 이상이어야 합니다.";
    }
    if (password !== passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    }
    if (!phoneNumber) {
      newErrors.phoneNumber = "연락처를 입력하세요.";
    }
    if (!address) {
      newErrors.address = "주소를 입력하세요.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setErrors({});
      setPasswordMatchMessage("");
      setIsEditing(false);
      setShowSavedAlert(true);
      setTimeout(() => {
        setShowSavedAlert(false);
      }, 3000);
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
        setAddress(data.address);
      },
    }).open();
  };

  const handleToggleActivity = () => {
    setIsActivityExpanded(!isActivityExpanded);
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
    <div className="flex min-h-screen bg-gray-100">
      {/* 사이드바 */}
      <MyPageSideBar></MyPageSideBar>
      <main className="flex-1 p-10 overflow-y-auto pb-32">
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
              <h2 className="text-2xl font-bold">최형석 님</h2>
              <button onClick={handleWithdraw} className="bg-red-500 text-white px-4 py-1 rounded-md text-sm mt-2">
                회원 탈퇴
              </button>
              <p className="text-sm text-gray-700 mt-2">생년월일: 1997-02-20</p>
              <p className="text-sm text-gray-700">이메일: gofftlqkf@naver.com</p>
              <p className="text-sm text-gray-700">연락처: 010-xxxx-xxxx</p>
            </div>
          </div>
        </section>

        {/* 회원 정보 수정 폼 */}
        <section className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md mb-10">
          <h3 className="text-xl font-bold mb-6">회원 정보</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-1">이메일</label>
              <input type="email" className="w-full border p-2 rounded-md" value="gower@dodo.com" readOnly />
            </div>
            <div>
              <label className="block font-medium mb-1">비밀번호</label>
              <input
                type="password"
                className="w-full border p-2 rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                readOnly={!isEditing}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="block font-medium mb-1">비밀번호 확인</label>
              <input
                type="password"
                className="w-full border p-2 rounded-md"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                readOnly={!isEditing}
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
              <input type="text" className="w-full border p-2 rounded-md" value="최형석" readOnly />
            </div>
            <div className="md:col-span-2">
              <label className="block font-medium mb-1">주소</label>
              <input
                type="text"
                className="w-full border p-2 rounded-md mb-2 cursor-pointer"
                value={address}
                placeholder="주소 검색 클릭"
                onClick={isEditing ? handleAddressSearch : undefined}
                readOnly
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              <input
                type="text"
                className="w-full border p-2 rounded-md"
                value={detailAddress}
                onChange={(e) => setDetailAddress(e.target.value)}
                placeholder="상세주소 입력"
                readOnly={!isEditing}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">생년월일</label>
              <input type="date" className="w-full border p-2 rounded-md" value="1997-02-20" readOnly />
            </div>
            <div>
              <label className="block font-medium mb-1">연락처</label>
              <div className="flex gap-2">
                <select
                  value={phonePrefix}
                  onChange={(e) => setPhonePrefix(e.target.value)}
                  disabled={!isEditing}
                  className="border p-2 rounded-md">
                  <option value="010">010</option>
                  <option value="011">011</option>
                  <option value="016">016</option>
                  <option value="017">017</option>
                  <option value="018">018</option>
                  <option value="019">019</option>
                </select>
                <input
                  type="text"
                  className="flex-1 border p-2 rounded-md"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="번호 입력"
                  readOnly={!isEditing}
                />
              </div>
              {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
            </div>
          </div>
          <div className="flex justify-end mt-6 space-x-3">
            <button
              onClick={handleEdit}
              disabled={isEditing}
              className="bg-blue-300 text-blue-900 px-4 py-2 rounded-md disabled:opacity-50">
              정보 편집
            </button>
            <button
              onClick={handleSave}
              disabled={!isEditing}
              className="bg-green-300 text-green-900 px-4 py-2 rounded-md disabled:opacity-50">
              저장
            </button>
          </div>
        </section>

        {/* 최근 활동 */}
        <section ref={activitySectionRef} className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={handleToggleActivity}>
            <h3 className="text-lg font-bold">내 최근 활동</h3>
            <i className={`fas fa-chevron-${isActivityExpanded ? "up" : "down"} text-gray-500`}></i>
          </div>
          <div
            className={`${isActivityExpanded ? "max-h-96 overflow-y-scroll" : "max-h-[140px] overflow-hidden"} transition-all duration-300 space-y-2`}>
            {activities.map((activity, index) => (
              <p key={index} className="text-sm">
                {activity}
              </p>
            ))}
          </div>
        </section>
      </main>

      {/* 저장 완료 알림 */}
      {showSavedAlert && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
          정보가 저장되었습니다.
        </div>
      )}
    </div>
  );
};

export default MyPage;
