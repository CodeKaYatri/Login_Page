let isLogin = true;

let nameField = document.getElementById("name");
let title = document.getElementById("title");
let toggleBtn = document.getElementById("toggleBtn");
let submitBtn = document.getElementById("submitBtn");
let error = document.getElementById("error");

let resultBox = document.getElementById("resultBox");
let showData = document.getElementById("showData");

const identifierField = document.getElementById("email");
const passwordField = document.getElementById("password");
const formBox = document.querySelector('.form-box');

function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function isPhone(value) {
    const digits = value.replace(/[^\d]/g, "");
    return digits.length >= 10 && digits.length <= 15;
}

function detectIdentifierType(value) {
    const v = value.trim();
    if (v.includes("@") || /[A-Za-z]/.test(v)) return "email";
    const digits = v.replace(/[^\d]/g, "");
    if (/^[\d\s()+-]+$/.test(v) || digits.length > 0) return "phone";
    return "email";
}

function isIdentifierValid(v) {
    return isEmail(v) || isPhone(v);
}

function updateControls() {
    const val = identifierField.value.trim();
    const valid = isIdentifierValid(val);
    passwordField.disabled = !valid;
    submitBtn.disabled = !valid;
}

nameField.style.display = "none";

toggleBtn.onclick = function () {
    error.innerText = "";

    if (isLogin) {
        title.innerText = "Sign Up";
        submitBtn.innerText = "Sign Up";
        toggleBtn.innerText = "Login";
        nameField.style.display = "block";
        isLogin = false;
    } else {
        title.innerText = "Login";
        submitBtn.innerText = "Login";
        toggleBtn.innerText = "Sign Up";
        nameField.style.display = "none";
        isLogin = true;
    }
    updateControls();
};

document.getElementById("form").addEventListener("submit", function (e) {
    e.preventDefault();

    let name = nameField.value;
    let identifier = identifierField.value.trim();
    let password = passwordField.value;

    if (!isLogin && name === "") {
        error.innerText = "Name required";
        return;
    }

    if (identifier === "") {
        error.innerText = "Email / Mobile required";
        return;
    }

    if (!isEmail(identifier) && !isPhone(identifier)) {
        const intended = detectIdentifierType(identifier);
        error.innerText = intended === "email"
            ? "Enter a valid email"
            : "Enter a valid mobile number";
        return;
    }

    if (password.trim() === "") {
        error.innerText = "Please fill password first";
        return;
    }

    if (password.length < 6) {
        error.innerText = "Password must be at least 6 characters";
        return;
    }

    if (!isLogin) {
        localStorage.setItem("name", name);
        localStorage.setItem("identifier", identifier);
        // Backward compatibility
        localStorage.setItem("email", identifier);
        localStorage.setItem("password", password);

        alert("Signup Successful");
    } else {
        let savedIdentifier = localStorage.getItem("identifier") || localStorage.getItem("email");
        let savedPassword = localStorage.getItem("password");

        if (identifier !== savedIdentifier || password !== savedPassword) {
            error.innerText = "Invalid Login Details";
            return;
        }

        alert("Login Successful");
    }

    resultBox.style.display = "block";
    showData.innerHTML =
        "Name: " + localStorage.getItem("name") + "<br>" +
        "Email/Mobile: " + (localStorage.getItem("identifier") || localStorage.getItem("email"));

    error.innerText = "";
    updateControls();
});

// Live validation to enable/disable fields
identifierField.addEventListener("input", () => {
    // Don't spam error while typing; just gate controls.
    updateControls();
});

// Initialize control states on load
updateControls();

// Subtle 3D tilt effect for the card
let tiltRAF = null;
function setTilt(e){
    const rect = formBox.getBoundingClientRect();
    const cx = rect.left + rect.width/2;
    const cy = rect.top + rect.height/2;
    const dx = (e.clientX - cx) / (rect.width/2);
    const dy = (e.clientY - cy) / (rect.height/2);
    const max = 8; // degrees
    const ry = dx * max;
    const rx = -dy * max;
    formBox.style.setProperty('--rx', rx.toFixed(2) + 'deg');
    formBox.style.setProperty('--ry', ry.toFixed(2) + 'deg');
}

function onTilt(e){
    if (tiltRAF) return;
    tiltRAF = requestAnimationFrame(()=>{
        setTilt(e);
        tiltRAF = null;
    });
}

function resetTilt(){
    formBox.style.setProperty('--rx', '0deg');
    formBox.style.setProperty('--ry', '0deg');
}

formBox.addEventListener('mousemove', onTilt);
formBox.addEventListener('mouseleave', resetTilt);
