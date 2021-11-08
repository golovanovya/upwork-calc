import React, { useEffect, useState } from 'react';

const defaults = {
    amount: 500,
    rate: 69,
    cb: 71
}

const App = () => {
    const [form, setForm] = useState(defaults);
    const [dollars, setDollars] = useState(null);
    const [rubles, setRubles] = useState(null);
    const [diff, setDiff] = useState(null);

    useEffect(() => {
        fetch("https://api.allorigins.win/get?url=https://www.cbr.ru/scripts/XML_daily.asp")
            .then(response => response.text())
            .then(data => {
                const parsed = data.match(/USD(?:.*?)<Value>(.*?)<\/Value>/);
                if (parsed.length > 1) {
                    setForm({ ...form, cb: parseFloat(parsed[1].replace(',', '.')) });
                }
            });
    }, [])

    const handleChange = ({ target }) => {
        const { name, value } = target;
        setForm({ ...form, [name]: value });
    }

    useEffect(() => {
        setRubles((form.amount - 1) * form.rate);
        setDollars((form.amount - 30) * form.cb);
    }, [form]);

    useEffect(() => {
        setDiff(dollars - rubles);
    }, [dollars, rubles]);

    return (
        <main>
            <div>
                <div>
                    <label>Сумма вывода</label> <input type='number' step='0.01' name='amount' value={form.amount} onChange={handleChange} />
                    <label>Курс банка</label> <input type='number' step='0.01' name='rate' value={form.rate} onChange={handleChange} />
                    <label>Курс ЦБ</label> <input type='number' step='0.01' name='cb' value={form.cb} onChange={handleChange} />
                </div>
                <p>Вывод в долларах: {null === dollars ? 'подсчёт..' : dollars}</p>
                <p>Вывод в рублях: {null === rubles ? 'подсчёт..' : rubles}</p>
                <p>Разница: {null === diff ? 'подсчёт...' : diff}</p>
                {null !== diff && <p>Выгоднее в {diff > 0 ? 'долларах' : 'рублях'}</p>}
            </div>
        </main>
    )
}

export default App;
