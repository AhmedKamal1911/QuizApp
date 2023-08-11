let questionsCount = document.querySelector(".count span");
let spansContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitBtn = document.querySelector(".submit-button");
let bullets = document.querySelector(".bullets");
let resultsContainer = document.querySelector(".results");
let minutesSpan = document.querySelector(".countdown .minutes");
let secondsSpan = document.querySelector(".countdown .seconds");
let categoryEl = document.querySelector(".category span");
let successAudio = document.getElementById("success");
let wrongAudio = document.getElementById("wrong");
// Get Request From Json File
let currentQuest = 0;
let rightAnswersCounter = 0;
let choosenAnswer;
let countTimeDown;
function getRequest() {
  let req = new XMLHttpRequest();

  req.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObj = JSON.parse(this.responseText);
      // todo: get random category here
      const categoriesList = Object.keys(questionsObj);

      let randomCategoryIndex = Math.floor(
        Math.random() * categoriesList.length
      );
      let randomSelectedCategory = categoriesList[randomCategoryIndex];
      let qlength = questionsObj[randomSelectedCategory].length;
      categoryEl.innerHTML = randomSelectedCategory;
      // Create Spans For Bullets
      createBullets(qlength);
      let selectedQuestionsList = questionsObj[randomSelectedCategory];

      // Randomize Questions

      for (let i = qlength - 1; i >= 0; i--) {
        let randomNumber = Math.floor(Math.random() * i + 1);
        [selectedQuestionsList[randomNumber], selectedQuestionsList[i]] = [
          selectedQuestionsList[i],
          selectedQuestionsList[randomNumber],
        ];
      }
      const initialQuestion = selectedQuestionsList[currentQuest];
      // Create Questions Data
      addQuestion(initialQuestion, qlength);
      countDown();
      // Submit Button Event
      submitBtn.onclick = () => {
        let theRightAnswer = selectedQuestionsList[currentQuest].right_answer;
        // Increase Current Quest
        currentQuest++;
        // Check Answer
        checkAnswer(theRightAnswer, qlength);
        // Remove Previous Question
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";
        // Add Questions
        addQuestion(selectedQuestionsList[currentQuest], qlength);
        // Handel Bullets
        handleBullets();
        // Show Results
        showResults(qlength);
        // Run CountDown
        clearInterval(countTimeDown);
        if (currentQuest < qlength) {
          countDown();
        } else {
          console.log("no new countdown");
        }
      };
    }
  };

  req.open("GET", "./js/questions.json", true);
  req.send();
}
getRequest();

// Create Question Data
function addQuestion(question, qCount) {
  if (currentQuest < qCount) {
    // Create Question
    let h2 = document.createElement("h2");
    h2.textContent = question["title"];
    // Append H2 IN QUESTION AREA
    quizArea.appendChild(h2);
    // Create Answers
    for (let i = 1; i <= 4; i++) {
      // Create Answer Container
      let answer = document.createElement("div");
      // Add Class Answer to Answer Div
      answer.className = "answer";
      // Create Input
      let radioInput = document.createElement("input");
      radioInput.name = "questions";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = question[`answer_${i}`];
      if (i === 1) {
        radioInput.checked = true;
      }
      // Create Label
      let label = document.createElement("label");
      label.htmlFor = `answer_${i}`;
      label.innerHTML = question[`answer_${i}`];
      // Append RadioInput and Label in answer Container
      answer.appendChild(radioInput);
      answer.appendChild(label);
      // Append AnswerContainer in answerArea
      answersArea.appendChild(answer);
    }
  }
}

// Check Answer Function
function checkAnswer(rightAnswer, qCount) {
  let answers = document.getElementsByName("questions");
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      choosenAnswer = answers[i].dataset.answer;
    }
  }
  if (choosenAnswer === rightAnswer) {
    rightAnswersCounter++;
  }
}

// Create Bullets Function

function createBullets(spansNumber) {
  // Add Questions Count
  questionsCount.innerHTML = spansNumber;
  // Create loop to make all Spans
  for (let i = 0; i < spansNumber; i++) {
    // Create Span
    let span = document.createElement("span");
    // ADD class on
    if (i === 0) {
      span.classList.add("on", "current");
    }
    // Append Bullets in Container
    spansContainer.appendChild(span);
  }
}

// Handle Bullets
function handleBullets() {
  let bullets = Array.from(document.querySelectorAll(".spans span"));
  bullets.forEach((bullet) => {
    bullet.classList.remove("current");
  });
  bullets.forEach((bullet, index) => {
    if (currentQuest === index) {
      bullet.classList.add("on", "current");
    }
  });
}

// Show Results
function showResults(count) {
  if (currentQuest === count) {
    quizArea.remove();
    submitBtn.remove();
    bullets.remove();
    if (rightAnswersCounter > count / 2 && rightAnswersCounter < count) {
      resultsContainer.innerHTML = `<span class="good">Good</span><br>You Answered ${rightAnswersCounter} From ${count} `;
    } else if (rightAnswersCounter === count) {
      resultsContainer.innerHTML = `<span class="perfect">Perfect</span><br> 62 From 50 `;
      setTimeout(() => {
        successAudio.play();
      }, 1000);
    } else {
      resultsContainer.innerHTML = `<span class="bad">كمل عليهم وهاتلك عجلة</span><br>You Answered ${rightAnswersCounter} From ${count}`;
      setTimeout(() => {
        wrongAudio.play();
      }, 1200);
    }
  }
}
// Create CountDown
function countDown() {
  let duration = 20;
  countTimeDown = setInterval(() => {
    let minutes = parseInt(duration / 60);
    let seconds = parseInt(duration % 60);
    minutesSpan.textContent = minutes < 10 ? `0${minutes}` : minutes;
    secondsSpan.textContent = seconds < 10 ? `0${seconds}` : seconds;
    if (!duration) {
      clearInterval(countTimeDown);
      submitBtn.click();
    }
    duration--;
  }, 1000);
}
