import { Expense } from "./interfaces"

export const categories : {id: string, name: string}[]= [
    {
      "id": "fa8337a7-a4b7-4257-a322-9d51473d9fc4",
      "name": "Personal Expenses"
    },
    {
      "id": "0c1dab86-8538-498f-af58-17b54de01d3d",
      "name": "Food"
    },
    {
      "id": "3d73aaae-d2cf-441c-9a91-5c2ab7c1f5ed",
      "name": "Housing"
    },
    {
      "id": "3f5d8771-e77a-402e-833d-66eeffaeae16",
      "name": "Transportation"
    }
]
  
export const expenses: Expense[] = [
{
    "id": "fa8337a7-a4b7-4257-a322-9d51473d9fc3",
    "name": "string",
    "category": {
    "id" : "fa8337a7-a4b7-4257-a322-9d51473d9fc1", 
    "name" : "Food",     
    "amount": 1
    }

},
{
    "id": "0c1dab86-8538-498f-af58-17b54de01d3c",
    "name": "string",
    "category": {
    "id" : "fa8337a7-a4b7-4257-a322-9d51473d9fc2", 
    "name" : "Food",     
    "amount": 6
    }

},
{
    "id": "3d73aaae-d2cf-441c-9a91-5c2ab7c1f5ec",
    "name": "string",
    "category": {
    "id" : "fa8337a7-a4b7-4257-a322-9d51473d9fc4", 
    "name" : "Personal Expenses",     
    "amount": 1
}

},
{
    "id": "3f5d8771-e77a-402e-833d-66eeffaeae15",
    "name": "string",
    "category": {
    "id" : "fa8337a7-a4b7-4257-a322-9d51473d9fc4", 
    "name" : "Personal Expenses",     
    "amount": 1
    }

}
]