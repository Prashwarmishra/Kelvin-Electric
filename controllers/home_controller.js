module.exports.home = function(req, res){
    return res.status(200).json({
        message: 'Kelvin Electric home page',
    });
}