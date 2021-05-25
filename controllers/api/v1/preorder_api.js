const User = require('../../../models/user');
const Preorder = require('../../../models/preorder');

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

//controller for cancelling user orders
module.exports.cancelOrders = async function(req, res){
    try {

        //locate user in database
        const user = await User.findById(req.user.id);
        if(user){

            //locate preorder in the database
            const preorder = await Preorder.findById(req.params.id);

            //if the order is found and not cancelled before
            if(preorder && !preorder.cancelled){

                //cancel the order
                preorder.cancelled = true;
                preorder.save();

                return res.status(200).json({
                    message: 'order cancellation successful',
                });
            }else{

                //handle already cancelled orders
                return res.status(400).json({
                    message: 'either order does not exist or it is already cancelled'
                });
            }
        }
        //handle unauthorized requests
        else{
            return res.status(401).json({
                message: 'Unauthorized',
            })
        }

    } catch (error) {
        //console error if any
        console.log('Error in getting preorders: ', error);
        return res.status(500).json({
            message: 'internal server error',
        });
    }
}
