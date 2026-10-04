/**
 * 數感遊樂園 - 成績紀錄 API（資料最小化與輸入驗證版）
 *
 * 請貼在綁定 Google 試算表的 Apps Script 專案，部署為網頁應用程式。
 * 本版不提供全校學生名單；學生以暱稱／代號提交，避免公開 roster API 洩露姓名。
 *
 * 欄位：時間戳記 | 班級 | 暱稱／代號 | 關卡 | 難度 | 秒數 | 分數 | 最高連續答對
 *
 * 注意：前端提供的分數仍可被使用者修改；本 API 做格式與範圍檢查，並非防作弊系統。
 */

var SHEET_NAME = '成績紀錄';
var HEADERS = ['時間戳記', '班級', '暱稱／代號', '關卡', '難度', '秒數', '分數', '最高連續答對'];

// 與目前前端班級下拉選單一致；新增班級時請同步更新。
var ALLOWED_CLASSES = [
  '一甲', '一乙', '二甲', '二乙', '三甲', '三乙',
  '四甲', '四乙', '五甲', '五乙', '六甲', '六乙'
];
var ALLOWED_MODES = ['乘法快手', '加減挑戰', '拆解特攻', '因數獵人', '倍數達人'];
var ALLOWED_DIFFICULTIES = ['簡單', '中等', '困難'];
var ALLOWED_SECONDS = [30, 60, 90];
var MAX_SCORE = 2000;
var MAX_STREAK = 150;

function doGet(e) {
  var action = e && e.parameter ? String(e.parameter.action || '') : '';
  if (action === 'roster') {
    // 刻意停用公開名單 API。舊前端收到 ok:false 後會保留手動輸入暱稱／代號。
    return json_({ ok: false, error: 'roster_disabled' });
  }
  return json_({ ok: true, message: '數感遊樂園成績 API 運作中；學生名單 API 未開放。' });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  var lockAcquired = false;

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json_({ ok: false, error: 'missing_request_body' });
    }

    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseError) {
      return json_({ ok: false, error: 'invalid_json' });
    }

    var item = validatePayload_(data);
    lock.waitLock(15000);
    lockAcquired = true;

    var sheet = getSheet_();
    var timestamp = new Date();
    var insertedRow = sheet.getLastRow() + 1;

    sheet.appendRow([
      timestamp,
      item.className,
      safeForSheet_(item.nickname),
      item.mode,
      item.diff,
      item.seconds,
      item.score,
      item.bestStreak
    ]);

    // 排名依「班級 + 關卡 + 難度 + 秒數」計算，避免不同班級互相混榜。
    var values = sheet.getDataRange().getValues();
    var matched = [];
    for (var i = 1; i < values.length; i++) {
      var row = values[i];
      if (
        String(row[1]) === item.className &&
        String(row[3]) === item.mode &&
        String(row[4]) === item.diff &&
        Number(row[5]) === item.seconds
      ) {
        matched.push({ sheetRow: i + 1, score: Number(row[6]) || 0 });
      }
    }

    matched.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return a.sheetRow - b.sheetRow; // 同分時先交卷者在前
    });

    var rank = 0;
    for (var j = 0; j < matched.length; j++) {
      if (matched[j].sheetRow === insertedRow) {
        rank = j + 1;
        break;
      }
    }

    return json_({ ok: true, rank: rank, total: matched.length });
  } catch (err) {
    // 不把試算表名稱、堆疊或其他內部細節回傳給瀏覽器。
    console.error('Score API error: ' + (err && err.stack ? err.stack : err));
    return json_({ ok: false, error: 'request_failed' });
  } finally {
    if (lockAcquired) lock.releaseLock();
  }
}

function validatePayload_(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Payload must be an object');
  }

  var className = cleanText_(data.className, 12);
  var nickname = cleanText_(data.nickname, 20);
  var mode = cleanText_(data.mode, 20);
  var diff = cleanText_(data.diff, 10);
  var seconds = strictInteger_(data.seconds, 30, 90, 'seconds');
  var score = strictInteger_(data.score, 0, MAX_SCORE, 'score');
  var bestStreak = strictInteger_(data.bestStreak, 0, MAX_STREAK, 'bestStreak');

  if (ALLOWED_CLASSES.indexOf(className) === -1) throw new Error('Invalid class');
  if (!nickname) throw new Error('Nickname is required');
  if (ALLOWED_MODES.indexOf(mode) === -1) throw new Error('Invalid mode');
  if (ALLOWED_DIFFICULTIES.indexOf(diff) === -1) throw new Error('Invalid difficulty');
  if (ALLOWED_SECONDS.indexOf(seconds) === -1) throw new Error('Invalid duration');

  return {
    className: className,
    nickname: nickname,
    mode: mode,
    diff: diff,
    seconds: seconds,
    score: score,
    bestStreak: bestStreak
  };
}

function cleanText_(value, maxLength) {
  if (value === null || value === undefined) return '';
  var text = String(value).replace(/[\u0000-\u001F\u007F]/g, '').trim();
  if (text.length > maxLength) throw new Error('Text too long');
  return text;
}

function strictInteger_(value, min, max, fieldName) {
  if (typeof value === 'string' && value.trim() === '') throw new Error('Invalid ' + fieldName);
  var number = Number(value);
  if (!isFinite(number) || Math.floor(number) !== number || number < min || number > max) {
    throw new Error('Invalid ' + fieldName);
  }
  return number;
}

/** 防止以公式字元開頭的文字被試算表當成公式執行。 */
function safeForSheet_(value) {
  var text = String(value == null ? '' : value).trim();
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('No active spreadsheet');

  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json_(object) {
  return ContentService
    .createTextOutput(JSON.stringify(object))
    .setMimeType(ContentService.MimeType.JSON);
}
