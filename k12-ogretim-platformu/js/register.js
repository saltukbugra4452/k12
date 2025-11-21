document.addEventListener('DOMContentLoaded', function () {
    const schoolSelect = document.getElementById('school_id');
    const newSchoolGroup = document.getElementById('new_school_group');
    const newSchoolInput = document.getElementById('new_school_name');
    const registerForm = document.getElementById('registerForm');
    const messageArea = document.getElementById('message-area');

    // Fetch and populate schools
    fetch('php/get_schools.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                data.schools.forEach(school => {
                    const option = document.createElement('option');
                    option.value = school.id;
                    option.textContent = school.name;
                    schoolSelect.appendChild(option);
                });
            } else {
                displayMessage('HATA: ' + (data.error || 'Bilinmeyen bir hata oluştu.'), 'danger');
            }
        })
        .catch(error => {
            console.error('Okul listesi alınamadı:', error);
            displayMessage('Okul listesi yüklenirken bir hata oluştu: ' + error.message, 'danger');
        });

    // Show/hide new school input field
    schoolSelect.addEventListener('change', function () {
        if (this.value === 'new') {
            newSchoolGroup.style.display = 'block';
            newSchoolInput.required = true;
        } else {
            newSchoolGroup.style.display = 'none';
            newSchoolInput.required = false;
        }
    });

    // Handle form submission with Fetch API
    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(registerForm);
        const submitButton = registerForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Kaydediliyor...';

        fetch('php/register.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayMessage(data.message, 'success');
                setTimeout(() => {
                    window.location.href = 'index.php';
                }, 2000);
            } else {
                displayMessage(data.message, 'danger');
            }
        })
        .catch(error => {
            console.error('Kayıt hatası:', error);
            displayMessage('Bir ağ hatası oluştu. Lütfen tekrar deneyin.', 'danger');
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.textContent = 'Kayıt Ol';
        });
    });

    function displayMessage(message, type) {
        messageArea.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
        messageArea.style.display = 'block';
    }
});
