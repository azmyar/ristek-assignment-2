import express from 'express';
import crypto from 'crypto';
import bodyParser from 'body-parser';

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import schema from './schema';
import { Expense } from "./interfaces";
import { categories, expenses } from "./data";

import * as swagger from "../swagger.json";

const app = express();
const port = 3000;
const specs = swaggerJsdoc(swagger);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(bodyParser.json())

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

app.post('/expense', (req,res) => {

    let body = req.body;
    let categoryName = ""

    const {error, value} = schema.validate(body, {abortEarly : false})

    if (error) {

        let errorMessage = ""
        for (let index = 0; index < error.details.length; index++) {
            errorMessage += error.details[index].message + "\n"
        }

        return res.send (errorMessage)
    }

    for (let index = 0; index < categories.length; index++) {
        if (categories[index].id === body.category){
            categoryName = categories[index].name
            break;
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

app.get('/expense/category', (req,res) => {
    res.send(categories);
});

app.get('/expense/total', (req,res) => {
  var total: number = 0;
  expenses.map((e) => (
    total += e.category.amount
  ))
  res.send({
    "total_expense": total
  });
});

app.get('/expense/:id', (req,res) => {

    for (let index = 0; index < expenses.length; index++) {
      if (expenses[index].id === req.params.id){
        res.send(expenses[index]);
        return;
      }
    }
    res.send(`Expense with id ${req.params.id} not found!`)
});

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

    const {error, value} = schema.validate(body, {abortEarly : false})

    if (error) {

        let errorMessage = ""
        for (let index = 0; index < error.details.length; index++) {
            errorMessage += error.details[index].message + "\n"
        }
        
        return res.send (errorMessage)
    }

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
            break;
        }
    }
    res.send(newExpense)
});

// Listener
app.listen(port, () => {
    console.log(`Connected Successfully on port ${port}`)
})