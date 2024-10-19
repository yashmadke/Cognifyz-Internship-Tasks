function validateForm() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const age = document.getElementById("age").value;
  const gender = document.getElementById("gender").value;

  let isValid = true;

  // Clear previous error messages
  clearErrors();

  // Name validation (must be at least 3 characters long)
  if (name.length < 3) {
    displayError("nameError", "Name must be at least 3 characters long.");
    isValid = false;
  }

  // Email validation
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailPattern.test(email)) {
    displayError("emailError", "Invalid email address.");
    isValid = false;
  }

  // Password validation (minimum length, must include uppercase and a number)
  const passwordStrength = checkPasswordStrength(password);
  if (password.length < 6) {
    displayError(
      "passwordError",
      "Password must be at least 6 characters long."
    );
    isValid = false;
  } else if (passwordStrength < 2) {
    displayError(
      "passwordError",
      "Password must contain at least one uppercase letter and one number."
    );
    isValid = false;
  }

  // Age validation (must be between 18 and 100)
  if (age < 18 || age > 100) {
    displayError("ageError", "Age must be between 18 and 100.");
    isValid = false;
  }

  // Gender validation (must select a gender)
  if (!gender) {
    displayError("genderError", "Please select your gender.");
    isValid = false;
  }

  return isValid;
}

function displayError(elementId, errorMessage) {
  document.getElementById(elementId).textContent = errorMessage;
}

function clearErrors() {
  const errors = document.querySelectorAll(".error");
  errors.forEach((error) => {
    error.textContent = "";
  });
}

function checkPasswordStrength(password) {
  const strengthMeter = document.createElement("div");
  strengthMeter.classList.add("password-strength");
  const strengthLevels = [0, 1, 2];

  document.getElementById("password").parentNode.appendChild(strengthMeter);

  let strength = 0;
  if (password.length >= 6) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;

  strengthLevels.forEach((level, index) => {
    const strengthBlock = document.createElement("span");
    if (index < strength) {
      strengthBlock.style.backgroundColor = "#28a745";
    }

    strengthMeter.appendChild(strengthBlock);
  });

  return strength;
}

document.getElementById("password").addEventListener("input", function () {
  const strengthMeter = document.querySelector(".password-strength");

  if (strengthMeter) strengthMeter.remove();

  checkPasswordStrength(this.value);
});
