
// 모집 상태
export enum GatheringStatus {
    intended = "모집중",
    progress = "진행중",
    end = "완료",
}

// 로그인 플랫폼
export enum socialLogin {
    own = "일반",
    kakao = "카카오",
    naver = "네이버"
}

//사용자 권한
export enum memberAuthority {
    admin = "일반",
    common = "관리자",
}

//참여신청 상태
export enum recruitStatus {
    reject = "승인",
    waiting = "대기",
}

