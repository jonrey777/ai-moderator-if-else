const Cron = (data, fn, second) => {
    const timeInterval = 1000 * second;
    setInterval(() => {
        fn(data);
    }, timeInterval);
};


module.exports = Cron;