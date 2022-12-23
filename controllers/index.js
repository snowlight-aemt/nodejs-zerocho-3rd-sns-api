const { User, Domain } = require('../models');
const { v4: uuidv4 } = require('uuid');

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

exports.createDomain = async (req, res, next) => {
    try {
        await Domain.create({
            UserId: req.user.id,
            host: req.body.host,
            type: req.body.type,
            clientSecret: uuidv4(),
        });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
}