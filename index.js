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
    // '-78242229',
    // '-23877091',
    // '-35068738',
    // '-20169232',
    // '-61920119',
];

const SOURCE_NAMES = [
    'Бумага',
    'Медуза',
    'Фонтанка',
    'РБК',
    'ЛентаРу',
    'Дождь',
    'Вести24',
    'Коммерсантъ',
    'СвободныеНовости',
    'РоссийскаяГазета'
];



async function main() {
    let vk = await easyvk({
        username: '89119191032',
        password: 'lisaandalex112',
        session_file: __dirname + '/.my-session'
    });
    const hundred = makeHundred();
    let globalBuffer = [];

    for (let sourceId of SOURCE_IDS) {
        let buffer = [];
        for (let j of hundred) {
            const response = await vk.call('wall.get', {
                owner_id: sourceId,
                offset: j * 100,
                count: 100,
                filter: 'owner'
            });
            const source = mapResponseToSource(response, sourceId);
            console.log(j);
            buffer.push(...source);
            await waitFor10MS(1);
        }
        globalBuffer.push(...buffer);

        console.log('writing...');
        writeToCSV(buffer, sourceId);
    }
    console.log('writing to global...');
    writeToCSV(globalBuffer, null);
    writeToJSON(buffer, 'global');

    process.exit(100);



    function writeToCSV(source, sourceId) {
        const csvHeader = [
            { id: 'id', title: "ID" },
            { id: 'text', title: "Text" },
            { id: 'date', title: "Date" },
        ]
        
        sourceId = sourceId ? sourceId * -1 : 'global'

        const writer = createCsvWriter({
            path: `output/csv/${sourceId}.csv`,
            header: csvHeader
        });
    
        writer.writeRecords(source).then(() => console.log(`${sourceId}.csv записан`));
    }
}

main();

function makeHundred() {
    const hundred = []
    for (let a = 0; a <= 100; a++) {
        hundred.push(a);
    }
    return hundred;
}

async function waitFor10MS(j) {
    return new Promise((res, rej) => setTimeout(res, 10 * j))
}

function mapResponseToSource(response, sourceId) {
    const source =
        response.vkr.items.map((item) =>
            ({
                id: -1 * sourceId,
                text: item.text.replace(/\n/g, '').replace(/,/g, ''),
                date: new Date(item.date * 1000).toISOString()
            })
        )
    return source;
}



function writeToJSON(source, id) {
    const sourceJSON = JSON.stringify(source);
    fs.writeFile(`output/${id}.json`, sourceJSON, (error) => {
        if (error) {
            console.warn(error);
        } else {
            console.log(id + ' ' + 'записан в JSON');
        }
    })
}