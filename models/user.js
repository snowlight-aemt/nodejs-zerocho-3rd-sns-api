const { STRING } = require('sequelize');
const Sequelize = require('sequelize');

class User extends Sequelize.Model {
    static initiate(sequelize) {
        // 모델(테이블) 정보들
        // 모델 관계
        User.init({
            email: {
                type: Sequelize.STRING(40),
                allowNull: true,
                unique: true,
            },
            nick: {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            provider: {
                type: Sequelize.ENUM('local', 'kakao'),
                allowNull: false,
                defaultValue: 'local',
            },
            snsId: {
                type: Sequelize.STRING(30),
                allowNull: true,
            }
        }, {
            // 관계 유효성 
            sequelize,
            timestamps: true, // createdAt, updateAt 칼럼 추가
            underscored: false, // true: created_at, update_dt
            modelName: 'User', // 자바스크립트에서 쓰는 이름.
            tableName: 'users', // DB table 이름
            paranoid: true, // deletedAt 유저 삭제일자 true : soft delete , false ; hard delete
            charset: 'utf8', // 이모티콘 utf8mb4
            collate: 'utf8_general_ci' // 정렬
        });
    }
    
    // 테이블에 관계는 asociate 에서 정의한다.
    static associate(db) {
        db.User.hasMany(db.Post);
        db.User.belongsToMany(db.User, { // 팔로워
            foreignKey: 'followingId',
            as: 'Followers',
            through: 'Follow',
        });
        db.User.belongsToMany(db.User, { // 팔로잉
            foreignKey: 'followerId',
            as: 'Followings',
            through: 'Follow',
        })
    }
}

module.exports = User;