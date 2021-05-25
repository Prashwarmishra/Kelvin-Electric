const User = require('../../../models/user');

//controller to view user orders
module.exports.viewOrders = async function(req, res){
    try {
        //find the user in db and populate the preorders
        const preorders = await User.findById(req.user.id).populate('preorders');
        
        return res.status(200).json({
            message: 'successfully fetched user orders',
            data: {
                preorders: preorders,
            }
        })
    } catch (error) {
        //console error if any
        console.log('Error in getting preorders: ', error);
        return res.status(500).json({
            message: 'internal server error',
        });
    }
}
