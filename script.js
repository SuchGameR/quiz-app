//
// App Title: Script for Quiz App
// 
// Author   : SGR (SuchGameR)
// Version  : 2.0.0
//
// Page Link: https://suchgamer.github.io/quiz-app/
//

// 要素等の宣言
const header = document.getElementById('header');
const categoryName = document.getElementById('category-name');
const progressDisplay = document.getElementById('progress');
const quizArea = document.getElementById('quiz-area');
const startButton = document.getElementById('start-button');
const fileInput = document.getElementById('file-input');

// データ変換の配列とMAP
let quizData = [];
let currentCategoryIndex = 0;
let answeredQuestions = new Map();

// ファイルのアップロードとデータの取得
fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    const text = e.target.result;
    parseQuizData(text);
  }

  reader.readAsText(file);
});

// 変換作業
function parseQuizData(text) {
  quizData = [];
  const lines = text.split('\n');
  let currentCategory = '';
  let categoryQuestions = [];

  for (const line of lines) {
    if (line.startsWith('#title')) {
      if (currentCategory !== '') {
        quizData.push({ category: currentCategory, questions: categoryQuestions });
      }
      currentCategory = line.substring(7).trim();
      categoryQuestions = [];
    } else if (line.trim() !== '') {
      const parts = line.split(/[　:]/);
      const question = parts[0].trim();
      const problemText = parts[1].trim();
      categoryQuestions.push({ question, problemText });
      console.log("取得データ:", { question, problemText });
    }
  }
  if (currentCategory !== '') {
    quizData.push({ category: currentCategory, questions: categoryQuestions });
  }
  console.log("quizData:", quizData);
}

// インポートボタンの処理
startButton.addEventListener('click', () => {
  if (quizData.length === 0) {
    alert('クイズデータをインポートしてください。');
    return;
  }

  startQuiz();
});

// 起動させる
function startQuiz() {
  currentCategoryIndex = 0;
  answeredQuestions.clear();
  showQuestion();
}

// クイズの問題を見せる
function showQuestion() {
  if (currentCategoryIndex >= quizData.length) {
    header.textContent = "クイズ終了！";
    quizArea.innerHTML = '';
    return;
  }

  const currentCategoryData = quizData[currentCategoryIndex];
  const currentCategory = currentCategoryData.category;
  const categoryQuestions = currentCategoryData.questions;

  const shuffledQuestions = categoryQuestions.sort(() => Math.random() - 0.5);

  for (const questionData of shuffledQuestions) {
    if (!answeredQuestions.get(currentCategory)?.has(questionData.question)) {
      categoryName.textContent = currentCategory;

      const correctCount = answeredQuestions.get(currentCategory)?.size || 0;
      progressDisplay.textContent = `(${correctCount}/${categoryQuestions.length})`;

      const problemTextElement = document.createElement('p');
      problemTextElement.textContent = questionData.problemText;
      quizArea.innerHTML = '';
      quizArea.appendChild(problemTextElement);

      const answers = [questionData.question];
      const otherQuestions = shuffledQuestions
        .filter(q => q.question !== questionData.question)
        .map(q => q.question);

      while (answers.length < 4 && otherQuestions.length > 0) {
        const randomIndex = Math.floor(Math.random() * otherQuestions.length);
        answers.push(otherQuestions.splice(randomIndex, 1)[0]);
      }

      shuffleArray(answers);
      
      console.log("正解:", questionData.question);

      answers.forEach(answer => {
        const answerButton = document.createElement('button');
        answerButton.textContent = answer;
        answerButton.addEventListener('click', () => {
          if (answer === questionData.question) {
            alert('正解！');
           
            if (!answeredQuestions.has(currentCategory)) {
              answeredQuestions.set(currentCategory, new Set());
            }
            answeredQuestions.get(currentCategory).add(questionData.question);

            if (answeredQuestions.get(currentCategory).size === categoryQuestions.length) {
              currentCategoryIndex++;
              showQuestion();
            } else {
              showQuestion();
            }
          } else {
            alert('不正解...');
            showQuestion();
          }
        });
        quizArea.appendChild(answerButton);
      });

      return;
    }
  }

  currentCategoryIndex++;
  showQuestion();
}

// 配列のシャッフル [Ver2]
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}