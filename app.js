// app.js - النسخة النهائية والذكية
const API_BASE_URL = "https://husamalmswry.pythonanywhere.com";

// هذا السطر الذكي يفحص: هل نحن في تيليجرام أم كروم؟
// إذا لم يجد تيليجرام، لن يتوقف الكود عن العمل
const tg = window.Telegram ? window.Telegram.WebApp : null;

document.addEventListener('DOMContentLoaded', () => {
    // توسيع الواجهة إذا كنا في تيليجرام
    if (tg) {
        tg.expand();
        tg.ready();
    }

    // تشغيل جلب الرصيد فوراً
    fetchUserBalance();

    // تفعيل الأزرار
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action');
            handleAction(action);
        });
    });

    const refreshBtn = document.querySelector('.small-btn');
    if(refreshBtn) refreshBtn.addEventListener('click', fetchUserBalance);
});

function fetchUserBalance() {
    // نستخدم معرف آمن لا يسبب مشاكل في كروم
    const userId = tg?.initDataUnsafe?.user?.id; 
    const balanceElement = document.querySelector('.balance-amount');
    
    // إذا فتحت من كروم (لا يوجد آيدي)، نعرض "زائر"
    if (!userId) {
        balanceElement.textContent = "زائر (تجريبي)";
        // هنا يمكنك إيقاف الدالة أو تركها تكمل للتجربة
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
            balanceElement.textContent = "خطأ";
        }
    })
    .catch(err => {
        console.error(err);
        balanceElement.textContent = "خطأ اتصال";
    });
}

function handleAction(action) {
    if (tg) {
        tg.sendData(JSON.stringify({ command: action }));
        alert("تم الإرسال!");
        tg.close();
    } else {
        alert("أنت في المتصفح! هذا الزر يعمل داخل تيليجرام فقط.");
    }
}
