import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Trophy, RotateCcw, BookOpen, Clock, Settings, Shuffle, Filter } from 'lucide-react';

const QuizApp = () => {
  // Simulasi struktur folder dengan data quiz
  // Dalam implementasi real, ini bisa diload dari file JSON di folder public/quiz-data/
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
              options: [
                "Harga Penawaran Supplier",
                "Harga Perkiraan Sendiri",
                "Harga Pasar Standar",
                "Harga Pemerintah Setempat"
              ],
              correctIndex: 1,
              difficulty: "mudah",
              explanation: "HPS (Harga Perkiraan Sendiri) adalah perkiraan harga barang/jasa yang ditetapkan oleh PPK (Pejabat Pembuat Komitmen) berdasarkan survei harga pasar setempat dan/atau harga yang telah dipublikasikan secara resmi."
            },
            {
              id: "pbj-hps-2",
              question: "Siapa yang berwenang menetapkan HPS?",
              options: [
                "Panitia Pengadaan",
                "PPK (Pejabat Pembuat Komitmen)",
                "Direktur Perusahaan",
                "Bendahara"
              ],
              correctIndex: 1,
              difficulty: "mudah",
              explanation: "PPK (Pejabat Pembuat Komitmen) adalah pihak yang berwenang menetapkan HPS. PPK harus melakukan survei harga pasar dan perhitungan yang akurat sebelum menetapkan HPS."
            },
            {
              id: "pbj-hps-3",
              question: "Berapa batas toleransi kewajaran harga penawaran terhadap HPS menurut Perpres 12/2021?",
              options: [
                "Maksimal 80% dari HPS",
                "Antara 80% - 110% dari HPS",
                "Maksimal 120% dari HPS",
                "Tidak ada batasan"
              ],
              correctIndex: 1,
              difficulty: "sedang",
              explanation: "Menurut Perpres 12/2021, harga penawaran yang wajar adalah antara 80% hingga 110% dari HPS. Penawaran di bawah 80% dapat dianggap tidak wajar dan perlu klarifikasi."
            },
            {
              id: "pbj-hps-4",
              question: "Apa yang harus dilakukan PPK jika seluruh penawaran melebihi pagu anggaran?",
              options: [
                "Langsung menggugurkan semua penawaran",
                "Melakukan negosiasi dengan penawar terendah",
                "Menyesuaikan HPS dan mengulang lelang",
                "Menambah pagu anggaran"
              ],
              correctIndex: 2,
              difficulty: "sulit",
              explanation: "Jika seluruh penawaran melebihi pagu anggaran, PPK harus meninjau ulang dan menyesuaikan HPS, kemudian mengulang proses lelang. Tidak diperkenankan langsung menggugurkan atau melakukan negosiasi tanpa prosedur yang benar."
            }
          ]
        },
        "Kontrak": {
          name: "Kontrak Pengadaan",
          questions: [
            {
              id: "pbj-kontrak-1",
              question: "Apa yang dimaksud dengan kontrak lump sum?",
              options: [
                "Kontrak dengan harga satuan",
                "Kontrak dengan harga pasti dan tetap",
                "Kontrak dengan harga yang bisa berubah",
                "Kontrak tanpa jaminan"
              ],
              correctIndex: 1,
              difficulty: "mudah",
              explanation: "Kontrak lump sum adalah kontrak dengan harga pasti dan tetap untuk menyelesaikan seluruh pekerjaan. Harga tidak akan berubah meskipun ada perubahan volume atau komponen pekerjaan, kecuali ada addendum kontrak."
            },
            {
              id: "pbj-kontrak-2",
              question: "Berapa batas maksimal keterlambatan yang dapat dikenakan denda?",
              options: [
                "5% dari nilai kontrak",
                "10% dari nilai kontrak",
                "15% dari nilai kontrak",
                "Tidak ada batas"
              ],
              correctIndex: 0,
              difficulty: "sedang",
              explanation: "Denda keterlambatan maksimal adalah 5% dari nilai kontrak. Jika keterlambatan melebihi batas tersebut, kontrak dapat diputus dan penyedia dapat dimasukkan dalam daftar hitam."
            },
            {
              id: "pbj-kontrak-3",
              question: "Apa fungsi dari jaminan pelaksanaan kontrak?",
              options: [
                "Membayar uang muka pekerjaan",
                "Menjamin kesungguhan penyedia menyelesaikan pekerjaan",
                "Pengganti pembayaran termin",
                "Biaya administrasi kontrak"
              ],
              correctIndex: 1,
              difficulty: "mudah",
              explanation: "Jaminan pelaksanaan berfungsi untuk menjamin kesungguhan penyedia dalam menyelesaikan pekerjaan sesuai kontrak. Jika penyedia wanprestasi, jaminan ini dapat dicairkan."
            },
            {
              id: "pbj-kontrak-4",
              question: "Dalam kondisi apa Force Majeure dapat diklaim dalam kontrak pengadaan?",
              options: [
                "Ketika penyedia mengalami kerugian",
                "Saat ada kejadian luar biasa di luar kendali para pihak",
                "Ketika harga material naik",
                "Saat penyedia ingin mengundurkan diri"
              ],
              correctIndex: 1,
              difficulty: "sulit",
              explanation: "Force Majeure dapat diklaim ketika terjadi kejadian luar biasa yang tidak dapat diperkirakan dan di luar kendali para pihak, seperti bencana alam, perang, huru-hara, atau kebijakan pemerintah yang menghalangi pelaksanaan kontrak. Kenaikan harga material bukan termasuk force majeure."
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
              question: "Apa yang dimaksud dengan delik dalam hukum pidana?",
              options: [
                "Perbuatan yang dilarang oleh undang-undang",
                "Hukuman penjara",
                "Proses persidangan",
                "Surat dakwaan"
              ],
              correctIndex: 0,
              difficulty: "mudah",
              explanation: "Delik adalah perbuatan yang dilarang oleh undang-undang dan diancam dengan pidana bagi siapa yang melakukannya. Delik juga sering disebut sebagai tindak pidana atau perbuatan pidana."
            },
            {
              id: "hukum-pidana-2",
              question: "Berapa lama masa daluwarsa penuntutan untuk tindak pidana kejahatan yang diancam pidana penjara lebih dari 3 tahun?",
              options: [
                "6 tahun",
                "12 tahun",
                "18 tahun",
                "Tidak ada batas"
              ],
              correctIndex: 1,
              difficulty: "sulit",
              explanation: "Menurut KUHP Pasal 78, masa daluwarsa penuntutan untuk tindak pidana kejahatan yang diancam pidana penjara lebih dari 3 tahun adalah 12 tahun. Setelah masa ini, pelaku tidak dapat lagi dituntut."
            }
          ]
        },
        "Perdata": {
          name: "Hukum Perdata",
          questions: [
            {
              id: "hukum-perdata-1",
              question: "Apa yang dimaksud dengan wanprestasi?",
              options: [
                "Prestasi kerja yang baik",
                "Tidak memenuhi kewajiban dalam perjanjian",
                "Pembatalan kontrak sepihak",
                "Ganti rugi akibat perbuatan melawan hukum"
              ],
              correctIndex: 1,
              difficulty: "mudah",
              explanation: "Wanprestasi adalah kondisi dimana salah satu pihak tidak memenuhi kewajibannya dalam suatu perjanjian, baik tidak melakukan sesuatu yang diperjanjikan, terlambat melakukan, atau melakukan tidak sesuai perjanjian."
            },
            {
              id: "hukum-perdata-2",
              question: "Apa perbedaan utama antara jual beli dan sewa menyewa?",
              options: [
                "Tidak ada perbedaan",
                "Jual beli ada perpindahan hak milik, sewa menyewa hanya hak pakai",
                "Jual beli lebih mahal",
                "Sewa menyewa hanya untuk barang bergerak"
              ],
              correctIndex: 1,
              difficulty: "sedang",
              explanation: "Perbedaan mendasar adalah dalam jual beli terjadi perpindahan hak milik dari penjual ke pembeli, sedangkan dalam sewa menyewa hanya ada perpindahan hak pakai untuk jangka waktu tertentu, kepemilikan tetap pada pemilik."
            }
          ]
        }
      }
    }
  };

  const [gameState, setGameState] = useState('setup'); // setup, playing, result
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
          setGameState('result');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

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
      // Random mode: ambil dari semua subtopik dalam topik
      const topic = quizDatabase[selectedTopic];
      Object.values(topic.subtopics).forEach(subtopic => {
        allQuestions = [...allQuestions, ...subtopic.questions];
      });
    } else {
      // Specific mode: ambil hanya dari subtopik yang dipilih
      const topic = quizDatabase[selectedTopic];
      selectedSubtopics.forEach(subtopicKey => {
        if (topic.subtopics[subtopicKey]) {
          allQuestions = [...allQuestions, ...topic.subtopics[subtopicKey].questions];
        }
      });
    }

    // Filter berdasarkan tingkat kesulitan
    allQuestions = allQuestions.filter(q => selectedDifficulty.includes(q.difficulty));

    return allQuestions;
  };

  const startQuiz = () => {
    const availableQuestions = getAvailableQuestions();
    
    if (availableQuestions.length === 0) {
      alert('Tidak ada soal yang tersedia dengan filter yang dipilih!');
      return;
    }

    // Random dan ambil sesuai jumlah yang diminta
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

// Tambahkan function baru ini
const saveQuizHistory = () => {
  const history = {
    topic: selectedTopic,
    subtopic: selectedSubtopics.join(', '),
    score: score,
    total: questions.length,
    date: new Date().toLocaleString('id-ID'),
    difficulty: selectedDifficulty.join(', '),
    timestamp: Date.now()
  };

  // Get existing history
  const existingHistory = localStorage.getItem(`quiz_history_${user.username}`);
  const historyArray = existingHistory ? JSON.parse(existingHistory) : [];
  
  // Add new history
  historyArray.unshift(history); // Add to beginning
  
  // Keep only last 20 records
  const limitedHistory = historyArray.slice(0, 20);
  
  // Save to localStorage
  localStorage.setItem(`quiz_history_${user.username}`, JSON.stringify(limitedHistory));
};
  
  const resetQuiz = () => {
    setGameState('setup');
    setSelectedAnswer(null);
    setShowExplanation(false);
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

  // Halaman Setup/Settings
  if (gameState === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-3xl w-full max-h-screen overflow-y-auto">
          <div className="text-center mb-8">
            <Settings className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Pengaturan Quiz
            </h1>
            <p className="text-gray-600">
              Pilih topik, subtopik, dan tingkat kesulitan soal
            </p>
          </div>

          {/* Pilih Topik */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              1. Pilih Topik:
            </label>
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

          {/* Mode Random atau Pilih */}
          {selectedTopic && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                2. Mode Soal:
              </label>
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

          {/* Pilih Subtopik (jika tidak random) */}
          {selectedTopic && !isRandomMode && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                3. Pilih Subtopik:
              </label>
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
                        <div className="text-sm text-gray-500">
                          {subtopic.questions.length} soal
                        </div>
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

          {/* Tingkat Kesulitan */}
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
                    className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                      selectedDifficulty.includes(diff)
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="font-semibold capitalize">{diff}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Jumlah Soal */}
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

          {/* Tombol Mulai */}
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
            <p className="text-xl text-gray-600">
              Skor Anda: {percentage.toFixed(0)}%
            </p>
            <p className="text-gray-500 mt-2">
              Waktu: {formatTime(timeTaken)}
            </p>
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
              {currentQuestion + 1}/{questions.length}
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
