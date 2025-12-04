// scripts/contact.js

document.addEventListener('DOMContentLoaded', function() {
    const feedbackForm = document.getElementById('feedbackForm');
    const feedbackModal = new bootstrap.Modal(document.getElementById('feedbackModal'));
    const successMessage = document.getElementById('success-message');
    let previousActiveElement;

    // Валидация формы в реальном времени
    function validateField(field) {
        const value = field.value.trim();
        const isValid = field.checkValidity();

        if (field.hasAttribute('required') && !value) {
            field.classList.add('is-invalid');
            field.classList.remove('is-valid');
            return false;
        }

        if (isValid) {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
            return true;
        } else {
            field.classList.add('is-invalid');
            field.classList.remove('is-valid');
            return false;
        }
    }

    // Обработка отправки формы
    feedbackForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Валидация всех полей
        const fields = feedbackForm.querySelectorAll('input, select, textarea');
        let allValid = true;

        fields.forEach(field => {
            if (!validateField(field)) {
                allValid = false;
            }
        });

        if (!allValid) {
            event.stopPropagation();
            feedbackForm.classList.add('was-validated');
            return;
        }

        // Сбор данных формы
        const formData = new FormData(feedbackForm);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // В реальном приложении здесь был бы AJAX-запрос
        console.log('Данные формы:', data);

        // Показываем уведомление об успешной отправке
        showSuccessMessage();

        // Закрываем модальное окно
        setTimeout(() => {
            feedbackModal.hide();
        }, 1500);

        // Очищаем форму
        setTimeout(() => {
            feedbackForm.reset();
            feedbackForm.classList.remove('was-validated');
            
            // Сбрасываем визуальное состояние полей
            fields.forEach(field => {
                field.classList.remove('is-valid', 'is-invalid');
            });
        }, 1000);
    });

    // Валидация при вводе
    feedbackForm.addEventListener('input', function(event) {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT' || event.target.tagName === 'TEXTAREA') {
            validateField(event.target);
        }
    });

    // Валидация при потере фокуса
    feedbackForm.addEventListener('blur', function(event) {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT' || event.target.tagName === 'TEXTAREA') {
            validateField(event.target);
        }
    }, true);

    // Показ уведомления об успехе
    function showSuccessMessage() {
        successMessage.style.display = 'block';
        successMessage.classList.add('show');
        
        // Автоматическое скрытие через 5 секунд
        setTimeout(() => {
            hideSuccessMessage();
        }, 5000);
    }

    function hideSuccessMessage() {
        successMessage.classList.remove('show');
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 300);
    }

    // Очистка формы при закрытии модального окна
    feedbackModal._element.addEventListener('hidden.bs.modal', function() {
        feedbackForm.reset();
        feedbackForm.classList.remove('was-validated');
        
        const fields = feedbackForm.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            field.classList.remove('is-valid', 'is-invalid');
        });
    });

    // Управление фокусом для доступности
    feedbackModal._element.addEventListener('show.bs.modal', function() {
        previousActiveElement = document.activeElement;
    });

    feedbackModal._element.addEventListener('shown.bs.modal', function() {
        const firstInput = feedbackForm.querySelector('input, select, textarea');
        if (firstInput) {
            firstInput.focus();
        }
    });

    feedbackModal._element.addEventListener('hidden.bs.modal', function() {
        if (previousActiveElement) {
            previousActiveElement.focus();
        }
    });
});