export interface RecruitQuestion {
    id: number;
    question: string;
    required: boolean;
    maxLength: number;
}

export interface JoinAnswer {
    questionId: number;
    answer: string;
}