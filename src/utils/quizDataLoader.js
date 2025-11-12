// quizDataLoader.js
// Script untuk load semua data quiz dari folder secara otomatis

/**
 * Load struktur quiz dan semua questions
 * @returns {Promise<Object>} Database quiz lengkap
 */
export async function loadQuizDatabase() {
  try {
    // 1. Load struktur utama
    const structureResponse = await fetch('/quiz-data/structure.json');
    if (!structureResponse.ok) {
      throw new Error('Gagal load structure.json');
    }
    
    const structure = await structureResponse.json();
    
    // 2. Load semua questions dari setiap subtopik
    const database = {};
    
    for (const [topicKey, topicData] of Object.entries(structure)) {
      database[topicKey] = {
        name: topicData.name,
        icon: topicData.icon || '📚',
        description: topicData.description || '',
        subtopics: {}
      };
      
      for (const [subtopicKey, subtopicData] of Object.entries(topicData.subtopics)) {
        try {
          // Load questions untuk subtopik ini
          const questionsResponse = await fetch(`/quiz-data/${subtopicData.file}`);
          
          if (questionsResponse.ok) {
            const questions = await questionsResponse.json();
            
            database[topicKey].subtopics[subtopicKey] = {
              name: subtopicData.name,
              questions: questions,
              totalQuestions: questions.length
            };
            
            console.log(`✅ Loaded ${questions.length} questions from ${topicKey}/${subtopicKey}`);
          } else {
            console.warn(`⚠️ File not found: ${subtopicData.file}`);
            database[topicKey].subtopics[subtopicKey] = {
              name: subtopicData.name,
              questions: [],
              totalQuestions: 0
            };
          }
        } catch (error) {
          console.error(`❌ Error loading ${topicKey}/${subtopicKey}:`, error);
          database[topicKey].subtopics[subtopicKey] = {
            name: subtopicData.name,
            questions: [],
            totalQuestions: 0
          };
        }
      }
    }
    
    console.log('📊 Quiz database loaded successfully!');
    return database;
    
  } catch (error) {
    console.error('❌ Fatal error loading quiz database:', error);
    
    // Return fallback data jika gagal
    return getFallbackData();
  }
}

/**
 * Load questions dari subtopik tertentu
 * @param {string} topic - Nama topik
 * @param {string} subtopic - Nama subtopik
 * @returns {Promise<Array>} Array of questions
 */
export async function loadSubtopicQuestions(topic, subtopic) {
  try {
    const structure = await fetch('/quiz-data/structure.json').then(r => r.json());
    const file = structure[topic]?.subtopics[subtopic]?.file;
    
    if (!file) {
      throw new Error(`Subtopik tidak ditemukan: ${topic}/${subtopic}`);
    }
    
    const response = await fetch(`/quiz-data/${file}`);
    if (!response.ok) {
      throw new Error(`File tidak ditemukan: ${file}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error loading subtopic questions:', error);
    return [];
  }
}

/**
 * Get statistik database
 * @param {Object} database - Quiz database
 * @returns {Object} Statistics
 */
export function getDatabaseStats(database) {
  let totalTopics = 0;
  let totalSubtopics = 0;
  let totalQuestions = 0;
  let byDifficulty = { mudah: 0, sedang: 0, sulit: 0 };
  
  for (const topic of Object.values(database)) {
    totalTopics++;
    
    for (const subtopic of Object.values(topic.subtopics)) {
      totalSubtopics++;
      totalQuestions += subtopic.questions.length;
      
      // Count by difficulty
      subtopic.questions.forEach(q => {
        if (byDifficulty[q.difficulty] !== undefined) {
          byDifficulty[q.difficulty]++;
        }
      });
    }
  }
  
  return {
    totalTopics,
    totalSubtopics,
    totalQuestions,
    byDifficulty,
    averageQuestionsPerSubtopic: Math.round(totalQuestions / totalSubtopics)
  };
}

/**
 * Fallback data jika gagal load dari file
 */
function getFallbackData() {
  return {
    "Demo": {
      name: "Demo Quiz",
      icon: "🎯",
      description: "Demo quiz untuk testing",
      subtopics: {
        "Basic": {
          name: "Basic Questions",
          questions: [
            {
              id: "demo-001",
              question: "Berapa hasil 2 + 2?",
              options: ["3", "4", "5", "6"],
              correctIndex: 1,
              difficulty: "mudah",
              explanation: "2 + 2 = 4. Ini adalah operasi penjumlahan dasar.",
              tags: ["matematika", "dasar"],
              references: ""
            }
          ],
          totalQuestions: 1
        }
      }
    }
  };
}

/**
 * Validate question structure
 * @param {Object} question - Question object
 * @returns {boolean} Is valid
 */
export function validateQuestion(question) {
  const required = ['id', 'question', 'options', 'correctIndex', 'difficulty', 'explanation'];
  
  for (const field of required) {
    if (question[field] === undefined || question[field] === null) {
      console.warn(`Question validation failed: missing ${field}`, question);
      return false;
    }
  }
  
  if (!Array.isArray(question.options) || question.options.length !== 4) {
    console.warn('Question must have exactly 4 options', question);
    return false;
  }
  
  if (question.correctIndex < 0 || question.correctIndex > 3) {
    console.warn('correctIndex must be between 0-3', question);
    return false;
  }
  
  if (!['mudah', 'sedang', 'sulit'].includes(question.difficulty)) {
    console.warn('Invalid difficulty level', question);
    return false;
  }
  
  return true;
}

/**
 * Filter dan validate semua questions
 * @param {Object} database - Quiz database
 * @returns {Object} Cleaned database
 */
export function cleanDatabase(database) {
  const cleaned = {};
  
  for (const [topicKey, topic] of Object.entries(database)) {
    cleaned[topicKey] = {
      ...topic,
      subtopics: {}
    };
    
    for (const [subtopicKey, subtopic] of Object.entries(topic.subtopics)) {
      const validQuestions = subtopic.questions.filter(q => validateQuestion(q));
      
      cleaned[topicKey].subtopics[subtopicKey] = {
        ...subtopic,
        questions: validQuestions,
        totalQuestions: validQuestions.length
      };
    }
  }
  
  return cleaned;
}

// Export default
export default {
  loadQuizDatabase,
  loadSubtopicQuestions,
  getDatabaseStats,
  validateQuestion,
  cleanDatabase
};
