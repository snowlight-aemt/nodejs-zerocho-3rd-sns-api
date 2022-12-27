const User = require('../models/user');
const Domain = require('../models/domain');
const Post = require('../models/post');
const Hashtag = require('../models/hashtag');

const jwt = require('jsonwebtoken');

exports.createToken = async (req, res) => {
    const { clientSecret } = req.body;

    try {
        const domain = await Domain.findOne({
            where: { clientSecret },
            include: [{
                model: User,
                attributes: ['id', 'nick']
            }]
        });

        if (!domain) {
            return res.status(401).json({
                code: 401,
                message: '등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요.',
            });
        }

        const token = jwt.sign({
            id: domain.User.id,
            nick: domain.User.nick,
        }, process.env.JWT_SECRET, {
            expiresIn: '30m',
            issuer: 'nodebird',
        });

        return res.json({
            code: 200,
            message: '토큰 발급되었습니다.',
            token,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: '서버 에러',
        });
    }

};

exports.tokenTest = async (req, res) => {
    res.json(res.locals.decoded);
}

exports.getMyPosts = async (req, res, next) => {
    console.log(`user : ${req.user}`);
    console.dir(`decoded : ${res.locals.decoded}`);
    try {
        const posts = await Post.findAll({
            where: { userId: res.locals.decoded.id }
        });
        return res.status(200).json({
            code: 200,
            payload: posts,
        });
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: '서버 에러',
        });
    }
};

exports.getPostsByHashtag = async (req, res, next) => {
    try {
        const hashtag = await Hashtag.findOne({
            where: { title: req.params.title }
        });
        if (!hashtag) {
            return res.status(404).json({
                code: 404,
                message: '검색 결과가 없습니다.',
            });
        }

        const posts = await hashtag.getPosts();
        if (posts.length === 0) {
            return res.status(404).json({
                code: 404,
                message: '검색 결과가 없습니다.',
            });
        }

        return res.status(200).json({
            code: 200,
            payload: posts,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: '서버 에러',
        })        
    }
}

// ----
// const hashtag = await Hashtag.findOne({
//     where: { title: req.params.title }
// });
// const posts = await hashtag.getPosts();

// SELECT `id`, `title`, `createdAt`, `updatedAt` FROM `hashtags` AS `Hashtag` WHERE `Hashtag`.`title` = 'Node';
//
// SELECT `Post`.`id`, `Post`.`content`, `Post`.`img`, `Post`.`createdAt`, `Post`.`updatedAt`, `Post`.`UserId`, `Hashtags`.`id` AS `Hashtags.id`, `Hashtags`.`title` AS `Hashtags.title`, `Hashtags`.`createdAt` AS `Hashtags.createdAt`, `Hashtags`.`updatedAt` AS `Hashtags.updatedAt`, `Hashtags->PostHashtag`.`createdAt` AS `Hashtags.PostHashtag.createdAt`, `Hashtags->PostHashtag`.`updatedAt` AS `Hashtags.PostHashtag.updatedAt`, `Hashtags->PostHashtag`.`HashtagId` AS `Hashtags.PostHashtag.HashtagId`, `Hashtags->PostHashtag`.`PostId` AS `Hashtags.PostHashtag.PostId`
// FROM `posts` AS `Post`
// INNER JOIN
//     `PostHashtag` AS `Hashtags->PostHashtag`
// INNER JOIN `hashtags` AS `Hashtags`
// ON `Hashtags`.`id` = `Hashtags->PostHashtag`.`HashtagId`
// ON `Post`.`id` = `Hashtags->PostHashtag`.`PostId`
// AND `Hashtags`.`title` = 'node'
//


// ----
// const posts = await Post.findAll({
//     include: {
//         model: Hashtag,
//         where: { title: hashtag.title },
//     }
// });

// SELECT `id`, `title`, `createdAt`, `updatedAt` FROM `hashtags` AS `Hashtag` WHERE `Hashtag`.`title` = 'Node';
// SELECT `Post`.`id`, `Post`.`content`, `Post`.`img`, `Post`.`createdAt`, `Post`.`updatedAt`, `Post`.`UserId`, `PostHashtag`.`createdAt` AS `PostHashtag.createdAt`, `PostHashtag`.`updatedAt` AS `PostHashtag.updatedAt`, `PostHashtag`.`HashtagId` AS `PostHashtag.HashtagId`, `PostHashtag`.`PostId` AS `PostHashtag.PostId`
// FROM `posts` AS `Post`
// INNER JOIN `PostHashtag` AS `PostHashtag`
// ON `Post`.`id` = `PostHashtag`.`PostId`
// AND `PostHashtag`.`HashtagId` = 1;