import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import express from 'express';
import crypto from 'crypto';
import bodyParser from 'body-parser';
import { UUID } from "crypto";

const app = express();
app.use(bodyParser.json())
const port = 3000;

interface Expense {
    id : UUID;
    name : string;
    category : Category
}

interface Category {
    id : string;
    name : string;
    amount: number
}

const categories : {id: string, name: string}[]= [
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

const expenses: Expense[] = [
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
      "name" : "Transportation",     
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

/**
 * @swagger
 * /expense:
 *  get:
 *      description: Retrieve List of Expenses
 * 
 *      parameters:
 *      - in: query
 *        name: category_id
 *        description: id of the category
 *        schema:
 *          type: string
 *      - in: query
 *        name: min_price
 *        description: minimum price
 *        schema:
 *          type: integer
 *      - in: query
 *        name: max_price
 *        description: maximum price
 *        schema:
 *          type: integer
 * 
 *      responses:
 *          "200":
 *              description: List of Expenses
 */
app.get('/expense', (req,res) => {
    const category_id = req.query.category_id?.toString();
    const min_price = req.query.min_price;
    const max_price = req.query.max_price;

    let filteredExpenses: Expense[] = expenses

    if (category_id !== undefined)
        if (category_id.includes(",")) {
            // Handle multiple category
            const categoryIds = category_id.split(",");
            filteredExpenses = filteredExpenses.filter(function (e) {
                return categoryIds.includes(e.category.id)
            })

        } else {
            // Handle single category
            filteredExpenses = filteredExpenses.filter(function (e){
                return (e.category.id === category_id)
            })
            
        }
    
    if (min_price !== undefined)
        filteredExpenses = filteredExpenses.filter(function (e){
            return (e.category.amount >= +min_price!)
        })

    if (max_price !== undefined)
        filteredExpenses = filteredExpenses.filter(function (e){
            return (e.category.amount <= +max_price!)
        })

    const newExpenses: { amount: number; id: String; name: String; category: String; }[] = []
    filteredExpenses.map((e) => (
      newExpenses.push({
        "amount" : e.category.amount,
        "id" : e.id,
        "name" : e.name,
        "category" : e.category.name
      })
    ))

    res.send(newExpenses);
});

/**
 * @swagger
 * components:
 *  schemas:
 *      Request:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *              name:
 *                  type: string
 */ 

/**
 * @swagger
 * /expense:
 *  post:
 *      description: Create New Expense
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/Request'
 * 
 *      responses:
 *          200:
 *              description: List of Expense   
 */
app.post('/expense', (req,res) => {
    let body = req.body;
    let categoryName = ""

    for (let index = 0; index < categories.length; index++) {
        if (categories[index].id === body.category){
            categoryName = categories[index].name
        }
    }

    const newExpense : Expense = {
        "id": crypto.randomUUID(),
        "name": body.name,
        "category": {
            "id": body.category,
            "name": categoryName,
            "amount": body.amount,
        },
    }
    
    expenses.push(newExpense);
    res.send(newExpense);
})

/**
 * @swagger
 * /expense/category:
 *  get:
 *      description: Retrieve List of Expense Category
 *      responses:
 *          200:
 *              description: List of Expense Category
 */
app.get('/expense/category', (req,res) => {
    res.send(categories);
});

/**
 * @swagger
 * /expense/total:
 *  get:
 *      description: Retrieve Amount of Total Expenses
 *      responses:
 *          200:
 *              description: Amount of Total Expenses
 */
app.get('/expense/total', (req,res) => {
  var total: number = 0;
  expenses.map((e) => (
    total += e.category.amount
  ))
  res.send({
    "total_expense": total
  });
});

/**
 * @swagger
 * /expense/{id}:
 *  get:
 *      description: Retrieve Detail of Expenses
 * 
 *      parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        description: id of the category
 * 
 *      responses:
 *          200:
 *              description: Detail of Expenses   
 */
app.get('/expense/:id', (req,res) => {

    for (let index = 0; index < expenses.length; index++) {
      if (expenses[index].id === req.params.id){
        res.send(expenses[index]);
        return;
      }
    }
    res.send(`Expense with id ${req.params.id} not found!`)
});

/**
 * @swagger
 * /expense/{id}:
 *  delete:
 *      description: Delete Expenses
 * 
 *      parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        description: id of the category
 * 
 *      responses:
 *          200:
 *              description: Success   
 */
app.delete('/expense/:id', (req,res) => {

  for (let index = 0; index < expenses.length; index++) {
    if (expenses[index].id === req.params.id){
      expenses.splice(index,1);
      res.send(`Success delete expense with id ${req.params.id}`);
      return;
    }
  }
  res.send(`Expense with id ${req.params.id} not found`)
});

/**
 * @swagger
 * /expense/{id}:
 *  put:
 *      description: Update Expenses
 *
 *      parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        description: Expense ID
 *
 *      responses:
 *          200:
 *              description: Success
 */
app.put('/expense/:id', (req,res) => {
    let body = req.body;
    let newExpense : Expense = {
        "id": crypto.randomUUID(),
        "name": "",
        "category": {
            "id": "",
            "name": "",
            "amount": 0,
        },
    };
    let categoryName = ""

    for (let index = 0; index < categories.length; index++) {
        if (categories[index].id === body.category){
            categoryName = categories[index].name
        }
    }

    for (let index = 0; index < expenses.length; index++) {
        if (expenses[index].id === req.params.id){

            newExpense = {
                "id": expenses[index].id,
                "name": body.name,
                "category": {
                    "id": body.category,
                    "name": categoryName,
                    "amount": body.amount,
                },
            }
            expenses.splice(index, 1, newExpense);
        }
    }
    res.send(newExpense)
});

// Swagger
const options = {
    definition: {
      swagger: "2.0",
      openapi: "3.1.0",
      info: {
        title: "Expense API",
        version: "0.1.0",
        description: "Simple CRUD expense API documentation",
        license: {
            name: "MIT",
            url: "https://spdx.org/licenses/MIT.html",
          },
      },
      servers: [
        {
          url: "http://localhost:3000",
        },
      ],
      
    },
    apis: ["./dist/*.js"],
  };
const specs = swaggerJsdoc(options);
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
);

// Listener
app.listen(port, () => {
    console.log(`Connected Successfully on port ${port}`)
})