let pinHolder = document.getElementById("text");
let copyHolder = document.getElementById("copy");
let langHolder = document.getElementById("language");

let head1 = document.getElementById("headOne");
let head2 = document.getElementById("headTwo");
let desc1 = document.getElementById("descOne");
let desc2 = document.getElementById("descTwo");

function get_pos(digit) {
  const positions = {
    1: [0, 0],
    2: [1, 0],
    3: [2, 0],
    4: [0, 1],
    5: [1, 1],
    6: [2, 1],
    7: [0, 2],
    8: [1, 2],
    9: [2, 2],
    0: [1, 3],
  };
  return positions[digit] || [0, 0];
}

function code_spread(code) {
  const digits = Array.from(code).map((c) => parseInt(c, 10));
  const distances = [];

  for (let i = 0; i < digits.length - 1; i++) {
    const [x1, y1] = get_pos(digits[i]);
    const [x2, y2] = get_pos(digits[i + 1]);
    const dist = Math.hypot(x2 - x1, y2 - y1);
    distances.push(dist);
  }

  if (distances.length === 0) return 0.0;
  const sum = distances.reduce((acc, val) => acc + val, 0);
  return sum / distances.length;
}

function analyzeNumberBinary(number) {
  const s = number.toString().padStart(4, "0");

  if (s.length !== 4 || !/^\d{4}$/.test(s)) {
    return "Number must be a 4-digit numeric string only.";
  }

  const digits = [...s].map((ch) => parseInt(ch, 10));

  const hasRepetition = new Set(s).size !== s.length ? 1 : 0;

  const isAscending = digits.every((d, i, arr) => {
    if (i === arr.length - 1) return true;
    return arr[i] + 1 === arr[i + 1];
  });

  const isDescending = digits.every((d, i, arr) => {
    if (i === arr.length - 1) return true;
    return arr[i] - 1 === arr[i + 1];
  });

  const isSequential = isAscending || isDescending ? 1 : 0;

  const isPalindrome = s === s.split("").reverse().join("") ? 1 : 0;

  const hasZero = s.includes("0") ? 1 : 0;

  // is_not_year: In Python, it was like: startswith '13' or '19'
  // meaning a four-digit number starting with 13 or 19 is not considered a year.
  const isNotYear = s.startsWith("13") || s.startsWith("19") ? 1 : 0;

  const uniqueNum = new Set(s).size;

  // Population standard deviation function:
  const pstdev = (arr) => {
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    const variance =
      arr.reduce((sum, val) => sum + (val - mean) ** 2, 0) / arr.length;
    return Math.sqrt(variance);
  };

  const aveDigitDistance = roundTo3(code_spread(s));
  const digitDistanceStd = roundTo3(pstdev(digits));

  return [
    hasRepetition,
    isSequential,
    isAscending ? 1 : 0,
    isDescending ? 1 : 0,
    isPalindrome,
    hasZero,
    isNotYear,
    uniqueNum,
    aveDigitDistance,
    digitDistanceStd,
  ];
}

function roundTo3(num) {
  return Math.round(num * 1000) / 1000;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function runONNX() {
  try {
    const session = await ort.InferenceSession.create("model/model1.onnx");

    while (true) {
      const num = getRandomInt(1000, 9999);
      const num_list = analyzeNumberBinary(num);
      const inputTensor = new ort.Tensor(
        "float32",
        new Float32Array(num_list),
        [1, 10]
      );

      const feeds = { input: inputTensor };
      const results = await session.run(feeds);

      const labelTensor = results["label"];
      const probsTensor = results["probabilities"];

      const predictedLabel = Number(labelTensor.data[0]);
      if (predictedLabel > 3) {
        pinHolder.innerHTML = num;
        break;
      }
    }
  } catch (e) {
    console.error("Inference failed:", e);
  }
}

runONNX();

function CopyPin() {
  if (pinHolder.innerHTML != "----") {
    pinHolder.focus();
    navigator.clipboard.writeText(pinHolder.innerHTML);

    copyHolder.innerHTML = "Copied!";

    setTimeout(function () {
      copyHolder.innerHTML = "Copy";
    }, 3000);
  }
}

function ChangeLanguage() {
  if (langHolder.innerHTML == "fa") {
    langHolder.innerHTML = "en";
    head1.innerHTML = "ایجاد پین امن برای کارت اعتباری";
    head2.innerHTML =
      "با ایجاد پین‌های معتبر برای کارت اعتباری به راحتی، امنیت مالی خود را تضمین کنید";
    desc1.style.textAlign = "right";
    desc1.innerHTML = "چرا باید از این وب‌سایت استفاده کنیم؟";
    desc2.style.direction = "rtl";
    desc2.style.textAlign = "justify";
    desc2.innerHTML =
      "با استفاده از این وب‌سایت، می‌توانید به راحتی و با اطمینان پین‌های امن و معتبر برای کارت‌های اعتباری خود تولید کنید. امنیت مالی یک نگرانی حیاتی است که همیشه باید مورد توجه باشد، و استفاده از این سرویس می‌تواند به اطمینان از معاملات مالی شما کمک کند. با استفاده از روش‌های قوی و مدرن ارائه شده توسط این سایت، شما می‌توانید از حفظ امنیت و اعتماد در تمامی معاملات مالی خود لذت ببرید.";
  } else if (langHolder.innerHTML == "en") {
    langHolder.innerHTML = "fa";
    head1.innerHTML = "Generate Safe PIN for Credit Card";
    head2.innerHTML =
      "Ensure your financial security by creating valid credit card PINs effortlessly";
    desc1.style.textAlign = "left";
    desc1.innerHTML = "Why should we use this website?";
    desc2.style.direction = "ltr";
    desc2.style.textAlign = "justify";
    desc2.innerHTML =
      "By using this website, you can easily and confidently generate secure and valid PINs for your credit cards. Financial security is a vital concern that should always be addressed, and utilizing this service can help ensure confidence in your financial transactions. With the robust and modern methods provided by this site, you can enjoy the preservation of security and trust in all your financial transactions.";
  }
}
