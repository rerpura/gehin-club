import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getFirestore, collection, addDoc, deleteDoc, doc,getDoc,setDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";
const app=initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app); let user=null,lastPost=0;
const $=id=>document.getElementById(id), esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const subjects = [
"目覚まし時計","犬","猫","スマホ","パソコン","Wi‑Fi",
"課題","先生","電車","自転車","カレンダー","冷蔵庫",
"AI","宇宙","地球","月","太陽","重力",
"布団","枕","エナジードリンク","Nintendo Switch",
"コントローラー","学校","会社","隣人",
"未来の自分","過去の自分","電池","充電器",
"妖怪","サメ","ドローン","ビオトープ管理士試験",
"コーヒー","階段","火星","タコ","ペンギン"
];

const actions = [
"との交渉が決裂した",
"が予想外の動きをした",
"が暴走した",
"が責任を放棄した",
"がストライキを起こした",
"が寝坊した",
"が反乱を起こした",
"がログアウトした",
"がアップデート中だった",
"がバグった",
"が行方不明になった",
"が仕様変更された",
"が有給を取った",
"が限界だった",
"が空気を読まなかった",
"が想定外だった",
"がメンテナンス中だった",
"がフリーズした",
"が覚醒した",
"が勝手に判断した"
];

const endings = [
"そのため私に責任はありません。",
"以上が調査結果です。",
"科学的に仕方ありません。",
"運営に確認してください。",
"現在原因を究明中です。",
"今後の改善を検討します。",
"大変遺憾です。",
"たぶん大丈夫です。",
"仕様です。",
"ご理解をお願いいたします。",
"知らんけど。",
"ヨシ！",
"異論は認めません。",
"責任者は現在捜索中です。",
"詳細は来世で説明します。"
];

$("excuseBtn").onclick=()=>{
    const subject =
        subjects[Math.floor(Math.random()*subjects.length)];

    const action =
        actions[Math.floor(Math.random()*actions.length)];

    const ending =
        endings[Math.floor(Math.random()*endings.length)];

    $("excuse").textContent =
        `${subject}${action}。${ending}`;
};
$("issueBtn").onclick=()=>{$("cardName").textContent=$("memberName").value.trim()||"名もなき会員";$("cardTitle").textContent="肩書き："+($("memberTitle").value.trim()||"一般会員");$("cardNo").textContent="NO. "+String(Math.floor(Math.random()*1e6)).padStart(6,"0")};
const provider = new GoogleAuthProvider();

$("googleLoginBtn").onclick = async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error(error);
    $("loginStatus").textContent =
      "ログイン失敗：" + error.message;
  }
};

$("logoutBtn").onclick = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error);
    $("loginStatus").textContent =
      "ログアウト失敗：" + error.message;
  }
};
onAuthStateChanged(auth, u => {
  user = u;

  const loggedIn = Boolean(u);

  $("postBtn").disabled = !loggedIn;
  $("googleLoginBtn").hidden = loggedIn;
  $("logoutBtn").hidden = !loggedIn;

  if (loggedIn) {
    $("loginStatus").textContent =
      `${u.displayName || "会員"}としてログイン中`;

    $("status").textContent =
      "共有掲示板に接続しました。";
  } else {
    $("loginStatus").textContent =
      "ログインしていません";

    $("status").textContent =
      "投稿するにはGoogleログインしてください。";
  }
  loadTodayFortune();
});
$("postBtn").onclick=async()=>{const text=$("postText").value.trim(),name =
  $("postName").value.trim() ||
  user.displayName ||
  "Google会員";if(!user||!text)return alert("投稿内容を入力してください。");if(Date.now()-lastPost<10000)return alert("連続投稿は10秒待ってください。");$("postBtn").disabled=true;try{await addDoc(collection(db,"posts"),{name,text,uid:user.uid,createdAt:serverTimestamp()});lastPost=Date.now();$("postText").value=""}catch(e){alert("投稿できませんでした："+e.message)}finally{$("postBtn").disabled=false}};
const q=query(collection(db,"posts"),orderBy("createdAt","desc"),limit(50));
onSnapshot(q,snap=>{$("posts").innerHTML=snap.empty?'<p class="small">まだ投稿はありません。</p>':snap.docs.map(d=>{const p=d.data(),own=user&&p.uid===user.uid,date=p.createdAt?.toDate().toLocaleString("ja-JP")||"送信中";return `<article class="post"><div class="postHead"><b>${esc(p.name)}</b><span>${esc(date)}</span></div>${own?`<button class="delete secondary" data-id="${d.id}">削除</button>`:""}<p>${esc(p.text)}</p></article>`}).join("");document.querySelectorAll(".delete").forEach(b=>b.onclick=async()=>{if(confirm("自分の投稿を削除しますか？"))await deleteDoc(doc(db,"posts",b.dataset.id))})},e=>{$("status").textContent="読込失敗：Firestore設定とルールを確認してください。"});
$("saveCardBtn").onclick = () => {

 html2canvas(document.querySelector(".member")).then(canvas => {

    const img = document.createElement("img");

    img.src = canvas.toDataURL("image/png");

    const w = window.open("");

    w.document.body.appendChild(img);
});
    
};
const fortunes = [
  {
    rarity: "大吉",
    overall: "★★★★★",
    excuse: "★★★★★",
    study: "★★★★☆",
    shark: "★★★★★",
    message: "今日は何をしても許される気がする日です。"
  },
  {
    rarity: "大吉",
    overall: "★★★★★",
    excuse: "★★★★☆",
    study: "★★★★★",
    shark: "★★★★☆",
    message: "やる気が本人より先に到着しています。"
  },
  {
    rarity: "中吉",
    overall: "★★★★☆",
    excuse: "★★★★★",
    study: "★★★☆☆",
    shark: "★★★★☆",
    message: "言い訳の完成度だけは過去最高です。"
  },
  {
    rarity: "中吉",
    overall: "★★★★☆",
    excuse: "★★★☆☆",
    study: "★★★★☆",
    shark: "★★★★★",
    message: "サメに関することならだいたいうまくいきます。"
  },
  {
    rarity: "小吉",
    overall: "★★★☆☆",
    excuse: "★★★★☆",
    study: "★★★☆☆",
    shark: "★★★☆☆",
    message: "普通の日です。普通が一番とは限りません。"
  },
  {
    rarity: "小吉",
    overall: "★★★☆☆",
    excuse: "★★★★★",
    study: "★★☆☆☆",
    shark: "★★★★☆",
    message: "失敗しても言い訳で巻き返せそうです。"
  },
  {
    rarity: "吉",
    overall: "★★★★☆",
    excuse: "★★★☆☆",
    study: "★★★★☆",
    shark: "★★★☆☆",
    message: "締切より少しだけ先に動くと吉です。"
  },
  {
    rarity: "末吉",
    overall: "★★☆☆☆",
    excuse: "★★★★☆",
    study: "★★☆☆☆",
    shark: "★★★☆☆",
    message: "無理に頑張らず、できるふりから始めましょう。"
  },
  {
    rarity: "凶",
    overall: "★☆☆☆☆",
    excuse: "★★★★★",
    study: "★☆☆☆☆",
    shark: "★★☆☆☆",
    message: "今日は言い訳を準備してから行動してください。"
  },
  {
    rarity: "大凶",
    overall: "☆☆☆☆☆",
    excuse: "★★★★★",
    study: "☆☆☆☆☆",
    shark: "★☆☆☆☆",
    message: "布団との交渉が決裂しないよう注意してください。"
  },
  {
    rarity: "SSR",
    overall: "★★★★★",
    excuse: "★★★★★",
    study: "★★★★★",
    shark: "★★★★★",
    message: "今日は世界のほうがあなたに合わせる日です。"
  },
  {
    rarity: "UR",
    overall: "★★★★★",
    excuse: "★★★★★",
    study: "★★★★★",
    shark: "★★★★★",
    message: "伝説の下品神が降臨しました。責任は負いません。"
  }
];

function getTodayKey() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function showFortune(fortune) {
  $("fortuneResult").innerHTML = `
    <strong>【${esc(fortune.rarity)}】</strong><br><br>
    総合運：${esc(fortune.overall)}<br>
    言い訳運：${esc(fortune.excuse)}<br>
    課題運：${esc(fortune.study)}<br>
    サメ運：${esc(fortune.shark)}<br><br>
    ${esc(fortune.message)}
  `;
}

async function loadTodayFortune() {
  if (!user) {
    $("fortuneBtn").disabled = true;
    $("fortuneResult").textContent =
      "Googleログインすると、1日1回だけ引けます。";
    return;
  }

  const today = getTodayKey();
  const fortuneId = `${user.uid}_${today}`;
  const fortuneRef = doc(db, "dailyFortunes", fortuneId);

  try {
    const fortuneSnap = await getDoc(fortuneRef);

    if (fortuneSnap.exists()) {
      showFortune(fortuneSnap.data().fortune);

      $("fortuneBtn").disabled = true;
      $("fortuneBtn").textContent = "今日は引きました";
    } else {
      $("fortuneResult").textContent =
        "今日の運勢はまだ引いていません。";

      $("fortuneBtn").disabled = false;
      $("fortuneBtn").textContent = "今日の運勢を引く";
    }
  } catch (error) {
    console.error(error);

    $("fortuneResult").textContent =
      "運勢の確認に失敗しました。";

    $("fortuneBtn").disabled = true;
  }
}

$("fortuneBtn").onclick = async () => {
  if (!user) {
    alert("先にGoogleログインしてください。");
    return;
  }

  $("fortuneBtn").disabled = true;
  $("fortuneBtn").textContent = "運勢を占っています…";

  const today = getTodayKey();
  const fortuneId = `${user.uid}_${today}`;
  const fortuneRef = doc(db, "dailyFortunes", fortuneId);

  try {
    const existing = await getDoc(fortuneRef);

    if (existing.exists()) {
      showFortune(existing.data().fortune);
      $("fortuneBtn").textContent = "今日は引きました";
      return;
    }

    const fortune =
      fortunes[Math.floor(Math.random() * fortunes.length)];

    await setDoc(fortuneRef, {
      uid: user.uid,
      date: today,
      fortune: fortune,
      createdAt: serverTimestamp()
    });

    showFortune(fortune);
    $("fortuneBtn").textContent = "今日は引きました";
  } catch (error) {
    console.error(error);

    $("fortuneResult").textContent =
      "運勢を引けませんでした：" + error.message;

    $("fortuneBtn").disabled = false;
    $("fortuneBtn").textContent = "もう一度試す";
  }
};
