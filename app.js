// app.js - نسخة محسنة لربط الواجهة بالبوت
// تهيئة واجهة WebApp الخاصة بتيليجرام (التأكد من وجودها)
const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;

// دالة لإرسال أمر للبوت
function sendCommand(commandName, messageText = "") {
    if (tg) {
        tg.sendData(JSON.stringify({
            command: commandName,
            message: messageText
        }));
        // يمكنك اختيار إغلاق الواجهة أو إظهار رسالة
        // tg.close();
    } else {
        alert("تطبيق تيليجرام غير متاح.");
    }
}

// دالة لتحديث الرصيد (يتم استدعاؤها عند فتح الواجهة أو تحديثها)
function requestBalance() {
    // هذه الدالة الآن سترسل أمراً للبوت ليقوم هو بالرد بالرصيد
    sendCommand("/balance_request", "الرجاء تحديث الرصيد.");
    document.querySelector('.balance-amount').textContent = '... يتم التحديث';
    // لا نغلق الواجهة هنا، البوت سيعرض الرصيد في المحادثة
}

// دالة لمعالجة ضغط الأزرار
document.addEventListener('DOMContentLoaded', () => {
    if (tg) {
        tg.ready();
        // إظهار الرصيد الافتراضي عند التحميل (يمكن تحديثه لاحقاً)
        document.querySelector('.balance-amount').textContent = '0.00 USDT';
    } else {
        document.querySelector('.balance-amount').textContent = 'غير متصل بالبوت';
    }

    document.querySelectorAll('.action-btn').forEach(button => {
        button.addEventListener('click', () => {
            const action = button.getAttribute('data-action');
            let commandToSend = "";

            // تعيين الأمر الصحيح لكل زر
            if (action === "publish") {
                commandToSend = "/publish_ad"; // أمر وهمي للنشر حالياً
            } else if (action === "channels") {
                commandToSend = "/my_channels"; // أمر وهمي لإدارة القنوات
            } else if (action === "deposit") {
                commandToSend = "/deposit_money_from_web"; // أمر وهمي للشحن من الويب
            } else if (action === "withdraw") {
                commandToSend = "/withdraw"; // هذا الأمر حقيقي
            }

            if (commandToSend) {
                sendCommand(commandToSend, `طلب من الواجهة: ${action}`);
                alert(`تم طلب الإجراء: ${action}. يرجى التحقق من رسائل البوت.`);
                if (tg) tg.close(); // إغلاق الواجهة بعد إرسال الأمر
            }
        });
    });

    // ربط زر التحديث بالدالة
    const updateBalanceBtn = document.querySelector('.small-btn');
    if (updateBalanceBtn) {
        updateBalanceBtn.addEventListener('click', requestBalance);
    }
});

// هذا الكود يستقبل البيانات من البوت
if (tg) {
    tg.onEvent('mainButtonClicked', function(){
        // إذا كان هناك زر رئيسي في البوت، يمكننا التعامل معه هنا
        // حالياً لا نحتاجه
    });
    // يمكننا إضافة استماع لـ tg.onEvent('invoiceClosed') أو غيرها لاحقاً
}
