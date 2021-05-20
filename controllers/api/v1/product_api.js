const Dealership = require('../../../models/dealership');

module.exports.locateDealerships = async function(req, res){
    try {

        //filter the dealerships based on city
        let dealerships = await Dealership.find({city:req.body.city});

        return res.status(200).json({
            message: 'the following dealerships are present at your location',
            data: {
                dealerships: dealerships,
            }
        })

    } catch (error) {
        
        //console error if any
        console.log('Error in locating dealerships: ',error);
        return res.status(500).json({
            message: 'internal server error',
        });
    }

}