import React, { useState } from 'react'
import ReactDOM from 'react-dom'

import ReactTagInput from '@pathofdev/react-tag-input'
import '@pathofdev/react-tag-input/build/index.css'
import axios from 'axios'
import numeral from 'numeral'
import { DateTime } from 'luxon'

const TickerList = props => {
    let listItems

    if (props.tickers.length > 0) {
        listItems = props.tickers.map((t, i) => (
            <li key={i} className="list-group-item">
                <div className="row align-items-center">
                    <div className="col">{t.symbol}</div>
                    <div className="col">EOD Price:<br />{numeral(t.price).format('$0,0.00')}</div>
                    <div className="col">Next dividend:<br />{t.dividends.length > 0 ? DateTime.fromISO(t.dividends[0].payment_date).toLocaleString() : '-'}</div>
                    <div className="col">Dividend Amount:<br />{t.dividends.length > 0 ? numeral(t.dividends[0].dividend_amount).format('$0.0000') : '-'}</div>
                </div>
            </li>
        ))
    } else {
        listItems = <li key="1" className="list-group-item"><h3>No tickers...</h3></li>
    }

    return (
        <ul className="list-group list-group-flush">
            {listItems}
        </ul>
    )
}

const AddTickerModal = props => {
    const [tags, setTags] = useState([])

    const addTags = (newTags) => {
        newTags = newTags.map(t => t.toUpperCase())
        setTags(newTags)
    }

    return (
        <div className="modal" tabIndex="-1" id="add-tickers-modal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add Tickers</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <p>This is where you can add Ticker Symbols to your account.</p>
                        <p>Any Symbols you add will be tracked by the app, and you will get daily updates after EOD data is available.</p>
                        <p>Add Symbols and then click submit below.</p>
                        <ReactTagInput tags={tags} onChange={addTags} />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary" onClick={() => props.setTickers(tags)}>Sumbit</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

class Dashboard extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            tickers: tickers
        }
    }

    componentDidUpdate() {
        console.log(this.state)
    }

    setTickers = (tickers) => {
        axios.get(
            `${iex_url}stock/market/batch`,
            {
                params: {
                    types: 'price,upcoming-dividends',
                    symbols: tickers.join(','),
                    token: iex_key
                }
            }
        )
            .then(({ data }) => {
                axios.post(
                    '/tickers/store_user_tickers',
                    {
                        tickers: data
                    }
                ).then(res => {
                    this.setState({ tickers: [...res.data, ...this.state.tickers] })
                    const modal = document.getElementById('add-tickers-modal')
                    const $modal = bootstrap.Modal.getInstance(modal)
                    $modal.hide()
                })
            })
    }

    render() {
        return (
            <>
                <div className="mx-auto w-50 card shadow-sm">
                    <div className="card-body text-center">
                        <TickerList tickers={this.state.tickers} />
                        <button id="add-tickers" className="btn btn-outline-dark mx-auto my-2 d-block" data-bs-toggle="modal" data-bs-target="#add-tickers-modal">Add tickers</button>
                    </div>
                </div>
                <AddTickerModal tickers={this.state.tickers} setTickers={(tickers) => this.setTickers(tickers)} />
            </>
        )
    }
}

ReactDOM.render(
    <Dashboard />,
    document.getElementById('dashboard')
)