async function wait(n) {
    return new Promise((res, rej) => setTimeout(res, n))
}

async function main() {
    const arr = [5, 4, 1, 3, 2];
    for (let i of arr) {
        console.log(i);
        await wait(i * 100);
    }
    process.exit(100);
}

main();