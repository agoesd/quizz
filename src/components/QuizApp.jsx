import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Trophy, RotateCcw, BookOpen, Clock, Settings, Shuffle, Filter } from 'lucide-react';

const QuizApp = ({ user }) => {
  // Simulasi database - Di production bisa diganti dengan fetch dari file JSON
  const quizDatabase = {
    "PBJ": {
      name: "Pengadaan Barang dan Jasa",
      subtopics: {
        "HPS": {
          name: "Harga Perkiraan Sendiri",
          questions: [
            {
              id: "pbj-hps-1",
              question: "Apa yang dimaksud dengan HPS dalam pengadaan barang/jasa?",
              options: ["Harga Penawaran Supplier", "Harga Perkiraan Sendiri", "Harga Pasar Standar", "Harga Pemerintah Setempat"],
              correctIndex: 1,
              difficulty: "mudah",
              explanation: "HPS (Harga Perkiraan Sendiri) adalah perkiraan harga barang/jasa yang ditetapkan oleh PPK berdasarkan survei harga pasar setempat."
            },
            {
              id: "pbj-hps-2",
              question: "Siapa yang berwenang menetapkan HPS?",
              options: ["Panitia Pengadaan", "PPK (Pejabat Pembuat Komitmen)", "Direktur Perusahaan", "Bendahara"],
              correctIndex: 1,
              difficulty: "mudah",
              explanation: "PPK adalah pihak yang berwenang menetapkan HPS setelah melakukan survei harga pasar."
            },
            {
              id: "pbj-hps-3",
              question: "Berapa toleransi harga penawaran terhadap HPS?",
              options: ["60%-90%", "70%-100%", "80%-110%", "90%-120%"],
              correctIndex: 2,
              difficulty: "sedang",
              explanation: "Harga penawaran wajar adalah 80%-110% dari HPS menurut Perpres 12/2021."
            },
            {
              id: "pbj-hps-4",
              question: "Apa yang dilakukan jika penawaran melebihi pagu?",
              options: ["Gugurkan semua", "Negosiasi", "Sesuaikan HPS dan ulang", "Tambah pagu"],
              correctIndex: 2,
              difficulty: "sulit",
              explanation: "Harus menyesuaikan HPS dan mengulang proses lelang jika semua penawaran melebihi pagu."
            }
          ]
        },
        "Kontrak": {
          name: "Kontrak Pengadaan",
          questions: [
            {
              id: "pbj-kontrak-1",
              question: "Apa itu kontrak lump sum?",
              options: ["Harga satuan", "Harga pasti tetap", "Harga berubah", "Tanpa jaminan"],
              correctIndex: 1,
              difficulty: "mudah",
              explanation: "Kontrak lump sum adalah kontrak dengan harga pasti dan tetap untuk seluruh pekerjaan."
            },
            {
              id: "pbj-kontrak-2",
              question: "Berapa denda maksimal keterlambatan?",
              options: ["3%", "5%", "7%", "10%"],
              correctIndex: 1,
              difficulty: "sedang",
              explanation: "Denda maksimal keterlambatan adalah 5% dari nilai kontrak."
            },
            {
              id: "pbj-kontrak-3",
              question: "Apa fungsi jaminan pelaksanaan?",
              options: ["Bayar uang muka", "Jamin kesungguhan", "Pengganti termin", "Biaya admin"],
              correctIndex: 1,
              difficulty: "mudah",
              explanation: "Jaminan pelaksanaan menjamin kesungguhan penyedia menyelesaikan pekerjaan."
            },
            {
              id: "pbj-kontrak-4",
              question: "Kapan force majeure dapat diklaim?",
              options: ["Kerugian penyedia", "Kejadian luar biasa", "Harga naik", "Penyedia mundur"],
              correctIndex: 1,
              difficulty: "sulit",
              explanation: "Force majeure untuk kejadian luar biasa di luar kendali para pihak."
            }
          ]
        }
      }
    },
    "Hukum": {
      name: "Hukum dan Peraturan",
      subtopics: {
        "Pidana": {
          name: "Hukum Pidana",
          questions: [
            {
              id: "hukum-pidana-1",
              question: "Apa itu delik dalam hukum pidana?",
              options: ["Perbuatan dilarang UU", "Hukuman penjara", "Proses sidang", "Surat dakwaan"],
              correctIndex: 0,
              difficulty: "mudah",
              explanation: "Delik adalah perbuatan yang dilarang undang-undang dan diancam pidana."
            },
            {
              id: "hukum-pidana-2",
              question: "Berapa daluwarsa penuntutan pidana >3 tahun?",
              options: ["6 tahun", "12 tahun", "18 tahun", "Tidak ada"],
              correctIndex: 1,
              difficulty: "sulit",
              explanation: "Menurut KUHP Pasal 78, daluwarsa penuntutan adalah 12 tahun untuk pidana >3 tahun."
            }
          ]
        },
        "Perdata": {
          name: "Hukum Perdata",
          questions: [
            {
              id: "hukum-perdata-1",
              question: "Apa itu wanprestasi?",
              options: ["Prestasi baik", "Tidak penuhi kewajiban", "Batal sepihak", "Ganti rugi PMH"],
              correctIndex: 1,
              difficulty: "mudah",
              explanation: "Wanprestasi adalah tidak memenuhi kewajiban dalam perjanjian."
            },
            {
              id: "hukum-perdata-2",
              question: "Beda jual beli dan sewa?",
              options: ["Tidak ada", "Jual beli ada perpindahan hak", "Jual beli lebih mahal", "Sewa hanya barang gerak"],
              correctIndex: 1,
              difficulty: "sedang",
              explanation: "Jual beli ada perpindahan hak milik, sewa hanya hak pakai sementara."
            }
          ]
        }
      }
    }
  };

  const [gameState, setGameState] = useState('setup');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedSubtopics, setSelectedSubtopics] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState(['mudah', 'sedang', 'sulit']);
  const [isRandomMode, setIsRandomMode] = useState(true);
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);
  
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(600);

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          saveQuizHistory();
          setGameState('result');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, score, questions.length]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const getAvailableQuestions = () => {
    let allQuestions = [];

    if (isRandomMode) {
      const topic = quizDatabase[selectedTopic];
      Object.values(topic.subtopics).forEach(subtopic => {
        allQuestions = [...allQuestions, ...subtopic.questions];
      });
    } else {
      const topic = quizDatabase[selectedTopic];
      selectedSubtopics.forEach(subtopicKey => {
        if (topic.subtopics[subtopicKey]) {
          allQuestions = [...allQuestions, ...topic.subtopics[subtopicKey].questions];
        }
      });
    }

    allQuestions = allQuestions.filter(q => selectedDifficulty.includes(q.difficulty));
    return allQuestions;
  };

  const startQuiz = () => {
    const availableQuestions = getAvailableQuestions();
    
    if (availableQuestions.length === 0) {
      alert('Tidak ada soal yang tersedia dengan filter yang dipilih!');
      return;
    }

    const shuffled = shuffleArray(availableQuestions);
    const selected = shuffled.slice(0, Math.min(numberOfQuestions, shuffled.length));
    
    setQuestions(selected);
    setCurrentQuestion(0);
    setScore(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setTimeRemaining(600);
    setGameState('playing');
  };

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    const isCorrect = index === questions[currentQuestion].correctIndex;
    
    setAnswers([...answers, {
      question: currentQuestion,
      selected: index,
      correct: questions[currentQuestion].correctIndex,
      isCorrect
    }]);

    if (isCorrect) {
      setScore(score + 1);
    }
    
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      saveQuizHistory();
      setGameState('result');
    }
  };

  const saveQuizHistory = () => {
    if (!user || questions.length === 0) return;
    
    const historyData = {
      topic: quizDatabase[selectedTopic]?.name || selectedTopic,
      subtopics: isRandomMode ? 'Semua Subtopik' : selectedSubtopics.join(', '),
      score,
      total: questions.length,
      percentage: Math.round((score / questions.length) * 100),
      date: new Date().toLocaleString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      difficulty: selectedDifficulty.join(', '),
      timestamp: Date.now()
    };

    const storageKey = `quiz_history_${user.username}`;
    const existingHistory = localStorage.getItem(storageKey);
    const historyArray = existingHistory ? JSON.parse(existingHistory) : [];
    
    historyArray.unshift(historyData);
    
    const limitedHistory = historyArray.slice(0, 50);
    localStorage.setItem(storageKey, JSON.stringify(limitedHistory));
  };

  const resetQuiz = () => {
    setGameState('setup');
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCurrentQuestion(0);
    setScore(0);
    setAnswers([]);
  };

  const toggleSubtopic = (subtopicKey) => {
    if (selectedSubtopics.includes(subtopicKey)) {
      setSelectedSubtopics(selectedSubtopics.filter(s => s !== subtopicKey));
    } else {
      setSelectedSubtopics([...selectedSubtopics, subtopicKey]);
    }
  };

  const toggleDifficulty = (diff) => {
    if (selectedDifficulty.includes(diff)) {
      if (selectedDifficulty.length > 1) {
        setSelectedDifficulty(selectedDifficulty.filter(d => d !== diff));
      }
    } else {
      setSelectedDifficulty([...selectedDifficulty, diff]);
    }
  };

  // Halaman Setup
  if (gameState === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-3xl w-full">
          <div className="text-center mb-8">
            <Settings className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Pengaturan Quiz</h1>
            <p className="text-gray-600">Pilih topik, subtopik, dan tingkat kesulitan soal</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">1. Pilih Topik:</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(quizDatabase).map(([key, topic]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedTopic(key);
                    setSelectedSubtopics([]);
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedTopic === key
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="font-semibold">{topic.name}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {Object.keys(topic.subtopics).length} subtopik
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedTopic && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">2. Mode Soal:</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsRandomMode(true)}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    isRandomMode
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <Shuffle className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-semibold">Random dari Semua Subtopik</div>
                </button>
                <button
                  onClick={() => setIsRandomMode(false)}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    !isRandomMode
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <Filter className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-semibold">Pilih Subtopik Tertentu</div>
                </button>
              </div>
            </div>
          )}

          {selectedTopic && !isRandomMode && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">3. Pilih Subtopik:</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(quizDatabase[selectedTopic].subtopics).map(([key, subtopic]) => (
                  <button
                    key={key}
                    onClick={() => toggleSubtopic(key)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedSubtopics.includes(key)
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{subtopic.name}</div>
                        <div className="text-sm text-gray-500">{subtopic.questions.length} soal</div>
                      </div>
                      {selectedSubtopics.includes(key) && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedTopic && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {isRandomMode ? '3' : '4'}. Tingkat Kesulitan:
              </label>
              <div className="flex gap-3">
                {['mudah', 'sedang', 'sulit'].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => toggleDifficulty(diff)}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                      selectedDifficulty.includes(diff)
                        ? diff === 'mudah' ? 'bg-green-500 text-white' :
                          diff === 'sedang' ? 'bg-yellow-500 text-white' :
                          'bg-red-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedTopic && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {isRandomMode ? '4' : '5'}. Jumlah Soal:
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={numberOfQuestions}
                onChange={(e) => setNumberOfQuestions(parseInt(e.target.value) || 1)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none"
              />
              <p className="text-sm text-gray-500 mt-2">
                Total soal tersedia: {getAvailableQuestions().length}
              </p>
            </div>
          )}

          {selectedTopic && (isRandomMode || selectedSubtopics.length > 0) && (
            <button
              onClick={startQuiz}
              disabled={getAvailableQuestions().length === 0}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Mulai Quiz
            </button>
          )}
        </div>
      </div>
    );
  }

  // Halaman Hasil
  if (gameState === 'result') {
    const percentage = (score / questions.length) * 100;
    const timeTaken = 600 - timeRemaining;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-3xl w-full max-h-screen overflow-y-auto">
          <div className="text-center mb-6">
            <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Selesai!</h2>
            <div className="text-6xl font-bold text-purple-600 my-4">
              {score}/{questions.length}
            </div>
            <p className="text-xl text-gray-600">Skor Anda: {percentage.toFixed(0)}%</p>
            <p className="text-gray-500 mt-2">Waktu: {formatTime(timeTaken)}</p>
            <p className="text-lg text-gray-600 mt-3 font-semibold">
              {percentage >= 80 ? "🎉 Luar biasa!" : 
               percentage >= 60 ? "👍 Bagus!" : 
               "💪 Terus berlatih!"}
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <h3 className="font-bold text-gray-800 text-xl border-b-2 border-purple-500 pb-2">
              Pembahasan:
            </h3>
            {answers.map((answer, idx) => (
              <div key={idx} className="bg-gray-50 p-5 rounded-xl border-l-4 border-gray-300">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-xs text-purple-600 font-semibold mb-1">
                      {questions[answer.question].difficulty.toUpperCase()} • Soal {idx + 1}
                    </p>
                    <p className="font-semibold text-gray-800">
                      {questions[answer.question].question}
                    </p>
                  </div>
                  {answer.isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 ml-2" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 ml-2" />
                  )}
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className={`p-3 rounded-lg ${answer.isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                    <p className="text-sm text-gray-600">Jawaban Anda:</p>
                    <p className={`font-medium ${answer.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                      {questions[answer.question].options[answer.selected]}
                    </p>
                  </div>
                  
                  {!answer.isCorrect && (
                    <div className="p-3 rounded-lg bg-green-100">
                      <p className="text-sm text-gray-600">Jawaban Benar:</p>
                      <p className="font-medium text-green-700">
                        {questions[answer.question].options[answer.correct]}
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                  <p className="text-sm font-semibold text-blue-800 mb-1">💡 Pembahasan:</p>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {questions[answer.question].explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={resetQuiz}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <RotateCcw className="w-5 h-5" />
            Quiz Baru
          </button>
        </div>
      </div>
    );
  }

  // Halaman Quiz
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold text-gray-500">
              Pertanyaan {currentQuestion + 1}/{questions.length}
            </span>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                questions[currentQuestion].difficulty === 'mudah' ? 'bg-green-100 text-green-700' :
                questions[currentQuestion].difficulty === 'sedang' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {questions[currentQuestion].difficulty.toUpperCase()}
              </span>
              <span className="text-sm font-semibold text-purple-600">
                Skor: {score}
              </span>
              <div className="flex items-center gap-1 text-sm font-semibold text-orange-600">
                <Clock className="w-4 h-4" />
                {formatTime(timeRemaining)}
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {questions[currentQuestion].question}
        </h2>

        <div className="space-y-3 mb-6">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={selectedAnswer !== null}
              className={`w-full p-4 text-left rounded-lg font-medium transition-all ${
                selectedAnswer === null
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-800 hover:shadow-md'
                  : selectedAnswer === index
                  ? index === questions[currentQuestion].correctIndex
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-red-500 text-white shadow-lg'
                  : index === questions[currentQuestion].correctIndex
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {selectedAnswer !== null && (
                  <>
                    {index === questions[currentQuestion].correctIndex && (
                      <CheckCircle className="w-5 h-5" />
                    )}
                    {selectedAnswer === index && index !== questions[currentQuestion].correctIndex && (
                      <XCircle className="w-5 h-5" />
                    )}
                  </>
                )}
              </div>
            </button>
          ))}
        </div>

        {showExplanation && (
          <div className="bg-blue-50 p-5 rounded-lg mb-6 border-l-4 border-blue-500">
            <div className="flex items-start gap-2">
              <BookOpen className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-blue-800 mb-2">Pembahasan:</p>
                <p className="text-gray-700 leading-relaxed">
                  {questions[currentQuestion].explanation}
                </p>
              </div>
            </div>
          </div>
        )}

        {selectedAnswer !== null && (
          <button
            onClick={nextQuestion}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
          >
            {currentQuestion < questions.length - 1 ? 'Pertanyaan Berikutnya →' : 'Lihat Hasil Akhir'}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizApp;
