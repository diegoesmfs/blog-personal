const validator = require("validator");

const validateArticles = async (parameters) => {



    let validateTitle = !validator.isEmpty(parameters.title) && validator.isLength(parameters.title, { min: 5, max: 25 });
    let validateContent = !validator.isEmpty(parameters.content);

    if (!validateTitle || !validateContent) {
        throw new Error("There are missing parameters");
    }


}

module.exports = {

    validateArticles

}