const Dealership = require('../../../models/dealership');

module.exports.addDealership = async function(req, res){
    try {
         //check if the dealership already exists in the database
        let dealership = await Dealership.findOne({name: req.body.name});
        console.log(dealership);
        if(dealership){
            return res.status(409).json({
                message: 'a dealership with that name already exists in the database, try again with a different name'
            });
        }

        //if no dealership exists by the name, create new dealership
        let newDealership = await Dealership.create({
            name: req.body.name,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            pincode: req.body.pincode,
            phone: req.body.phone
        });

        return res.status(200).json({
            message: 'new dealership record created in the database',
            data: {
                dealership: newDealership,
            }
        });
    } catch (error) {
        
        //console error if any
        console.log('Error in adding new dealership: ',error);
        return res.status(500).json({
            message: 'internal server error',
        });
    }
}