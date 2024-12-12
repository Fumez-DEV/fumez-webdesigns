console.log('Script loaded successfully!');

// Smooth scroll for internal links
document.querySelectorAll("a[href^='#']").forEach(anchor => {
    anchor.addEventListener("click", function(e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        document.querySelector(targetId).scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
});

document.querySelectorAll('a.language-switcher').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const overlay = document.getElementById('transition-overlay');
        overlay.classList.add('active');
        setTimeout(() => {
            window.location.href = this.href;
        }, 500); // Match the duration of your CSS transition
    });
});


// Contact form submission
document.querySelector('#contact-form').addEventListener('submit', function(event) {
    event.preventDefault();

    fetch(this.action, {
        method: 'POST',
        body: new FormData(this),
        headers: { 'Accept': 'application/json' }
    }).then(response => {
        if (response.ok) {
            alert('הטופס נשלח בהצלחה! תודה על פנייתכם.');
            this.reset();
        } else {
            alert('אופס! אירעה בעיה בשליחת הטופס.');
        }
    }).catch(error => console.error('Error:', error));
});

// Toggle mobile menu
const toggleButton = document.querySelector('.toggle-button');
const navMenu = document.querySelector('nav ul');

toggleButton.addEventListener('click', () => {
    navMenu.classList.toggle("show");
    toggleButton.classList.toggle("active");
});

// FAQ item toggle
document.querySelectorAll('.faq-item h3').forEach(item => {
    item.addEventListener('click', () => {
        item.parentElement.classList.toggle('active');
    });
});

// Function to open an email in Hebrew with notification
function openEmail(packageType) {
    const email = "arikmelku3@gmail.com";
    const hebrewMessage = `שלום אריק,\n\nאני מעוניין/ת בחבילה ${packageType === 'Basic' ? 'בסיסית' : packageType === 'Standard' ? 'סטנדרטית' : 'פרימיום'} שמוצעת ב-פיומז - עיצובי אתרים. אשמח לקבל פרטים נוספים לגבי החבילה ואת הצעדים הבאים להמשך.\n\nהנה הפרטים שלי:\n\nשם: [השם שלך]\nאימייל: [האימייל שלך]\nטלפון: [מספר הטלפון שלך]\n\nמידע נוסף או דרישות:\n[אנא הוסף/הוסיפי כל פרט נוסף שתרצה/תרצי לשתף]\n\nתודה על העזרה שלך!\n\nבברכה,\n[השם שלך]`;

    // Open mailto link with the prefilled Hebrew message
    const subject = `התעניינות בחבילת ${packageType === 'Basic' ? 'בסיסית' : packageType === 'Standard' ? 'סטנדרטית' : 'פרימיום'} מ-פיומז - עיצובי אתרים`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(hebrewMessage)}`;

    // Show notification
    showNotification("מועבר לאימייל שלך, תודה שפנית אלינו!");
}

// Function to show a notification
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show', 'success');

    // Hide the notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show', 'success');
    }, 3000);
}

// Video conversion with ffmpeg.js
async function convertVideoToGif(videoPath, outputPath) {
    const { createFFmpeg, fetchFile } = FFmpeg;
    const ffmpeg = createFFmpeg({ log: true });

    await ffmpeg.load();
    ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(videoPath));
    await ffmpeg.run('-i', 'input.mp4', '-vf', 'fps=10,scale=320:180,setsar=1', '-t', '5', 'output.gif');

    const data = ffmpeg.FS('readFile', 'output.gif');
    const gifUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));
    document.getElementById(outputPath).src = gifUrl;
}
