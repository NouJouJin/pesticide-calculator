import React, { useState } from 'react'

function PesticideManager({ pesticides, setPesticides }) {
    const [newName, setNewName] = useState('')

    const handleAdd = () => {
        if (newName.trim()) {
            setPesticides([...pesticides, newName.trim()])
            setNewName('')
        }
    }

    const handleDelete = (index) => {
        if (window.confirm('この農薬を削除しますか？')) {
            const newList = pesticides.filter((_, i) => i !== index)
            setPesticides(newList)
        }
    }

    return (
        <div className="card">
            <h2>農薬の登録</h2>
            <div className="input-group" style={{ display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    placeholder="農薬名を入力"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
                <button className="btn btn-primary" style={{ width: 'auto' }} onClick={handleAdd}>追加</button>
            </div>

            <h3 style={{ marginTop: '20px' }}>登録済みリスト</h3>
            <ul className="history-list">
                {pesticides.map((p, i) => (
                    <li key={i} className="history-item flex-between">
                        <span>{p}</span>
                        <button
                            className="btn btn-outline"
                            style={{ width: 'auto', padding: '5px 15px', color: '#ff5252', borderColor: '#ff5252' }}
                            onClick={() => handleDelete(i)}
                        >
                            削除
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default PesticideManager
