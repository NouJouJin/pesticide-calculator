import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

function SprayHistory() {
    const [records, setRecords] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchRecords = async () => {
        setIsLoading(true)
        try {
            const { data, error } = await supabase
                .from('spray_records')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setRecords(data)
        } catch (err) {
            console.error('Error fetching records:', err)
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchRecords()
    }, [])

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
    }

    if (error) {
        return (
            <div className="card">
                <p style={{ color: '#ff5252', textAlign: 'center' }}>エラーが発生しました: {error}</p>
                <button className="btn btn-outline" onClick={fetchRecords}>再試行</button>
            </div>
        )
    }

    return (
        <div className="card">
            <div className="flex-between" style={{ marginBottom: '20px' }}>
                <h2>散布記録 (Supabase)</h2>
                <button
                    className="btn btn-outline"
                    style={{ width: 'auto', padding: '8px 15px' }}
                    onClick={fetchRecords}
                    disabled={isLoading}
                >
                    {isLoading ? '更新中...' : '更新'}
                </button>
            </div>

            {isLoading ? (
                <p style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}>読み込み中...</p>
            ) : records.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}>記録はありません</p>
            ) : (
                <ul className="history-list">
                    {records.map((r) => (
                        <li key={r.id} className="history-item">
                            <div className="history-meta">
                                {formatDate(r.created_at)} | 担当: {r.applicator_name || '未設定'}
                            </div>
                            <div className="history-calc" style={{ fontSize: '1.2rem', margin: '5px 0' }}>
                                {r.pesticide_name}: {r.dilution_rate}倍
                            </div>
                            <div className="flex-between">
                                <span style={{ fontSize: '0.9rem', color: '#666' }}>
                                    面積: {r.area_m2} m²
                                </span>
                                {r.notes && (
                                    <span style={{ fontSize: '0.8rem', color: '#888', fontStyle: 'italic' }}>
                                        注: {r.notes}
                                    </span>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default SprayHistory
