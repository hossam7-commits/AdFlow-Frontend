// app.js - النسخة المباشرة (بدون فلسفة)
const API_BASE_URL = "https://husamalmswry.pythonanywhere.com";

// استدعاء مباشر لمكتبة تيليجرام
const tg = window.Telegram.WebApp;

document.addEventListener('DOMContentLoaded', () => {
    // توسيع فوري
    tg.expand();

    // جلب الرصيد
    fetchUserBalance();

    // تفعيل الأزرار
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action');
            if(action) handleAction(action);
        });
    });

    const refreshBtn = document.querySelector('.small-btn');
    if(refreshBtn) refreshBtn.addEventListener('click', fetchUserBalance);
});

function fetchUserBalance() {
    const balanceElement = document.querySelector('.balance-amount');
    
    // محاولة قراءة الآيدي بأكثر من طريقة
    let userId = tg.initDataUnsafe?.user?.id;

    // إذا لم يجد الآيدي، لا يكتب زائر، بل يحاول مرة أخرى أو يكتب خطأ صريح
    if (!userId) {
        balanceElement.textContent = "خطأ معرف"; // لنعرف أن المشكلة في الآيدي
        return;
    }

    balanceElement.textContent = "جاري التحميل...";

    fetch(`${API_BASE_URL}/api/get_balance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "success") {
            balanceElement.textContent = data.balance;
        } else {
            balanceElement.textContent = "خطأ سيرفر";
        }
    })
    .catch(err => {
        balanceElement.textContent = "خطأ نت";
    });
}

function handleAction(action) {
    // إرسال البيانات للبوت
    tg.sendData(JSON.stringify({ command: action }));
    // إغلاق النافذة فوراً ليشعر المستخدم بالاستجابة
    tg.close();
}
