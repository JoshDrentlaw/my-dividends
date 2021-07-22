import React, { useState } from 'react'
import ReactDOM from 'react-dom'

import ReactTagInput from '@pathofdev/react-tag-input'
import '@pathofdev/react-tag-input/build/index.css'
import axios from 'axios'
import numeral from 'numeral'
import { DateTime } from 'luxon'

const DashboardNav = props => {
    return (
        <>
            <ul className="nav nav-pills nav-justified flex-column flex-sm-row mb-5" id="dashboard-tabs" role="tablist">
                <li className="flex-sm-fill text-sm-center nav-item" role="presentation">
                    <button className="nav-link active" id="positions-tab" data-bs-toggle="pill" data-bs-target="#positions" type="button" role="tab" aria-controls="positions" aria-selected="true">Positions</button>
                </li>
                <li className="flex-sm-fill text-sm-center nav-item" role="presentation">
                    <button className="nav-link" id="news-articles-tab" data-bs-toggle="pill" data-bs-target="#news-articles" type="button" role="tab" aria-controls="news-articles" aria-selected="true">News</button>
                </li>
            </ul>
            <div className="tab-content" id="dashboard-tab-content">
                <div className="tab-pane fade show active" id="positions" role="tabpanel" aria-labelledby="positions-tab">
                    <TickerList tickers={props.tickers} />
                    <button id="add-tickers" className="btn btn-outline-dark mx-auto my-2 d-block" data-bs-toggle="modal" data-bs-target="#add-tickers-modal">Add tickers</button>
                </div>
                <div className="tab-pane fade" id="news-articles" role="tabpanel" aria-labelledby="news-articles-tab">
                    <Articles tickers={props.tickers} />
                </div>
            </div>
        </>
    )
}

const TickerList = props => {
    let listItems

    if (props.tickers.length > 0) {
        listItems = props.tickers.map((t, i) => (
            <li key={i} className="list-group-item">
                <div className="row align-items-center">
                    <div className="col">{t.symbol}</div>
                    <div className="col">EOD Price:<br />{numeral(t.price).format('$0,0.00')}</div>
                    <div className="col">Next dividend:<br />{t.dividends.length > 0 ? DateTime.fromISO(t.dividends[0].payment_date).toLocaleString() : '-'}</div>
                    <div className="col">Dividend Amount:<br />{t.dividends.length > 0 ? numeral(t.dividends[0].dividend_amount).format('$0.00[00]') : '-'}</div>
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

const Articles = props => {
    return (
        <div className="d-flex align-items-start">
            <div className="nav flex-column nav-pills me-5" id="article-tabs" role="tablist" aria-orientation="vertical">
                {props.tickers.map((t, i) => (
                    <button key={t.symbol} className={(i === 0 ? "active " : "") + "nav-link"} id={t.symbol + "-tab"} data-bs-toggle="pill" data-bs-target={"#" + t.symbol} type="button" role="tab" aria-controls={t.symbol} aria-selected="true">{t.symbol}</button>
                ))}
            </div>
            <div className="tab-content" id="articles-tab-content">
                {props.tickers.map((t, i) => {
                    const articles = t.articles.map((a, j) => (
                        <div key={j + i + t.symbol} className="mb-5">
                            {/* <img src={a.url + a.image} alt="article image" className="ratio ratio-16x9" /> */}
                            <h3>{a.headline} <small>{DateTime.fromISO(a.published_at).toLocaleString()}</small></h3>
                            <p>{a.summary}</p>
                            <a href={a.url} target="_blank">See the full story at {a.source}</a> {parseInt(a.has_paywall) ? '' : '<span className="badge bg-success">Free</span>'}
                        </div>
                    ))
                    return (
                        <div key={i + t.symbol} className={(i === 0 ? "show active " : "") + "tab-pane fade"} id={t.symbol} role="tabpanel" aria-labelledby={t.symbol + "-tab"}>
                            {articles}
                        </div>
                    )
                })}
            </div>
        </div>
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
                        <DashboardNav tickers={this.state.tickers} />
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