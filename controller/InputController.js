exports.validatePlanData = (req, res, next) => {
    const { planName, amount, benefitPercentage, benefitType, tenure } = req.body;

    if (!planName) {
        res.status(400).json({ message: "Provide planName in Request Body" });
        return;
    } 

    if (!amount) {
        res.status(400).json({ message: "Provide amount in Request Body" });
        return;
    }

    if (!benefitPercentage) {
        res.status(400).json({ message: "Provide benefitPercentage in Request Body" });
        return;
    } 

    if (!benefitType) {
        res.status(400).json({ message: "Provide benefitType in Request Body" });
        return;
    } 

    if (!tenure) {
        res.status(400).json({ message: "Provide tenure in Request Body" });
        return;
    } 

    next();
}

exports.validatePromotionData = async (req, res,next) => {
    const { type ,planId, benefitPercentage, benefitType, promotionName } = req.body;

    if (!type) {
        res.status(400).json({ message: "Provide promotion type in request body" });
        return;
    }

    if (!benefitPercentage) {
        res.status(400).json({ message: "Provide benefitPercentage in Request Body" });
        return;
    } 

    if (!benefitType) {
        res.status(400).json({ message: "Provide benefitType in Request Body" });
        return;
    } 
    if (!planId) {
        res.status(400).json({ message: "Provide planId in Request Body" });
        return;
    } 

    if (!promotionName) {
        res.status(400).json({ message: "Provide promotionName in Request Body" });
        return;
    } 

    if (type == "by_user") {
        const { maxUser } = req.body;
        if (!maxUser) {
            res.status(400).json({ message: "Provide maxUser in Request Body" });
            return;
        }
    }

    if (type == "by_timeperiod") {
        const { startDate,endDate } = req.body;
        if (!startDate) {
            res.status(400).json({ message: "Provide startDate in Request Body" });
            return;
        }

        if (!endDate) {
            res.status(400).json({ message: "Provide endDate in Request Body" });
            return;
        }
    }
    next();
}

exports.validateSubscritionData = (req, res, next) => {
    const { type ,promotionId, userId, depositedAmount } = req.body;

    if (!type) {
        res.status(400).json({ message: "Provide promotion type in request body" });
        return;
    }

    if (!promotionId) {
        res.status(400).json({ message: "Provide promotion promotionId in request body" });
        return;
    }

    if (!userId) {
        res.status(400).json({ message: "Provide promotion userId in request body" });
        return;
    }

    if (!depositedAmount) {
        res.status(400).json({ message: "Provide promotion depositedAmount in request body" });
        return;
    }
    next()
}