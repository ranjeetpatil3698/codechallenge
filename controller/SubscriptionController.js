const { DB } = require("../Database");

exports.subscribeToPromotion =async (req, res) => {
    const { type,promotionId,userId,depositedAmount} = req.body;

    if (type == "by_user") {
        try {
            const result=await createSubscriptionByUser(req,res);
            res.status(200).json({
                message: "subscribe To user Promotion success",
                result
            });
        } catch (err) {
            res.status(400).json({
                message: "subscribe To user Promotion failed",
                error:err
            })
        }

    }
    if (type == "by_timeperiod") {
        
        try {
            const result=await createSubscriptionByTimePeriod(req,res);
            res.status(200).json({
            message: "subscribe To timeperiod Promotion success",
            result
        });
        } catch(error) {
            res.status(400).json({
                message: "subscribe To user Promotion failed",
                error
            })
        }
    }
    
}


const createSubscriptionByUser = async (req,res) => {
    const { type, promotionId, userId, depositedAmount } = req.body;
    
    //1.get promotion
    const promotionResult = await DB.from("by_user_promotion")
    .select("*").eq("promotionId", promotionId);

    const promotion = promotionResult.data[0];
    
    //2.check validity of maxuser column
    if (promotion.maxUser == 0) {
        res.status(200).json({ message: `cannot issue more promotion` });
        return;
    } 

    //3.get plan
    const planRequest = await DB.from("plan").select("*").eq("planId", promotion.planId);
    const plan = planRequest.data[0];
    

    //4.calulate reward amount
    const totalBenefitPercentage = plan.benefitPercentage + promotion.percentage;
    const rewardAmount =  (totalBenefitPercentage) / 100 * plan.amount;
    
    //5.add to customer goals and calculate reward amount;
    const customerGoal = {
        promotionId: promotion.promotionId,
        promotionType: type,
        userId: userId,
        selectedAmount: plan.amount,
        depositedAmount: depositedAmount,
        totalBenefitPercentage: totalBenefitPercentage,
        rewardAmount: rewardAmount,
        tenure: plan.tenure,
        benefitType:promotion.benefitType
    }
    

    const customerGoalRequest=await DB
        .from('customer_goals')
        .insert([customerGoal]);

    console.log(customerGoalRequest);
   
    //6.decrement the maxuser column value

    const update = await DB
        .from('by_user_promotion')
        .update({ maxUser: `${promotion.maxUser-1}` })
        .eq('maxUser', `${promotion.maxUser}`);

    return customerGoal;
}

//subscribing to promotion by time period
const createSubscriptionByTimePeriod = async (req,res) => {
    const { type, promotionId, userId, depositedAmount } = req.body;
    
    //1.get promotion
    const promotionResult = await DB.from("by_timeperiod_promotion")
    .select("*").eq("promotionId", promotionId);

    const promotion = promotionResult.data[0];
    
    //2.check date validity
    if (promotion.endDate < new Date()) {
        res.status(200).json({ message: `promotion expired` });
        return;
    } 

    if (promotion.startDate > new Date()) {
        res.status(200).json({ message: `this promotion will start on ${promotion.startDate}` });
        return;
    } 

    //3.get plan
    const planRequest = await DB.from("plan").select("*").eq("planId", promotion.planId);
    const plan = planRequest.data[0];
    

    //4.calulate reward amount
    const totalBenefitPercentage = plan.benefitPercentage + promotion.percentage;
    const rewardAmount =  (totalBenefitPercentage) / 100 * plan.amount;
    
    //5.add to customer goals and calculate reward amount;
    const customerGoal = {
        promotionId: promotion.promotionId,
        promotionType: type,
        userId: userId,
        selectedAmount: plan.amount,
        depositedAmount: depositedAmount,
        totalBenefitPercentage: totalBenefitPercentage,
        rewardAmount: rewardAmount,
        tenure: plan.tenure,
        benefitType:promotion.benefitType
    }
    

    const update=await DB
        .from('customer_goals')
        .insert([customerGoal]);

    return customerGoal;
}