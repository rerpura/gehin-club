import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getFirestore, collection, addDoc, deleteDoc, doc, query, orderBy, limit, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";
const app=initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app); let user=null,lastPost=0;
const $=id=>document.getElementById(id), esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const excuses=["遅れたんじゃない。時間のほうが先に行った。","やる気はありましたが、本人が欠席しています。","確認したつもりが、つもりのままでした。","目覚ましは鳴りました。私との交渉が決裂しました。"];
$("excuseBtn").onclick=()=>$("excuse").textContent=excuses[Math.floor(Math.random()*excuses.length)];
$("issueBtn").onclick=()=>{$("cardName").textContent=$("memberName").value.trim()||"名もなき会員";$("cardTitle").textContent="肩書き："+($("memberTitle").value.trim()||"一般会員");$("cardNo").textContent="NO. "+String(Math.floor(Math.random()*1e6)).padStart(6,"0")};
try{await signInAnonymously(auth)}catch(e){$("status").textContent="接続失敗：Firebase設定と匿名認証を確認してください。"}
onAuthStateChanged(auth,u=>{user=u;$("postBtn").disabled=!u;$("status").textContent=u?"共有掲示板に接続しました。":"認証できませんでした。"});
$("postBtn").onclick=async()=>{const text=$("postText").value.trim(),name=$("postName").value.trim()||"匿名会員";if(!user||!text)return alert("投稿内容を入力してください。");if(Date.now()-lastPost<10000)return alert("連続投稿は10秒待ってください。");$("postBtn").disabled=true;try{await addDoc(collection(db,"posts"),{name,text,uid:user.uid,createdAt:serverTimestamp()});lastPost=Date.now();$("postText").value=""}catch(e){alert("投稿できませんでした："+e.message)}finally{$("postBtn").disabled=false}};
const q=query(collection(db,"posts"),orderBy("createdAt","desc"),limit(50));
onSnapshot(q,snap=>{$("posts").innerHTML=snap.empty?'<p class="small">まだ投稿はありません。</p>':snap.docs.map(d=>{const p=d.data(),own=user&&p.uid===user.uid,date=p.createdAt?.toDate().toLocaleString("ja-JP")||"送信中";return `<article class="post"><div class="postHead"><b>${esc(p.name)}</b><span>${esc(date)}</span></div>${own?`<button class="delete secondary" data-id="${d.id}">削除</button>`:""}<p>${esc(p.text)}</p></article>`}).join("");document.querySelectorAll(".delete").forEach(b=>b.onclick=async()=>{if(confirm("自分の投稿を削除しますか？"))await deleteDoc(doc(db,"posts",b.dataset.id))})},e=>{$("status").textContent="読込失敗：Firestore設定とルールを確認してください。"});