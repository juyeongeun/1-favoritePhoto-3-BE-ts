import { Card, Exchange, User } from "@prisma/client";
import { ShopData } from "../shop/shopData";

export interface ResponseExchange extends Exchange {
  shop: ShopData;
  user: { nickname: string };
  card: {
    name: string;
    grade: string;
    genre: string;
    description: string;
    purchasePrice: number | null;
  };
}
