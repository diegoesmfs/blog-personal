const { validateArticles } = require("../helper/validate");
const Articles = require("../models/articles");
const fs = require("fs");
const path = require("path");

const test = (req, res) => {

    return res.status(200).json({

        message: "Funciona el controlador"

    });

}

const save = async (req, res) => {

    //pick the parameters

    let parameters = req.body;

    //validate the data

    try {
        await validateArticles(parameters);
    } catch (error) {

        return res.status(400).json({

            status: "error",
            message: error.message || "Data is Missing"

        })

    }


    // create the json to save

    const article = new Articles(parameters);

    //save the article in the data base

    try {
        const savedArticle = await article.save();
        return res.status(200).json({
            status: "success",
            article: savedArticle,
            message: "File saved"
        });
    } catch (error) {
        return res.status(400).json({
            status: "error",
            message: error.message || "Didn't save the data"
        });
    }

}

const findArticles = async (req, res) => {

    try {

        const articles = await Articles.find({}).sort({ date: -1 });

        if (req.params.last) {

            articles.limit(3);

        }

        if (!articles || articles.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "No articles can be found"
            });
        }


        return res.status(200).json({
            status: "success",
            urlParameter: req.params.last,
            articles
        });
    } catch (error) {

        return res.status(500).json({
            status: "error",
            message: error.message || "An error occurred while retrieving articles"
        });
    }

}

const oneArticle = async (req, res) => {

    //get an id by the url

    let id = req.params.id;

    //find the article

    try {

        const searchedArticle = await Articles.findById(id);

        //if not
        if (!searchedArticle) {
            return res.status(404).json({
                status: "error",
                message: "No article by the provided ID can be found"
            });
        }

        //if
        return res.status(200).json({
            status: "success",
            searchedArticle
        });

    } catch (error) {

        return res.status(500).json({
            status: "error",
            message: error.message || "An error occurred while retrieving articles"
        });

    }
}

const deleteArticle = async (req, res) => {

    let articleId = req.params.id;

    try {

        let searchedArticle = await Articles.findOneAndDelete({ _id: articleId });

        //if not
        if (!searchedArticle) {
            return res.status(404).json({
                status: "error",
                message: "No article by the provided ID can be found"
            });
        }

        //if
        return res.status(200).json({
            status: "success",
            searchedArticle
        });

    } catch (error) {

        return res.status(500).json({
            status: "error",
            message: error.message || "An error occurred while retrieving articles"
        });

    }

}

const updateArticle = async (req, res) => {

    let articleId = req.params.id;

    let parameters = req.body;

    //get the new article data

    try {
        await validateArticles(parameters);
    } catch (error) {

        return res.status(400).json({

            status: "error",
            message: error.message || "Data is Missing"

        })

    }

    //update the article data
    try {

        const updatedArticle = await Articles.findOneAndUpdate({ _id: articleId }, { title: parameters.title, content: parameters.content }, // Update data
            { new: true });

        //if not
        if (!updatedArticle) {
            return res.status(404).json({
                status: "error",
                message: "No article by the provided ID can be found"
            });
        }

        //if
        return res.status(200).json({
            status: "success",
            updatedArticle
        });

    } catch (error) {

        return res.status(500).json({
            status: "error",
            message: error.message || "An error occurred while retrieving articles"
        });

    }

}

const upload = async (req, res) => {

    //get the image
    if (!req.file && !req.files) {

        return res.status(404).json({

            status: "error",
            message: "Wrong fetch"

        })

    }
    //image name
    let fileName = req.file.originalname;
    //extension of the image
    let fileSplit = fileName.split("\.");
    let fileExtension = fileSplit[1];
    //make sure of it
    if (fileExtension != "png" && fileExtension != "jpg" && fileExtension != "jpeg" && fileExtension != "gift") {

        //delete file y answer
        fs.unlink(req.file.path, (error) => {

            return res.status(400).json({

                status: "error",
                message: "Its not an image"

            });

        })
    } else {

        let articleId = req.params.id;

        //update the article data
        try {

            const updatedArticle = await Articles.findOneAndUpdate({ _id: articleId }, { image: req.file.filename }, // Update data
                { new: true });

            //if not
            if (!updatedArticle) {
                return res.status(404).json({
                    status: "error",
                    message: "No article by the provided ID can be found"
                });
            }

            //if
            return res.status(200).json({
                status: "success",
                updatedArticle
            });

        } catch (error) {

            return res.status(500).json({
                status: "error",
                message: error.message || "An error occurred while retrieving articles"
            });

        }
    }

}

const image = async (req, res) => {

    let filefolder = req.params.image;
    let pathTray = "./image/articles/" + filefolder;

    fs.stat(pathTray, (error, exist) => {

        if (exist) {

            return res.sendFile(path.resolve(pathTray));

        } else {

            return res.status(404).json({

                status: "error",
                message: "The image cant be found"

            });

        }

    });

}

const finder = async (req, res) => {

    //get the string
    let search = req.params.searched;
    //find or
    Articles.find({
        "$or": [

            { "title": { "$regex": search, "$options": "i" } },
            { "content": { "$regex": search, "$options": "i" } }

        ]
    })
        .sort({ date: -1 })
        .exec((error, foundArticlles) => {

            if (error || !foundArticles || foundArticlles.length <= 0) {

                return res.status(404).json({

                    stattus: "error",
                    message: "Articles not found"

                });

            }

            return res.staus(200).json({

                status: "succes"

            })

        })
    //give an order

    //execute

    //return

}

module.exports = {

    test,
    save,
    findArticles,
    oneArticle,
    deleteArticle,
    updateArticle,
    upload,
    image,
    finder

}