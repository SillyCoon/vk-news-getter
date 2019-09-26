const easyvk = require('easyvk')

easyvk({
    username: '89119191032',
    password: 'lisaandalex112',
    session_file: __dirname + '/.my-session'
}).then(async vk => {

    /*
      Этот код сначала авторизует вас по логину и паролю,
      а затем отправит текстовое сообщение вам
    */

    // делаем запрос на GET api.vk.com/method/messages.send
    let { vkr } = await vk.call('wall.get', {
        owner_id: -15755094,
        count: 5
    });


    // выводим ответ сервера
    console.log(vkr);

})