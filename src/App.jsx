import React, { useState, useEffect } from 'react'
import Calculator from './components/Calculator'
import PesticideManager from './components/PesticideManager'
import History from './components/History'
import SprayHistory from './components/SprayHistory'

function App() {
  const [activeTab, setActiveTab] = useState('calc')
  const [pesticides, setPesticides] = useState(() => {
    const saved = localStorage.getItem('pesticides')
    return saved ? JSON.parse(saved) : ['トレボン', 'スミチオン', 'アミスター']
  })
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('calc_history')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('pesticides', JSON.stringify(pesticides))
  }, [pesticides])

  useEffect(() => {
    localStorage.setItem('calc_history', JSON.stringify(history))
  }, [history])

  const addHistory = (item) => {
    setHistory([item, ...history])
  }

  const deleteHistory = (index) => {
    const newHistory = [...history]
    newHistory.splice(index, 1)
    setHistory(newHistory)
  }

  const clearHistory = () => {
    if (window.confirm('履歴をすべて削除しますか？')) {
      setHistory([])
    }
  }

  return (
    <div className="container">
      <header>
        <h1 style={{ textAlign: 'center', marginTop: '10px' }}>農薬希釈計算</h1>
      </header>

      <div className="tabs">
        <div
          className={`tab ${activeTab === 'calc' ? 'active' : ''}`}
          onClick={() => setActiveTab('calc')}
        >
          計算
        </div>
        <div
          className={`tab ${activeTab === 'pesticides' ? 'active' : ''}`}
          onClick={() => setActiveTab('pesticides')}
        >
          農薬管理
        </div>
        <div
          className={`tab ${activeTab === 'spray_history' ? 'active' : ''}`}
          onClick={() => setActiveTab('spray_history')}
        >
          散布履歴
        </div>
        <div
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          履歴
        </div>
      </div>

      <main>
        {activeTab === 'calc' && (
          <Calculator pesticides={pesticides} onSave={addHistory} />
        )}
        {activeTab === 'pesticides' && (
          <PesticideManager pesticides={pesticides} setPesticides={setPesticides} />
        )}
        {activeTab === 'spray_history' && (
          <SprayHistory />
        )}
        {activeTab === 'history' && (
          <History history={history} onClear={clearHistory} onDelete={deleteHistory} />
        )}
      </main>

      <footer style={{ textAlign: 'center', marginTop: '40px', fontSize: '0.8rem', color: '#999' }}>
        &copy; 2026 農薬希釈計算アプリ
      </footer>
    </div>
  )
}

export default App
