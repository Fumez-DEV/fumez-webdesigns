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

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Elements to observe
const sections = document.querySelectorAll('section');
const aboutImage = document.querySelector('.about-image');
const aboutTextParagraphs = document.querySelectorAll('.about-text p');
const serviceItems = document.querySelectorAll('.service-item');
const contactElements = document.querySelectorAll('#contact h2, #contact p, #contact form');
const allElements = [...sections, aboutImage, ...aboutTextParagraphs, ...serviceItems, ...contactElements];

// Observing elements
allElements.forEach(element => fadeInObserver.observe(element));

// Contact form submission
document.querySelector('#contact-form').addEventListener('submit', function(event) {
    event.preventDefault();

    fetch(this.action, {
        method: 'POST',
        body: new FormData(this),
        headers: { 'Accept': 'application/json' }
    }).then(response => {
        const confirmationMessage = document.querySelector('.confirmation-message');
        if (response.ok) {
            confirmationMessage.classList.add('visible');
            this.reset();
            setTimeout(() => confirmationMessage.classList.remove('visible'), 5000);
        } else {
            alert('Oops! There was a problem submitting your form.');
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

// Video conversion with ffmpeg.js
const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({ log: true });

async function convertVideoToGif(videoPath, outputPath) {
    await ffmpeg.load();
    ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(videoPath));
    await ffmpeg.run('-i', 'input.mp4', '-vf', 'fps=10,scale=320:180,setsar=1', '-t', '5', 'output.gif');

    const data = ffmpeg.FS('readFile', 'output.gif');
    const gifUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));
    document.getElementById(outputPath).src = gifUrl;
}

// Open email function with language option
function openEmail(packageType) {
    const email = "arikmelku3@gmail.com";
    const isEnglish = confirm("Would you like to send the message in English? Click 'Cancel' for Hebrew.");

    const translatedPackageType = isEnglish ? packageType : (packageType === 'Basic' ? 'בסיסית' : packageType === 'Standard' ? 'סטנדרטית' : 'פרימיום');
    const subject = encodeURIComponent(`Interest in ${translatedPackageType} Package from Fumez Web Designs`);

    const englishMessage = `Hello Arik,\n\nI am interested in the ${packageType} package offered by Fumez Web Designs. Please provide me with more details about this package and the next steps to proceed.\n\nHere are my details:\n\nName: [Your Name]\nEmail: [Your Email]\nPhone: [Your Phone Number]\n\nAdditional Information or Requirements:\n[Please add any specific details you would like to share]\n\nThank you for your assistance!\n\nBest regards,\n[Your Name]`;
    const hebrewMessage = `שלום אריק,\n\nאני מעוניין/ת בחבילה ${translatedPackageType} שמוצעת ב-Fumez Web Designs. אשמח לקבל פרטים נוספים לגבי החבילה ואת הצעדים הבאים להמשך.\n\nהנה הפרטים שלי:\n\nשם: [השם שלך]\nאימייל: [האימייל שלך]\nטלפון: [מספר הטלפון שלך]\n\nמידע נוסף או דרישות:\n[אנא הוסף/הוסיפי כל פרט נוסף שתרצה/תרצי לשתף]\n\nתודה על העזרה שלך!\n\nבברכה,\n[השם שלך]`;

    const body = isEnglish ? encodeURIComponent(englishMessage) : encodeURIComponent(hebrewMessage);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
}

// FAQ item toggle
document.querySelectorAll('.faq-item h3').forEach(item => {
    item.addEventListener('click', () => {
        item.parentElement.classList.toggle('active');
    });
});
