const keys = require('../keys');

module.exports = function(email, token){
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject:'Відновлення доступу',
        html: `
            <h1>Ви забули пароль</h1>
            <p>Якщо ні, то проігноруйте це повідомлення</p>
            <p>Інакше нажміть на посилання нижче</p>
            <p><a href="${keys.BASE_URL}/auth/password/${token}">Відновити доступ</a></p>   
            <hr/>
            <a href="${keys.BASE_URL}">Магазин ліків</a> 
        `
    }
}