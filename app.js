// app.js - النسخة المتصلة بالسيرفر الحي
const API_BASE_URL = "https://husamalmswry.pythonanywhere.com"; // رابط سيرفرك

const tg = window.Telegram.WebApp;

document.addEventListener('DOMContentLoaded', () => {
    // 1. توسيع الواجهة لتملأ الشاشة
    if (tg) {
        tg.expand();
        tg.ready();
    }

    // 2. محاولة جلب الرصيد فوراً عند الفتح
    fetchUserBalance();

    // 3. تفعيل الأزرار
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action');
            handleAction(action);
        });
    });
    
    // زر تحديث الرصيد الصغير
    const refreshBtn = document.querySelector('.small-btn');
    if(refreshBtn) refreshBtn.addEventListener('click', fetchUserBalance);
});

// دالة جلب الرصيد من سيرفر PythonAnywhere
function fetchUserBalance() {
    const userId = tg.initDataUnsafe?.user?.id; 
    const balanceElement = document.querySelector('.balance-amount');
    
    if (!userId) {
        balanceElement.textContent = "زائر (تجريبي)";
        return;
    }

    balanceElement.textContent = "جاري التحميل...";

    // الاتصال بالسيرفر
    fetch(`${API_BASE_URL}/api/get_balance`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: userId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            balanceElement.textContent = data.balance; 
        } else {
            balanceElement.textContent = "خطأ";
        }
    })
    .catch(error => {
        console.error('Error:', error);
        balanceElement.textContent = "خطأ في الاتصال";
    });
}

function handleAction(action) {
    if (tg) {
        tg.sendData(JSON.stringify({ command: action }));
        alert("تم إرسال الطلب للبوت! ✅");
        tg.close();
    }
}
