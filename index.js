const easyvk = require('easyvk');
const fs = require('fs');

const SOURCE_IDS = [
    '-23303030',
    '-76982440',
    '-18901857',
    '-25232578',
    '-67991642',
    '-17568841',
    '-24136539',
    '-23482909',
    '-364976',
    '-23304496',
    '-78242229',
    '-23877091',
    '-35068738',
    '-20169232',
    '-61920119',
];

easyvk({
    username: '89119191032',
    password: 'lisaandalex112',
    session_file: __dirname + '/.my-session'
}).then(async (vk) => {
    // https://vk.com/dev/wall.get
    SOURCE_IDS.forEach(async (sourceId, i) => {
        if (i % 5 === 0) {
            setTimeout( async () => {
                const response = await vk.call('wall.get', {
                    owner_id: sourceId,
                    count: 100000,
                    filter: 'owner'
                });
                const source = mapResponseToSource(response, sourceId);
                writeToFile(source, sourceId);
            }, 10000);
        } else {
            const response = await vk.call('wall.get', {
                owner_id: sourceId,
                count: 100000,
                filter: 'owner'
            });
            const source = mapResponseToSource(response, sourceId);
            writeToFile(source, sourceId);
        }
    });
});

function mapResponseToSource(response, sourceId) {
    const source = {
        id: sourceId,
        news: response.vkr.items.map((item) =>
            ({
                text: item.text,
                date: item.date
            })
        )
    }
    return source;
}

function writeToFile(source, id) {
    const sourceJSON = JSON.stringify(source);
    fs.writeFile(`output/${id}.json`, sourceJSON, (error) => {
        if (error) {
            console.warn(error);
        } else {
            console.log(id + ' ' + 'записан');
        }
    })
}