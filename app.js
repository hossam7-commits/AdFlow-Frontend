const tg = window.Telegram.WebApp;

function requestBalance() {
    tg.sendData(JSON.stringify({
        command: "/balance_request",
        message: "رجاءً قم بتحديث رصيدي."
    }));
    document.querySelector('.balance-amount').textContent = '... يتم التحديث';
    setTimeout(() => {
        tg.close();
    }, 1500);
}

document.querySelectorAll('.action-btn').forEach(button => {
    button.addEventListener('click', () => {
        const action = button.getAttribute('data-action');
        tg.sendData(JSON.stringify({
            command: action,
            message: `المستخدم طلب إجراء: ${action}`
        }));
        alert(`تم طلب الإجراء: ${action}. يرجى التحقق من رسائل البوت.`);
        tg.close();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    tg.ready();
    // الرصيد الافتراضي
    document.querySelector('.balance-amount').textContent = '0.00 USDT';
    
    // إخفاء الأزرار مؤقتاً لو لم تكن متوافقة مع الويب
    // يمكنك تعديل هذه الدالة لاحقاً لربط الرصيد الحقيقي
});
