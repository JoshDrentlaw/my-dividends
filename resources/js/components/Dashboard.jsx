import React, { useState, useRef, PureComponent } from 'react'
import ReactDOM from 'react-dom'

import { WithContext as ReactTags } from 'react-tag-input'
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, LineChart, Line, BarChart, Bar, LabelList, Label, CartesianGrid, XAxis, YAxis } from 'recharts'
import axios from 'axios'
import numeral from 'numeral'
import { DateTime } from 'luxon'
import { data } from 'autoprefixer'

let accounts = userAccounts

const delimiters = [32, 188]

const DashboardNav = props => {
    return (
        <>
            <ul className="nav nav-pills nav-justified flex-column flex-sm-row mb-3">
                {props.accounts.map((a, i) => {
                    const active = i === 0 ? ' active' : '',
                        id = a.account_name.replaceAll(' ', '-') + '-' + a.account_location.replaceAll(' ', '-')

                    return (
                        <li className="flex-sm-fill text-sm-center nav-item" role="presentation" key={'account-' + id} onClick={() => props.setAccount(a)}>
                            <button className={"nav-link" + active} id={id + "-tab"} data-bs-toggle="pill" data-bs-target={"#" + id} type="button" role="tab" aria-controls={id} aria-selected="true">
                                {a.account_name}
                                <small className="d-block">({a.account_location})</small>
                            </button>
                        </li>
                    )
                })}
            </ul>
            <div className="tab-content" id="dashboard-account-content">
                {props.accounts.map((a, i) => {
                    const active = i === 0 ? ' show active' : '',
                        id = a.account_name.replaceAll(' ', '-') + '-' + a.account_location.replaceAll(' ', '-')

                    return (
                        <div key={'account-container-' + id} className={"tab-pane fade" + active} id={id} role="tabpanel" aria-labelledby={id + "-tab"}>
                            <ul className="nav nav-pills nav-justified flex-column flex-sm-row mb-5" id="dashboard-tabs" role="tablist">
                                <li className="flex-sm-fill text-sm-center nav-item" role="presentation">
                                    <button className="nav-link active" id={id + "-positions-tab"} data-bs-toggle="pill" data-bs-target={"#" + id + "-positions"} type="button" role="tab" aria-controls={id + "-positions"} aria-selected="true">Positions</button>
                                </li>
                                <li className="flex-sm-fill text-sm-center nav-item" role="presentation">
                                    <button className="nav-link" id={id + "-articles-tab"} data-bs-toggle="pill" data-bs-target={"#" + id + "-articles"} type="button" role="tab" aria-controls={id + "-articles"} aria-selected="true">Articles</button>
                                </li>
                                <li className="flex-sm-fill text-sm-center nav-item" role="presentation">
                                    <button className="nav-link" id={id + "-charts-tab"} data-bs-toggle="pill" data-bs-target={"#" + id + "-charts"} type="button" role="tab" aria-controls={id + "-charts"} aria-selected="true">Charts</button>
                                </li>
                            </ul>
                            <div className="tab-content" id="dashboard-position-content">
                                <div className="tab-pane fade show active" id={id + "-positions"} role="tabpanel" aria-labelledby={id + "-positions-tab"}>
                                    <PositionList positions={a.positions} />
                                    <div className="my-3">
                                        <button id="add-positions" className="btn btn-outline-dark me-3" data-bs-toggle="modal" data-bs-target="#add-positions-modal">Add positions</button>
                                        <button id="upload-spreadsheets" className="btn btn-outline-dark" data-bs-toggle="modal" data-bs-target="#upload-spreadsheets-modal">Upload Spreadsheets</button>
                                    </div>
                                </div>
                                <div className="tab-pane fade" id={id + "-articles"} role="tabpanel" aria-labelledby={id + "-articles-tab"}>
                                    <Articles positions={a.positions} />
                                </div>
                                <div className="tab-pane fade" id={id + "-charts"} role="tabpanel" aria-labelledby={id + "-charts-tab"} style={{ width: '100%', height: 500 }}>
                                    <Charts positions={a.positions} id={id} />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

const AddFirstAccount = props => {
    const [name, setName] = useState(false)
    const [location, setLocation] = useState('Choose account location')

    const fileInput = useRef(null)

    const uploadSpreadsheet = () => {
        const files = new FormData()

        files.append('spreadsheet', fileInput.current.files[0])
        files.append('source', location)
        axios({
            method: 'post',
            url: 'positions/upload_spreadsheets',
            data: files,
            headers: { 'Content-Type': 'multipart/formdata' }
        })
            .then(res => {
                console.log(res)
                props.completeSpreadsheetUpload(res.data.accounts)
            })
    }

    const validate = () => {
        if (name && location !== 'Choose account location') {
            props.addAccount(name, location)
        }
    }

    return (
        <>
            <h1 className="text-center">No Accounts...</h1>
            <h2>So...</h2>
            <p className="mt-4">Select an account location.</p>
            <select name="location" id="" className="form-select" value={location} onChange={({ target: { value } }) => setLocation(value)}>
                <option value="Choose account location" disabled>Choose account location</option>
                <option value="Fidelity">Fidelity</option>
                <option value="M1 Finance">M1 Finance</option>
                <option value="Acorns">Acorns</option>
            </select>
            <h2 className="mt-4">And...</h2>
            <p className="mt-4">Add an account.</p>
            <div className="input-group">
                <input type="text" name="account_name" id="account-name" className="form-control" aria-describedby="account-submit" onChange={({ target: { value } }) => setName(value)} placeholder="Enter account name" />
                <button className="btn btn-outline-dark" id="account-submit" type="button" onClick={() => validate()}>Submit</button>
            </div>
            <h2 className="text-center mt-4">Or...</h2>
            <p className="mt-4">Upload a CSV and our system will pull all accounts and symbols for that account.</p>
            <p>Make sure your CSV has column headers named "Account Name" and "Symbol".</p>
            <p>If it has a column called "Quantity", it will pick that up as well if the symbol in that row is new.</p>
            <div className="input-group">
                <input type="file" className="form-control" id="file-upload-0" accept=".csv" aria-label="Upload" ref={fileInput} />
                <button className="btn btn-outline-dark" id="account-submit" type="button" onClick={() => uploadSpreadsheet()}>Submit</button>
            </div>
            <div className="form-text">We never save your files or use any other data that we didn't describe above. Once we grab your data from the file, we delete it from our server.</div>
        </>
    )
}

const PositionList = props => {
    const positions = props.positions
    let listItems

    if (positions.length > 0) {
        listItems = positions.map((t, i) => (
            <li key={'symbol' + i} className="list-group-item">
                <div className="row align-items-center">
                    <div className="col">{t.symbol}</div>
                    <div className="col">EOD Price:<br />{numeral(t.price).format('$0,0.00')}</div>
                    <div className="col">Next dividend:<br />{t.dividends.length > 0 ? DateTime.fromISO(t.dividends[0].paymentDate).toLocaleString() : '-'}</div>
                    <div className="col">Dividend Ex-Date:<br />{t.dividends.length > 0 ? DateTime.fromISO(t.dividends[0].exDate).toLocaleString() : '-'}</div>
                    <div className="col">Dividend Amount:<br />{t.dividends.length > 0 ? numeral(t.dividends[0].amount).format('$0.00[00]') : '-'}</div>
                </div>
            </li>
        ))
    } else {
        listItems = <li key="1" className="list-group-item"><h3>No positions...</h3></li>
    }

    return (
        <ul className="list-group list-group-flush">
            {listItems}
        </ul>
    )
}

const Articles = props => {
    const positions = props.positions

    if (positions) {
        return (
            <div className="d-flex align-items-start">
                <div className="nav flex-column nav-pills me-5" id="article-tabs" role="tablist" aria-orientation="vertical">
                    {positions.map((t, i) => (
                        <button key={'articles-' + t.symbol} className={(i === 0 ? "active " : "") + "nav-link"} id={t.symbol + "-tab"} data-bs-toggle="pill" data-bs-target={"#" + t.symbol} type="button" role="tab" aria-controls={t.symbol} aria-selected="true">{t.symbol}</button>
                    ))}
                </div>
                <div className="tab-content" id="articles-tab-content">
                    {positions.map((t, i) => {
                        const articles = t.articles.map((a, j) => (
                            <div key={'article-' + t.symbol} className="mb-5">
                                {/* <img src={a.url + a.image} alt="article image" className="ratio ratio-16x9" /> */}
                                <h3>{a.headline} <small>{DateTime.fromISO(a.published_at).toLocaleString()}</small></h3>
                                <p>{a.summary}</p>
                                <a href={a.url} target="_blank">See the full story at {a.source}</a> {parseInt(a.has_paywall) ? '' : '<span className="badge bg-success">Free</span>'}
                            </div>
                        ))
                        return (
                            <div key={'article-container-' + t.symbol} className={(i === 0 ? "show active " : "") + "tab-pane fade"} id={t.symbol} role="tabpanel" aria-labelledby={t.symbol + "-tab"}>
                                {articles}
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    } else {
        return (
            <p>No positions...</p>
        )
    }
}

const Charts = ({ positions, id }) => {
    return (
        <div className="d-flex align-items-start"/*  style={{ width: '100%', height: '100%' }} */>
            <div className="nav flex-column nav-pills me-5" id="chart-tabs" role="tablist" aria-orientation="vertical">
                <button className="nav-link active" id={id + "-diversity-tab"} data-bs-toggle="pill" data-bs-target={`#${id}-diversity`} type="button" role="tab" aria-controls={id + "-diversity"} aria-selected="true">Diversity</button>
                <button className="nav-link" id={id + "-this-month-tab"} data-bs-toggle="pill" data-bs-target={`#${id}-this-month`} type="button" role="tab" aria-controls={id + "-this-month"} aria-selected="true">Ex-Date</button>
            </div>
            <div className="tab-content" id="charts-tab-content" style={/* { width: '100%', height: '100%' } */{ margin: 'auto' }}>
                <div className="tab-pane show active fade" id={id + "-diversity"} role="tabpanel" aria-labelledby={id + "-diversity-tab"} style={{ width: '100%', height: '100%' }}>
                    <Diversity positions={positions} />
                </div>
                <div className="tab-pane" id={id + "-this-month"} role="tabpanel" aria-labelledby={id + "-this-month-tab"} style={{ width: '100%', height: '100%' }}>
                    <ExDate positions={positions} />
                </div>
            </div>
        </div>
    )
}

const Diversity = ({ positions }) => {
    const totalShares = positions.reduce((a, v) => numeral(v.shares).add(a).value(), 0),
        percents = positions.map(p => {
            const percent = parseFloat(numeral(p.shares).divide(totalShares).multiply(100).value().toFixed(1))
            return { name: p.symbol, value: percent }
        }).filter(p => p.value > 0),
        formatter = ({ value }) => `${value}%`
    console.log(percents)

    return (
        <ResponsiveContainer minWidth="500px" minHeight="500px">
            <PieChart>
                <Pie
                    dataKey="value"
                    nameKey="name"
                    data={percents}
                    label={formatter}
                >
                    {percents.map((p, i) => (
                        <Cell key={`diversity-cell-${i}`} fill={`hsl(${i * 45}deg 70% 20%)`} />
                    ))}
                    <LabelList dataKey="name" />
                </Pie>
                <Tooltip />
                <Legend content={() => "Share percentage of account portfolio"} />
            </PieChart>
        </ResponsiveContainer>
    )
}

const ExDate = ({ positions }) => {
    const thisMonth = DateTime.now().toFormat('M'),
        today = parseInt(DateTime.now().toFormat('d')),
        first = parseInt(DateTime.now().startOf('month').toFormat('d')),
        last = parseInt(DateTime.now().endOf('month').toFormat('d')),
        domain = [first, last]
    let divsThisMonth = today === first ? [{ date: first }] : [{ date: first }, { date: today }]

    positions.forEach(p => {
        if (p.dividends.length > 0) {
            p.dividends.forEach(d => {
                const date = d.exDate
                if (DateTime.fromISO(date).toFormat('M') === thisMonth) {
                    divsThisMonth.push({
                        name: p.symbol,
                        label: DateTime.fromISO(date).toFormat('DD'),
                        y: 0,
                        date: parseInt(DateTime.fromISO(date).toFormat('d'))
                    })
                }
            })
        }
    })
    divsThisMonth.push({ date: last })
    divsThisMonth.sort((a, b) => a.date - b.date)

    return (
        <ResponsiveContainer minWidth="700px" minHeight="300px">
            <LineChart data={divsThisMonth}>
                <CartesianGrid />
                <Line dataKey="y" dot={today} name="Dividend Ex-Date" />
                <YAxis dataKey="y" domain={[-1, 1]} hide={true} />
                <XAxis
                    dataKey="date"
                    scale="time"
                    type="number"
                    domain={domain}
                    tickLine={false}
                    tickFormatter={time => DateTime.fromFormat(time.toString(), 'd').toFormat('DD')}
                />
                <Tooltip
                    labelFormatter={(v, p) => {
                        // console.log('label formatter:', v, p)
                        return p.length > 0 ? 'Symbol: ' + p[0].payload.name : ''
                    }}
                    formatter={(v, n, p) => {
                        // console.log('formatter:', p)
                        return p.payload ? p.payload.label : v
                    }}
                />
                <Legend />
            </LineChart>
        </ResponsiveContainer>
    )
}

const UploadSpreadsheetsModal = props => {
    const [files, setFiles] = useState(new Blob)
    const [uploadSource, setUploadSource] = useState('Choose source')

    const fileInput = useRef(null)

    const uploadSpreadsheet = () => {
        const files = new FormData()

        files.append('spreadsheet', fileInput.current.files[0])
        files.append('source', uploadSource)
        axios({
            method: 'post',
            url: 'positions/upload_spreadsheets',
            data: files,
            headers: { 'Content-Type': 'multipart/formdata' }
        })
            .then(res => {
                console.log(res)
            })
    }

    return (
        <div className="modal" tabIndex="-1" id="upload-spreadsheets-modal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Upload Spreadsheets</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <p>Choose a file and a file source. You will not be able to upload without choosing a file source.</p>
                        <p>Our system will only grab data for accounts it finds inside your spreadsheets. You must have a column labeled "Account Name" in your file, and the value must match an active account attached to your profile.</p>
                        <div className="input-group mb-3">
                            <input type="file" className="form-control" id="file-upload-0" aria-label="Upload" ref={fileInput} />
                            <button type="button" className="btn btn-outline-dark dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
                                <span className="visually-hidden">Toggle Dropdown</span>
                            </button>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item" href="#" onClick={() => setUploadSource('Fidelity')}>Fidelity</a></li>
                                <li><a className="dropdown-item" href="#" onClick={() => setUploadSource('M1 Finance')}>M1 Finance</a></li>
                                <li><a className="dropdown-item" href="#" onClick={() => setUploadSource('Acorns')}>Acorns</a></li>
                            </ul>
                            <label className="input-group-text" >{uploadSource}</label>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-outline-primary" onClick={() => uploadSpreadsheet()}>Sumbit</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const AddPositionModal = props => {
    const [tags, setTags] = useState([])

    const addTags = (newTag) => {
        newTag = {
            text: newTag.text.toUpperCase(),
            id: newTag.id.toUpperCase()
        }
        setTags([...tags, newTag])
    }

    const deleteTag = (idx) => {
        setTags(tags.filter((t, i) => i !== idx))
    }

    const submitTags = () => {
        props.setPositions(tags)
        setTags([])
    }

    return (
        <div className="modal" tabIndex="-1" id="add-positions-modal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add Positions</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <p>This is where you can add Position Symbols to your account.</p>
                        <p>Any Symbols you add will be tracked by the app, and you will get daily updates after EOD data is available.</p>
                        <p>Add Symbols and then click submit below.</p>
                        <div className="w-100">
                            <ReactTags
                                placeholder="Press comma or space to add a tag"
                                inline={true}
                                inputFieldPosition="inline"
                                tags={tags}
                                handleAddition={tag => addTags(tag)}
                                handleDelete={i => deleteTag(i)}
                                allowDragDrop={false}
                                delimiters={delimiters}
                                classNames={{
                                    tagInputField: 'form-control',
                                    tag: 'btn btn-dark btn-sm d-inline me-1',
                                    remove: 'btn btn-dark badge ms-2 mb-3'
                                }}
                            />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-outline-primary" onClick={submitTags}>submit</button>
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
            account: accounts.length > 0 ? accounts[0] : {},
            accounts: accounts,
            positions: accounts.length > 0 ? accounts[0].positions : []
        }
    }

    componentDidMount() {
        this.freshData()
    }

    componentDidUpdate() {
    }

    freshData = (state = this.state.accounts) => {
        if (state.length > 0) {
            const uniqueSymbols = [],
                allSymbols = state.map(a => a.positions.map(p => p.symbol)).reduce((a, v) => a.concat(v), []).filter(s => {
                    if (!uniqueSymbols.includes(s)) {
                        uniqueSymbols.push(s)
                        return s
                    }
                }).join(',')

            axios.get(
                `${iex_url}stock/market/batch`,
                {
                    params: {
                        types: 'price,dividends',
                        symbols: allSymbols,
                        token: iex_key
                    }
                }
            )
                .then(({ data }) => {
                    const accounts = state.map(a => {
                        a.positions = a.positions.map(p => {
                            const symData = data[p.symbol]
                            p.price = symData.price
                            p.dividends = symData['dividends']
                            p.articles = []
                            return p
                        })
                        return a
                    })

                    this.setState({ accounts, account: accounts[0], positions: accounts[0].positions })
                })
        }
    }

    addAccount = (account, location) => {
        axios.post(
            '/accounts/create_account',
            {
                account_name: account,
                account_location: location
            }
        ).then(res => {
            this.setState({ account, accounts: [...res.data] })
        })
    }

    setPositions = (positions) => {
        axios.post(
            '/positions/store_user_positions',
            {
                symbols: positions.map(p => p.text),
                account: this.state.account
            }
        ).then(res => {
            const positions = res.data,
                account = { ...this.state.account, positions }
            this.setState({
                positions,
                account,
                accounts: [...this.state.accounts.filter(a => a.id !== account.id), account]
            })
            const modal = document.getElementById('add-positions-modal')
            const $modal = bootstrap.Modal.getInstance(modal)
            $modal.hide()
        })
    }

    completeSpreadsheetUpload = (accounts) => {
        this.freshData(accounts)
    }

    render() {
        return (
            <>
                <div className="mx-auto w-50 card shadow-sm" style={{ minHeight: '500px' }}>
                    <div className="card-body text-center">
                        {this.state.accounts.length > 0
                            ? <DashboardNav
                                setAccount={(account) => this.setState({ account, positions: account.positions })}
                                accounts={this.state.accounts}
                                positions={this.state.positions}
                            />
                            : <AddFirstAccount completeSpreadsheetUpload={this.completeSpreadsheetUpload} />
                        }
                    </div>
                </div>
                <AddPositionModal setPositions={(positions) => this.setPositions(positions)} />
                <UploadSpreadsheetsModal />
            </>
        )
    }
}

ReactDOM.render(
    <Dashboard />,
    document.getElementById('dashboard')
)