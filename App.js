const express = require("express");
const sequelize = require("./config/db");
const bodyParser = require("body-parser");
const { Book } = require("./models"); // Импорт модели Book
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Подключение к базе данных
sequelize
  .authenticate()
  .then(() => {
    console.log("Подключение к базе данных установлено.");
  })
  .catch((err) => {
    console.error("Ошибка подключения к базе данных:", err);
  });

// Маршрут для получения списка всех книг
app.get("/books", async (req, res) => {
  try {
    const books = await Book.findAll(); // Получение всех книг
    res.json(books); // Отправка JSON ответа с книгами
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Маршрут для добавления новой книги
app.post("/books", async (req, res) => {
  try {
    const { title, author, year } = req.body; // Данные из тела запроса
    const newBook = await Book.create({ title, author, year }); // Создание новой книги
    res.status(201).json(newBook); // Отправка JSON ответа с новой книгой
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Маршрут для обновления данных книги
app.put("/books/:id", async (req, res) => {
  try {
    const { id } = req.params; // Параметр пути
    const { title, author, year } = req.body; // Данные для обновления
    const [updated] = await Book.update(
      { title, author, year },
      { where: { id } }
    );

    if (updated) {
      const updatedBook = await Book.findByPk(id); // Получаем обновленную книгу
      res.json(updatedBook); // Отправляем обновленную книгу
    } else {
      res.status(404).json({ message: "Книга не найдена" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Маршрут для удаления книги
app.delete("/books/:id", async (req, res) => {
  try {
    const { id } = req.params; // Параметр пути
    const deleted = await Book.destroy({ where: { id } });

    if (deleted) {
      res.status(204).send(); // Отправляем статус 204 (без содержимого)
    } else {
      res.status(404).json({ message: "Книга не найдена" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Основной маршрут
app.get("/", (req, res) => {
  res.send("Приложение работает!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});

module.exports = app;
