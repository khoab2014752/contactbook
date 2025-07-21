const express = require("express");
const cors = require("cors");
const contactsRouter = require("./app/routes/contact.route")
const ApiError = require("./app/api-error");
const app = express();

app.use("/api/contacts", contactsRouter);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({message: "Welcome to Contactbook"});
});


//handle 404 response
app.use((req, res, next) =>{
    //code chay khi khong co route dc dinh nghia nao
    //goi next() de chuyen sang middleware xu ly loi
    return next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
    //Middleware xu ly loi tap trung
    //Trong cac doan code xy ly o cac route, goi next(error)
    //se chuyen ve ve middleware xu ly loi nay
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});

module.exports = app;