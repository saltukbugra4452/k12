'use strict';

(function () {
    /**
     * Q&A modülü
     * Öğrenciler: Soru sorar ve sadece kendi sorularını görür.
     * Öğretmenler: Tüm soruları görür, filtreler ve yanıtlayabilir.
     */

    const STORAGE_KEY = 'qa_questions_v2';

    const elements = {
      askForm: document.getElementById('askForm'),
      studentList: document.getElementById('studentQaList'),
      teacherList: document.getElementById('teacherQaList'),
      studentView: document.getElementById('student-qa-view'),
      teacherView: document.getElementById('teacher-qa-view'),
      subjectFilter: document.getElementById('qaSubjectFilter'),
      statusFilter: document.getElementById('qaStatusFilter'),
      whoami: document.getElementById('qaWhoami')
    };

    const user = getCurrentUser();
    const state = {
      questions: loadQuestions(),
      filters: {
        subject: elements.subjectFilter?.value || '',
        status: elements.statusFilter?.value || ''
      }
    };

    init();

    function init() {
      updateWhoami();
      toggleViews();
      bindEvents();
      render();
    }

    function getCurrentUser() {
      const stored = JSON.parse(
        sessionStorage.getItem('eduplatform_user') ||
        localStorage.getItem('eduplatform_user') ||
        'null'
      );

      if (!stored) {
        return { username: 'Test Öğrenci', role: 'student' };
      }

      return {
        username: stored.username || 'Anonim',
        role: stored.role === 'teacher' ? 'teacher' : 'student'
      };
    }

    function loadQuestions() {
      try {
        const items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        if (Array.isArray(items)) {
          return items;
        }
      } catch (err) {
        console.error('QA verileri okunamadı', err);
      }
      return [];
    }

    function saveQuestions() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.questions));
    }

    function updateWhoami() {
      if (!elements.whoami) return;
      const roleText = user.role === 'teacher' ? 'Öğretmen' : 'Öğrenci';
      elements.whoami.textContent = `Giriş yapan: ${user.username} (${roleText})`;
    }

    function toggleViews() {
      if (user.role === 'teacher') {
        elements.studentView?.classList.add('hidden');
        elements.teacherView?.classList.remove('hidden');
      } else {
        elements.studentView?.classList.remove('hidden');
        elements.teacherView?.classList.add('hidden');
      }
    }

    function bindEvents() {
      elements.subjectFilter?.addEventListener('change', onFilterChange);
      elements.statusFilter?.addEventListener('change', onFilterChange);

      if (user.role === 'student' && elements.askForm) {
        elements.askForm.addEventListener('submit', handleQuestionSubmit);
      }

      elements.teacherList?.addEventListener('click', handleTeacherActions);
    }

    function onFilterChange() {
      state.filters.subject = elements.subjectFilter?.value || '';
      state.filters.status = elements.statusFilter?.value || '';
      render();
    }

    function handleQuestionSubmit(event) {
      event.preventDefault();
      const subject = document.getElementById('askSubject').value;
      const title = document.getElementById('askTitle').value.trim();
      const body = document.getElementById('askBody').value.trim();

      if (!subject || !title || !body) return;

      const question = {
        id: Date.now(),
        student: user.username,
        subject,
        title,
        body,
        status: 'open',
        answer: null,
        askedAt: new Date().toISOString()
      };

      state.questions.unshift(question);
      saveQuestions();
      elements.askForm.reset();
      render();
    }

    function handleTeacherActions(event) {
      const button = event.target.closest('[data-action]');
      if (!button) return;

      const id = Number(button.getAttribute('data-id'));
      const question = state.questions.find((q) => q.id === id);
      if (!question) return;

      if (button.dataset.action === 'answer') {
        const textarea = document.getElementById(`answer-${id}`);
        const answer = textarea?.value.trim();
        if (!answer) {
          alert('Cevap boş olamaz.');
          return;
        }
        question.answer = answer;
        question.status = 'resolved';
        saveQuestions();
        render();
      } else if (button.dataset.action === 'reopen') {
        question.status = 'open';
        question.answer = null;
        saveQuestions();
        render();
      }
    }

    function render() {
      if (user.role === 'student') {
        renderStudentView();
      } else {
        renderTeacherView();
      }
    }

    function renderStudentView() {
      if (!elements.studentList) return;

      const questions = filteredQuestions().filter(
        (q) => q.student === user.username
      );

      elements.studentList.innerHTML = '';

      if (questions.length === 0) {
        elements.studentList.innerHTML = emptyState('Henüz soru sormadınız.');
        return;
      }

      questions.forEach((q) => {
        const card = document.createElement('article');
        card.className = 'qa-item active';
        card.innerHTML = `
          <div class="qa-header">
            <div>
              <strong>${escapeHtml(q.title)}</strong>
              <span class="text-secondary"> • ${escapeHtml(q.subject)}</span>
            </div>
            <span class="badge ${q.status === 'resolved' ? 'bg-success' : 'bg-warning'}">
              ${q.status === 'resolved' ? 'Çözüldü' : 'Bekliyor'}
            </span>
          </div>
          <div class="qa-body">
            <p>${escapeHtml(q.body)}</p>
            ${q.answer ? `
              <div class="qa-answer">
                <h6><i class="fas fa-chalkboard-teacher"></i> Öğretmen Yanıtı</h6>
                <p>${escapeHtml(q.answer)}</p>
              </div>
            ` : '<p class="text-secondary"><i>Öğretmen yanıtı bekleniyor...</i></p>'}
          </div>
        `;
        elements.studentList.appendChild(card);
      });
    }

    function renderTeacherView() {
      if (!elements.teacherList) return;

      const questions = filteredQuestions();

      elements.teacherList.innerHTML = '';

      if (questions.length === 0) {
        elements.teacherList.innerHTML = emptyState('Filtreye uyan soru bulunamadı.');
        return;
      }

      questions.forEach((q) => {
        const card = document.createElement('article');
        card.className = 'qa-item active';
        card.innerHTML = `
          <div class="qa-header">
            <div>
              <strong>${escapeHtml(q.title)}</strong>
              <span class="text-secondary"> • ${escapeHtml(q.subject)}</span>
            </div>
            <span class="badge ${q.status === 'resolved' ? 'bg-success' : 'bg-warning'}">
              ${q.status === 'resolved' ? 'Çözüldü' : 'Açık'}
            </span>
          </div>
          <div class="qa-body">
            <p><strong>Öğrenci:</strong> ${escapeHtml(q.student)}</p>
            <p>${escapeHtml(q.body)}</p>
            ${renderTeacherControls(q)}
          </div>
        `;
        elements.teacherList.appendChild(card);
      });
    }

    function renderTeacherControls(question) {
      if (question.status === 'resolved' && question.answer) {
        return `
          <div class="qa-answer">
            <h6><i class="fas fa-check-circle"></i> Verilen Yanıt</h6>
            <p>${escapeHtml(question.answer)}</p>
            <button class="btn btn-outline btn-sm" data-action="reopen" data-id="${question.id}">
              <i class="fas fa-undo"></i> Yeniden Aç
            </button>
          </div>
        `;
      }

      return `
        <div class="form-group" style="margin-top:1rem;">
          <label class="form-label" for="answer-${question.id}">Yanıtınız</label>
          <textarea id="answer-${question.id}" class="form-input form-textarea" placeholder="Öğrencinize kısa ve odaklı bir yanıt yazın..."></textarea>
          <button class="btn btn-primary btn-sm" data-action="answer" data-id="${question.id}" style="margin-top:0.5rem;">
            <i class="fas fa-paper-plane"></i> Yanıtı Gönder
          </button>
        </div>
      `;
    }

    function filteredQuestions() {
      return state.questions.filter((q) => {
        const subjectMatch = !state.filters.subject || q.subject === state.filters.subject;
        const statusMatch = !state.filters.status || q.status === state.filters.status;
        return subjectMatch && statusMatch;
      });
    }

    function emptyState(message) {
      return `
        <div class="empty-state">
          <i class="fas fa-circle-question"></i>
          <p>${message}</p>
        </div>
      `;
    }

    function escapeHtml(value) {
      return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
  })();
