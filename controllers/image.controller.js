class ImageController {
    static async getImage(req, res) {
        const url = req.headers.host;
        const { path } = req.query;
        if(path){
            res.send(`${url}/${path}`)
        }
    }
}

module.exports = ImageController;
