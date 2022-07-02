const { DB } = require("../Database");

exports.SortByUser =async (req, res, next) => {
    const { sort } = req.query;
   
    if (sort === "user") {
        const { data, error } = await getPromotionByUser();
      
        if (!error)
            res.status(200).json({ message: "success", data });
        else
            res.status(500).json({ message: "Server Error", error });
        return;
    }
    next();
}

exports.SortByTimePeriod =async (req, res, next) => {
    const { sort } = req.query;
    if (sort=="timeperiod") {
        const { data, error } =await getPromotionByTimePeriod();
        if (!error)
            res.status(200).json({ message: "success", data });
        else
            res.status(500).json({ message: "Server Error", error });
        return;
    }
    next();
}


exports.getAllPromotions =async (req, res) => {
    const { sort } = req.query;

    if (sort) {
        res.status(400).json({ message: "UNSUPPORTED SORT CRITERIA" });
        return;
    }

    const {data:userPromotion,error:userError }=await getPromotionByUser();
    const { data: timePeriodPromotion, error: timePeriodError } =await getPromotionByTimePeriod();
    const result = { userPromotion, timePeriodPromotion };

    if (!userError && !timePeriodError) {
        res.status(200).json({ message: "All Promotions",result});
    } else {
        res.status(500).json({ message:"Server Error", error });
    }
    
    return;
}

exports.createPromotion =async (req, res) => {
    const { type } = req.body;
    
    if (type === "by_user") {
       await  createNewUserPromotion(req, res);
    }
    if (type === "by_timeperiod") {
       await createNewTimePeriodPromotion(req,res)
    }
    return;
}



//Utilitiy Method
const getPromotionByTimePeriod = async () => {
    let result = await DB
        .from('plan')
        .select(`
            planId,
            planName,
            amount,
            benefitType,
            benefitPercentage,
            by_timeperiod_promotion!inner (*)
        `)
    return result;
}

const getPromotionByUser = async () => {
    let result= await DB
    .from('plan')
    .select(`
        planId,
        planName,
        amount,
        benefitType,
        benefitPercentage,
        by_user_promotion!inner (*)
    `)
    return result;
}

const createNewUserPromotion =async (req, res) => {
    const { planId, benefitPercentage:percentage, benefitType, maxUser, promotionName } = req.body;
        const { data, error } = await DB
        .from('by_user_promotion')
        .insert([
        { planId, percentage, benefitType, maxUser, promotionName },
        ])
       
        if (!error) {
            res.status(200).json({ message: "Promotion Added successfully", data });
            return;
        }    
        res.status(500).json({ message: "Server Error",error});
        return;
}

const createNewTimePeriodPromotion =async (req, res) => {
    const {planId, benefitPercentage:percentage,benefitType,startDate,endDate,promotionName } = req.body;
        const { data, error } = await DB
        .from('by_timeperiod_promotion')
        .insert([
        { planId, percentage,benefitType,startDate,endDate,promotionName},
        ])
       
        if (!error) {
            res.status(200).json({ message: "Promotion Added successfully", data });
            return;
        }    
        res.status(500).json({ message: "Server Error",error});
        return;
}

