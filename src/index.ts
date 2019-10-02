import { Source } from './model/source';
const easyvk = require('easyvk');
import { SOURCES } from './sources';
import { createClient, print } from 'redis';
import { News } from './model/news';

easyvk({
    username: '89119191032',
    password: 'lisaandalex112',
    session_file: __dirname + '/.my-session'
}).then(async (vk: any) => {

    // https://github.com/NodeRedis/node_redis
    const redisClient = createClient();
    redisClient.get("key", (error, value) => console.log(value));

    SOURCES.forEach(async (sourceId: string) => {

        // https://vk.com/dev/wall.get
        const { response } = await vk.call('wall.get', {
            owner_id: sourceId,
            count: 5,
            filter: 'owner'
        });

        const source = {
            id: sourceId,
            news: response.items.map((item: any) => {
                return {
                    text: item.text,
                    date: item.date
                } as News
            })
        } as Source

        console.log(source);
    });
})