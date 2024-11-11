import { Shop } from "@prisma/client";
export interface WhereConditions {
  userId: number;
  OR?: Array<{ card: { name: { contains: string; mode: "insensitive" } } }>;
}

export interface CreateShopCardData {
  userId: number;
  cardId: number;
  price: number;
  totalCount: number;
  exchangeGrade?: string;
  exchangeGenre?: string;
  exchangeDescription?: string;
}

export interface UpdateShopCardData {
  shopId: number;
  cardId: number;
  userId: number;
  price: number;
  totalCount: number;
  remainingCount?: number;
  exchangeGrade?: string;
  exchangeGenre?: string;
  exchangeDescription?: string;
}

export interface Filters {
  search?: string;
  grade?: string;
  genre?: string;
  isSoldOut?: boolean;
}

export interface PaginationResult {
  totalCards: number;
  currentPage: number;
  totalPages: number;
  cards: (Shop & {
    card: {
      name: string;
      genre: string;
      grade: string;
      imageURL: string;
    };
    user: {
      nickname: string;
    };
    isSoldOut: boolean;
  })[];
}
