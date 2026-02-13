import React from 'react'

function History({ history, onClear, onDelete }) {

    const downloadCSV = () => {
        if (history.length === 0) return

        const headers = ['日付', '農薬名', '水量(L)', '倍率(倍)', '必要量(ml)']
        const rows = history.map(h => [
            h.date,
            h.pesticide,
            h.water,
            h.ratio,
            h.result
        ])

        const content = [
            headers.map(h => `"${h}"`).join(','),
            ...rows.map(r => r.map(v => `"${v}"`).join(','))
        ].join('\n')

        // Add BOM for Excel UTF-8
        const bom = new Uint8Array([0xEF, 0xBB, 0xBF])
        const blob = new Blob([bom, content], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.setAttribute('href', url)
        link.setAttribute('download', `pesticide_history_${new Date().toISOString().slice(0, 10)}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="card">
            <div className="flex-between" style={{ marginBottom: '20px' }}>
                <h2>計算履歴</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        className="btn btn-outline"
                        style={{ width: 'auto', padding: '8px 15px' }}
                        onClick={downloadCSV}
                        disabled={history.length === 0}
                    >
                        CSV保存
                    </button>
                    <button
                        className="btn btn-outline"
                        style={{ width: 'auto', padding: '8px 15px', borderColor: '#ff5252', color: '#ff5252' }}
                        onClick={onClear}
                        disabled={history.length === 0}
                    >
                        全削除
                    </button>
                </div>
            </div>

            {history.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}>履歴はありません</p>
            ) : (
                <ul className="history-list">
                    {history.map((h, i) => (
                        <li key={i} className="history-item">
                            <div className="flex-between">
                                <div>
                                    <div className="history-meta">{h.date}</div>
                                    <div className="history-calc">
                                        {h.pesticide}: {h.water}L × {h.ratio}倍
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div className="result-value" style={{ fontSize: '1.5rem', marginBottom: 0 }}>
                                        {h.result} <span style={{ fontSize: '0.8rem' }}>ml</span>
                                    </div>
                                    <button
                                        onClick={() => onDelete(i)}
                                        style={{ background: 'none', border: 'none', color: '#ff5252', fontSize: '0.8rem', cursor: 'pointer' }}
                                    >
                                        削除
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default History
