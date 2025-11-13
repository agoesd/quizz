import React, { useState, useEffect } from 'react';
import { Plus, Save, Trash2, Download, Upload, Eye, Database, RotateCcw, Archive } from 'lucide-react';

const AdminPanel = () => {
  const [topics, setTopics] = useState({
    'PBJ': { name: 'Pengadaan Barang dan Jasa', subtopics: ['HPS', 'Kontrak', 'Lelang'] },
    'Hukum': { name: 'Hukum dan Peraturan', subtopics: ['Pidana', 'Perdata'] },
    'Akuntansi': { name: 'Akuntansi', subtopics: ['Dasar', 'Keuangan'] }
  });
  
  const [questions, setQuestions] = useState([]);
  const [backups, setBackups] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    id: '',
    question: '',
    options: ['', '', '', ''],
    correctIndex: 0,
    difficulty: 'mudah',
    explanation: '',
    tags: '',
    references: '',
    topic: '',
    subtopic: ''
  });
  
  const [editIndex, setEditIndex] = useState(-1);
  const [showPreview, setShowPreview] = useState(false);
  const [stats, setStats] = useState({ total: 0, mudah: 0, sedang: 0, sulit: 0 });

  // Load backups dari localStorage
  useEffect(() => {
    const savedBackups = localStorage.getItem('quiz_backups');
    if (savedBackups) {
      setBackups(JSON.parse(savedBackups));
    }
  }, []);

  // Update statistik
  useEffect(() => {
    const mudah = questions.filter(q => q.difficulty === 'mudah').length;
    const sedang = questions.filter(q => q.difficulty === 'sedang').length;
    const sulit = questions.filter(q => q.difficulty === 'sulit').length;
    
    setStats({
      total: questions.length,
      mudah,
      sedang,
      sulit
    });
  }, [questions]);

  const generateId = (topic, subtopic) => {
    const prefix = `${topic.toLowerCase()}-${subtopic.toLowerCase()}`;
    const count = questions.filter(q => q.id.startsWith(prefix)).length + 1;
    return `${prefix}-${String(count).padStart(3, '0')}`;
  };

  const handleInputChange = (field, value) => {
    setCurrentQuestion({ ...currentQuestion, [field]: value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const addQuestion = () => {
    if (!currentQuestion.question || !currentQuestion.topic || !currentQuestion.subtopic) {
      alert('Harap isi minimal pertanyaan, topik, dan subtopik!');
      return;
    }

    if (currentQuestion.options.some(opt => !opt.trim())) {
      alert('Harap isi semua pilihan jawaban!');
      return;
    }

    const id = currentQuestion.id || generateId(currentQuestion.topic, currentQuestion.subtopic);
    
    const newQuestion = {
      ...currentQuestion,
      id,
      tags: currentQuestion.tags.split(',').map(t => t.trim()).filter(t => t)
    };

    if (editIndex >= 0) {
      const updatedQuestions = [...questions];
      updatedQuestions[editIndex] = newQuestion;
      setQuestions(updatedQuestions);
      setEditIndex(-1);
    } else {
      setQuestions([...questions, newQuestion]);
    }

    resetForm();
  };

  const editQuestion = (index) => {
    const q = questions[index];
    setCurrentQuestion({
      ...q,
      tags: Array.isArray(q.tags) ? q.tags.join(', ') : q.tags
    });
    setEditIndex(index);
  };

  const deleteQuestion = (index) => {
    if (confirm('Yakin ingin menghapus soal ini?')) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const resetForm = () => {
    setCurrentQuestion({
      id: '',
      question: '',
      options: ['', '', '', ''],
      correctIndex: 0,
      difficulty: 'mudah',
      explanation: '',
      tags: '',
      references: '',
      topic: '',
      subtopic: ''
    });
  };

  const exportJSON = () => {
    const dataStr = JSON.stringify(questions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `questions-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportBySubtopic = () => {
    // Group questions by topic and subtopic
    const grouped = {};
    
    questions.forEach(q => {
      if (!grouped[q.topic]) {
        grouped[q.topic] = {};
      }
      if (!grouped[q.topic][q.subtopic]) {
        grouped[q.topic][q.subtopic] = [];
      }
      grouped[q.topic][q.subtopic].push(q);
    });

    // Create zip structure info
    let structure = "Struktur File yang akan dibuat:\n\n";
    for (const [topic, subtopics] of Object.entries(grouped)) {
      structure += `📁 ${topic}/\n`;
      for (const [subtopic, qs] of Object.entries(subtopics)) {
        structure += `  📁 ${subtopic}/\n`;
        structure += `    📄 questions.json (${qs.length} soal)\n`;
      }
    }

    alert(structure + "\n\nSilakan export per subtopik secara manual, atau gunakan fitur export all untuk mendapatkan satu file JSON.");

    // Export each subtopic
    for (const [topic, subtopics] of Object.entries(grouped)) {
      for (const [subtopic, qs] of Object.entries(subtopics)) {
        const dataStr = JSON.stringify(qs, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${topic}-${subtopic}-questions.json`;
        link.click();
        URL.revokeObjectURL(url);
      }
    }
  };

  const importJSON = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          if (Array.isArray(imported)) {
            setQuestions(imported);
            alert(`✅ Berhasil import ${imported.length} soal!`);
          } else {
            alert('❌ Format JSON tidak valid! Harus berupa array.');
          }
        } catch (err) {
          alert('❌ Error: File JSON tidak valid!');
        }
      };
      reader.readAsText(file);
    }
  };

  const createBackup = () => {
    const backup = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      questions: questions,
      totalQuestions: questions.length,
      stats: stats
    };

    const newBackups = [backup, ...backups].slice(0, 10); // Keep last 10 backups
    setBackups(newBackups);
    localStorage.setItem('quiz_backups', JSON.stringify(newBackups));
    
    alert(`✅ Backup berhasil dibuat! Total: ${questions.length} soal`);
  };

  const restoreBackup = (backupId) => {
    const backup = backups.find(b => b.id === backupId);
    if (backup) {
      if (confirm(`Restore backup dari ${new Date(backup.timestamp).toLocaleString()}?\n\nIni akan mengganti ${questions.length} soal saat ini dengan ${backup.totalQuestions} soal dari backup.`)) {
        setQuestions(backup.questions);
        alert('✅ Backup berhasil di-restore!');
      }
    }
  };

  const deleteBackup = (backupId) => {
    if (confirm('Hapus backup ini?')) {
      const newBackups = backups.filter(b => b.id !== backupId);
      setBackups(newBackups);
      localStorage.setItem('quiz_backups', JSON.stringify(newBackups));
    }
  };

  const clearAllData = () => {
    if (confirm('⚠️ PERINGATAN!\n\nIni akan menghapus SEMUA soal yang ada.\nPastikan Anda sudah membuat backup!\n\nLanjutkan?')) {
      if (confirm('Apakah Anda YAKIN? Data tidak bisa dikembalikan!')) {
        setQuestions([]);
        resetForm();
        setEditIndex(-1);
        alert('✅ Semua data telah dihapus.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Admin Panel - Input Soal Quiz</h1>
              <p className="text-gray-600 mt-1">Kelola soal quiz dengan mudah</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-indigo-600">{stats.total}</div>
              <div className="text-sm text-gray-500">Total Soal</div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Soal</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.mudah}</div>
              <div className="text-sm text-gray-600">Mudah</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{stats.sedang}</div>
              <div className="text-sm text-gray-600">Sedang</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{stats.sulit}</div>
              <div className="text-sm text-gray-600">Sulit</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <label className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 flex items-center gap-2 text-sm font-medium">
              <Upload className="w-4 h-4" />
              Import JSON
              <input type="file" accept=".json" onChange={importJSON} className="hidden" />
            </label>
            
            <button
              onClick={exportJSON}
              disabled={questions.length === 0}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center gap-2 text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Export All
            </button>

            <button
              onClick={exportBySubtopic}
              disabled={questions.length === 0}
              className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 disabled:opacity-50 flex items-center gap-2 text-sm font-medium"
            >
              <Database className="w-4 h-4" />
              Export by Subtopic
            </button>

            <button
              onClick={createBackup}
              disabled={questions.length === 0}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 disabled:opacity-50 flex items-center gap-2 text-sm font-medium"
            >
              <Archive className="w-4 h-4" />
              Create Backup
            </button>
            
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 flex items-center gap-2 text-sm font-medium"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? 'Hide' : 'Show'} JSON
            </button>

            <button
              onClick={clearAllData}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2 text-sm font-medium ml-auto"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </div>
        </div>

        {/* Backup Section */}
        {backups.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Archive className="w-5 h-5" />
              Backup History ({backups.length})
            </h2>
            <div className="space-y-2">
              {backups.map((backup) => (
                <div key={backup.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-800">
                      {new Date(backup.timestamp).toLocaleString('id-ID')}
                    </div>
                    <div className="text-sm text-gray-600">
                      {backup.totalQuestions} soal • 
                      Mudah: {backup.stats.mudah} • 
                      Sedang: {backup.stats.sedang} • 
                      Sulit: {backup.stats.sulit}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => restoreBackup(backup.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Restore
                    </button>
                    <button
                      onClick={() => deleteBackup(backup.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Input */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700">
                {editIndex >= 0 ? '✏️ Edit Soal' : '➕ Tambah Soal Baru'}
              </h2>

              {/* Topik & Subtopik */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Topik *</label>
                  <select
                    value={currentQuestion.topic}
                    onChange={(e) => handleInputChange('topic', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Pilih Topik</option>
                    {Object.entries(topics).map(([key, topic]) => (
                      <option key={key} value={key}>{topic.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtopik *</label>
                  <select
                    value={currentQuestion.subtopic}
                    onChange={(e) => handleInputChange('subtopic', e.target.value)}
                    disabled={!currentQuestion.topic}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                  >
                    <option value="">Pilih Subtopik</option>
                    {currentQuestion.topic && topics[currentQuestion.topic]?.subtopics.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ID Soal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID Soal <span className="text-gray-500 text-xs">(otomatis jika kosong)</span>
                </label>
                <input
                  type="text"
                  value={currentQuestion.id}
                  onChange={(e) => handleInputChange('id', e.target.value)}
                  placeholder="pbj-hps-001"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Pertanyaan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pertanyaan *
                </label>
                <textarea
                  value={currentQuestion.question}
                  onChange={(e) => handleInputChange('question', e.target.value)}
                  rows="3"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Tulis pertanyaan di sini..."
                />
              </div>

              {/* Pilihan Jawaban */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilihan Jawaban *
                </label>
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="radio"
                      name="correct"
                      checked={currentQuestion.correctIndex === index}
                      onChange={() => handleInputChange('correctIndex', index)}
                      className="w-4 h-4 text-green-600 cursor-pointer"
                    />
                    <span className="text-sm font-medium text-gray-600 w-6">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Pilihan ${String.fromCharCode(65 + index)}`}
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                ))}
                <p className="text-xs text-gray-500 mt-1">
                  💡 Klik radio button untuk menandai jawaban benar
                </p>
              </div>

              {/* Tingkat Kesulitan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tingkat Kesulitan *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['mudah', 'sedang', 'sulit'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => handleInputChange('difficulty', level)}
                      className={`py-2 px-4 rounded-lg font-medium transition-all ${
                        currentQuestion.difficulty === level
                          ? level === 'mudah' ? 'bg-green-500 text-white shadow-lg' :
                            level === 'sedang' ? 'bg-yellow-500 text-white shadow-lg' :
                            'bg-red-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pembahasan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pembahasan *
                </label>
                <textarea
                  value={currentQuestion.explanation}
                  onChange={(e) => handleInputChange('explanation', e.target.value)}
                  rows="4"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Jelaskan jawaban yang benar dan mengapa pilihan lain salah..."
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags <span className="text-gray-500 text-xs">(pisahkan dengan koma)</span>
                </label>
                <input
                  type="text"
                  value={currentQuestion.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder="HPS, PPK, Pengadaan"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Referensi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Referensi <span className="text-gray-500 text-xs">(opsional)</span>
                </label>
                <input
                  type="text"
                  value={currentQuestion.references}
                  onChange={(e) => handleInputChange('references', e.target.value)}
                  placeholder="Perpres 12/2021 Pasal 27"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Tombol Aksi */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={addQuestion}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  {editIndex >= 0 ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  {editIndex >= 0 ? 'Update Soal' : 'Tambah Soal'}
                </button>
                {editIndex >= 0 && (
                  <button
                    onClick={() => {
                      resetForm();
                      setEditIndex(-1);
                    }}
                    className="px-6 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600"
                  >
                    Batal
                  </button>
                )}
              </div>
            </div>

            {/* List Soal */}
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center justify-between">
                <span>📚 Daftar Soal ({questions.length})</span>
                {editIndex >= 0 && (
                  <span className="text-sm text-purple-600 font-normal">Mode Edit Aktif</span>
                )}
              </h2>
              <div className="space-y-3 max-h-[900px] overflow-y-auto pr-2">
                {questions.length === 0 ? (
                  <div className="text-center py-16 text-gray-400">
                    <Database className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Belum ada soal</p>
                    <p className="text-sm">Mulai tambahkan soal pertama Anda!</p>
                  </div>
                ) : (
                  questions.map((q, index) => (
                    <div 
                      key={index} 
                      className={`bg-gradient-to-r p-4 rounded-lg border-2 transition-all ${
                        editIndex === index
                          ? 'from-purple-50 to-indigo-50 border-purple-400 shadow-lg'
                          : 'from-gray-50 to-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-xs font-mono text-gray-500 bg-white px-2 py-0.5 rounded">
                              {q.id}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                              q.difficulty === 'mudah' ? 'bg-green-100 text-green-700' :
                              q.difficulty === 'sedang' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {q.difficulty.toUpperCase()}
                            </span>
                            <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded">
                              {q.topic} › {q.subtopic}
                            </span>
                          </div>
                          <p className="font-medium text-gray-800 line-clamp-2">{q.question}</p>
                        </div>
                        <div className="flex gap-2 ml-3">
                          <button
                            onClick={() => editQuestion(index)}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteQuestion(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                        <span className="text-green-600 font-bold">✓</span>
                        <span className="line-clamp-1">{q.options[q.correctIndex]}</span>
                      </div>
                      
                      {q.tags && q.tags.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {q.tags.map((tag, i) => (
                            <span key={i} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Preview JSON */}
        {showPreview && questions.length > 0 && (
          <div className="bg-gray-900 text-green-400 rounded-lg p-6 font-mono text-sm overflow-x-auto mt-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-bold">JSON Preview</h3>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(questions, null, 2));
                  alert('✅ JSON copied to clipboard!');
                }}
                className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
              >
                Copy
              </button>
            </div>
            <pre className="max-h-96 overflow-y-auto">{JSON.stringify(questions, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
