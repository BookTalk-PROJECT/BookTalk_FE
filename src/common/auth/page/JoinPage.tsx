import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { createMember, validationEmail } from "../api/Join.mock";
import { Member } from "../type/type";


const JoinPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [normalAddress, setNormalAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [birth, setBirth] = useState("");
  const [p_phoneNumber, setP_phoneNumber] = useState("010");
  const [b_phoneNumber, setB_PhoneNumber] = useState("");
  const [gender, setGender] = useState("male");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [emailStatus, setEmailStatus] = useState<"none" | "invalid" | "duplicate" | "available">("none");
  const [isChecking, setIsChecking] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [authType, setAuthType] = useState<"OWN" | "KAKAO" | "NAVER">("OWN");

  const onSelectP_phoneNumber = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setP_phoneNumber(e.target.value);
  };

  /* 패스워드 상태가 실시간으로 바뀔 때마다 매칭 여부 확인 후 메세지 띄움 */
  useEffect(() => {
    if (passwordConfirm) {
      if (password !== passwordConfirm) {
        setPasswordMatchError("비밀번호가 일치하지 않습니다");
      } else {
        setPasswordMatchError("비밀번호가 일치합니다");
      }
    } else {
      setPasswordMatchError("");
    }
  }, [password, passwordConfirm]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkEmailDuplicate = async () => {
    if (!email.trim()) {
      setEmailStatus("invalid");
      return;
    }
    if (!validateEmail(email)) {
      setEmailStatus("invalid");
      return;
    }
    setIsChecking(true);
    try {
      const emailJson = {
        email,
      }
      const isExistMember = await validationEmail(emailJson);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (isExistMember) {
        setEmailStatus("duplicate");
      } else {
        setEmailStatus("available");
      }
    } finally {
      setIsChecking(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if(!name){
      newErrors.name = "이름을 입력하세요";
    }

    if (!email) {
      newErrors.email = "이메일을 입력하세요";
    } else if (!validateEmail(email)) {
      newErrors.email = "유효한 이메일을 입력하세요";
    } else if (emailStatus === "duplicate") {
      newErrors.email = "이미 사용 중인 이메일입니다";
    } else if (emailStatus !== "available") {
      newErrors.email = "이메일 중복확인을 해주세요";
    }

    if (!password) {
      newErrors.password = "비밀번호를 입력하세요";
    } else if (password.length < 9) {
      newErrors.password = "비밀번호는 9자리 이상이어야 합니다";
    }

    if (!passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호 확인을 입력하세요";
    } else if (password !== passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다";
    }

    if (!b_phoneNumber) {
      newErrors.phoneNumber = "연락처를 입력하세요";
    }

    if (!normalAddress) {
      newErrors.address = "주소를 입력하세요";
    }

    if (!birth) {
      newErrors.birth = "생년월일을 입력하세요";
    }

    if (!agreeTerms) {
      newErrors.agreeTerms = "개인정보 수집 및 이용에 동의해주세요";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {

      const address = `${normalAddress},${detailAddress}`;
      const phoneNumber = `${p_phoneNumber}-${b_phoneNumber}`;

      const joinData = {
        name,
        email,
        password,
        phoneNumber,
        address,
        birth,
        gender,
        authType,
      }
      createMember(joinData);

      alert("회원가입 성공!");
      navigate("/login");
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleAddressSearch = () => {
    new (window as any).daum.Postcode({
      oncomplete: function (data: any) {
        setNormalAddress(data.address);
      },
    }).open();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center py-10">
        <div className="w-full max-w-lg">
          <div className="flex justify-center mb-6">
            <img
              src="https://readdy.ai/api/search-image?query=A%20modern%20minimalist%20book%20logo%20design%20with%20abstract%20geometric%20shapes%2C%20professional%20and%20clean%20style%2C%20soft%20gradient%20background%2C%20reading%20and%20knowledge%20concept&width=120&height=120&seq=1&orientation=squarish"
              alt="로고"
              className="w-24 h-24 object-contain"
            />
          </div>
          <div className="bg-white rounded-lg p-8 shadow">
            <h2 className="text-2xl font-bold mb-8 text-center">회원가입</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>

              {/* 이름 입력 */}
              <div className="relative">
                <label className="block text-sm mb-1">이름</label>
                <div className="relative">
                  <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
                      placeholder="이름을 입력해주세요"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* 이메일 입력 */}
              <div className="relative">
                <label className="block text-sm mb-1">이메일</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailStatus("none");
                    }}
                    className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm"
                    placeholder="이메일을 입력하세요"
                  />
                  <button
                    type="button"
                    onClick={checkEmailDuplicate}
                    disabled={isChecking}
                    className={`px-4 py-2 rounded-md text-sm transition-colors min-w-[90px] ${isChecking ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"} text-white`}>
                    {isChecking ? "확인 중..." : "중복체크"}
                  </button>
                </div>
                {emailStatus === "invalid" && <p className="text-red-500 text-sm mt-1">유효한 이메일을 입력해주세요</p>}
                {emailStatus === "duplicate" && (
                  <p className="text-red-500 text-sm mt-1">이미 사용 중인 이메일입니다</p>
                )}
                {emailStatus === "available" && <p className="text-green-500 text-sm mt-1">사용 가능한 이메일입니다</p>}
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* 비밀번호 입력 */}
              <div className="relative">
                <label className="block text-sm mb-1">비밀번호</label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
                    placeholder="비밀번호를 입력해주세요"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 group">
                    <span className="text-gray-400 cursor-pointer">ℹ️</span>
                    <div className="absolute right-0 hidden group-hover:block bg-gray-700 text-white text-xs rounded px-2 py-1 mt-2 w-max">
                      비밀번호는 9자리 이상으로 입력하세요
                    </div>
                  </div>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              {/* 비밀번호 확인 입력 */}
              <div className="relative">
                <label className="block text-sm mb-1">비밀번호 확인</label>
                <input
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
                  placeholder="비밀번호를 다시 입력해주세요"
                />
                {passwordMatchError && (
                  <p
                    className={`text-sm mt-1 ${passwordMatchError === "비밀번호가 일치합니다" ? "text-green-500" : "text-red-500"}`}>
                    {passwordMatchError}
                  </p>
                )}
                {errors.passwordConfirm && <p className="text-red-500 text-sm mt-1">{errors.passwordConfirm}</p>}
              </div>

              {/* 연락처 */}
              <div className="relative">
                <label className="block text-sm mb-1">연락처</label>
                <div className="flex gap-2">
                  <select  className="w-24 border border-gray-300 rounded-md px-4 py-2 text-sm" defaultValue="010"  value={p_phoneNumber}
                           onChange={onSelectP_phoneNumber}>
                    <option value="010">010</option>
                    <option value="011">011</option>
                    <option value="016">016</option>
                    <option value="017">017</option>
                    <option value="018">018</option>
                    <option value="019">019</option>
                  </select>
                  <input
                    type="tel"
                    value={b_phoneNumber}
                    onChange={(e) => setB_PhoneNumber(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm"
                    placeholder="연락처를 입력하세요"
                  />
                </div>
                {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
              </div>

              {/* 주소 */}
              <div className="relative">
                <label className="block text-sm mb-1">주소</label>
                <input
                  type="text"
                  value={normalAddress}
                  onClick={handleAddressSearch}
                  readOnly
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm cursor-pointer"
                  placeholder="주소를 검색하세요"
                />
                <input
                  type="text"
                  value={detailAddress}
                  onChange={(e) => setDetailAddress(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm mt-2"
                  placeholder="상세주소를 입력하세요"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>

              {/* 성별 */}
              <div className="relative">
                <label className="block text-sm mb-1">성별</label>
                <div className="flex gap-4">
                  <label className="flex items-center text-sm">
                    <input
                      type="radio"
                      value="male"
                      checked={gender === "male"}
                      onChange={() => setGender("male")}
                      className="mr-1"
                    />{" "}
                    남자
                  </label>
                  <label className="flex items-center text-sm">
                    <input
                      type="radio"
                      value="female"
                      checked={gender === "female"}
                      onChange={() => setGender("female")}
                      className="mr-1"
                    />{" "}
                    여자
                  </label>
                </div>
              </div>

              {/* 생년월일 */}
              <div className="relative">
                <label className="block text-sm mb-1">생년월일</label>
                <input
                  type="date"
                  value={birth}
                  onChange={(e) => setBirth(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
                />
                {errors.birth && <p className="text-red-500 text-sm mt-1">{errors.birth}</p>}
              </div>

              {/* 개인정보 수집 동의 */}
              <div className="relative">
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mr-2"
                  />{" "}
                  개인정보 수집 및 이용에 동의합니다.
                </label>
                {errors.agreeTerms && <p className="text-red-500 text-sm mt-1">{errors.agreeTerms}</p>}
              </div>

              {/* 가입 버튼 */}
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-colors mt-6">
                가입하기
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JoinPage;
