/**
 * 數字森林闖關 - 後台紀錄系統
 * 部署方式：
 * 1. 開一個新的 Google 表單試算表（Google Sheets）。
 * 2. 上方選單「擴充功能」→「Apps Script」。
 * 3. 把這個檔案的全部內容貼進去，取代原本的內容。
 * 4. 上方工具列的函式下拉選單選「setupSheets」，按執行（▶），
 *    第一次執行會跳出授權視窗，允許即可。這會自動建立工作表：
 *    「名單」「作答紀錄」「學生總覽」「數感特訓紀錄」，
 *    以及數學勇士大挑戰用的「診斷測驗紀錄」「診斷作答明細」「診斷指標總覽」「診斷團體戰」。
 *    這一份後台程式同時服務「數字森林闖關」和「數感快手」兩個遊戲，
 *    只要部署一次、一個網址，兩邊遊戲都能用。
 * 5. 執行完後，去「名單」工作表，把全校/全班的班級、座號、姓名填進去
 *    （第一列是標題列，不要刪，從第二列開始填資料）。
 * 6. 上方選單「部署」→「新增部署作業」：
 *      類型選「網頁應用程式」
 *      「執行身份」選「我」
 *      「可存取權限」一定要選「任何人」（不要選「知道 Google 帳戶的任何人」，
 *       不然孩子在遊戲裡送資料會失敗）
 * 7. 按部署，會給你一個網址，長得像：
 *      https://script.google.com/macros/s/AKfycb.../exec
 *    把這個網址複製起來，貼到任一個遊戲網頁右上角的齒輪圖示設定裡即可（兩個遊戲共用同一個網址）。
 * 8. 之後如果你修改了這個程式碼，要「部署」→「管理部署作業」→
 *    點編輯（鉛筆）→版本選「新版本」→部署，網址才會套用新的程式碼。
 *
 * 「作答紀錄」和「數感特訓紀錄」都是最新的一筆放在標題列正下方（最上面），
 * 不用每次都捲到表格最下面找最新資料。如果你原本已經有累積的舊資料，
 * 那些舊資料還是照原本的順序（舊到新）留在下面，只有之後新送出的成績才會補在最上面；
 * 想要整份都變成新到舊，可以自己選取資料範圍後用「資料」→「排序範圍」依時間欄位遞減排序一次。
 */

var SHEET_ROSTER = '名單';
var SHEET_LOG = '作答紀錄';
var SHEET_SUMMARY = '學生總覽';
var SHEET_NS = '數感特訓紀錄';

// ---- 數學勇士大挑戰（學習診斷）----
var SHEET_DX = '診斷測驗紀錄';
var SHEET_DX_ITEMS = '診斷作答明細';
var SHEET_DX_ROOM = '診斷團體戰';
var SHEET_DX_SUMMARY = '診斷指標總覽';
// 老師金鑰：填一串只有老師知道的英數字（例如 'k7Q2m9xP'），存檔後重新部署。
// 在遊戲的「老師專區」輸入同一串，就能從試算表讀回全班的診斷總表。
// 留空代表不開放讀取（學生姓名不會被公開讀出）。
var DX_TEACHER_KEY = '';

function getSheet_(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  return sheet;
}

/**
 * 把新紀錄插在標題列正下方（最新的在最上面），而不是加在表格最後面，
 * 這樣老師打開試算表不用捲到最下面才看得到最新的紀錄。
 */
function prependRow_(sheet, header, values) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(header);
    sheet.setFrozenRows(1);
  }
  sheet.insertRowAfter(1);
  sheet.getRange(2, 1, 1, values.length).setValues([values]);
}

/**
 * 執行一次即可：建立四個工作表與標題列/公式。
 */
function setupSheets() {
  var roster = getSheet_(SHEET_ROSTER);
  if (roster.getLastRow() === 0) {
    roster.appendRow(['班級', '座號', '姓名']);
    roster.setFrozenRows(1);
  }

  var log = getSheet_(SHEET_LOG);
  if (log.getLastRow() === 0) {
    log.appendRow(['時間', '班級', '姓名', '關卡ID', '關卡名稱', '分類', '答對題數', '總題數', '星數']);
    log.setFrozenRows(1);
  }

  var summary = getSheet_(SHEET_SUMMARY);
  summary.clear();
  summary.appendRow(['班級', '姓名', '分類', '平均星數', '作答次數', '答對率(%)']);
  summary.setFrozenRows(1);
  summary.getRange('A2').setFormula(
    '=IFERROR(QUERY(' + SHEET_LOG + '!A:I,' +
    '"select B, C, F, avg(I), count(I), avg(G)/avg(H)*100 ' +
    'where B is not null and B <> \'\' ' +
    'group by B, C, F ' +
    'order by B, C, F ' +
    'label avg(I) \'\', count(I) \'\', avg(G)/avg(H)*100 \'\'", 0),"")'
  );

  var ns = getSheet_(SHEET_NS);
  if (ns.getLastRow() === 0) {
    ns.appendRow(['時間', '班級', '姓名', '模式', '答對題數', '總題數', 'XP', '平均反應時間(ms)', '等級']);
    ns.setFrozenRows(1);
  }

  dxSetup_();

  SpreadsheetApp.getActiveSpreadsheet().toast('設定完成！請到「名單」工作表填班級與姓名。');
}

/**
 * 給遊戲讀取班級名單用的（GET ?action=roster）
 */
function doGet(e) {
  var action = e.parameter.action;
  if (action === 'diagRoom') return dxJson_(dxRoom_(e.parameter.room));
  if (action === 'diagMatrix') return dxJson_(dxMatrix_(e.parameter.key, e.parameter.cls));
  if (action === 'roster') {
    var sheet = getSheet_(SHEET_ROSTER);
    var lastRow = sheet.getLastRow();
    var roster = {};
    if (lastRow > 1) {
      var data = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
      for (var i = 0; i < data.length; i++) {
        var cls = String(data[i][0] || '').trim();
        var name = String(data[i][2] || '').trim();
        if (!cls || !name) continue;
        if (!roster[cls]) roster[cls] = [];
        roster[cls].push(name);
      }
    }
    return ContentService.createTextOutput(JSON.stringify({ ok: true, roster: roster }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  if (action === 'nsLeaderboard') {
    var nsSheet = getSheet_(SHEET_NS);
    var nsLastRow = nsSheet.getLastRow();
    var totals = {};
    if (nsLastRow > 1) {
      var nsData = nsSheet.getRange(2, 1, nsLastRow - 1, 9).getValues();
      for (var i = 0; i < nsData.length; i++) {
        var cls = String(nsData[i][1] || '').trim();
        var name = String(nsData[i][2] || '').trim();
        var xp = Number(nsData[i][6]) || 0;
        var lvl = Number(nsData[i][8]) || 1;
        if (!cls || !name) continue;
        var key = cls + '\u0001' + name;
        if (!totals[key]) totals[key] = { className: cls, studentName: name, totalXp: 0, maxLevel: 1 };
        totals[key].totalXp += xp;
        if (lvl > totals[key].maxLevel) totals[key].maxLevel = lvl;
      }
    }
    var list = Object.keys(totals).map(function (k) { return totals[k]; });
    list.sort(function (a, b) { return b.totalXp - a.totalXp; });
    return ContentService.createTextOutput(JSON.stringify({ ok: true, leaderboard: list.slice(0, 50) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput(JSON.stringify({ ok: true, msg: '數字森林闖關 API' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 給遊戲送出成績用的（POST，body 是 JSON）
 * body.type === 'numberSense' 時記錄到「數感特訓紀錄」，否則記錄到「作答紀錄」（數字森林闖關）
 */
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);

    if (body.type === 'diagnostic') return dxJson_(dxSaveResult_(body));
    if (body.type === 'diagProgress') return dxJson_(dxProgress_(body));

    if (body.type === 'numberSense') {
      var nsSheet = getSheet_(SHEET_NS);
      prependRow_(nsSheet, ['時間', '班級', '姓名', '模式', '答對題數', '總題數', 'XP', '平均反應時間(ms)', '等級'], [
        new Date(),
        body.className || '',
        body.studentName || '',
        body.mode || '',
        body.correct || 0,
        body.total || 0,
        body.xp || 0,
        body.avgReactionMs || 0,
        body.level || 1
      ]);
      return ContentService.createTextOutput(JSON.stringify({ ok: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var sheet = getSheet_(SHEET_LOG);
    prependRow_(sheet, ['時間', '班級', '姓名', '關卡ID', '關卡名稱', '分類', '答對題數', '總題數', '星數'], [
      new Date(),
      body.className || '',
      body.studentName || '',
      body.stageId || '',
      body.stageTitle || '',
      body.category || '',
      body.correct || 0,
      body.total || 0,
      body.stars || 0
    ]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/* =====================================================================
 * 數學勇士大挑戰（diagnostic.html）— 學習診斷紀錄
 *
 * 會用到四個工作表（第一次收到資料時自動建立，也可以重新執行 setupSheets）：
 *  「診斷測驗紀錄」每做完一次測驗一列：答對率、未通過／需加強的指標代碼。
 *  「診斷作答明細」每一題一列：指標代碼、題目、孩子的答案、正確答案、對錯、可能的迷思。
 *                  用「篩選」把「答對(1/0)」選 0，就是每個孩子的錯題清單。
 *  「診斷指標總覽」自動統計每個孩子在每個指標的作答題數與答對題數。
 *  「診斷團體戰」團體戰時每個孩子的即時進度（只用來算隊伍分數）。
 *
 * 公開的 GET 只回傳隊伍分數與指標統計，不回傳學生姓名；
 * 讀回全班姓名與診斷結果需要上方的 DX_TEACHER_KEY。
 * ===================================================================== */

var DX_HEADER = ['時間', '測驗ID', '班級', '姓名', '模式', '房間', '隊伍', '答對題數', '總題數',
  '答對率(%)', '分數', '未通過指標', '需加強指標', '指標結果(JSON)', '錯題(JSON)'];
var DX_ITEM_HEADER = ['時間', '測驗ID', '班級', '姓名', '模式', '題號', '指標代碼', '指標內容',
  '題目', '學生答案', '正確答案', '答對(1/0)', '可能迷思'];
var DX_ROOM_HEADER = ['更新時間', '房間', '隊伍', '班級', '姓名', '已答題數', '答對題數', '分數', '完成', '指標統計'];
var DX_MODES = ['個人戰', '團體戰', '複測'];
var DX_TEAMS = ['紅隊', '藍隊', '綠隊', '黃隊'];
var DX_CODE_RE = /^[A-Z]{2}-\d{1,2}-\d{1,2}-\d{1,2}$/;
var DX_ROOM_RE = /^[1-9]\d{3}$/;

function dxJson_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function dxText_(value, maxLength) {
  if (value === null || value === undefined) return '';
  var text = String(value).replace(/[\u0000-\u001F\u007F]/g, ' ').trim();
  return text.length > maxLength ? text.slice(0, maxLength) : text;
}

function dxInt_(value, min, max) {
  var n = Math.round(Number(value));
  if (!isFinite(n)) n = min;
  return Math.max(min, Math.min(max, n));
}

/** 以 = + - @ 開頭的文字前面加 '，避免被試算表當成公式。 */
function dxSafe_(value) {
  var text = String(value === null || value === undefined ? '' : value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function dxCodes_(obj) {
  var out = {};
  if (!obj || typeof obj !== 'object') return out;
  var n = 0;
  for (var k in obj) {
    if (!obj.hasOwnProperty(k) || !DX_CODE_RE.test(k) || ++n > 40) continue;
    var v = obj[k];
    if (!v || v.length !== 2) continue;
    out[k] = [dxInt_(v[0], 0, 80), dxInt_(v[1], 0, 80)];
  }
  return out;
}

function dxEnsure_(name, header) {
  var sheet = getSheet_(name);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(header);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function dxEnsureSummary_() {
  var sheet = getSheet_(SHEET_DX_SUMMARY);
  if (sheet.getLastRow() > 0) return;
  sheet.getRange('A1').setFormula(
    '=IFERROR(QUERY(\'' + SHEET_DX_ITEMS + '\'!A:M,' +
    '"select C, D, G, H, count(L), sum(L) where G is not null ' +
    'group by C, D, G, H order by C, D, G ' +
    'label count(L) \'作答題數\', sum(L) \'答對題數\'", 1),"")'
  );
}

function dxSetup_() {
  dxEnsure_(SHEET_DX, DX_HEADER);
  dxEnsure_(SHEET_DX_ITEMS, DX_ITEM_HEADER);
  dxEnsure_(SHEET_DX_ROOM, DX_ROOM_HEADER);
  dxEnsureSummary_();
}

/** 與前端相同的判斷：全對＝通過；2題以上答對一半以上＝需加強；其餘＝未通過。 */
function dxStatus_(right, total) {
  if (right === total) return 'pass';
  if (total >= 2 && right * 2 >= total) return 'weak';
  return 'fail';
}

function dxSaveResult_(b) {
  var testId = dxText_(b.testId, 40);
  if (!/^[A-Za-z0-9_-]{6,40}$/.test(testId)) return { ok: false, error: 'bad_test_id' };
  var cls = dxText_(b.className, 12);
  var name = dxText_(b.studentName, 20);
  if (!cls || !name) return { ok: false, error: 'missing_identity' };
  var mode = DX_MODES.indexOf(b.mode) > -1 ? b.mode : '個人戰';
  var room = DX_ROOM_RE.test(String(b.room || '')) ? String(b.room) : '';
  var team = DX_TEAMS.indexOf(b.team) > -1 ? b.team : '';
  var items = Array.isArray(b.items) ? b.items.slice(0, 80) : [];
  if (!items.length) return { ok: false, error: 'no_items' };

  var right = 0, codes = {}, clean = [], wrong = [];
  for (var i = 0; i < items.length; i++) {
    var it = items[i] || {};
    var code = DX_CODE_RE.test(String(it.code)) ? String(it.code) : '';
    var ok = it.ok === true;
    if (ok) right++;
    if (code) {
      if (!codes[code]) codes[code] = [0, 0];
      codes[code][1]++;
      if (ok) codes[code][0]++;
    }
    var row = {
      no: i + 1, code: code, codeName: dxText_(it.codeName, 60), q: dxText_(it.q, 200),
      given: dxText_(it.given, 40), ans: dxText_(it.ans, 40), ok: ok, err: dxText_(it.err, 80)
    };
    clean.push(row);
    if (!ok) wrong.push({ no: row.no, code: row.code, q: row.q, given: row.given, ans: row.ans, err: row.err });
  }
  var fail = [], weak = [];
  for (var c in codes) {
    var st = dxStatus_(codes[c][0], codes[c][1]);
    if (st === 'fail') fail.push(c);
    else if (st === 'weak') weak.push(c);
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var sheet = dxEnsure_(SHEET_DX, DX_HEADER);
    // 平板離線後補送時，同一份測驗可能送兩次：用測驗ID去重。
    var last = sheet.getLastRow();
    if (last > 1) {
      var ids = sheet.getRange(2, 2, Math.min(last - 1, 2000), 1).getValues();
      for (var j = 0; j < ids.length; j++) {
        if (String(ids[j][0]) === testId) return { ok: true, duplicate: true };
      }
    }
    var now = new Date();
    prependRow_(sheet, DX_HEADER, [
      now, testId, dxSafe_(cls), dxSafe_(name), mode, room, team, right, items.length,
      Math.round(right * 100 / items.length), dxInt_(b.score, 0, 100000),
      fail.join('、'), weak.join('、'), JSON.stringify(codes), JSON.stringify(wrong)
    ]);

    var itemSheet = dxEnsure_(SHEET_DX_ITEMS, DX_ITEM_HEADER);
    var rows = clean.map(function (x) {
      return [now, testId, dxSafe_(cls), dxSafe_(name), mode, x.no, x.code, dxSafe_(x.codeName),
        dxSafe_(x.q), dxSafe_(x.given), dxSafe_(x.ans), x.ok ? 1 : 0, dxSafe_(x.err)];
    });
    itemSheet.insertRowsAfter(1, rows.length);
    itemSheet.getRange(2, 1, rows.length, DX_ITEM_HEADER.length).setValues(rows);
    dxEnsureSummary_();
  } finally {
    lock.releaseLock();
  }
  return { ok: true };
}

function dxProgress_(b) {
  var room = String(b.room || '');
  if (!DX_ROOM_RE.test(room)) return { ok: false, error: 'bad_room' };
  var team = DX_TEAMS.indexOf(b.team) > -1 ? b.team : '';
  if (!team) return { ok: false, error: 'bad_team' };
  var cls = dxText_(b.className, 12);
  var name = dxText_(b.studentName, 20);
  if (!cls || !name) return { ok: false, error: 'missing_identity' };
  var row = [new Date(), Number(room), team, dxSafe_(cls), dxSafe_(name),
    dxInt_(b.answered, 0, 80), dxInt_(b.correct, 0, 80), dxInt_(b.score, 0, 100000),
    b.done === true ? '是' : '', JSON.stringify(dxCodes_(b.codes))];

  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var sheet = dxEnsure_(SHEET_DX_ROOM, DX_ROOM_HEADER);
    var last = sheet.getLastRow(), target = 0;
    if (last > 1) {
      var v = sheet.getRange(2, 2, last - 1, 4).getValues(); // 房間, 隊伍, 班級, 姓名
      for (var i = 0; i < v.length; i++) {
        if (String(v[i][0]) === room && String(v[i][2]) === cls && String(v[i][3]) === name) { target = i + 2; break; }
      }
    }
    if (target) sheet.getRange(target, 1, 1, row.length).setValues([row]);
    else sheet.appendRow(row);
  } finally {
    lock.releaseLock();
  }
  return { ok: true };
}

/** 團體戰排行榜：只回傳隊伍統計，不回傳姓名。12 小時前的同號房間資料不列入。 */
function dxRoom_(room) {
  room = String(room || '');
  var res = { ok: true, room: room, teams: [], codes: {} };
  if (!DX_ROOM_RE.test(room)) return res;
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_DX_ROOM);
  if (!sheet || sheet.getLastRow() < 2) return res;
  var v = sheet.getRange(2, 1, sheet.getLastRow() - 1, DX_ROOM_HEADER.length).getValues();
  var since = Date.now() - 12 * 3600 * 1000, teams = {};
  for (var i = 0; i < v.length; i++) {
    var r = v[i];
    if (String(r[1]) !== room) continue;
    var ts = r[0] instanceof Date ? r[0].getTime() : 0;
    if (ts < since) continue;
    var t = String(r[2]);
    if (!teams[t]) teams[t] = { team: t, members: 0, finished: 0, score: 0, answered: 0, correct: 0 };
    var g = teams[t];
    g.members++;
    if (String(r[8]) === '是') g.finished++;
    g.score += Number(r[7]) || 0;
    g.answered += Number(r[5]) || 0;
    g.correct += Number(r[6]) || 0;
    try {
      var c = JSON.parse(r[9] || '{}');
      for (var k in c) {
        if (!DX_CODE_RE.test(k)) continue;
        if (!res.codes[k]) res.codes[k] = [0, 0];
        res.codes[k][0] += Number(c[k][0]) || 0;
        res.codes[k][1] += Number(c[k][1]) || 0;
      }
    } catch (e) {}
  }
  DX_TEAMS.forEach(function (name) {
    if (!teams[name]) return;
    teams[name].avg = Math.round(teams[name].score / teams[name].members);
    res.teams.push(teams[name]);
  });
  return res;
}

/** 老師讀回全班診斷結果（需要 DX_TEACHER_KEY）。 */
function dxMatrix_(key, cls) {
  if (!DX_TEACHER_KEY || String(key || '') !== DX_TEACHER_KEY) return { ok: false, error: 'forbidden' };
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_DX);
  if (!sheet || sheet.getLastRow() < 2) return { ok: true, results: [] };
  var n = Math.min(sheet.getLastRow() - 1, 800);
  var v = sheet.getRange(2, 1, n, DX_HEADER.length).getValues();
  cls = dxText_(cls, 12);
  var out = [];
  for (var i = 0; i < v.length; i++) {
    var r = v[i];
    if (cls && String(r[2]) !== cls) continue;
    var codes = {}, wrong = [];
    try { codes = JSON.parse(r[13] || '{}'); } catch (e) {}
    try { wrong = JSON.parse(r[14] || '[]'); } catch (e) {}
    out.push({
      id: String(r[1]), ts: r[0] instanceof Date ? r[0].getTime() : 0, cls: String(r[2]), name: String(r[3]),
      mode: String(r[4]), room: String(r[5]), team: String(r[6]), right: Number(r[7]) || 0,
      total: Number(r[8]) || 0, score: Number(r[10]) || 0, codes: codes, wrong: wrong
    });
  }
  return { ok: true, results: out };
}
