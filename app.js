import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getFirestore, collection, addDoc, deleteDoc, doc, query, orderBy, limit, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";
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
try{await signInAnonymously(auth)}catch(e){$("status").textContent="接続失敗：Firebase設定と匿名認証を確認してください。"}
onAuthStateChanged(auth,u=>{user=u;$("postBtn").disabled=!u;$("status").textContent=u?"共有掲示板に接続しました。":"認証できませんでした。"});
$("postBtn").onclick=async()=>{const text=$("postText").value.trim(),name=$("postName").value.trim()||"匿名会員";if(!user||!text)return alert("投稿内容を入力してください。");if(Date.now()-lastPost<10000)return alert("連続投稿は10秒待ってください。");$("postBtn").disabled=true;try{await addDoc(collection(db,"posts"),{name,text,uid:user.uid,createdAt:serverTimestamp()});lastPost=Date.now();$("postText").value=""}catch(e){alert("投稿できませんでした："+e.message)}finally{$("postBtn").disabled=false}};
const q=query(collection(db,"posts"),orderBy("createdAt","desc"),limit(50));
onSnapshot(q,snap=>{$("posts").innerHTML=snap.empty?'<p class="small">まだ投稿はありません。</p>':snap.docs.map(d=>{const p=d.data(),own=user&&p.uid===user.uid,date=p.createdAt?.toDate().toLocaleString("ja-JP")||"送信中";return `<article class="post"><div class="postHead"><b>${esc(p.name)}</b><span>${esc(date)}</span></div>${own?`<button class="delete secondary" data-id="${d.id}">削除</button>`:""}<p>${esc(p.text)}</p></article>`}).join("");document.querySelectorAll(".delete").forEach(b=>b.onclick=async()=>{if(confirm("自分の投稿を削除しますか？"))await deleteDoc(doc(db,"posts",b.dataset.id))})},e=>{$("status").textContent="読込失敗：Firestore設定とルールを確認してください。"});
$("saveCardBtn").onclick = () => {

    html2canvas(document.querySelector(".card")).then(canvas => {

        const link = document.createElement("a");

       const dataUrl = canvas.toDataURL("image/png");
window.open(dataUrl, "_blank");
    });
};
