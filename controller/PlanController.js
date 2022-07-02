const { DB } = require("../Database");

exports.createPlan = async (req, res) => {
    
    const { planName, amount, benefitPercentage, benefitType, tenure } = req.body;
    
    const { data, error } = await DB
    .from('plan')
    .insert([
    { planName,amount, benefitPercentage, benefitType,tenure},
    ])
   
    if (!error) {
        res.status(200).json({ message: "plan added successfully", data });
        return;
    }

    res.status(500).json({ message: "Server Error"});
   
}

exports.getAllPlans =async (req, res) => {
    let {data,error} = await DB
        .from('plan')
        .select("*");
    if (!error) {
        res.status(200).json({ message: " createPromotion success" ,data});
        return;
    }

    if (!data) {
        res.status(500).json({ message: "Server Error",error });
        return;
    }
    
}

