function createCache(fn) {
    const cache = new Map();

    return function(...args) {
        console.log('Cache', cache);
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            console.log('Returned from cache');
            return cache.get(key);
        }
        const res = fn.apply(this, args);
        cache.set(serializedArgs, res);
        return res;
    }
}

function fetchData(url) {
    console.log('Fetching data from URL' + url);

    return {
        data: 'Some data',
    };
}

const cached = createCache(fetchData);

cached('https://test.com');
cached('https://test.com');
