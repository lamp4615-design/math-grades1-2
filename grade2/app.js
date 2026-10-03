const topics = [
  { id: "place", icon: "🏠", name: "位值小屋", desc: "百、十、個位", make: makePlace },
  { id: "add", icon: "➕", name: "加法探險", desc: "二位數加法", make: makeAdd },
  { id: "sub", icon: "➖", name: "減法探險", desc: "二位數減法", make: makeSub },
  { id: "multi", icon: "🍬", name: "乘法花園", desc: "連加與乘法", make: makeMulti },
  { id: "compare", icon: "⚖️", name: "數字比一比", desc: "大於、小於、等於", make: makeCompare },
  { id: "money", icon: "🪙", name: "小小購物家", desc: "算錢與找錢", make: makeMoney }
];
let currentTopic = null, currentQuestion = null, selectedAnswer = null, questionNumber = 0;
let correctCount = Number(localStorage.getItem("math-helper-correct") || 0);
document.querySelector("#streak").textContent = correctCount;

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = values => values[random(0, values.length - 1)];
const question = (text, answer, hint, options, misconception = "") => ({
  text, answer: String(answer), hint, misconception,
  options: options || makeOptions(answer)
});
function makeOptions(answer) {
  const n = Number(answer);
  if (!Number.isFinite(n)) return [String(answer), ...makeTextOptions(String(answer))];
  const values = new Set([n]);
  while (values.size < 4) {
    const distractor = Math.max(0, n + random(-10, 10));
    values.add(distractor === n && n < 10 ? n + random(1, 10) : distractor);
  }
  return [...values].sort(() => Math.random() - .5).map(String);
}
function makeTextOptions(answer) {
  const options = answer.includes("×") ? answer.split("×").reverse().join("×") : `${answer}（答案）`;
  const candidates = [options, answer.includes("×") ? answer.replace("×", "+") : "先算個位再算十位", "把數字的位置看反了", "把每組數量和組數混在一起"];
  return [...new Set([answer, ...candidates])].slice(0, 4);
}
function makePlace() {
  const n = random(101, 999), digits = String(n).padStart(3, "0"), place = pick(["百位", "十位", "個位"]);
  const index = { 百位: 0, 十位: 1, 個位: 2 }[place];
  return question(`${n} 的${place}數字是多少？`, digits[index], `把 ${n} 分成百、十、個三個位置，${place}是在第 ${index + 1} 個位置。`, null, "位值不是看數字長得像什麼，而是看它站在哪一個位置；同一個數字站在不同位置，代表的數量不同。");
}
function makeAdd() {
  const a = random(12, 68), b = random(11, 31);
  return question(`${a} + ${b} = ?`, a + b, `先算個位，再算十位：${a % 10} + ${b % 10}，如果超過 10 要記得進位。`, null, "直式計算時要「個位對個位、十位對十位」，進位的 1 是 1 個十，不是 1 個一。");
}
function makeSub() {
  const a = random(35, 89), b = random(12, a - 5);
  return question(`${a} - ${b} = ?`, a - b, `可以想「${b} 加多少會到 ${a}？」或用個位、十位分開減。`, null, "減法不是把兩個數字各自相減後隨便拼起來；要維持位值，不能用小數減大數時硬算。");
}
function makeMulti() {
  const item = pick(["糖果", "貼紙", "鉛筆", "積木"]);
  const groups = random(2, 5), each = random(2, 9), total = groups * each;
  const type = random(1, 4);
  if (type === 1) {
    return question(`每排有 ${each} 個${item}，排成 ${groups} 排，一共有幾個？`, total, `把 ${each} 連加 ${groups} 次，也可以寫成 ${groups} × ${each}。`, null, "乘法的兩個數字各有意思：一個表示有幾組，一個表示每組有幾個；不能只看到數字就亂乘。");
  }
  if (type === 2) {
    return question(`小安把 ${total} 個${item}每 ${each} 個裝一袋，可以裝成幾袋？`, groups, `想一想：${each} × 幾等於 ${total}？這是在做分裝。`, null, "分裝問題問的是「有幾袋」，不是每袋有幾個；先找清楚題目最後問什麼。");
  }
  if (type === 3) {
    return question(`有 ${groups} 盒，每盒 ${each} 個${item}，用乘法算式記錄，可以寫成？`, `${groups} × ${each}`, `有幾盒就是幾組，每盒幾個就是每組的數量。`, [`${groups} × ${each}`, `${each} + ${groups}`, `${groups} + ${each}`, `${total} - ${each}`], "乘法算式要對應情境；「有幾盒」和「每盒幾個」都要保留，不能改成加法後失去分組意思。");
  }
  return question(`老師有 ${total} 個${item}，平均分給 ${groups} 位小朋友，每人幾個？`, each, `把全部${item}公平分成 ${groups} 份，想一想 ${total} ÷ ${groups}。`, null, "平分問題問的是「每人幾個」；每一份要一樣多，不能只把總數減掉一次。");
}
function makeCompare() {
  const a = random(10, 99), b = random(10, 99), answer = a === b ? "=" : a > b ? ">" : "<";
  return question(`${a}  __  ${b}，應填入什麼符號？`, answer, `先比較十位，十位一樣時再比較個位。`, ["<", "=", ">"]);
}
function makeMoney() {
  const items = [
    ["彩色筆", 15, 10], ["橡皮擦", 12, 8], ["筆記本", 35, 5],
    ["故事書", 80, 3], ["貼紙本", 25, 4]
  ];
  const type = random(1, 4), item = pick(items);
  if (type === 1) {
    const quantity = random(2, 5), total = item[1] * quantity;
    return question(`買 ${quantity} 個${item[0]}，每個 ${item[1]} 元，一共要付幾元？`, total, `把 ${item[1]} 元連加 ${quantity} 次，也可以用 ${quantity} × ${item[1]}。`, null, "相同價格重複出現時才使用乘法；總價要包含每一個物品的價格。");
  }
  if (type === 2) {
    const price = item[1] + random(1, 5) * 5, paid = Math.ceil(price / 10) * 10 + 10;
    return question(`一個${item[0]} ${price} 元，付 ${paid} 元，要找回幾元？`, paid - price, `找錢就是「付的錢 − 商品價格」，算算 ${paid} − ${price}。`, null, "找錢是付出的錢減去花掉的錢，不是把兩個金額相加；找回的錢加回商品價格，應該等於付出的錢。");
  }
  if (type === 3) {
    const quantity = random(2, 4), total = item[1] * quantity;
    return question(`用 ${total} 元剛好買 ${quantity} 個${item[0]}，每個${item[0]}幾元？`, item[1], `把總價平均分給 ${quantity} 個${item[0]}，算算 ${total} ÷ ${quantity}。`, null, "總價已經是全部物品的錢，要平均分給物品數量，才會得到一個的價格。");
  }
  const hundreds = random(1, 5);
  return question(`${hundreds} 張 100 元鈔票合起來是多少元？`, hundreds * 100, `一張是 100 元，數數看有幾個 100。`, null, `數鈔票時，張數和每張的面額要一起看；${hundreds} 張 100 元不是 ${hundreds} 元。`);
}

const topicList = document.querySelector("#topic-list");
topics.forEach(topic => {
  const button = document.createElement("button");
  button.className = "topic";
  button.innerHTML = `<span class="topic-icon">${topic.icon}</span><strong>${topic.name}</strong><small>${topic.desc}</small>`;
  button.addEventListener("click", () => startTopic(topic, button));
  topicList.appendChild(button);
});
function startTopic(topic, button) {
  currentTopic = topic; questionNumber = 0;
  document.querySelectorAll(".topic").forEach(item => item.classList.remove("selected"));
  button.classList.add("selected");
  document.querySelector("#question-card").classList.remove("hidden");
  nextQuestion();
  document.querySelector("#question-card").scrollIntoView({ behavior: "smooth", block: "nearest" });
}
function nextQuestion() {
  questionNumber++; currentQuestion = currentTopic.make(); selectedAnswer = null;
  document.querySelector("#topic-label").textContent = currentTopic.name;
  document.querySelector("#question-count").textContent = `第 ${questionNumber} 題`;
  document.querySelector("#question-text").textContent = currentQuestion.text;
  document.querySelector("#feedback").textContent = "";
  document.querySelector("#feedback").className = "feedback";
  document.querySelector("#hint").classList.add("hidden");
  document.querySelector("#next-question").classList.add("hidden");
  document.querySelector("#check-answer").classList.remove("hidden");
  document.querySelector("#show-hint").classList.remove("hidden");
  const area = document.querySelector("#answer-area");
  area.innerHTML = `<div class="answer-options">${currentQuestion.options.map(option => `<button class="answer-option" data-answer="${option}">${option}</button>`).join("")}</div>`;
  area.querySelectorAll(".answer-option").forEach(option => option.addEventListener("click", () => {
    selectedAnswer = option.dataset.answer;
    area.querySelectorAll(".answer-option").forEach(item => item.classList.remove("selected"));
    option.classList.add("selected");
  }));
}
document.querySelector("#check-answer").addEventListener("click", () => {
  const feedback = document.querySelector("#feedback");
  if (selectedAnswer === null) { feedback.textContent = "先選一個答案，再送出喔！"; return; }
  if (selectedAnswer === currentQuestion.answer) {
    correctCount++; localStorage.setItem("math-helper-correct", correctCount);
    document.querySelector("#streak").textContent = correctCount;
    feedback.textContent = "答對了！你有仔細想一想，真棒！"; feedback.className = "feedback correct";
  } else {
    feedback.textContent = `再想一下。${currentQuestion.misconception || "看看提示找出答案吧！"}`;
    feedback.className = "feedback wrong";
  }
  document.querySelector("#answer-area").querySelectorAll("button").forEach(button => button.disabled = true);
  document.querySelector("#check-answer").classList.add("hidden");
  document.querySelector("#next-question").classList.remove("hidden");
});
document.querySelector("#next-question").addEventListener("click", nextQuestion);
document.querySelector("#show-hint").addEventListener("click", () => {
  document.querySelector("#hint").textContent = `小提示：${currentQuestion.hint}`;
  document.querySelector("#hint").classList.remove("hidden");
});

document.querySelectorAll(".tab").forEach(tab => tab.addEventListener("click", () => {
  document.querySelectorAll(".tab, .panel").forEach(item => item.classList.remove("active"));
  tab.classList.add("active"); document.querySelector(`#${tab.dataset.tab}`).classList.add("active");
}));
document.querySelector("#ask-helper").addEventListener("click", () => {
  const text = document.querySelector("#problem-input").value.trim();
  document.querySelector("#helper-response").innerHTML = text ? explainProblem(text) : "<div class=\"empty-state\">先把題目寫下來，小老師才能幫你喔！</div>";
});
document.querySelector("#similar-problem").addEventListener("click", () => {
  const topic = currentTopic || pick(topics), generated = topic.make();
  document.querySelector("#helper-response").innerHTML = `<div class="response-title">來挑戰類似題！</div><div class="similar"><strong>${generated.text}</strong><p>先自己算算看，再回到「數感練習」選 ${topic.name} 核對答案。</p></div>`;
});
function explainProblem(text) {
  const numbers = text.match(/\d+/g)?.map(Number) || [];
  let steps = [];
  if (/[+加]/.test(text) && numbers.length >= 2) {
    steps = [`這是一個「合起來」的問題，要用加法。`, `先算個位：${numbers[0] % 10} + ${numbers[1] % 10}。`, `再算十位：${Math.floor(numbers[0] / 10)} + ${Math.floor(numbers[1] / 10)}，別忘了檢查有沒有進位。`];
  } else if (/[-減找回]/.test(text) && numbers.length >= 2) {
    steps = [`這是一個「剩下多少或找回多少」的問題，要用減法。`, `可以想成「${numbers[1]} 加多少會到 ${numbers[0]}？」。`, `最後用加法驗算：答案加上拿走的數，應該回到原來的數。`];
  } else if (/[×xX乘每盒每組]/.test(text) && numbers.length >= 2) {
    steps = [`看到「每一組一樣多」，可以用乘法。`, `把相同的數連加：${numbers[1]} + ${numbers[1]} + ……，共 ${numbers[0]} 組。`, `連加也能記成 ${numbers[0]} × ${numbers[1]}。`];
  } else {
    steps = [`先找題目中的數字和關鍵詞。`, `想一想：這題是在合起來（加）、拿走（減），還是好幾組一樣多（乘）？`, `把你想到的算式寫出來，再用反方向的算式檢查答案。`];
  }
  return `<div class="response-title">我們一起拆解這題</div>${steps.map((step, i) => `<div class="step"><strong>第 ${i + 1} 步：</strong>${step}</div>`).join("")}<p>你可以再按「出一道類似題」練習一次，學會了就會越來越快！</p>`;
}
