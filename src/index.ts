const easyvk = require('easyvk');
import { SOURCES } from './sources';
import { RedisClient } from 'redis';

easyvk({
    username: '89119191032',
    password: 'lisaandalex112',
    session_file: __dirname + '/.my-session'
}).then(async (vk: any) => {

    /*
      Этот код сначала авторизует вас по логину и паролю,
      а затем отправит текстовое сообщение вам
    */

    // делаем запрос на GET api.vk.com/method/messages.send

    SOURCES.forEach(async (source: string) => {
        const { vkr } = await vk.call('wall.get', {
            owner_id: source,
            count: 5,
            filter: 'ovner'
        });

        const result = { id: source, texts: vkr.items.map((item: any) => item.text)} ;
        console.log(result);
    });
})