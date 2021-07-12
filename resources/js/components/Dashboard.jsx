import React, { useState } from 'react'
import ReactDOM from 'react-dom'

import ReactTagInput from '@pathofdev/react-tag-input'
import '@pathofdev/react-tag-input/build/index.css'

const TickerList = props => {
    let listItems
    if (props.tickers) {
        listItems = props.tickers.map(t => (
            <li className="list-group-item">{t.symbol}</li>
        ))
    } else {
        listItems = <li className="list-group-item"><h3>No tickers...</h3></li>
    }

    return (
        <ul className="list-group list-group-flush">
            {listItems}
        </ul>
    )
}

const AddTickerModal = props => {
    const [tags, setTags] = useState(props.tickers)

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
                        <button type="button" className="btn btn-primary" onClick={() => props.setTickers(tags)}>Save changes</button>
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
            tickers: []
        }
    }

    componentDidUpdate() {
        console.log(this.state)
    }

    setTickers = (tickers) => {
        this.setState({ tickers })
    }

    render() {
        return (
            <>
                <div className="mx-auto w-25 card shadow-sm">
                    <div className="card-body text-center">
                        <TickerList tickers={this.props.tickers} />
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