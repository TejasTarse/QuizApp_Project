const loginForm = document.getElementById('login-form');
const loginContainer = document.getElementById('login-container');
const quizContainer = document.getElementById('quiz-container');
const usernameDisplay = document.getElementById('username');
const mobileUsernameDisplay = document.getElementById('mobile-username');
const errorMsg = document.getElementById('error-msg');

loginForm.addEventListener('submit', e => {
  e.preventDefault();

  const username = document.getElementById('usernameInput').value.trim();
  const password = document.getElementById('passwordInput').value;

  if (password === '123') {
    errorMsg.style.display = 'none';

    loginContainer.style.display = 'none';
    quizContainer.style.display = 'block';

    usernameDisplay.innerText = username.toUpperCase() || 'User';
    mobileUsernameDisplay.innerText = username.toUpperCase() || 'User';

  } else {
    errorMsg.style.display = 'block';
  }
});


const categoryList = document.getElementById('category-list');
const configArea = document.getElementById('config-area');
const quizArea = document.getElementById('quiz-area');
const resultArea = document.getElementById('result-area');
const questionArea = document.getElementById('question-area');
const optionsArea = document.getElementById('options-area');
const timerElem = document.getElementById('timer');
const nextBtn = document.getElementById('nextBtn');
const sidebar = document.getElementById('sidebar');  // sidebar element
const questionCounter = document.getElementById('question-counter');
const username = document.getElementById('usernameInput').value;

let selectedCategory = "HTML";
let questions = [];
let currQuestion = 0;
let score = 0;
let selectedQuestions = [];
let timer = null;
let secondsPerQ = 30;

// Functions to disable/enable sidebar interaction
function disableSidebar() {
  sidebar.classList.add('disabled');
}

function enableSidebar() {
  sidebar.classList.remove('disabled');
}

function renderCategories() {
  const cats = Object.keys(quizBank);
  categoryList.innerHTML = "";
  cats.forEach(cat => {
    const li = document.createElement('li');
    li.textContent = cat;
    if (cat === selectedCategory) li.classList.add('active');
    li.onclick = () => {
      selectedCategory = cat;
      renderCategories();
      showConfig();
    };
    categoryList.appendChild(li);
  });
}
renderCategories();

function showConfig() {
  configArea.style.display = "block";
  quizArea.style.display = "none";
  resultArea.style.display = "none";


}

const activeCategoryElem = document.getElementById('active-category');

function updateActiveCategory(category) {
  activeCategoryElem.innerText = category.toUpperCase();
}

categoryList.addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    selectedCategory = e.target.innerText;
    renderCategories();  // re-render to highlight active
    updateActiveCategory(selectedCategory); // update navbar text
    showConfig();
  }
});

updateActiveCategory(selectedCategory);

function shuffle(arr) {
  let n = arr.length, t, i;
  while (n) {
    i = Math.floor(Math.random() * n--);
    t = arr[n];
    arr[n] = arr[i];
    arr[i] = t;
  }
  return arr;
}

document.getElementById('startQuizBtn').onclick = () => {
// console.log("Hiii");
  let valid = true;
  // Clear previous
  document.getElementById('numQuestions').classList.remove('input-error');
  document.getElementById('timePerQuestion').classList.remove('input-error');
  document.getElementById('numQuestionsError').textContent = '';
  document.getElementById('timePerQuestionError').textContent = '';

  const numQuestions = parseInt(document.getElementById('numQuestions').value, 10);
  const timePerQuestion = parseInt(document.getElementById('timePerQuestion').value, 10);

  if (isNaN(numQuestions) || numQuestions < 1 || numQuestions > 50) {
    document.getElementById('numQuestions').classList.add('input-error');
    document.getElementById('numQuestionsError').textContent = 'Number of questions must be between 1 and 50.';
    valid = false;
  }
  if (isNaN(timePerQuestion) || timePerQuestion < 10 || timePerQuestion > 150) {
    document.getElementById('timePerQuestion').classList.add('input-error');
    document.getElementById('timePerQuestionError').textContent = 'Time per question must be between 10 and 150 seconds.';
    valid = false;
  }
  if (!valid) {
    e.preventDefault();
    return false;
  }

  // let numQuestions = parseInt(document.getElementById('numQuestions').value, 10);
  secondsPerQ = parseInt(document.getElementById('timePerQuestion').value, 10);
  let categoryQ = quizBank[selectedCategory].slice();
  if (numQuestions > categoryQ.length) numQuestions = categoryQ.length;
  selectedQuestions = shuffle(categoryQ).slice(0, numQuestions);
  currQuestion = 0;
  score = 0;
  configArea.style.display = "none";
  resultArea.style.display = "none";
  quizArea.style.display = "block";
  nextBtn.style.display = "none";


  disableSidebar();  // DISABLE sidebar on quiz start

  questionCounter.innerText = `Question ${currQuestion + 1} / ${selectedQuestions.length}`;

  showQuestion();
};

function showQuestion() {
  const q = selectedQuestions[currQuestion];
  questionArea.textContent = `Q${currQuestion + 1}: ${q.question}`;
  optionsArea.innerHTML = "";
  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.onclick = () => selectOption(idx, btn);
    optionsArea.appendChild(btn);
  });
  nextBtn.style.display = "none";
  startTimer();
}

function selectOption(idx, btn) {
  stopTimer();
  const q = selectedQuestions[currQuestion];
  Array.from(optionsArea.children).forEach((b, i) => {
    b.disabled = true;
    if (i === q.answer) b.classList.add('correct');
    if (i === idx && idx !== q.answer) b.classList.add('wrong');
    if (i === idx) b.classList.add('selected');
  });
  if (idx === q.answer) score++;
  nextBtn.style.display = "block";
}

nextBtn.onclick = () => {
  currQuestion++;
  if (currQuestion >= selectedQuestions.length) {
    showResult();
  } else {
    questionCounter.innerText = `Question ${currQuestion + 1} / ${selectedQuestions.length}`;
    showQuestion();
  }
};

function showResult() {
  quizArea.style.display = "none";
  resultArea.style.display = "block";

  // Get username value from input with id 'usernameInput'
  const username = document.getElementById('usernameInput').value.trim() || 'User';

  resultArea.innerHTML = `Quiz Over, <strong>${username}</strong> !<br> Total Score: ${score} / ${selectedQuestions.length}`;
  questionCounter.innerText = '';

  enableSidebar();
}



let timerValue = 0;
function startTimer() {
  timerValue = secondsPerQ;
  timerElem.textContent = `Time Left: ${timerValue}s`;
  timer = setInterval(() => {
    timerValue--;
    timerElem.textContent = `Time Left: ${timerValue}s`;
    if (timerValue <= 0) {
      stopTimer();
      selectOption(-1, null);
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}


// Custom Select Initialization
document.addEventListener("DOMContentLoaded", function () {
  const x = document.getElementsByClassName("custom-select");
  for (let i = 0; i < x.length; i++) {
    const selElmnt = x[i].getElementsByTagName("select")[0];
    const selectedDiv = document.createElement("DIV");
    selectedDiv.setAttribute("class", "select-selected");
    selectedDiv.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(selectedDiv);

    const optionsDiv = document.createElement("DIV");
    optionsDiv.setAttribute("class", "select-items select-hide");
    for (let j = 1; j < selElmnt.length; j++) {
      const optionDiv = document.createElement("DIV");
      optionDiv.innerHTML = selElmnt.options[j].innerHTML;
      optionDiv.addEventListener("click", function (e) {
        const s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        const h = this.parentNode.previousSibling;
        for (let i = 0; i < s.length; i++) {
          if (s.options[i].innerHTML === this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;

            // Mark selected
            const sameAsSelected = this.parentNode.getElementsByClassName("same-as-selected");
            for (let k = 0; k < sameAsSelected.length; k++) {
              sameAsSelected[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }

        h.click();

        // 🔹 Trigger your quiz functions here
        const selectedCategory = s.value;
        localStorage.setItem("selectedCategory", selectedCategory);

        if (typeof showConfig === "function") showConfig();
        if (typeof loadQuestions === "function") loadQuestions(selectedCategory);
      });
      optionsDiv.appendChild(optionDiv);
    }
    x[i].appendChild(optionsDiv);

    selectedDiv.addEventListener("click", function (e) {
      e.stopPropagation();
      closeAllSelect(this);
      this.nextSibling.classList.toggle("select-hide");
      this.classList.toggle("select-arrow-active");
    });
  }

  function closeAllSelect(elmnt) {
    const items = document.getElementsByClassName("select-items");
    const selected = document.getElementsByClassName("select-selected");
    for (let i = 0; i < selected.length; i++) {
      if (elmnt === selected[i]) continue;
      selected[i].classList.remove("select-arrow-active");
    }
    for (let i = 0; i < items.length; i++) {
      if (elmnt && elmnt.nextSibling === items[i]) continue;
      items[i].classList.add("select-hide");
    }
  }

  document.addEventListener("click", closeAllSelect);
});

//  let mobileCategoryDropdown = document.getElementById("mobile-category-dropdown");

//   mobileCategoryDropdown.addEventListener("click", function (e) {
//   selectedCategory = document.getElementById("mobile-category-dropdown").value;
//   console.log(selectedCategory);
//   console.log("Hiii"); // This will now print when the user makes a selection
//   updateActiveCategory(selectedCategory);
//   showConfig();
// });
document.addEventListener("DOMContentLoaded", function() {
  const dropdown = document.getElementById("mobile-category-dropdown");
  if (dropdown) {
    dropdown.addEventListener("change", function() {
      myFunction();
    });
  }
});


function myFunction() {
  var x = document.getElementById("mobile-category-dropdown").value;
  console.log(x);
  
}



username


showConfig();
