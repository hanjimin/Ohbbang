// MySQL AUTO_INCREMENT와 같은 속성 구현하기 위한 서버 전용 Collection
_AutoIncrement = new Mongo.Collection("_AutoIncrement");

/**
 * 주어진 키값에 대한 AUTO_INCREMENT 값을 구한다.
 * 없는 키값의 경우 새로 AUTO_INCREMENT를 생성한다.
 * @param {String} key 키값
 * @returns {Number} 주어진 키값에 대한 AUTO_INCREMENT 값
 */
getAutoIncrement = function (key) {
    check(key, String);
    var autoIncrement = _AutoIncrement.findOne({_id: key});
    if (!autoIncrement) {
        _AutoIncrement.insert({_id: key, value: 0});
        autoIncrement = _AutoIncrement.findOne({_id: key});
    }

    if (!autoIncrement) throw new Error("create-autoincrement-failed");

    _AutoIncrement.update({_id: key}, {$inc: {value: 1}});
    return autoIncrement.value;
};