const { User, Domain } = require('../models');

exports.renderLogin = async (req, res, next) => {
    try {
        // where 옵션에 undefined 가 들어가면 된다 그래서 없으면 null 이 될 수 있게.
        const user = await User.findOne({ where: { id: req.user?.id || null }, include: { model: Domain } });
        res.render('login', {
            user,
            domains: user?.Domains,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.createDomain = (req, res, next) => {
    try {

    } catch (error) {
        console.error(error);
        next(error);
    }
}