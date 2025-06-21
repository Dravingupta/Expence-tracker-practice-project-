const express = require("express");
const app = express();
const port = 12;
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require("uuid");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

let essentials = [];
let extras = [];

app.get("/", (req, res) => {
    let essentialsTotal = essentials.reduce((sum, item) => sum + Number(item.amount), 0);
    let extrasTotal = extras.reduce((sum, item) => sum + Number(item.amount), 0);

    res.render("index", { essentials, extras, essentialsTotal, extrasTotal });
});

app.get("/new", (req, res) => {
    res.render("new.ejs");
});

app.post("/", (req, res) => {
    let { title, description, catagory, amount, date, paymentMethod } = req.body;

    if (!date) date = new Date().toISOString().split("T")[0]; 
    if (!paymentMethod) paymentMethod = "Cash";

    const newExpense = {
        id: uuidv4(),
        title,
        description,
        catagory,
        amount,
        date,
        paymentMethod
    };

    if (catagory === "Essentials") {
        essentials.push(newExpense);
    } else {
        extras.push(newExpense);
    }

    res.redirect("/");
});

app.get("/edit/essentials/:id", (req, res) => {
    const { id } = req.params;
    const expense = essentials.find(item => item.id === id);
    res.render("editEssentials", { expense });
});

app.get("/edit/extras/:id", (req, res) => {
    const { id } = req.params;
    const expense = extras.find(item => item.id === id);
    res.render("editExtras", { expense });
});

app.put("/edit/essentials/:id", (req, res) => {
    const { id } = req.params;
    const { title, description, amount, catagory, date, paymentMethod } = req.body;

    const index = essentials.findIndex(item => item.id === id);
    if (index !== -1) {
        const updatedItem = { title, description, amount, catagory, date, paymentMethod, id };

        if (catagory === "Essentials") {
            essentials[index] = updatedItem;
        } else {
            essentials.splice(index, 1);
            extras.push(updatedItem);
        }
    }
    res.redirect("/");
});

app.put("/edit/extras/:id", (req, res) => {
    const { id } = req.params;
    const { title, description, amount, catagory, date, paymentMethod } = req.body;

    const index = extras.findIndex(item => item.id === id);
    if (index !== -1) {
        const updatedItem = { title, description, amount, catagory, date, paymentMethod, id };

        if (catagory === "Unnecessary") {
            extras[index] = updatedItem;
        } else {
            extras.splice(index, 1);
            essentials.push(updatedItem);
        }
    }
    res.redirect("/");
});

app.delete("/delete/essentials/:id", (req, res) => {
    const { id } = req.params;
    essentials = essentials.filter(item => item.id !== id);
    res.redirect("/");
});

app.delete("/delete/extras/:id", (req, res) => {
    const { id } = req.params;
    extras = extras.filter(item => item.id !== id);
    res.redirect("/");
});

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
