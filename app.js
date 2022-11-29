const express = require("express");
const app = express();
const { Todo } = require("./models");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const csrf = require("tiny-csrf");

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("secret"));
app.use(csrf("1234567890Swapnilpatelqwertylkjj"));

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.get("/", async (req, res) => {
  // const allTodos = await Todo.getTodos();
  const overdue = await Todo.overdue();
  const dueToday = await Todo.dueToday();
  const dueLater = await Todo.dueLater();
  const completed = await Todo.completed();
  if (req.accepts("html")) {
    res.render("index", {
      dueLater,
      dueToday,
      overdue,
      completed,
      csrfToken: req.csrfToken(),

    });
  } else {
    res.json({
      overdue, dueLater, dueToday, completed,
    });
  }
});
app.get("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.status(200).json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", async function (request, response) {
  try {
    const todo = await Todo.addTodo({ title: request.body.title, dueDate: request.body.dueDate });
    return response.redirect("/");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id", async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.setCompletionStatus(request.body.completed);
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);
  // FILL IN YOUR CODE HERE
  try {
    const todoDelete = await Todo.destroy({
      where: {
        id: request.params.id,
      },
    });
    response.status(200).json((todoDelete) ? true : false);
  } catch (err) {
    console.log(err);
    return response.status(422).json(err);
  }
  // First, we have to query our database to delete a Todo by ID.
  // Then, we have to respond back with true/false based on whether the Todo was deleted or not.

});




module.exports = app;
