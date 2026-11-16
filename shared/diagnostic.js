/* 數學勇士大挑戰：各年級共用的遊戲引擎
 * 每個年級的頁面先載入這個檔，再用 DX.start(config) 傳入自己的題庫：
 *   config = { grade, title, homeLabel, maxDigits, areas, gen, plan, codes, kidNames }
 * 題庫的產生函式可以使用 DX 提供的工具（亂數、選項、注音、畫圖）。 */
(function(){
  "use strict";

  /* ================= 注音 ================= */
  var CHAR_ZY = {
    "數":"ㄕㄨˇ","字":"ㄗˋ","森":"ㄙㄣ","林":"ㄌㄧㄣˊ","闖":"ㄔㄨㄤˇ","關":"ㄍㄨㄢ",
    "一":"ㄧ","年":"ㄋㄧㄢˊ","級":"ㄐㄧˊ","樂":"ㄌㄜˋ","園":"ㄩㄢˊ","個":"ㄍㄜˋ","卡":"ㄎㄚˇ",
    "起":"ㄑㄧˇ","玩":"ㄨㄢˊ","遊":"ㄧㄡˊ","戲":"ㄒㄧˋ","學":"ㄒㄩㄝˊ","已":"ㄧˇ","經":"ㄐㄧㄥ",
    "得":"ㄉㄜˊ","到":"ㄉㄠˋ","顆":"ㄎㄜ","星":"ㄒㄧㄥ","共":"ㄍㄨㄥˋ","返":"ㄈㄢˇ","回":"ㄏㄨㄟˊ",
    "地":"ㄉㄧˋ","圖":"ㄊㄨˊ","再":"ㄗㄞˋ","次":"ㄘˋ","下":"ㄒㄧㄚˋ","題":"ㄊㄧˊ","查":"ㄔㄚˊ",
    "看":"ㄎㄢˋ","結":"ㄐㄧㄝˊ","果":"ㄍㄨㄛˇ","答":"ㄉㄚˊ","對":"ㄉㄨㄟˋ","了":"˙ㄌㄜ","太":"ㄊㄞˋ",
    "棒":"ㄅㄤˋ","想":"ㄒㄧㄤˇ","正":"ㄓㄥˋ","確":"ㄑㄩㄝˋ","案":"ㄢˋ","是":"ㄕˋ","綠":"ㄌㄩˋ",
    "色":"ㄙㄜˋ","的":"˙ㄉㄜ","第":"ㄉㄧˋ","多":"ㄉㄨㄛ","加":"ㄐㄧㄚ","油":"ㄧㄡˊ","你":"ㄋㄧˇ",
    "會":"ㄏㄨㄟˋ","越":"ㄩㄝˋ","半":"ㄅㄢˋ","繼":"ㄐㄧˋ","續":"ㄒㄩˋ","很":"ㄏㄣˇ","不":"ㄅㄨˋ",
    "錯":"ㄘㄨㄛˋ","喔":"ㄛ","快":"ㄎㄨㄞˋ","要":"ㄧㄠˋ","全":"ㄑㄩㄢˊ","部":"ㄅㄨˋ","小":"ㄒㄧㄠˇ",
    "達":"ㄉㄚˊ","人":"ㄖㄣˊ","積":"ㄐㄧ","木":"ㄇㄨˋ","屋":"ㄨ","認":"ㄖㄣˋ","識":"ㄕˋ","以":"ㄧˇ",
    "內":"ㄋㄟˋ","位":"ㄨㄟˋ","值":"ㄓˊ","大":"ㄉㄚˋ","冒":"ㄇㄠˋ","險":"ㄒㄧㄢˇ","分":"ㄈㄣ",
    "辨":"ㄅㄧㄢˋ","十":"ㄕˊ","和":"ㄏㄢˋ","比":"ㄅㄧˇ","誰":"ㄕㄟˊ","決":"ㄐㄩㄝˊ","排":"ㄆㄞˊ",
    "隊":"ㄉㄨㄟˋ","獎":"ㄐㄧㄤˇ","盃":"ㄅㄟ","順":"ㄕㄨㄣˋ","序":"ㄒㄩˋ","青":"ㄑㄧㄥ","蛙":"ㄨㄚ",
    "跳":"ㄊㄧㄠˋ","法":"ㄈㄚˇ","減":"ㄐㄧㄢˇ","用":"ㄩㄥˋ","算":"ㄙㄨㄢˋ","閱":"ㄩㄝˋ","讀":"ㄉㄨˊ",
    "理":"ㄌㄧˇ","解":"ㄐㄧㄝˇ","偵":"ㄓㄣ","探":"ㄊㄢˋ","故":"ㄍㄨˋ","事":"ㄕˋ","找":"ㄓㄠˇ",
    "出":"ㄔㄨ","商":"ㄕㄤ","店":"ㄉㄧㄢˋ","買":"ㄇㄞˇ","東":"ㄉㄨㄥ","西":"ㄒㄧ","錢":"ㄑㄧㄢˊ",
    "幣":"ㄅㄧˋ","練":"ㄌㄧㄢˋ","習":"ㄒㄧˊ","付":"ㄈㄨˋ","時":"ㄕˊ","鐘":"ㄓㄨㄥ","精":"ㄐㄧㄥ",
    "靈":"ㄌㄧㄥˊ","懂":"ㄉㄨㄥˇ","整":"ㄓㄥˇ","點":"ㄉㄧㄢˇ","曆":"ㄌㄧˋ","尋":"ㄒㄩㄣˊ","寶":"ㄅㄠˇ",
    "上":"ㄕㄤˋ","期":"ㄑㄧˊ","立":"ㄌㄧˋ","方":"ㄈㄤ","體":"ㄊㄧˇ","高":"ㄍㄠ","矮":"ㄞˇ",
    "量":"ㄌㄧㄤˊ","長":"ㄔㄤˊ","短":"ㄉㄨㄢˇ","抓":"ㄓㄨㄚ","路":"ㄌㄨˋ","線":"ㄒㄧㄢˋ","走":"ㄗㄡˇ",
    "哪":"ㄋㄚˇ","條":"ㄊㄧㄠˊ","較":"ㄐㄧㄠˋ","堆":"ㄉㄨㄟ","邊":"ㄅㄧㄢ","樣":"ㄧㄤˋ","右":"ㄧㄡˋ",
    "左":"ㄗㄨㄛˇ","幾":"ㄐㄧˇ","每":"ㄇㄟˇ","片":"ㄆㄧㄢˋ","荷":"ㄏㄜˊ","葉":"ㄧㄝˋ","有":"ㄧㄡˇ",
    "蘋":"ㄆㄧㄥˊ","又":"ㄧㄡˋ","摘":"ㄓㄞ","現":"ㄒㄧㄢˋ","原":"ㄩㄢˊ","本":"ㄅㄣˇ","氣":"ㄑㄧˋ",
    "球":"ㄑㄧㄡˊ","媽":"ㄇㄚ","糖":"ㄊㄤˊ","吃":"ㄔ","掉":"ㄉㄧㄠˋ","還":"ㄏㄞˊ","剩":"ㄕㄥˋ",
    "書":"ㄕㄨ","架":"ㄐㄧㄚˋ","借":"ㄐㄧㄝˋ","鉛":"ㄑㄧㄢ","筆":"ㄅㄧˇ","盒":"ㄏㄜˊ","裡":"ㄌㄧˇ",
    "枝":"ㄓ","今":"ㄐㄧㄣ","天":"ㄊㄧㄢ","她":"ㄊㄚ","給":"ㄍㄟˇ","同":"ㄊㄨㄥˊ","請":"ㄑㄧㄥˇ",
    "問":"ㄨㄣˋ","班":"ㄅㄢ","女":"ㄋㄩˇ","生":"ㄕㄥ","男":"ㄋㄢˊ","其":"ㄑㄧˊ","中":"ㄓㄨㄥ",
    "假":"ㄐㄧㄚˋ","沒":"ㄇㄟˊ","來":"ㄌㄞˊ","課":"ㄎㄜˋ","魚":"ㄩˊ","缸":"ㄍㄤ","紅":"ㄏㄨㄥˊ",
    "黑":"ㄏㄟ","放":"ㄈㄤˋ","進":"ㄐㄧㄣˋ","元":"ㄩㄢˊ","爸":"ㄅㄚˋ","他":"ㄊㄚ","當":"ㄉㄤ",
    "作":"ㄗㄨㄛˋ","勵":"ㄌㄧˋ","操":"ㄘㄠ","場":"ㄔㄤˇ","隻":"ㄓ","狗":"ㄍㄡˇ","在":"ㄗㄞˋ",
    "牠":"ㄊㄚ","們":"˙ㄇㄣ","白":"ㄅㄞˊ","過":"ㄍㄨㄛˋ","兒":"ㄦˊ","跑":"ㄆㄠˇ","彈":"ㄉㄢˋ",
    "珠":"ㄓㄨ","兩":"ㄌㄧㄤˇ","張":"ㄓㄤ","貼":"ㄊㄧㄝ","紙":"ㄓˇ","拿":"ㄋㄚˊ","剛":"ㄍㄤ",
    "好":"ㄏㄠˇ","款":"ㄎㄨㄢˇ","闆":"ㄅㄢˇ","謝":"ㄒㄧㄝˋ","囉":"˙ㄌㄨㄛ","試":"ㄕˋ","夠":"ㄍㄡˋ",
    "麵":"ㄇㄧㄢˋ","包":"ㄅㄠ","汁":"ㄓ","蠟":"ㄌㄚˋ","記":"ㄐㄧˋ","偶":"ㄡˇ","具":"ㄐㄩˋ",
    "巴":"ㄅㄚ","士":"ㄕˋ","厲":"ㄌㄧˋ","害":"ㄏㄞˋ","都":"ㄉㄡ","就":"ㄐㄧㄡˋ","購":"ㄍㄡˋ",
    "物":"ㄨˋ","成":"ㄔㄥˊ","功":"ㄍㄨㄥ","面":"ㄇㄧㄢˋ","月":"ㄩㄝˋ","日":"ㄖˋ","隔":"ㄍㄜˊ",
    "疊":"ㄉㄧㄝˊ","緞":"ㄉㄨㄢˋ","帶":"ㄉㄞˋ","迴":"ㄏㄨㄟˊ","紋":"ㄨㄣˊ","針":"ㄓㄣ","步":"ㄅㄨˋ",
    "明":"ㄇㄧㄥˊ","美":"ㄇㄟˇ","華":"ㄏㄨㄚˊ","阿":"ㄚ","強":"ㄑㄧㄤˊ","芳":"ㄈㄤ","傑":"ㄐㄧㄝˊ",
    "妹":"ㄇㄟˋ","弟":"ㄉㄧˋ","二":"ㄦˋ","三":"ㄙㄢ","四":"ㄙˋ","五":"ㄨˇ","六":"ㄌㄧㄡˋ",
    "七":"ㄑㄧ","八":"ㄅㄚ","九":"ㄐㄧㄡˇ","注":"ㄓㄨˋ","音":"ㄧㄣ","開":"ㄎㄞ","尺":"ㄔˇ",
    "少":"ㄕㄠˇ","老":"ㄌㄠˇ","這":"ㄓㄜˋ","重":"ㄔㄨㄥˊ","清":"ㄑㄧㄥ","空":"ㄎㄨㄥ",
    "目":"ㄇㄨˋ","前":"ㄑㄧㄢˊ","彎":"ㄨㄢ","曲":"ㄑㄩ","格":"ㄍㄜˊ","差":"ㄔㄚˋ","從":"ㄘㄨㄥˊ",
    "搬":"ㄅㄢ","家":"ㄐㄧㄚ","號":"ㄏㄠˋ","被":"ㄅㄟˋ","移":"ㄧˊ","動":"ㄉㄨㄥˋ","別":"ㄅㄧㄝˊ",
    "甲":"ㄐㄧㄚˇ","乙":"ㄧˇ","丙":"ㄅㄧㄥˇ","間":"ㄐㄧㄢ","另":"ㄌㄧㄥˋ","最":"ㄗㄨㄟˋ",
    "新":"ㄒㄧㄣ","馬":"ㄇㄚˇ","說":"ㄕㄨㄛ","也":"ㄧㄝˇ","能":"ㄋㄥˊ",
    "姓":"ㄒㄧㄥˋ","名":"ㄇㄧㄥˊ","選":"ㄒㄩㄢˇ","擇":"ㄗㄜˊ","始":"ㄕˇ","歡":"ㄏㄨㄢ","迎":"ㄧㄥˊ",
    "先":"ㄒㄧㄢ","登":"ㄉㄥ","入":"ㄖㄨˋ","直":"ㄓˊ","師":"ㄕ","專":"ㄓㄨㄢ","設":"ㄕㄜˋ","定":"ㄉㄧㄥˋ",
    "資":"ㄗ","料":"ㄌㄧㄠˋ","網":"ㄨㄤˇ","址":"ㄓˇ","儲":"ㄔㄨˊ","存":"ㄘㄨㄣˊ","連":"ㄌㄧㄢˊ",
    "送":"ㄙㄨㄥˋ","失":"ㄕ","敗":"ㄅㄞˋ","切":"ㄑㄧㄝˋ",
    "例":"ㄌㄧˋ","如":"ㄖㄨˊ","取":"ㄑㄩˇ","單":"ㄉㄢ","填":"ㄊㄧㄢˊ","寫":"ㄒㄧㄝˇ","尚":"ㄕㄤˋ","未":"ㄨㄟˋ",
    "往":"ㄨㄤˇ","倒":"ㄉㄠˋ","退":"ㄊㄨㄟˋ","規":"ㄍㄨㄟ","律":"ㄌㄩˋ","份":"ㄈㄣˋ",
    "身":"ㄕㄣ","站":"ㄓㄢˋ","箱":"ㄒㄧㄤ","子":"˙ㄗ","段":"ㄉㄨㄢˋ","玉":"ㄩˋ","智":"ㄓˋ",
    "葵":"ㄎㄨㄟˊ","光":"ㄍㄨㄤ","丁":"ㄉㄧㄥ","刻":"ㄎㄜˋ","可":"ㄎㄜˇ","早":"ㄗㄠˇ","餐":"ㄘㄢ",
    "午":"ㄨˇ","晚":"ㄨㄢˇ","睡":"ㄕㄨㄟˋ","覺":"ㄐㄧㄠˋ","國":"ㄍㄨㄛˊ","慶":"ㄑㄧㄥˋ","煙":"ㄧㄢ",
    "火":"ㄏㄨㄛˇ","校":"ㄒㄧㄠˋ","運":"ㄩㄣˋ","那":"ㄋㄚˋ","合":"ㄏㄜˊ",
    "與":"ㄩˇ","計":"ㄐㄧˋ","形":"ㄒㄧㄥˊ","活":"ㄏㄨㄛˊ","換":"ㄏㄨㄢˋ","交":"ㄐㄧㄠ",
    "板":"ㄅㄢˇ","接":"ㄐㄧㄝ","平":"ㄆㄧㄥˊ","版":"ㄅㄢˇ","基":"ㄐㄧ","準":"ㄓㄨㄣˇ","只":"ㄓˇ",
    "公":"ㄍㄨㄥ","去":"ㄑㄩˋ","口":"ㄎㄡˇ","台":"ㄊㄞˊ","向":"ㄒㄧㄤˋ","圈":"ㄑㄩㄢ","孩":"ㄏㄞˊ",
    "室":"ㄕˋ","幫":"ㄅㄤ","床":"ㄔㄨㄤˊ","影":"ㄧㄥˇ","後":"ㄏㄡˋ","怎":"ㄗㄣˇ","我":"ㄨㄛˇ",
    "或":"ㄏㄨㄛˋ","手":"ㄕㄡˇ","才":"ㄘㄞˊ","把":"ㄅㄚˇ","投":"ㄊㄡˊ","指":"ㄓˇ","撥":"ㄅㄛ",
    "檢":"ㄐㄧㄢˇ","滑":"ㄏㄨㄚˊ","由":"ㄧㄡˊ","盤":"ㄆㄢˊ","示":"ㄕˋ","績":"ㄐㄧ","自":"ㄗˋ",
    "著":"˙ㄓㄜ","藏":"ㄘㄤˊ","訣":"ㄐㄩㄝˊ","變":"ㄅㄧㄢˋ","讓":"ㄖㄤˋ","跟":"ㄍㄣ","轉":"ㄓㄨㄢˇ",
    "鍵":"ㄐㄧㄢˋ","門":"ㄇㄣˊ","顯":"ㄒㄧㄢˇ","飯":"ㄈㄢˋ","麼":"˙ㄇㄜ","鼠":"ㄕㄨˇ"
  };
  var PHRASE_ZY = {
    "數學":["ㄕㄨˋ","ㄒㄩㄝˊ"], "數字":["ㄕㄨˋ","ㄗˋ"], "一共":["ㄧˊ","ㄍㄨㄥˋ"],
    "一樣":["ㄧˊ","ㄧㄤˋ"], "一次":["ㄧˊ","ㄘˋ"], "一個":["ㄧˊ","˙ㄍㄜ"], "一半":["ㄧˊ","ㄅㄢˋ"],
    "一起":["ㄧˋ","ㄑㄧˇ"], "一題":["ㄧˋ","ㄊㄧˊ"], "一數":["ㄧˋ","ㄕㄨˇ"], "一堆":["ㄧˋ","ㄉㄨㄟ"],
    "一比":["ㄧˋ","ㄅㄧˇ"], "一份":["ㄧˊ","ㄈㄣˋ"], "不夠":["ㄅㄨˊ","ㄍㄡˋ"], "不錯":["ㄅㄨˊ","ㄘㄨㄛˋ"],
    "一圈":["ㄧˋ","ㄑㄩㄢ"], "一格":["ㄧˋ","ㄍㄜˊ"], "一點":["ㄧˋ","ㄉㄧㄢˇ"],
    "一串":["ㄧˊ","ㄔㄨㄢˋ"], "一盒":["ㄧˋ","ㄏㄜˊ"], "一包":["ㄧˋ","ㄅㄠ"], "一袋":["ㄧˊ","ㄉㄞˋ"],
    "一束":["ㄧˊ","ㄕㄨˋ"], "一捆":["ㄧˋ","ㄎㄨㄣˇ"], "一張":["ㄧˋ","ㄓㄤ"], "一條":["ㄧˋ","ㄊㄧㄠˊ"],
    "一類":["ㄧˊ","ㄌㄟˋ"], "一下":["ㄧˊ","ㄒㄧㄚˋ"], "一邊":["ㄧˋ","ㄅㄧㄢ"], "一關":["ㄧˋ","ㄍㄨㄢ"],
    "一隊":["ㄧˊ","ㄉㄨㄟˋ"], "一人":["ㄧˋ","ㄖㄣˊ"], "一天":["ㄧˋ","ㄊㄧㄢ"], "一定":["ㄧˊ","ㄉㄧㄥˋ"],
    "個數":["ㄍㄜˋ","ㄕㄨˋ"], "的數":["˙ㄉㄜ","ㄕㄨˋ"], "加數":["ㄐㄧㄚ","ㄕㄨˋ"], "位數":["ㄨㄟˋ","ㄕㄨˋ"],
    "和是":["ㄏㄜˊ","ㄕˋ"], "的和":["˙ㄉㄜ","ㄏㄜˊ"], "數數":["ㄕㄨˇ","ㄕㄨˇ"], "長針":["ㄔㄤˊ","ㄓㄣ"],
    "不會":["ㄅㄨˊ","ㄏㄨㄟˋ"], "不是":["ㄅㄨˊ","ㄕˋ"], "不要":["ㄅㄨˊ","ㄧㄠˋ"], "不對":["ㄅㄨˊ","ㄉㄨㄟˋ"],
    "還是":["ㄏㄞˊ","ㄕˋ"], "覺得":["ㄐㄩㄝˊ","˙ㄉㄜ"], "睡覺":["ㄕㄨㄟˋ","ㄐㄧㄠˋ"], "地方":["ㄉㄧˋ","˙ㄈㄤ"],
    "東西":["ㄉㄨㄥ","˙ㄒㄧ"], "時候":["ㄕˊ","˙ㄏㄡ"], "什麼":["ㄕㄜˊ","˙ㄇㄜ"], "多少":["ㄉㄨㄛ","ㄕㄠˇ"],
    "朋友":["ㄆㄥˊ","˙ㄧㄡ"], "哥哥":["ㄍㄜ","˙ㄍㄜ"], "姐姐":["ㄐㄧㄝˇ","˙ㄐㄧㄝ"], "弟弟":["ㄉㄧˋ","˙ㄉㄧ"],
    "妹妹":["ㄇㄟˋ","˙ㄇㄟ"], "爸爸":["ㄅㄚˋ","˙ㄅㄚ"], "媽媽":["ㄇㄚ","˙ㄇㄚ"], "葡萄":["ㄆㄨˊ","˙ㄊㄠ"],
    "盤子":["ㄆㄢˊ","˙ㄗ"], "椅子":["ㄧˇ","˙ㄗ"], "這個":["ㄓㄜˋ","˙ㄍㄜ"], "那個":["ㄋㄚˋ","˙ㄍㄜ"],
    "哪個":["ㄋㄚˇ","˙ㄍㄜ"], "幾個":["ㄐㄧˇ","˙ㄍㄜ"], "看看":["ㄎㄢˋ","˙ㄎㄢ"], "想想":["ㄒㄧㄤˇ","˙ㄒㄧㄤ"],
    "算算":["ㄙㄨㄢˋ","˙ㄙㄨㄢ"], "填填":["ㄊㄧㄢˊ","˙ㄊㄧㄢ"], "數一數":["ㄕㄨˇ","˙ㄧ","ㄕㄨˇ"],
    "哪個數":["ㄋㄚˇ","˙ㄍㄜ","ㄕㄨˋ"], "數的":["ㄕㄨˋ","˙ㄉㄜ"], "數最":["ㄕㄨˋ","ㄗㄨㄟˋ"],
    "一盤":["ㄧˋ","ㄆㄢˊ"], "一年":["ㄧˋ","ㄋㄧㄢˊ"], "一隻":["ㄧˋ","ㄓ"], "知道":["ㄓ","ㄉㄠˋ"]
  };
  var EXTRA_ZY = {
    "勇":"ㄩㄥˇ","挑":"ㄊㄧㄠˇ","戰":"ㄓㄢˋ","團":"ㄊㄨㄢˊ","魔":"ㄇㄛˊ","王":"ㄨㄤˊ","龍":"ㄌㄨㄥˊ",
    "恐":"ㄎㄨㄥˇ","章":"ㄓㄤ","怪":"ㄍㄨㄞˋ","獸":"ㄕㄡˋ","山":"ㄕㄢ","城":"ㄔㄥˊ","堡":"ㄅㄠˇ",
    "打":"ㄉㄚˇ","逃":"ㄊㄠˊ","房":"ㄈㄤˊ","碼":"ㄇㄚˇ","友":"ㄧㄡˇ",
    "藍":"ㄌㄢˊ","黃":"ㄏㄨㄤˊ","等":"ㄉㄥˇ","待":"ㄉㄞˋ","完":"ㄨㄢˊ","績":"ㄐㄧ","錄":"ㄌㄨˋ",
    "串":"ㄔㄨㄢˋ","顛":"ㄉㄧㄢ","雞":"ㄐㄧ","蛋":"ㄉㄢˋ","走":"ㄗㄡˇ","剩":"ㄕㄥˋ","袋":"ㄉㄞˋ",
    "束":"ㄕㄨˋ","捆":"ㄎㄨㄣˇ","朵":"ㄉㄨㄛˇ","花":"ㄏㄨㄚ","綁":"ㄅㄤˇ","吸":"ㄒㄧ","管":"ㄍㄨㄢˇ",
    "根":"ㄍㄣ","星":"ㄒㄧㄥ","愛":"ㄞˋ","心":"ㄒㄧㄣ","亮":"ㄌㄧㄤˋ","幸":"ㄒㄧㄥˋ","草":"ㄘㄠˇ",
    "角":"ㄐㄧㄠˇ","塊":"ㄎㄨㄞˋ","圓":"ㄩㄢˊ","票":"ㄆㄧㄠˋ","哥":"ㄍㄜ","姐":"ㄐㄧㄝˇ","兩":"ㄌㄧㄤˇ",
    "糕":"ㄍㄠ","莓":"ㄇㄟˊ","算":"ㄙㄨㄢˋ","式":"ㄕˋ","記":"ㄐㄧˋ","飛":"ㄈㄟ",
    "樹":"ㄕㄨˋ","鳥":"ㄋㄧㄠˇ","吃":"ㄔ","置":"ㄓˋ","櫃":"ㄍㄨㄟˋ","椅":"ㄧˇ","朋":"ㄆㄥˊ",
    "繩":"ㄕㄥˊ","巧":"ㄑㄧㄠˇ","克":"ㄎㄜˋ","力":"ㄌㄧˋ","拍":"ㄆㄞ","麼":"˙ㄇㄜ","什":"ㄕㄜˊ",
    "窩":"ㄨㄛ","床":"ㄔㄨㄤˊ","準":"ㄓㄨㄣˇ","備":"ㄅㄟˋ","教":"ㄐㄧㄠˋ","安":"ㄢ","功":"ㄍㄨㄥ",
    "昨":"ㄗㄨㄛˊ","明":"ㄇㄧㄥˊ","曆":"ㄌㄧˋ","鉛":"ㄑㄧㄢ","尾":"ㄨㄟˇ","頭":"ㄊㄡˊ","擦":"ㄘㄚ",
    "橡":"ㄒㄧㄤˋ","皮":"ㄆㄧˊ","雄":"ㄒㄩㄥˊ","英":"ㄧㄥ","婷":"ㄊㄧㄥˊ","元":"ㄩㄢˊ","形":"ㄒㄧㄥˊ",
    "片":"ㄆㄧㄢˋ","類":"ㄌㄟˋ","動":"ㄉㄨㄥˋ","交":"ㄐㄧㄠ","通":"ㄊㄨㄥ","工":"ㄍㄨㄥ","水":"ㄕㄨㄟˇ",
    "糖":"ㄊㄤˊ","萄":"ㄊㄠˊ","葡":"ㄆㄨˊ","好":"ㄏㄠˇ","沒":"ㄇㄟˊ","關":"ㄍㄨㄢ","係":"ㄒㄧˋ",
    "輸":"ㄕㄨ","候":"ㄏㄡˋ",
    "換":"ㄏㄨㄢˋ","嗎":"˙ㄇㄚ","呢":"˙ㄋㄜ","吧":"˙ㄅㄚ","剛":"ㄍㄤ","題":"ㄊㄧˊ",
    "分":"ㄈㄣ","爭":"ㄓㄥ","秒":"ㄇㄧㄠˇ","念":"ㄋㄧㄢˋ","唸":"ㄋㄧㄢˋ",
    "聲":"ㄕㄥ","讀":"ㄉㄨˊ","複":"ㄈㄨˋ","測":"ㄘㄜˋ","驗":"ㄧㄢˋ","診":"ㄓㄣˇ","斷":"ㄉㄨㄢˋ",
    "報":"ㄅㄠˋ","告":"ㄍㄠˋ","項":"ㄒㄧㄤˋ","目":"ㄇㄨˋ","次":"ㄘˋ","連":"ㄌㄧㄢˊ","色":"ㄙㄜˋ",
    "筆":"ㄅㄧˇ","此":"ㄘˇ","並":"ㄅㄧㄥˋ","排":"ㄆㄞˊ","彩":"ㄘㄞˇ","照":"ㄓㄠˋ","規":"ㄍㄨㄟ",
    "零":"ㄌㄧㄥˊ","誤":"ㄨˋ","建":"ㄐㄧㄢˋ","漏":"ㄌㄡˋ","跨":"ㄎㄨㄚˋ","改":"ㄍㄞˇ","依":"ㄧ",
    "逐":"ㄓㄨˊ","相":"ㄒㄧㄤ","混":"ㄏㄨㄣˋ","淆":"ㄧㄠˊ","為":"ㄨㄟˊ","楚":"ㄔㄨˇ","獨":"ㄉㄨˊ",
    "概":"ㄍㄞˋ","知":"ㄓ","道":"ㄉㄠˋ","反":"ㄈㄢˇ","散":"ㄙㄢˇ","引":"ㄧㄣˇ","己":"ㄐㄧˇ",
    "各":"ㄍㄜˋ","稱":"ㄔㄥ","件":"ㄐㄧㄢˋ","情":"ㄑㄧㄥˊ","發":"ㄈㄚ","符":"ㄈㄨˊ","意":"ㄧˋ",
    "思":"ㄙ","卻":"ㄑㄩㄝˋ","坐":"ㄗㄨㄛˋ","型":"ㄒㄧㄥˊ","扳":"ㄅㄢ","總":"ㄗㄨㄥˇ","額":"ㄜˊ",
    "語":"ㄩˇ","弄":"ㄋㄨㄥˋ","熟":"ㄕㄨˊ","欄":"ㄌㄢˊ","判":"ㄆㄢˋ","端":"ㄉㄨㄢ","之":"ㄓ",
    "句":"ㄐㄩˋ","話":"ㄏㄨㄚˋ","推":"ㄊㄨㄟ","而":"ㄦˊ","度":"ㄉㄨˋ","層":"ㄘㄥˊ","拼":"ㄆㄧㄣ",
    "狀":"ㄓㄨㄤˋ","組":"ㄗㄨˇ","悉":"ㄒㄧ","標":"ㄅㄧㄠ","應":"ㄧㄥ","於":"ㄩˊ","些":"ㄒㄧㄝ",
    "領":"ㄌㄧㄥˇ","賽":"ㄙㄞˋ","紀":"ㄐㄧˋ","提":"ㄊㄧˊ","醒":"ㄒㄧㄥˇ","按":"ㄢˋ","猜":"ㄘㄞ",
    "刪":"ㄕㄢ","除":"ㄔㄨˊ","伍":"ㄨˇ","血":"ㄒㄧㄝˇ","表":"ㄅㄧㄠˇ","補":"ㄅㄨˇ","均":"ㄐㄩㄣ",
    "需":"ㄒㄩ","列":"ㄌㄧㄝˋ","印":"ㄧㄣˋ","金":"ㄐㄧㄣ","鑰":"ㄧㄠˋ","更":"ㄍㄥˋ","所":"ㄙㄨㄛˇ"
  };
  for(var _k in EXTRA_ZY) CHAR_ZY[_k]=EXTRA_ZY[_k];
  // 二年級用字
  var G2_ZY={
    "乘":"ㄔㄥˊ","區":"ㄑㄩ","百":"ㄅㄞˇ","忘":"ㄨㄤˋ","但":"ㄉㄢˋ","代":"ㄉㄞˋ","裙":"ㄑㄩㄣˊ","外":"ㄨㄞˋ",
    "套":"ㄊㄠˋ","衣":"ㄧ","褲":"ㄎㄨˋ","壺":"ㄏㄨˊ","近":"ㄐㄧㄣˋ","估":"ㄍㄨ","齊":"ㄑㄧˊ","樟":"ㄓㄤ",
    "榕":"ㄖㄨㄥˊ","棵":"ㄎㄜ","鴨":"ㄧㄚ","互":"ㄏㄨˋ","逆":"ㄋㄧˋ","利":"ㄌㄧˋ","輕":"ㄑㄧㄥ","遞":"ㄉㄧˋ",
    "停":"ㄊㄧㄥˊ","車":"ㄔㄜ","輛":"ㄌㄧㄤˋ","餅":"ㄅㄧㄥˇ","乾":"ㄍㄢ","奇":"ㄑㄧˊ","倍":"ㄅㄟˋ","義":"ㄧˋ",
    "支":"ㄓ","冰":"ㄅㄧㄥ","賣":"ㄇㄞˋ","價":"ㄐㄧㄚˋ","背":"ㄅㄟˋ","鄰":"ㄌㄧㄣˊ","撲":"ㄆㄨ","滿":"ㄇㄢˇ",
    "硬":"ㄧㄥˋ","壞":"ㄏㄨㄞˋ","腳":"ㄐㄧㄠˇ","廊":"ㄌㄤˊ","恩":"ㄣ","桌":"ㄓㄨㄛ","逸":"ㄧˋ","鋼":"ㄍㄤ",
    "布":"ㄅㄨˋ","維":"ㄨㄟˊ","峰":"ㄈㄥ","旗":"ㄑㄧˊ","距":"ㄐㄩˋ","離":"ㄌㄧˊ","裝":"ㄓㄨㄤ","瓶":"ㄆㄧㄥˊ",
    "容":"ㄖㄨㄥˊ","器":"ㄑㄧˋ","杯":"ㄅㄟ","梨":"ㄌㄧˊ","橘":"ㄐㄩˊ","香":"ㄒㄧㄤ","蕉":"ㄐㄧㄠ","瓜":"ㄍㄨㄚ",
    "周":"ㄓㄡ","沿":"ㄧㄢˊ","它":"ㄊㄚ","足":"ㄗㄨˊ","頂":"ㄉㄧㄥˇ","界":"ㄐㄧㄝˋ","廠":"ㄔㄤˇ","機":"ㄐㄧ",
    "驟":"ㄗㄡˋ","納":"ㄋㄚˋ","扶":"ㄈㄨˊ","材":"ㄘㄞˊ","評":"ㄆㄧㄥˊ","含":"ㄏㄢˊ",
    "重":"ㄓㄨㄥˋ"   // 二年級的「重」多半是輕重；「重複、重新」另列在詞語裡
  };
  for(var _g in G2_ZY) CHAR_ZY[_g]=G2_ZY[_g];
  var G2_PHRASE={
    "重複":["ㄔㄨㄥˊ","ㄈㄨˋ"], "重新":["ㄔㄨㄥˊ","ㄒㄧㄣ"], "容量":["ㄖㄨㄥˊ","ㄌㄧㄤˋ"], "重量":["ㄓㄨㄥˋ","ㄌㄧㄤˋ"],
    "數量":["ㄕㄨˋ","ㄌㄧㄤˋ"], "的差":["˙ㄉㄜ","ㄔㄚ"], "一顆":["ㄧˋ","ㄎㄜ"], "一本":["ㄧˋ","ㄅㄣˇ"], "一件":["ㄧˊ","ㄐㄧㄢˋ"],
    "一支":["ㄧˋ","ㄓ"], "一枝":["ㄧˋ","ㄓ"], "一片":["ㄧˊ","ㄆㄧㄢˋ"], "一小":["ㄧˋ","ㄒㄧㄠˇ"], "一些":["ㄧˋ","ㄒㄧㄝ"],
    "不用":["ㄅㄨˊ","ㄩㄥˋ"], "一共":["ㄧˊ","ㄍㄨㄥˋ"]
  };
  for(var _p in G2_PHRASE) PHRASE_ZY[_p]=G2_PHRASE[_p];
  function az(text){
    var out='', chars=Array.from(String(text)), i=0;
    while(i<chars.length){
      if(i+2<chars.length){
        var three=chars[i]+chars[i+1]+chars[i+2];
        if(PHRASE_ZY[three]){
          for(var t=0;t<3;t++) out+='<ruby>'+chars[i+t]+'<rt>'+PHRASE_ZY[three][t]+'</rt></ruby><wbr>';
          i+=3; continue;
        }
      }
      if(i+1<chars.length){
        var two=chars[i]+chars[i+1];
        if(PHRASE_ZY[two]){
          out+='<ruby>'+chars[i]+'<rt>'+PHRASE_ZY[two][0]+'</rt></ruby><wbr>';
          out+='<ruby>'+chars[i+1]+'<rt>'+PHRASE_ZY[two][1]+'</rt></ruby><wbr>';
          i+=2; continue;
        }
      }
      var ch=chars[i];
      if(ch==='\n') out+='<br>';
      else if(CHAR_ZY[ch]) out+='<ruby>'+ch+'<rt>'+CHAR_ZY[ch]+'</rt></ruby><wbr>';
      else out+=esc(ch);
      i++;
    }
    return out;
  }
  function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }

  /* ================= 亂數與出題工具 ================= */
  var R=Math.random;
  function mulberry32(a){ return function(){ a|=0; a=a+0x6D2B79F5|0; var t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
  function hashStr(s){ var h=2166136261>>>0; for(var i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619)>>>0; } return h; }
  function rnd(){ return R(); }
  function ri(a,b){ return Math.floor(R()*(b-a+1))+a; }
  function pick(a){ return a[Math.floor(R()*a.length)]; }
  function shuffle(a){ a=a.slice(); for(var i=a.length-1;i>0;i--){ var j=Math.floor(R()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; } return a; }
  function sample(a,n){ return shuffle(a).slice(0,n); }
  function rep(s,n){ var o=''; for(var i=0;i<n;i++) o+=s; return o; }
  function mk(pairs){ var m={}; pairs.forEach(function(p){ if(!(p[0] in m)) m[p[0]]=p[1]; }); return m; }
  var CN=['零','一','二','三','四','五','六','七','八','九'];
  function cnNum(n){ if(n<10) return CN[n]; var t=Math.floor(n/10), o=n%10; return (t===1?'':CN[t])+'十'+(o?CN[o]:''); }
  function asOpt(x){ return (typeof x==='object') ? x : {t:String(x)}; }
  function copy(o, extra){ var r={}, k; for(k in o) r[k]=o[k]; for(k in extra) r[k]=extra[k]; return r; }
  /* 選擇題：correct 是正確選項；wrongs 是 [選項, 迷思說明]，依重要性排列，最多取 3 個；
   * fill 用來在選項不足 4 個時補上相近的數。 */
  function mc(correct, wrongs, fill){
    var list=[], seen={};
    function add(o){ if(seen[o.t]||list.length>=4) return; seen[o.t]=1; list.push(o); }
    add(copy(asOpt(correct),{ok:true}));
    wrongs.forEach(function(w){ add(copy(asOpt(w[0]),{err:w[1]})); });
    if(fill){ var d=1; while(list.length<4 && d<30){ var v=fill.base+(d%2?1:-1)*Math.ceil(d/2)*(fill.step||1); d++; if(v>=0) add({t:v+(fill.unit||''), err:fill.err||'計算或數數錯誤'}); } }
    return shuffle(list);
  }
  function Q(stem, o){ o.stem=stem; return o; }

  /* ================= 共用的圖 ================= */
  function svgWrap(w,h,inner){ return '<svg class="pic" viewBox="0 0 '+w+' '+h+'" width="'+w+'" height="'+h+'" aria-hidden="true">'+inner+'</svg>'; }
  function svgBeads(k,m){
    var s='', per=3, i, j;
    for(i=0;i<k;i++){ var x=4+(i%per)*120, y=6+Math.floor(i/per)*30;
      s+='<rect x="'+x+'" y="'+y+'" width="112" height="20" rx="10" class="str"/>';
      for(j=0;j<10;j++) s+='<circle cx="'+(x+11+j*10)+'" cy="'+(y+10)+'" r="4.6" class="bead"/>'; }
    var y0=6+Math.ceil(k/per)*30;
    for(j=0;j<m;j++) s+='<circle cx="'+(14+j*18)+'" cy="'+(y0+10)+'" r="6.5" class="bead"/>';
    return svgWrap(4+per*120, y0+(m?26:0)+2, s);
  }
  function svgSticks(b,l){
    var s='', x=6, i, j;
    for(i=0;i<b;i++){ for(j=0;j<10;j++) s+='<rect x="'+(x+j*4.4).toFixed(1)+'" y="6" width="3.4" height="70" rx="1.5" class="stick"/>';
      s+='<rect x="'+(x-3)+'" y="34" width="50" height="14" rx="4" class="band"/><text x="'+(x+22)+'" y="45" class="bandt">10</text>'; x+=56; }
    for(j=0;j<l;j++){ s+='<rect x="'+x+'" y="6" width="4" height="70" rx="1.5" class="stick"/>'; x+=11; }
    return svgWrap(x+6, 82, s);
  }
  function svgEggs(b,l){
    var s='', per=4, i, r, c;
    for(i=0;i<b;i++){ var x=4+(i%per)*80, y=4+Math.floor(i/per)*42;
      s+='<rect x="'+x+'" y="'+y+'" width="74" height="36" rx="7" class="carton"/>';
      for(r=0;r<2;r++) for(c=0;c<5;c++) s+='<ellipse cx="'+(x+10+c*13.5)+'" cy="'+(y+10+r*16)+'" rx="5.2" ry="6.4" class="egg"/>'; }
    var y0=4+Math.ceil(b/per)*42;
    for(i=0;i<l;i++) s+='<ellipse cx="'+(12+i*17)+'" cy="'+(y0+10)+'" rx="6" ry="7.5" class="egg"/>';
    return svgWrap(4+per*80, y0+(l?22:0)+2, s);
  }
  /* 錢幣與紙鈔：1、5、10、50 元是硬幣，100、500、1000 元是紙鈔 */
  function svgMoney(list){
    var RAD={1:15,5:18,10:21,50:25}, s='', x=4, H=60;
    list.forEach(function(v){
      if(RAD[v]){ var r=RAD[v];
        s+='<circle cx="'+(x+r)+'" cy="30" r="'+r+'" class="coin c'+v+'"/><text x="'+(x+r)+'" y="'+(30+r*0.36).toFixed(1)+'" class="coint" style="font-size:'+(r*0.9).toFixed(1)+'px">'+v+'</text>';
        x+=2*r+6;
      } else {
        s+='<rect x="'+x+'" y="8" width="72" height="44" rx="5" class="note n'+v+'"/><text x="'+(x+36)+'" y="37" class="notet">'+v+'</text>';
        x+=78;
      }
    });
    return svgWrap(x, H, s);
  }
  function svgCoins(list){ return svgMoney(list); }
  /* 鐘面：短針比較粗、比較短；分針比較細、比較長 */
  function svgClockRaw(ha, ma, size){
    var s='<circle cx="100" cy="100" r="94" class="face"/>', i;
    for(i=0;i<60;i++){ var a=i*6*Math.PI/180, r1=i%5?86:79;
      s+='<line x1="'+(100+r1*Math.sin(a)).toFixed(1)+'" y1="'+(100-r1*Math.cos(a)).toFixed(1)+'" x2="'+(100+90*Math.sin(a)).toFixed(1)+'" y2="'+(100-90*Math.cos(a)).toFixed(1)+'" class="'+(i%5?'tk':'tk5')+'"/>'; }
    for(i=1;i<=12;i++){ var b=i*30*Math.PI/180; s+='<text x="'+(100+66*Math.sin(b)).toFixed(1)+'" y="'+(100-66*Math.cos(b)+7).toFixed(1)+'" class="cn">'+i+'</text>'; }
    function hand(ang,len,cls){ var t=ang*Math.PI/180; return '<line x1="100" y1="100" x2="'+(100+len*Math.sin(t)).toFixed(1)+'" y2="'+(100-len*Math.cos(t)).toFixed(1)+'" class="'+cls+'"/>'; }
    s+=hand(ha,46,'hh')+hand(ma,74,'mh')+'<circle cx="100" cy="100" r="5" class="hub"/>';
    var z=size||190;
    return '<svg class="pic clk" viewBox="0 0 200 200" width="'+z+'" height="'+z+'" aria-hidden="true">'+s+'</svg>';
  }
  function svgClock(h,m,size){ return svgClockRaw(((h%12)+m/60)*30, m*6, size); }
  var MONTH_DAYS=[31,28,31,30,31,30,31,31,30,31,30,31];
  function svgCal(month, days, start){
    var W=['日','一','二','三','四','五','六'], cw=44, ch=30, s='', i;
    s+='<text x="'+(cw*3.5)+'" y="21" class="calt">'+month+'月</text>';
    for(i=0;i<7;i++) s+='<rect x="'+(i*cw)+'" y="30" width="'+cw+'" height="'+ch+'" class="calh"/><text x="'+(i*cw+cw/2)+'" y="51" class="calw'+(i===0||i===6?' we':'')+'">'+W[i]+'</text>';
    for(var d=1; d<=days; d++){ var p=start+d-1, c=p%7, r=Math.floor(p/7), x=c*cw, y=60+r*ch;
      s+='<rect x="'+x+'" y="'+y+'" width="'+cw+'" height="'+ch+'" class="calc"/><text x="'+(x+cw/2)+'" y="'+(y+21)+'" class="cald'+(c===0||c===6?' we':'')+'">'+d+'</text>'; }
    return svgWrap(7*cw, 60+Math.ceil((start+days)/7)*ch+2, s);
  }
  function svgPencil(n,N){
    var S=26, x0=10, s='', i, end=x0+n*S;
    s+='<rect x="'+x0+'" y="12" width="12" height="18" rx="3" class="eraser"/>';
    s+='<rect x="'+(x0+12)+'" y="12" width="'+(n*S-34)+'" height="18" class="pencil"/>';
    s+='<polygon points="'+(end-22)+',12 '+end+',21 '+(end-22)+',30" class="wood"/><polygon points="'+(end-7)+',18.5 '+end+',21 '+(end-7)+',23.5" class="lead"/>';
    s+='<line x1="'+x0+'" y1="6" x2="'+x0+'" y2="74" class="guide"/><line x1="'+end+'" y1="6" x2="'+end+'" y2="74" class="guide"/>';
    for(i=0;i<N;i++) s+='<rect x="'+(x0+i*S)+'" y="44" width="'+S+'" height="'+S+'" class="unit"/>';
    return svgWrap(x0*2+N*S, 78, s);
  }
  function svgClipRibbons(a,b){
    var U=30, x0=34, s='', i;
    function clip(x,y){ return '<rect x="'+(x+1)+'" y="'+y+'" width="'+(U-2)+'" height="11" rx="5.5" class="clip"/><rect x="'+(x+6)+'" y="'+(y+3)+'" width="'+(U-12)+'" height="5" rx="2.5" class="clip"/>'; }
    s+='<text x="4" y="28" class="lbl">甲</text><rect x="'+x0+'" y="14" width="'+(a*U)+'" height="16" rx="3" class="rib0"/>';
    for(i=0;i<a;i++) s+=clip(x0+i*U,36);
    s+='<text x="4" y="88" class="lbl">乙</text><rect x="'+x0+'" y="74" width="'+(b*U)+'" height="16" rx="3" class="rib1"/>';
    for(i=0;i<b;i++) s+=clip(x0+i*U,96);
    return svgWrap(x0+a*U+8, 112, s);
  }
  function svgRibbons(rows){
    var s='', x0=36, maxEnd=0;
    rows.forEach(function(r,i){ var y=12+i*40;
      s+='<text x="6" y="'+(y+16)+'" class="lbl">'+r.lab+'</text><rect x="'+(x0+r.start)+'" y="'+y+'" width="'+r.len+'" height="20" rx="4" class="rib'+(i%3)+'"/>';
      maxEnd=Math.max(maxEnd, x0+r.start+r.len); });
    return svgWrap(maxEnd+8, 12+rows.length*40, s);
  }
  function svgRoute(lab){
    var s='<path d="M40,160 Q130,-30 330,46" class="route"/><path d="M40,160 L330,46" class="route"/><path d="M40,160 L110,200 L180,130 L250,200 L330,46" class="route"/>';
    s+='<text x="14" y="186" class="emot">🏠</text><text x="318" y="40" class="emot">🏫</text>';
    s+='<text x="150" y="26" class="lbl">'+lab.curve+'</text><text x="206" y="124" class="lbl">'+lab.straight+'</text><text x="104" y="224" class="lbl">'+lab.zig+'</text>';
    return svgWrap(360, 232, s);
  }
  function svgCubes(hs){
    var S=30, D=11, s='', maxH=Math.max.apply(null,hs), W=8+hs.length*S+D, H=8+maxH*S+D;
    hs.forEach(function(h,i){ for(var j=0;j<h;j++){ var x=4+i*S, y=H-4-(j+1)*S;
      s+='<rect x="'+x+'" y="'+y+'" width="'+S+'" height="'+S+'" class="cf"/>'+
         '<polygon points="'+x+','+y+' '+(x+D)+','+(y-D)+' '+(x+S+D)+','+(y-D)+' '+(x+S)+','+y+'" class="ct"/>'+
         '<polygon points="'+(x+S)+','+y+' '+(x+S+D)+','+(y-D)+' '+(x+S+D)+','+(y+S-D)+' '+(x+S)+','+(y+S)+'" class="cs"/>'; } });
    return svgWrap(W,H,s);
  }
  function svgShape(kind){
    var sq='<rect x="10" y="10" width="70" height="70" class="shp"/>', s='';
    if(kind==='sq1') s=sq+'<line x1="10" y1="80" x2="80" y2="10" class="shl"/>';
    else if(kind==='sq4') s=sq+'<line x1="10" y1="80" x2="80" y2="10" class="shl"/><line x1="10" y1="10" x2="80" y2="80" class="shl"/>';
    else if(kind==='rect2') s=sq+'<line x1="45" y1="10" x2="45" y2="80" class="shl"/>';
    else if(kind==='circle') s='<circle cx="45" cy="45" r="36" class="shp"/>';
    else s='<polygon points="10,80 80,80 10,10" class="shp"/>';
    return svgWrap(90,90,s);
  }
  function emo(e){ return '<span class="emo">'+e+'</span>'; }
  function grp(e,n){ return '<span class="grp">'+rep(e,n)+'</span>'; }

  /* ================= 組卷 ================= */
  function buildTest(cfg, plan, seed){
    var saved=R; R=mulberry32(seed>>>0);
    var items=[];
    try{
      cfg.areas.forEach(function(area){ area.codes.forEach(function(code){
        var n=plan[code]||0; if(!n) return;
        var fns=shuffle(cfg.gen[code]);
        for(var i=0;i<n;i++){
          var it=fns[i%fns.length](); it.code=code; it.area=area.id;
          if(it.errs) delete it.errs[it.num]; // 數字湊巧時，迷思答案可能剛好等於正確答案
          items.push(it);
        }
      }); });
    } finally { R=saved; }
    return items;
  }

  /* ================= 遊戲 ================= */
  var C=null, CODES={}, KID_NAME={}, CODE_ORDER=[], CODE_SET={}, AREA_BY={};
  var TEAMS=['紅隊','藍隊','綠隊','黃隊'];
  var TEAM_COLOR={'紅隊':'#e5484d','藍隊':'#3b7be0','綠隊':'#2f9e5f','黃隊':'#d39b00'};
  function $(id){ return document.getElementById(id); }
  function planTotal(p){ var n=0; for(var k in p) n+=p[k]; return n; }

  /* ---------- 儲存、身分、後台（與數字森林等遊戲共用） ---------- */
  function lsGet(k,d){ try{ var v=localStorage.getItem(k); return v===null?d:v; }catch(e){ return d; } }
  function lsSet(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }
  function lsDel(k){ try{ localStorage.removeItem(k); }catch(e){} }
  function lsJSON(k,d){ try{ var v=localStorage.getItem(k); return v?JSON.parse(v):d; }catch(e){ return d; } }
  function lsSetJSON(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }
  function zyPref(){ return lsGet('nf_zy','1')!=='0'; }
  function ttsPref(){ return lsGet('dx_tts','1')!=='0'; }
  function getIdentity(){ var c=lsGet('nf_class',''), n=lsGet('nf_name',''); return (c&&n)?{cls:c,name:n}:null; }
  function setIdentity(c,n){ lsSet('nf_class',c); lsSet('nf_name',n); }
  function clearIdentity(){ lsDel('nf_class'); lsDel('nf_name'); }
  var DEFAULT_API_URL='https://script.google.com/macros/s/AKfycbymeX7KkuiscvkkPhIMr085r96sa3varVo_zXe7G5FUreDMBv77vRn-1xNCq86Ksb8NHw/exec';
  function getApiUrl(){ var v=lsGet('nf_api',''); return (v&&v.trim())?v.trim():DEFAULT_API_URL; }
  function apiGet(params){
    var api=getApiUrl(); if(!api) return Promise.reject(new Error('no api'));
    var q=Object.keys(params).map(function(k){ return encodeURIComponent(k)+'='+encodeURIComponent(params[k]); }).join('&');
    return fetch(api+(api.indexOf('?')>-1?'&':'?')+q).then(function(r){ return r.json(); });
  }
  function apiPost(body){
    var api=getApiUrl(); if(!api) return Promise.reject(new Error('no api'));
    return fetch(api,{method:'POST', body:JSON.stringify(body)}).then(function(r){ return r.json(); });
  }
  // 後台是否已更新成支援診斷的版本（舊版會把資料誤寫進「作答紀錄」，所以要先確認）
  var backendState='unknown', backendPromise=null;
  function checkBackend(force){
    if(backendPromise && !force) return backendPromise;
    backendPromise=apiGet({action:'diagRoom', room:'0'}).then(function(d){
      backendState=(d && d.ok && Array.isArray(d.teams))?'ok':'old'; return backendState==='ok';
    }).catch(function(){ backendState='off'; backendPromise=null; return false; });
    return backendPromise;
  }
  function outbox(){ return lsJSON('dx_outbox',[]); }
  function sendResult(payload){
    return checkBackend().then(function(ok){
      if(!ok) throw new Error('backend');
      return apiPost(payload);
    }).then(function(res){
      if(!res || !res.ok) throw new Error('rejected');
      return true;
    }).catch(function(){
      var box=outbox(); if(!box.some(function(p){ return p.testId===payload.testId; })){ box.push(payload); lsSetJSON('dx_outbox',box.slice(-60)); }
      return false;
    });
  }
  function flushOutbox(){
    var box=outbox(); if(!box.length) return;
    checkBackend().then(function(ok){
      if(!ok) return;
      var left=box.slice();
      (function next(){
        if(!left.length){ lsSetJSON('dx_outbox',[]); return; }
        apiPost(left[0]).then(function(res){ if(res&&res.ok){ left.shift(); lsSetJSON('dx_outbox',left); next(); } }).catch(function(){});
      })();
    });
  }
  function loadRoster(cb){
    apiGet({action:'roster'}).then(function(d){ cb(d&&d.roster&&Object.keys(d.roster).length?d.roster:null); }).catch(function(){ cb(null); });
  }
  // 一、二年級的紀錄存在同一個瀏覽器裡，用指標代碼分辨是不是這個年級的
  function inGrade(r){ return r && r.codes && Object.keys(r.codes).some(function(c){ return CODE_SET[c]; }); }
  function gradeHistory(){ return lsJSON('dx_history',[]).filter(inGrade); }

  /* ---------- 語音 ---------- */
  function speakText(t){
    return String(t).replace(/（　）/g,'多少').replace(/→/g,'，').replace(/\+/g,'加').replace(/−/g,'減').replace(/×/g,'乘以')
      .replace(/=/g,'等於').replace(/□/g,'格子').replace(/[「」]/g,'').replace(/\n/g,'。');
  }
  function say(text){
    try{
      if(!window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      var u=new SpeechSynthesisUtterance(speakText(text)); u.lang='zh-TW'; u.rate=0.85;
      window.speechSynthesis.speak(u);
    }catch(e){}
  }

  /* ---------- 畫面 ---------- */
  var SCREENS=['login','hub','join','play','stage','report','history','teacher','board'];
  var timers=[];
  function clearTimers(){ timers.forEach(function(t){ clearInterval(t); clearTimeout(t); }); timers=[]; }
  function show(name, html){
    clearTimers();
    try{ if(window.speechSynthesis) window.speechSynthesis.cancel(); }catch(e){}
    if(html!==undefined) $('scr-'+name).innerHTML=html;
    SCREENS.forEach(function(s){ $('scr-'+s).classList.toggle('hidden', s!==name); });
    window.scrollTo(0,0);
    renderTop();
  }
  function renderTop(){
    $('lnk-home').innerHTML='← '+az(C.homeLabel);
    $('btn-zy').innerHTML=az('注音')+'：'+az(zyPref()?'開':'關');
    $('btn-tts').innerHTML='🔊 '+az(ttsPref()?'自動唸題':'不唸題');
    document.body.classList.toggle('zy-off',!zyPref());
    var id=getIdentity();
    $('who').innerHTML=id?('👤 '+esc(id.cls)+' '+esc(id.name)+' <button class="btn small" data-act="logout">'+az('換人')+'</button>'):'';
  }
  function fmtTime(ts){ var d=new Date(ts); function p(n){ return (n<10?'0':'')+n; } return d.getFullYear()+'/'+p(d.getMonth()+1)+'/'+p(d.getDate())+' '+p(d.getHours())+':'+p(d.getMinutes()); }
  function heroHTML(sub){ return '<div class="hero"><div><h1>'+az(C.title)+'</h1><p class="sub">'+az(sub)+'</p></div><div class="mascot" aria-hidden="true">'+C.areas.map(function(a){ return a.boss; }).join('')+'</div></div>'; }

  /* ---------- 登入 ---------- */
  var rosterCache=null;
  function renderLogin(askForm){
    var id=getIdentity();
    if(id && !askForm){
      show('login','<div class="card center"><div style="font-size:60px">🦸</div><h2>'+az('你是')+' '+esc(id.cls)+' '+esc(id.name)+' '+az('嗎？')+'</h2>'+
        '<div class="row"><button class="btn primary" data-act="me-yes">'+az('是我，開始！')+'</button><button class="btn" data-act="logout">'+az('不是，換人')+'</button></div></div>');
      return;
    }
    show('login', heroHTML('先登入，老師才看得到你的成績喔！')+
      '<div class="card" id="login-card">'+loginFields(rosterCache)+'<p class="warn" id="login-warn"></p><div class="row"><button class="btn primary" data-act="login">'+az('登入')+'</button></div></div>');
    if(!rosterCache) loadRoster(function(r){ if(r){ rosterCache=r; var c=$('login-card'); if(c && !$('cls-sel')){ c.innerHTML=loginFields(r)+'<p class="warn" id="login-warn"></p><div class="row"><button class="btn primary" data-act="login">'+az('登入')+'</button></div>'; } } });
  }
  function loginFields(roster){
    if(roster){
      var cls=Object.keys(roster).sort();
      return '<label class="f" for="cls-sel">'+az('班級')+'</label><select class="f" id="cls-sel"><option value="">'+az('請選擇')+'</option>'+cls.map(function(c){ return '<option>'+esc(c)+'</option>'; }).join('')+'</select>'+
        '<label class="f" for="name-sel">'+az('姓名')+'</label><select class="f" id="name-sel"><option value="">'+az('先選班級')+'</option></select>';
    }
    return '<label class="f" for="cls-in">'+az('班級')+'</label><input class="f" id="cls-in" maxlength="12" placeholder="例如：'+esc(C.classExample)+'" value="'+esc(lsGet('nf_class',''))+'">'+
      '<label class="f" for="name-in">'+az('姓名')+'</label><input class="f" id="name-in" maxlength="20" placeholder="例如：王小明">';
  }
  function doLogin(){
    var c, n;
    if($('cls-sel')){ c=$('cls-sel').value; n=$('name-sel').value; }
    else { c=($('cls-in').value||'').trim(); n=($('name-in').value||'').trim(); }
    if(!c||!n){ $('login-warn').innerHTML=az('請填寫班級和姓名喔！'); return; }
    setIdentity(c.slice(0,12), n.slice(0,20));
    renderHub();
  }

  /* ---------- 首頁 ---------- */
  function renderHub(noFetch){
    if(!getIdentity()){ renderLogin(true); return; }
    if(!noFetch) refreshServerHistory(function(){ if(!$('scr-hub').classList.contains('hidden')) renderHub(true); });
    var mine=myHistory(), need=mine.length?needCodes(mine[0]):[];
    show('hub', heroHTML('打倒'+cnNum(C.areas.length)+'隻魔王，看看你學會了哪些數學本領！')+
      '<div class="modes">'+
      '<button class="mode" data-act="solo"><span class="ic">🗡️</span><span><span class="t">'+az('個人戰')+'</span><span class="d">'+az('一個人挑戰'+cnNum(C.areas.length)+'隻魔王，一共')+planTotal(C.plan)+az('題。')+'</span></span></button>'+
      '<button class="mode" data-act="join"><span class="ic">🛡️</span><span><span class="t">'+az('團體戰')+'</span><span class="d">'+az('輸入老師給的房間號碼，和隊友一起比賽！')+'</span></span></button>'+
      (need.length?'<button class="mode" data-act="retest"><span class="ic">🔁</span><span><span class="t">'+az('複測挑戰')+'</span><span class="d">'+az('再練一次上次還不熟的本領：')+need.map(function(c){ return az(KID_NAME[c]); }).join('、')+'</span></span></button>':'')+
      '<button class="mode" data-act="myhist"><span class="ic">📋</span><span><span class="t">'+az('我的紀錄')+'</span><span class="d">'+az('看看以前的成績和診斷報告。')+'</span></span></button>'+
      '</div><p class="tip">'+az('小提醒：不會的題目可以按「我不會」，不要用猜的喔！這樣老師才知道要怎麼幫你。')+'</p>');
  }

  /* ---------- 團體戰：加入 ---------- */
  var join={code:'', team:''};
  function renderJoin(){ join={code:'', team:join.team}; show('join', joinHTML()); }
  function joinHTML(){
    var keys=[1,2,3,4,5,6,7,8,9].map(function(k){ return '<button class="key" data-act="jkey" data-k="'+k+'">'+k+'</button>'; }).join('')+
      '<button class="key" data-act="jkey" data-k="del" aria-label="刪除">⌫</button><button class="key" data-act="jkey" data-k="0">0</button><span></span>';
    return '<div class="card"><h2>'+az('🛡️ 團體戰')+'</h2><p class="muted">'+az('輸入老師給的房間號碼，再選你的隊伍。')+'</p>'+
      '<div class="numpad"><div class="codeshow" id="jcode">'+(join.code||'&nbsp;')+'</div><div class="keys">'+keys+'</div></div>'+
      '<div class="teampick">'+TEAMS.map(function(t){ return '<button class="teambtn'+(join.team===t?' sel':'')+'" style="background:'+TEAM_COLOR[t]+'" data-act="jteam" data-t="'+t+'">'+az(t)+'</button>'; }).join('')+'</div>'+
      '<p class="warn" id="jwarn"></p><div class="row"><button class="btn" data-act="hub">'+az('返回')+'</button><button class="btn primary" data-act="jstart">'+az('開始比賽！')+'</button></div></div>';
  }

  /* ---------- 測驗流程 ---------- */
  var T=null;
  function dayKey(){ var d=new Date(); return d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate(); }
  function newId(){ return Date.now().toString(36)+Math.floor(Math.random()*1e9).toString(36); }
  function startTest(mode, opt){
    opt=opt||{};
    var plan=C.plan, seed;
    if(mode==='retest'){ plan={}; opt.codes.forEach(function(c){ plan[c]=3; }); }
    if(mode==='team') seed=hashStr('room'+C.grade+'-'+opt.room+'-'+dayKey()); // 同一房間、同一天，全隊題目相同
    else seed=(Date.now() ^ Math.floor(Math.random()*4294967295))>>>0;
    T={ id:newId(), mode:mode, room:opt.room||'', team:opt.team||'', items:buildTest(C, plan, seed), i:0, rec:[],
        score:0, combo:0, best:0, locked:false, num:'' };
    showQuestion();
  }
  function areaStats(areaId){
    var n=0, right=0, done=0;
    T.items.forEach(function(it,i){ if(it.area!==areaId) return; n++; if(i<T.rec.length){ done++; if(T.rec[i].ok) right++; } });
    return {n:n, right:right, done:done};
  }
  function showQuestion(){
    var it=T.items[T.i], area=AREA_BY[it.area], st=areaStats(it.area), N=T.items.length;
    var hp=Math.round((st.n-st.right)/st.n*100);
    var h='<div class="card"><div class="bosshead"><div class="boss" id="boss" aria-hidden="true">'+area.boss+'</div>'+
      '<div class="bossinfo"><b>'+az(area.name)+'・'+az(area.bossName)+'</b><div class="hp" aria-label="魔王血量"><i style="width:'+hp+'%"></i></div></div>'+
      '<div class="scorebox">⭐ '+T.score+'<br>'+(T.combo>1?'🔥 '+az('連續')+' '+T.combo:'&nbsp;')+'</div></div>'+
      '<div class="prog"><i style="width:'+Math.round(T.i/N*100)+'%"></i></div><div class="progtxt"><span>'+az('第')+' '+(T.i+1)+' / '+N+' '+az('題')+'</span>'+
      (T.mode==='team'?'<span style="color:'+TEAM_COLOR[T.team]+'">'+az(T.team)+' · '+az('房間')+' '+esc(T.room)+'</span>':'')+'</div>'+
      (T.mode==='team'?'<div class="teams" id="tstrip"><span class="muted">'+az('隊伍分數讀取中…')+'</span></div>':'')+
      '<div class="stemrow"><p class="stem">'+az(it.stem)+'</p><button class="btn small" data-act="say" title="唸題目" aria-label="唸題目">🔊</button></div>'+
      (it.vis?'<div class="vis">'+it.vis+'</div>':'');
    if(it.choices){
      h+='<div class="choices'+(it.long?' long':'')+(it.one?' one':'')+'">'+it.choices.map(function(c,i){
        return '<button class="choice" data-act="pick" data-i="'+i+'"'+(c.h?' aria-label="選項 '+(i+1)+'"':'')+'>'+(c.h||az(c.t))+'</button>'; }).join('')+'</div>';
    } else {
      T.num='';
      h+='<div class="numpad"><div class="numshow"><span id="numval">&nbsp;</span>'+(it.unit?'<span class="u">'+az(it.unit)+'</span>':'')+'</div><div class="keys">'+
        [1,2,3,4,5,6,7,8,9].map(function(k){ return '<button class="key" data-act="key" data-k="'+k+'">'+k+'</button>'; }).join('')+
        '<button class="key" data-act="key" data-k="del" aria-label="刪除">⌫</button><button class="key" data-act="key" data-k="0">0</button>'+
        '<button class="key ok" data-act="key" data-k="ok">'+az('確定')+'</button></div></div>';
    }
    h+='<p class="fb" id="fb" role="status"></p><div class="row"><button class="btn small dunno" data-act="dunno">🤔 '+az('我不會')+'</button></div></div>';
    T.locked=false;
    show('play', h);
    if(ttsPref()) say(it.stem);
    if(T.mode==='team') startStripPoll();
  }
  function answerText(it){ if(it.choices){ for(var i=0;i<it.choices.length;i++) if(it.choices[i].ok) return it.choices[i].t; } return it.num+(it.unit||''); }
  function record(ok, given, err){
    var it=T.items[T.i];
    T.rec.push({ no:T.i+1, code:it.code, area:it.area, codeName:CODES[it.code].name, q:it.stem.replace(/\n/g,' '),
      given:String(given), ans:answerText(it), ok:ok, err:ok?'':err });
    if(ok){ T.combo++; T.best=Math.max(T.best,T.combo); T.score+=100+10*Math.min(T.combo-1,10); }
    else T.combo=0;
  }
  function afterAnswer(ok){
    var fb=$('fb'), boss=$('boss');
    fb.className='fb '+(ok?'ok':'no');
    fb.innerHTML=ok?az(['答對了！','太棒了！','打中魔王了！'][Math.floor(Math.random()*3)]):az('沒關係，下一題加油！');
    if(boss){ boss.classList.remove('hit','laugh'); void boss.offsetWidth; boss.classList.add(ok?'hit':'laugh'); }
    var st=areaStats(T.items[T.i].area), bar=document.querySelector('.hp i'); if(bar) bar.style.width=Math.round((st.n-st.right)/st.n*100)+'%';
    if(T.mode==='team') sendProgress(false);
    timers.push(setTimeout(nextStep, ok?900:1100));
  }
  function nextStep(){
    var cur=T.items[T.i]; T.i++;
    if(T.i>=T.items.length || T.items[T.i].area!==cur.area) showStage(cur.area);
    else showQuestion();
  }
  function showStage(areaId){
    var a=AREA_BY[areaId], st=areaStats(areaId), r=st.right/st.n, stars=r>=0.9?3:r>=0.6?2:r>=0.3?1:0, win=r>=0.6, last=T.i>=T.items.length;
    show('stage','<div class="card stage"><div class="big" aria-hidden="true">'+(win?'💥'+a.boss:a.boss+'💨')+'</div>'+
      '<div class="stars">'+rep('★',stars)+rep('☆',3-stars)+'</div>'+
      '<h2>'+az(win?('打倒了'+a.bossName+'！'):(a.bossName+'逃走了，下次再挑戰！'))+'</h2>'+
      '<p>'+az('這一關答對')+' '+st.right+' / '+st.n+' '+az('題')+'</p>'+
      '<div class="row"><button class="btn primary" data-act="next-area">'+az(last?'看結果':'下一關')+' →</button></div></div>');
    if(ttsPref()) say(win?('打倒了'+a.bossName+'！'):(a.bossName+'逃走了'));
  }
  function codeStats(rec){ var c={}; rec.forEach(function(r){ if(!c[r.code]) c[r.code]=[0,0]; c[r.code][1]++; if(r.ok) c[r.code][0]++; }); return c; }
  function sendProgress(done){
    var id=getIdentity(); if(!id) return;
    var snap={type:'diagProgress', room:T.room, team:T.team, className:id.cls, studentName:id.name,
      answered:T.rec.length, correct:T.rec.filter(function(r){ return r.ok; }).length, score:T.score, done:done, codes:codeStats(T.rec)};
    checkBackend().then(function(ok){ if(ok) apiPost(snap).catch(function(){}); });
  }
  function finish(){
    var id=getIdentity()||{cls:'',name:''};
    var modeLabel=T.mode==='team'?'團體戰':T.mode==='retest'?'複測':'個人戰';
    var right=T.rec.filter(function(r){ return r.ok; }).length;
    var res={ id:T.id, ts:Date.now(), grade:C.grade, cls:id.cls, name:id.name, mode:modeLabel, room:T.room, team:T.team, score:T.score, best:T.best,
      right:right, total:T.rec.length, codes:codeStats(T.rec),
      wrong:T.rec.filter(function(r){ return !r.ok; }).map(function(r){ return {no:r.no, code:r.code, q:r.q, given:r.given, ans:r.ans, err:r.err}; }) };
    var hist=lsJSON('dx_history',[]); hist.unshift(res); lsSetJSON('dx_history',hist.slice(0,300));
    var payload={ type:'diagnostic', testId:res.id, className:id.cls, studentName:id.name, mode:modeLabel, room:T.room, team:T.team, score:T.score,
      items:T.rec.map(function(r){ return {code:r.code, codeName:r.codeName, q:r.q, given:r.given, ans:r.ans, ok:r.ok, err:r.err}; }) };
    if(T.mode==='team') sendProgress(true);
    var mode=T.mode, room=T.room, team=T.team;
    T=null;
    renderReport(res, {fresh:true, mine:true});
    sendResult(payload).then(function(ok){
      var s=$('send-status'); if(s) s.innerHTML=ok?'✅ 已送到老師的試算表':'💾 已存在這台平板，連上網路後會自動補送';
    });
    if(mode==='team') startWaitPoll(room, team);
  }

  /* ---------- 團體戰分數 ---------- */
  function teamChips(teams, me){
    if(!teams.length) return '<span class="muted">'+az('等待隊友加入…')+'</span>';
    return teams.slice().sort(function(a,b){ return b.avg-a.avg; }).map(function(t){
      return '<span class="tchip'+(t.team===me?' me':'')+'" style="background:'+TEAM_COLOR[t.team]+'"><span>'+az(t.team)+'</span><span>'+t.avg+'</span></span>'; }).join('');
  }
  function startStripPoll(){
    function tick(){ if(!T) return; var room=T.room, me=T.team; apiGet({action:'diagRoom', room:room}).then(function(d){ var el=$('tstrip'); if(el && d && d.teams) el.innerHTML=teamChips(d.teams, me); }).catch(function(){}); }
    tick(); timers.push(setInterval(tick, 10000));
  }
  function startWaitPoll(room, team){
    function tick(){ apiGet({action:'diagRoom', room:room}).then(function(d){ var el=$('wait-board'); if(el && d && d.teams) el.innerHTML=boardBars(d.teams, team); }).catch(function(){}); }
    tick(); timers.push(setInterval(tick, 8000));
  }
  function boardBars(teams, me){
    if(!teams.length) return '<p class="muted center">'+az('還沒有隊伍的成績')+'</p>';
    var max=Math.max.apply(null, teams.map(function(t){ return t.avg; }).concat([1]));
    return teams.slice().sort(function(a,b){ return b.avg-a.avg; }).map(function(t,i){
      return '<div class="barrow"><span class="nm" style="color:'+TEAM_COLOR[t.team]+'">'+(i===0?'👑':'')+az(t.team)+(t.team===me?' ⬅':'')+'</span>'+
        '<span class="bar"><i style="width:'+Math.round(t.avg/max*100)+'%;background:'+TEAM_COLOR[t.team]+'"></i></span>'+
        '<span class="val">'+az('平均')+' '+t.avg+'<br><small>'+t.finished+'/'+t.members+' '+az('人完成')+'</small></span></div>'; }).join('');
  }

  /* ---------- 診斷報告 ---------- */
  function statusOf(r,t){ if(r===t) return 'pass'; if(t>=2 && r*2>=t) return 'weak'; return 'fail'; }
  var ST_LABEL={pass:'✅ 通過', weak:'⚠️ 需加強', fail:'❌ 未通過'};
  function needCodes(res){ return CODE_ORDER.filter(function(c){ var v=res.codes[c]; return v && statusOf(v[0],v[1])!=='pass'; }); }
  /* 孩子自己的紀錄：這台平板的紀錄，加上從試算表讀回的其他平板紀錄。
   * 讀試算表需要老師金鑰（老師在這台平板的老師專區輸入過），沒有金鑰就只看本機。 */
  var serverHist={who:'', list:[], state:''};
  function whoKey(id){ return id.cls+'\u0001'+id.name; }
  function myHistory(){
    var id=getIdentity(); if(!id) return [];
    var seen={}, out=[], extra=serverHist.who===whoKey(id)?serverHist.list:[];
    gradeHistory().concat(extra).forEach(function(r){
      if(r.cls!==id.cls || r.name!==id.name || seen[r.id]) return;
      seen[r.id]=1; out.push(r);
    });
    return out.sort(function(a,b){ return b.ts-a.ts; });
  }
  function refreshServerHistory(onChange){
    var id=getIdentity(), key=lsGet('dx_key','');
    if(!id || !key) return false;
    function done(list, state){
      var cur=getIdentity(); if(!cur || whoKey(cur)!==whoKey(id)) return; // 讀取期間換人了
      serverHist={who:whoKey(id), list:list, state:state};
      if(onChange) onChange();
    }
    apiGet({action:'diagMatrix', key:key, cls:id.cls}).then(function(d){
      if(!d || !d.ok || !Array.isArray(d.results)){ done(serverHist.who===whoKey(id)?serverHist.list:[], 'fail'); return; }
      done(d.results.filter(function(r){ return r.name===id.name && inGrade(r); }), 'ok');
    }).catch(function(){ done(serverHist.who===whoKey(id)?serverHist.list:[], 'fail'); });
    return true;
  }
  var lastReport=null;
  function renderReport(res, opt){
    opt=opt||{}; lastReport=res;
    var rows=CODE_ORDER.filter(function(c){ return res.codes[c]; }).map(function(c){ var v=res.codes[c]; return {code:c, r:v[0], t:v[1], st:statusOf(v[0],v[1])}; });
    var pass=rows.filter(function(x){ return x.st==='pass'; }), need=rows.filter(function(x){ return x.st!=='pass'; });
    var pct=res.total?Math.round(res.right*100/res.total):0;
    var h='';
    if(opt.mine){
      h+='<div class="card kid center"><div style="font-size:56px" aria-hidden="true">'+(pct>=80?'🏆':pct>=60?'🎉':'💪')+'</div>'+
        '<h2>'+az('你答對了')+' '+res.right+' / '+res.total+' '+az('題！')+'</h2><p class="line">⭐ '+res.score+(res.best>1?' ・ 🔥 '+az('最多連續答對')+' '+res.best+' '+az('題'):'')+'</p>'+
        (pass.length?'<p class="line">'+az('你已經學會：')+'<br>'+pass.map(function(x){ return '<span class="pill">'+az(KID_NAME[x.code])+'</span>'; }).join('')+'</p>':'')+
        (need.length?'<p class="line">'+az('要再多練習：')+'<br>'+need.map(function(x){ return '<span class="pill">'+az(KID_NAME[x.code])+'</span>'; }).join('')+'</p>':'<p class="line">'+az('全部通過，你是數學勇士！')+'</p>')+
        (opt.fresh?'<p class="metaline" id="send-status">⏳ 正在送出成績…</p>':'')+'</div>';
      if(res.mode==='團體戰' && opt.fresh) h+='<div class="card no-print"><h3>'+az('隊伍成績')+'</h3><div id="wait-board"><p class="muted">'+az('讀取中…')+'</p></div></div>';
    }
    /*T*/
    var level=pct>=80?'大致精熟':pct>=60?'部分精熟，請加強下方標示的項目':'建議優先安排補救教學';
    h+='<div class="card rep"><h3>📋 學習診斷報告（教師版）</h3>'+
      '<p class="metaline">'+esc(res.cls)+' '+esc(res.name)+'｜'+fmtTime(res.ts)+'｜'+esc(res.mode)+(res.room?'｜房間 '+esc(res.room)+' '+esc(res.team):'')+'</p>'+
      '<p style="margin:8px 0;font-size:17px"><b>答對 '+res.right+' / '+res.total+' 題（'+pct+'%）</b>：'+level+'</p>'+
      '<p class="metaline">判讀：每個指標全對為「通過」；2 題以上答對一半以上為「需加強」；其餘為「未通過」。百分比門檻為本遊戲自訂的參考，不是篩選測驗的通過標準。標 ★ 的是〈學扶題對照表〉中全國錯誤率較高的指標。</p>'+
      '<div class="tblwrap"><table><thead><tr><th>指標代碼</th><th>基本學習內容</th><th>答對</th><th>結果</th></tr></thead><tbody>'+
      rows.map(function(x){ return '<tr><td>'+x.code+(CODES[x.code].hot?' <span class="hot">★</span>':'')+'</td><td>'+esc(CODES[x.code].name)+'</td><td>'+x.r+'/'+x.t+'</td><td class="st s-'+x.st+'">'+ST_LABEL[x.st]+'</td></tr>'; }).join('')+
      '</tbody></table></div>'+(C.notCovered?'<p class="metaline" style="margin-top:8px">'+esc(C.notCovered)+'</p>':'')+'</div>';
    if(res.wrong.length){
      h+='<div class="card rep"><h3>❌ 錯題與可能的迷思（'+res.wrong.length+' 題）</h3>'+
        res.wrong.map(function(w){ return '<div class="wrongitem"><b>第 '+w.no+' 題｜'+esc(w.code)+'</b> '+esc(w.q)+'<br>孩子的答案：<b>'+esc(w.given)+'</b>　正確答案：<b>'+esc(w.ans)+'</b><br><span class="err">可能的迷思：'+esc(w.err||'—')+'</span></div>'; }).join('')+'</div>';
    }
    if(need.length){
      h+='<div class="card rep"><h3>🧭 教學建議</h3>'+need.map(function(x){ return '<p style="margin:8px 0"><b class="s-'+x.st+'">'+x.code+' '+esc(CODES[x.code].name)+'</b><br>'+esc(CODES[x.code].tip)+'</p>'; }).join('')+'</div>';
    }
    /*/T*/
    h+='<div class="row no-print"><button class="btn" data-act="print">🖨️ '+az('列印')+'</button>'+
      (opt.mine && need.length?'<button class="btn primary" data-act="retest">🔁 '+az('複測還不熟的本領')+'</button>':'')+
      '<button class="btn" data-act="'+(opt.back||'hub')+'">'+az('返回')+'</button></div>';
    show('report', h);
    if(opt.fresh && ttsPref()) say('你答對了'+res.right+'題');
  }

  /* ---------- 我的紀錄 ---------- */
  function renderMyHistory(noFetch){
    var list=myHistory(), note;
    if(!lsGet('dx_key','')) note='只顯示這台平板上的紀錄（老師在老師專區輸入金鑰後，就能看到其他平板的紀錄）';
    else if(!noFetch){ refreshServerHistory(function(){ if(!$('scr-history').classList.contains('hidden')) renderMyHistory(true); }); note='☁️ 正在讀取其他平板上的紀錄…'; }
    else note=serverHist.state==='ok'?'☁️ 已包含其他平板上的紀錄':'⚠️ 讀不到試算表（沒有網路或金鑰不正確），只顯示這台平板上的紀錄';
    show('history','<div class="card"><h2>📋 '+az('我的紀錄')+'</h2><p class="metaline">'+note+'</p>'+
      (list.length?'<table class="hist">'+list.map(function(r){
      return '<tr><td>'+fmtTime(r.ts)+'</td><td>'+az(r.mode)+'</td><td>'+r.right+'/'+r.total+'</td><td><button class="btn small" data-act="hist-open" data-id="'+esc(r.id)+'" data-back="myhist">'+az('看報告')+'</button></td></tr>'; }).join('')+'</table>'
      :'<p class="muted">'+az('還沒有紀錄，先去挑戰魔王吧！')+'</p>')+'<div class="row"><button class="btn" data-act="hub">'+az('返回')+'</button></div></div>');
  }

  /*T*/
  /* ---------- 老師專區 ---------- */
  var mxData=[];
  function renderTeacher(){
    var hist=gradeHistory(), box=outbox();
    var state={unknown:'檢查中…', ok:'✅ 已連線，後台支援診斷紀錄', old:'⚠️ 後台還是舊版：請把 grade1/Code.gs 貼到 Apps Script，執行 setupSheets，再「管理部署作業 → 新版本」重新部署', off:'❌ 連不上後台（沒有網路或網址錯誤）'};
    show('teacher','<div class="card"><h2>⚙️ 老師專區</h2>'+
      '<p class="metaline" id="be-state">後台狀態：'+state[backendState]+(box.length?'<br>這台平板還有 '+box.length+' 份成績等待補送。':'')+'</p>'+
      '<label class="f" for="api-in">Google Apps Script 網址（和數字森林共用）</label><input class="f" id="api-in" style="font-size:14px" value="'+esc(getApiUrl())+'">'+
      '<label class="f" for="key-in">老師金鑰（Code.gs 裡的 DX_TEACHER_KEY；可讀回全班總表，孩子在這台平板也看得到自己在其他平板的紀錄）</label><input class="f" id="key-in" type="password" style="font-size:16px" value="'+esc(lsGet('dx_key',''))+'">'+
      '<div class="row"><button class="btn primary" data-act="t-save">儲存設定</button></div></div>'+
      '<div class="card"><h2>🛡️ 團體戰</h2><p class="muted">按「開新房間」會產生一組 4 位數號碼。用投影機打開大螢幕，孩子在自己的平板選「團體戰」輸入號碼和隊伍。同一個房間、同一天，全部孩子拿到相同的題目。</p>'+
      '<div class="row"><button class="btn primary" data-act="t-newroom">開新房間</button><input class="f" id="room-in" inputmode="numeric" maxlength="4" placeholder="或輸入已開的房間號碼" style="max-width:240px;font-size:17px"><button class="btn" data-act="t-openroom">打開大螢幕</button></div></div>'+
      '<div class="card"><h2>📊 全班診斷總表（'+esc(C.gradeLabel)+'）</h2><p class="muted">每位孩子取最近一次的結果，列出每個指標通過與否。點姓名看完整報告。</p>'+
      '<div class="row"><button class="btn" data-act="t-mx-local">這台平板的紀錄（'+hist.length+' 筆）</button><button class="btn" data-act="t-mx-server">從試算表讀取全班</button></div><div id="mx-area"></div></div>'+
      '<div class="card"><h2>🗂️ 這台平板的紀錄（'+esc(C.gradeLabel)+'）</h2>'+(hist.length?'<table class="hist">'+hist.slice(0,60).map(function(r){
        return '<tr><td>'+fmtTime(r.ts)+'</td><td>'+esc(r.cls)+' '+esc(r.name)+'</td><td>'+esc(r.mode)+'</td><td>'+r.right+'/'+r.total+'</td><td><button class="btn small" data-act="hist-open" data-id="'+esc(r.id)+'" data-back="teacher">報告</button></td></tr>'; }).join('')+'</table>'
        :'<p class="muted">還沒有紀錄。</p>')+
      '<div class="row"><button class="btn" data-act="t-clear">清除這台平板的紀錄</button><button class="btn" data-act="hub">返回</button></div></div>');
    if(backendState==='unknown') checkBackend(true).then(function(){ var el=$('be-state'); if(el) el.innerHTML='後台狀態：'+state[backendState]; });
  }
  function matrixHTML(results){
    var latest={}, keys=[];
    results.filter(inGrade).forEach(function(r){ var k=r.cls+'\u0001'+r.name; if(!latest[k]){ keys.push(k); latest[k]=r; } else if(latest[k].ts<r.ts) latest[k]=r; });
    var list=keys.map(function(k){ return latest[k]; }).sort(function(a,b){ return a.cls===b.cls ? a.name.localeCompare(b.name,'zh-Hant') : (a.cls<b.cls?-1:1); });
    mxData=list;
    if(!list.length) return '<p class="muted">沒有資料。</p>';
    var cnt={}; CODE_ORDER.forEach(function(c){ cnt[c]=[0,0]; });
    var body=list.map(function(r,i){
      var pct=r.total?Math.round(r.right*100/r.total):0;
      return '<tr><td class="nm">'+esc(r.cls)+' <button class="linkbtn" data-act="mx-open" data-i="'+i+'">'+esc(r.name)+'</button><br><small>'+fmtTime(r.ts).slice(5)+'</small></td><td>'+pct+'%</td>'+
        CODE_ORDER.map(function(c){ var v=r.codes[c]; if(!v) return '<td>·</td>'; var s=statusOf(v[0],v[1]); cnt[c][1]++; if(s==='pass') cnt[c][0]++; return '<td class="s-'+s+'" title="'+c+' '+v[0]+'/'+v[1]+'">'+(s==='pass'?'✅':s==='weak'?'⚠️':'❌')+'</td>'; }).join('')+'</tr>'; }).join('');
    var foot='<tr><th>通過人數</th><th></th>'+CODE_ORDER.map(function(c){ return '<th>'+(cnt[c][1]?cnt[c][0]+'/'+cnt[c][1]:'·')+'</th>'; }).join('')+'</tr>';
    return '<div class="tblwrap rep"><table class="mx"><thead><tr><th>學生</th><th>答對率</th>'+CODE_ORDER.map(function(c){ return '<th class="code" title="'+esc(CODES[c].name)+'">'+c+(CODES[c].hot?'★':'')+'</th>'; }).join('')+'</tr></thead><tbody>'+body+'</tbody><tfoot>'+foot+'</tfoot></table></div>'+
      '<div class="row no-print"><button class="btn small" data-act="print">🖨️ 列印總表</button></div>';
  }
  /* ---------- 老師大螢幕 ---------- */
  function renderBoard(room){
    show('board','<div class="card board"><p class="center muted" style="font-size:20px">請孩子打開「'+esc(C.title)+'」（'+esc(C.gradeLabel)+'）→「團體戰」，輸入房間號碼</p>'+
      '<div class="roomcode">'+esc(room)+'</div><div id="board-bars"><p class="muted center">等待孩子加入…</p></div></div>'+
      '<div class="card rep"><h3>📉 這個房間目前比較弱的指標</h3><div id="board-weak"><p class="muted">還沒有資料</p></div></div>'+
      '<div class="row no-print"><button class="btn" data-act="teacher">結束（回老師專區）</button></div>');
    function tick(){
      apiGet({action:'diagRoom', room:room}).then(function(d){
        if(!d || !d.teams) return;
        var b=$('board-bars'); if(b) b.innerHTML=d.teams.length?boardBars(d.teams,''):'<p class="muted center">等待孩子加入…</p>';
        var w=$('board-weak'); if(!w) return;
        var list=Object.keys(d.codes||{}).map(function(c){ return {c:c, r:d.codes[c][0], t:d.codes[c][1]}; }).filter(function(x){ return x.t>=2 && CODES[x.c]; })
          .sort(function(a,b){ return a.r/a.t-b.r/b.t; }).slice(0,6);
        w.innerHTML=list.length?'<table><thead><tr><th>指標</th><th>內容</th><th>答對率</th></tr></thead><tbody>'+list.map(function(x){
          return '<tr><td>'+x.c+'</td><td>'+esc(CODES[x.c].name)+'</td><td>'+Math.round(x.r*100/x.t)+'%（'+x.r+'/'+x.t+'）</td></tr>'; }).join('')+'</tbody></table>':'<p class="muted">還沒有資料</p>';
      }).catch(function(){});
    }
    tick(); timers.push(setInterval(tick, 5000));
  }
  /*/T*/

  /* ---------- 按鈕 ---------- */
  var ACT={
    'me-yes':function(){ renderHub(); },
    'logout':function(){ clearIdentity(); T=null; renderLogin(true); },
    'login':doLogin,
    'hub':function(){ T=null; renderHub(); },
    'zy':function(){ lsSet('nf_zy', zyPref()?'0':'1'); renderTop(); },
    'tts':function(){ lsSet('dx_tts', ttsPref()?'0':'1'); renderTop(); },
    'solo':function(){ startTest('solo'); },
    'retest':function(){
      var id=getIdentity()||{};
      var src=(lastReport && lastReport.name===id.name && lastReport.cls===id.cls && inGrade(lastReport))?lastReport:myHistory()[0];
      var codes=src?needCodes(src):[]; if(!codes.length){ renderHub(); return; }
      startTest('retest',{codes:codes});
    },
    'myhist':renderMyHistory,
    'join':renderJoin,
    'jkey':function(b){ var k=b.dataset.k; if(k==='del') join.code=join.code.slice(0,-1); else if(join.code.length<4) join.code+=k; $('jcode').innerHTML=join.code||'&nbsp;'; },
    'jteam':function(b){ join.team=b.dataset.t; document.querySelectorAll('.teambtn').forEach(function(x){ x.classList.toggle('sel', x.dataset.t===join.team); }); },
    'jstart':function(){
      if(!/^[1-9]\d{3}$/.test(join.code)){ $('jwarn').innerHTML=az('房間號碼是4個數字喔！'); return; }
      if(!join.team){ $('jwarn').innerHTML=az('請選一個隊伍！'); return; }
      startTest('team',{room:join.code, team:join.team});
    },
    'say':function(){ if(T) say(T.items[T.i].stem); },
    'pick':function(b){
      if(!T||T.locked) return; T.locked=true;
      var it=T.items[T.i], c=it.choices[parseInt(b.dataset.i,10)];
      b.classList.add(c.ok?'picked-ok':'picked-no');
      record(!!c.ok, c.t, c.err||'其他錯誤');
      afterAnswer(!!c.ok);
    },
    'key':function(b){
      if(!T||T.locked) return;
      var k=b.dataset.k, it=T.items[T.i];
      if(k==='del') T.num=T.num.slice(0,-1);
      else if(k==='ok'){
        if(!T.num){ $('fb').className='fb no'; $('fb').innerHTML=az('先按數字，再按確定喔！'); return; }
        T.locked=true;
        var v=parseInt(T.num,10), ok=v===it.num;
        record(ok, v+(it.unit||''), it.errs[v]||'其他錯誤');
        afterAnswer(ok); return;
      } else if(T.num.length<(C.maxDigits||3)) T.num=(T.num==='0'?'':T.num)+k;
      $('numval').innerHTML=T.num||'&nbsp;';
    },
    'dunno':function(){
      if(!T||T.locked) return; T.locked=true;
      record(false,'我不會','表示不會（沒有作答）');
      afterAnswer(false);
    },
    'next-area':function(){ if(!T) return; if(T.i>=T.items.length) finish(); else showQuestion(); },
    'print':function(){ window.print(); },
    'hist-open':function(b){
      var r=lsJSON('dx_history',[]).concat(serverHist.list).filter(function(x){ return x.id===b.dataset.id; })[0];
      if(r) renderReport(r,{back:b.dataset.back, mine:b.dataset.back==='myhist'});
    },
    'teacher':function(){ T=null; renderTeacher(); },
    't-save':function(){
      lsSet('nf_api', $('api-in').value.trim()); lsSet('dx_key', $('key-in').value.trim());
      backendState='unknown'; backendPromise=null; rosterCache=null; renderTeacher(); flushOutbox();
    },
    't-newroom':function(){ renderBoard(String(1000+Math.floor(Math.random()*9000))); },
    't-openroom':function(){ var v=($('room-in').value||'').trim(); if(/^[1-9]\d{3}$/.test(v)) renderBoard(v); else alert('請輸入 4 位數的房間號碼（第一位不是 0）'); },
    't-mx-local':function(){ $('mx-area').innerHTML=matrixHTML(lsJSON('dx_history',[])); },
    't-mx-server':function(){
      var key=lsGet('dx_key',''), area=$('mx-area');
      if(!key){ area.innerHTML='<p class="warn">請先在上方輸入老師金鑰並儲存。</p>'; return; }
      area.innerHTML='<p class="muted">讀取中…</p>';
      apiGet({action:'diagMatrix', key:key}).then(function(d){
        if(!d || !d.ok){ area.innerHTML='<p class="warn">讀取失敗：'+(d&&d.error==='forbidden'?'金鑰不正確，或 Code.gs 的 DX_TEACHER_KEY 還沒設定':'後台尚未更新')+'</p>'; return; }
        area.innerHTML=matrixHTML(d.results);
      }).catch(function(){ area.innerHTML='<p class="warn">連不上後台。</p>'; });
    },
    'mx-open':function(b){ var r=mxData[parseInt(b.dataset.i,10)]; if(r) renderReport(r,{back:'teacher'}); },
    't-clear':function(){
      if(confirm('確定要清除這台平板上「'+C.gradeLabel+'」的診斷紀錄嗎？（試算表裡的資料不會被刪除）')){
        lsSetJSON('dx_history', lsJSON('dx_history',[]).filter(function(r){ return !inGrade(r); })); renderTeacher();
      }
    }
  };

  /* ---------- 啟動 ---------- */
  var SKELETON='<div class="topbar"><a class="btn small" href="index.html" id="lnk-home"></a><span class="who" id="who"></span>'+
    '<span class="tools"><button class="btn small" id="btn-tts" data-act="tts"></button><button class="btn small" id="btn-zy" data-act="zy"></button>'+
    '<button class="btn small" data-act="teacher" title="老師專區">⚙️</button></span></div>'+
    SCREENS.map(function(s){ return '<section id="scr-'+s+'" class="hidden"></section>'; }).join('');
  function start(cfg){
    C=cfg; CODES=cfg.codes; KID_NAME=cfg.kidNames; CODE_ORDER=[]; CODE_SET={}; AREA_BY={};
    cfg.areas.forEach(function(a){ AREA_BY[a.id]=a; a.codes.forEach(function(c){ CODE_ORDER.push(c); CODE_SET[c]=1; }); });
    var app=$('app');
    app.innerHTML=SKELETON;
    app.addEventListener('click', function(e){
      var b=e.target.closest('[data-act]'); if(!b) return;
      var f=ACT[b.dataset.act]; if(f){ e.preventDefault(); f(b,e); }
    });
    document.addEventListener('change', function(e){
      if(e.target && e.target.id==='cls-sel' && rosterCache){
        var names=rosterCache[e.target.value]||[];
        $('name-sel').innerHTML='<option value="">'+az('請選擇')+'</option>'+names.map(function(n){ return '<option>'+esc(n)+'</option>'; }).join('');
      }
    });
    renderTop();
    renderLogin(!getIdentity());
    flushOutbox();
  }

  window.DX={
    az:az, esc:esc, rnd:rnd, ri:ri, pick:pick, shuffle:shuffle, sample:sample, rep:rep, mk:mk, cnNum:cnNum, mc:mc, Q:Q,
    svgWrap:svgWrap, svgBeads:svgBeads, svgSticks:svgSticks, svgEggs:svgEggs, svgCoins:svgCoins, svgMoney:svgMoney,
    svgClock:svgClock, svgClockRaw:svgClockRaw, svgCal:svgCal, svgPencil:svgPencil, svgClipRibbons:svgClipRibbons,
    svgRibbons:svgRibbons, svgRoute:svgRoute, svgCubes:svgCubes, svgShape:svgShape, emo:emo, grp:grp, MONTH_DAYS:MONTH_DAYS,
    buildTest:buildTest, start:start
  };
})();
