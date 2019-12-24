const easyvk = require('easyvk');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

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

const csvHeader = [
    { id: 'id', title: "ID" },
    { id: 'date', title: "Date" },
    { id: 'text', title: "Text" }
]

easyvk({
    username: '89119191032',
    password: 'lisaandalex112',
    session_file: __dirname + '/.my-session'
}).then(async (vk) => {
    // https://vk.com/dev/wall.get
    SOURCE_IDS.forEach(async (sourceId, i) => {
        if (i % 5 === 0) {
            setTimeout(async () => {
                const response = await vk.call('wall.get', {
                    owner_id: sourceId,
                    count: 100000,
                    filter: 'owner'
                });
                const source = mapResponseToSource(response, sourceId);
                writeToCSV(source, sourceId);
            }, 10000);
        } else {
            const response = await vk.call('wall.get', {
                owner_id: sourceId,
                count: 100000,
                filter: 'owner'
            });
            const source = mapResponseToSource(response, sourceId);
            writeToCSV(source, sourceId);
        }
    });
});

function mapResponseToSource(response, sourceId) {
    const source =
        response.vkr.items.map((item) =>
            ({
                id: sourceId,
                text: item.text.replace(/\n/g, '').replace(/,/g, ''),
                date: new Date(item.date * 1000).toISOString()
            })
        )
    return source;
}

function writeToCSV(source, id) {
    const writer = createCsvWriter({
        path: `output/csv/${id}.csv`,
        header: csvHeader
    });

    writer.writeRecords(source).then(() => console.log(`${id}.scv записан`));
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