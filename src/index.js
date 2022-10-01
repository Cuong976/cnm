const express = require("express");
const AWS = require("aws-sdk");
const multer = require("multer")

const upload = multer();
const app = express();

//view engine
app.use(express.static("./src/resources/static"));
app.set("view engine", "ejs");
app.set("views", "./src/resources/views");

//dynamo config
const config = new AWS.Config({
    accessKeyId: "AKIAXSRWE6UPHPTXCCST",
    secretAccessKey: "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",
    region: "ap-southeast-1",
});

AWS.config = config;
const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = "product"

app.get("/", (req, res) => {
    const param = {
        TableName: tableName
    }
    docClient.scan(param, (e, data) => {
        if (e) {
            res.status(400).send("Internal server erro")
        } else {
            console.log(data.Items);
            res.render("index", { products: data.Items });
        }
    });
});

app.post("/", upload.fields([]), (req, res) => {
    const product = {...req.body }
    const param = {
        TableName: tableName,
        Item: product
    }
    docClient.put(param, (e, data) => {
        if (e) {
            res.status(400).send("Internal server erro")

        } else {
            res.redirect("/")
        }
    });

})

app.get("/delete/:id", (req, res) => {
    const param = {
        TableName: tableName,
        Key: {
            product_id: req.params.id,
        }
    }
    docClient.delete(param, (e, data) => {
        if (e) {
            res.status(400).send("Internal server erro");
        } else {
            console.log(data);
            res.redirect("/")
        }
    })
})

app.listen(3000, () => {
    console.log("server listening on port 3000");
});