import React, { useState } from 'react'

function Calculator({ pesticides, onSave }) {
    const [water, setWater] = useState('')
    const [ratio, setRatio] = useState('')
    const [selectedPesticide, setSelectedPesticide] = useState(pesticides[0] || '')

    // 登録リストが変更された場合、選択内容を同期（空だった場合や、選択中のが消えた場合）
    React.useEffect(() => {
        if (!pesticides.includes(selectedPesticide)) {
            setSelectedPesticide(pesticides[0] || '')
        }
    }, [pesticides])

    const calculateResult = () => {
        const w = parseFloat(water)
        const r = parseFloat(ratio)
        if (isNaN(w) || isNaN(r) || r === 0) return null
        // ml = (L * 1000) / ratio
        return ((w * 1000) / r).toFixed(1)
    }

    const result = calculateResult()

    const handleSave = () => {
        if (!result) return
        const now = new Date()
        const dateStr = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`

        onSave({
            date: dateStr,
            pesticide: selectedPesticide,
            water: water,
            ratio: ratio,
            result: result,
            timestamp: now.getTime()
        })
        alert('保存しました')
    }

    return (
        <div className="card">
            <div className="input-group">
                <label>農薬を選択</label>
                <select
                    value={selectedPesticide}
                    onChange={(e) => setSelectedPesticide(e.target.value)}
                >
                    {pesticides.map((p, i) => (
                        <option key={i} value={p}>{p}</option>
                    ))}
                </select>
            </div>

            <div className="input-group">
                <label>水の量 (リットル)</label>
                <input
                    type="number"
                    inputMode="decimal"
                    placeholder="例: 10"
                    value={water}
                    onChange={(e) => setWater(e.target.value)}
                />
            </div>

            <div className="input-group">
                <label>希釈倍率 (倍)</label>
                <div className="quick-buttons">
                    <button className="quick-btn" onClick={() => setRatio('500')}>500倍</button>
                    <button className="quick-btn" onClick={() => setRatio('1000')}>1000倍</button>
                    <button className="quick-btn" onClick={() => setRatio('2000')}>2000倍</button>
                </div>
                <input
                    type="number"
                    inputMode="numeric"
                    placeholder="例: 1000"
                    value={ratio}
                    onChange={(e) => setRatio(e.target.value)}
                />
            </div>

            <div className="result-area">
                <span className="result-unit">必要な農薬量</span>
                <span className="result-value">{result ? result : '---'}</span>
                <span className="result-unit">ml</span>
            </div>

            <button
                className="btn btn-primary mt-20"
                onClick={handleSave}
                disabled={!result}
            >
                結果を保存する
            </button>
        </div>
    )
}

export default Calculator
