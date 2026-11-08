function getMoney(amount) {
    const bills = [2000, 1000, 500, 200, 100, 50];
    const res = new Map();

    for (let i=0; i<bills.length; i++) {
        if (amount < bills[i]) continue;

        res.set(bills[i], Math.floor(amount / bills[i]));
        amount = amount % bills[i]
    }
    
    return res;
}

getMoney(6200)
