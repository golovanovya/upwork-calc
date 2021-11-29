import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

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
    }, []);

    const handleChange = ({ target }) => {
        const { name, value } = target;
        setForm({ ...form, [name]: value });
    };

    useEffect(() => {
        setRubles((form.amount - 1) * form.rate);
        setDollars((form.amount - 30) * form.cb);
    }, [form]);

    useEffect(() => {
        setDiff(dollars - rubles);
    }, [dollars, rubles]);

    return (
        <main>
            <div className='container'>
                <h1>Upwork withdraw calc</h1>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className='form-group'>
                        <label>Withdraw amount</label> <input className='form-control' type='number' step='0.01' name='amount' value={form.amount} onChange={handleChange} />
                    </div>
                    <div className='form-group'>
                        <label>Bank exchange rate</label> <input className='form-control' type='number' step='0.01' name='rate' value={form.rate} onChange={handleChange} />
                    </div>
                    <div className='form-group'>
                        <label>Central bank exchange rates</label> <input className='form-control' type='number' step='0.01' name='cb' value={form.cb} onChange={handleChange} />
                    </div>
                </form>
                <p>Withdraw in $: {null === dollars ? 'calculating..' : dollars}</p>
                <p>Withdraw in ₽: {null === rubles ? 'calculating..' : rubles}</p>
                <p>Diff: {null === diff ? 'calculating...' : diff}</p>
                {null !== diff && <p style={{ fontWeight: 'bold' }}>More profitable in {diff > 0 ? '$' : '₽'}</p>}
            </div>
        </main>
    )
}

export default App;
