import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

function Calculator({ pesticides, onSave }) {
    const [water, setWater] = useState('')
    const [ratio, setRatio] = useState('')
    const [selectedPesticide, setSelectedPesticide] = useState(pesticides[0] || '')
    const [applicatorName, setApplicatorName] = useState(() => {
        return localStorage.getItem('last_applicator') || ''
    })
    const [areaM2, setAreaM2] = useState('')
    const [notes, setNotes] = useState('')
    const [isSaving, setIsSaving] = useState(false)

    // 登録リストが変更された場合、選択内容を同期（空だった場合や、選択中のが消えた場合）
    useEffect(() => {
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

    const handleSave = async () => {
        if (!result) return
        setIsSaving(true)

        try {
            const now = new Date()
            const dateStr = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`

            // 1. LocalHistory (従来通り)
            onSave({
                date: dateStr,
                pesticide: selectedPesticide,
                water: water,
                ratio: ratio,
                result: result,
                timestamp: now.getTime()
            })

            // 2. Supabase Cloud Save
            const { error } = await supabase
                .from('spray_records')
                .insert([
                    {
                        applicator_name: applicatorName,
                        pesticide_name: selectedPesticide,
                        dilution_rate: parseFloat(ratio),
                        area_m2: parseFloat(areaM2) || 0,
                        notes: notes
                    }
                ])

            if (error) throw error

            // 成功時
            localStorage.setItem('last_applicator', applicatorName)
            alert('Supabaseに保存しました')
            setAreaM2('')
            setNotes('')
        } catch (error) {
            console.error('Error saving to Supabase:', error)
            alert('Supabaseへの保存に失敗しました: ' + error.message)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="card">
            <div className="input-group">
                <label>担当者名</label>
                <input
                    type="text"
                    placeholder="例: 山田 太郎"
                    value={applicatorName}
                    onChange={(e) => setApplicatorName(e.target.value)}
                />
            </div>

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
                <label>面積 (m²)</label>
                <input
                    type="number"
                    inputMode="decimal"
                    placeholder="例: 100"
                    value={areaM2}
                    onChange={(e) => setAreaM2(e.target.value)}
                />
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

            <div className="input-group">
                <label>メモ</label>
                <textarea
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #ddd', fontSize: '1rem' }}
                    rows="2"
                    placeholder="例: 東側の区画"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                ></textarea>
            </div>

            <div className="result-area">
                <span className="result-unit">必要な農薬量</span>
                <span className="result-value">{result ? result : '---'}</span>
                <span className="result-unit">ml</span>
            </div>

            <button
                className="btn btn-primary mt-20"
                onClick={handleSave}
                disabled={!result || isSaving}
            >
                {isSaving ? '保存中...' : '散布記録として保存する'}
            </button>
        </div>
    )
}

export default Calculator
