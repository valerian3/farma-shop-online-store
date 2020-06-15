const keys = require('../keys');

module.exports = function(email){
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Ваш аккаунт зареєстровано',
        html: `<h1>Вітаємо в нашому магазині</h1>
        <p>Ви успішно зареєструвалися - ${email}</p>
        <hr/>
        <a href="${keys.BASE_URL}">Магазин ліків</a>`
    }
}