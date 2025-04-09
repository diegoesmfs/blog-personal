const express = require("express");
router = express.Router();
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({

    destination: function(req, file, cb){

        cb(null, './images/articles/');

    },

    filename: function(req, file, cb){

        cb(null, "article" + Date.now() + path.extname(file.originalname));

    }

});

const uploading = multer({storage: storage});

const ArticleController = require("../controllers/Articles");

router.get("/test-route", ArticleController.test);
router.post("/create", ArticleController.save);
router.get("/articles/:last?", ArticleController.findArticles);
router.get("/article/:id", ArticleController.oneArticle);
router.delete("/article/:id", ArticleController.deleteArticle);
router.put("/article/:id", ArticleController.updateArticle);
router.post("/upload-image/:id",[uploading.single("file")], ArticleController.upload);
router.get("/image/:image", ArticleController.image);
router.get("/search/:searched". ArticleController.finder);

module.exports = router;