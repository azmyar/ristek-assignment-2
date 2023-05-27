import { UUID } from "crypto";

export interface Expense {
    id : UUID;
    name : string;
    category : Category
}

export interface Category {
    id : string;
    name : string;
    amount: number
}