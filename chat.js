document.addEventListener('DOMContentLoaded', function() {
    const messageForm = document.getElementById('messageForm');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatMessages = document.getElementById('chatMessages');
    const teachersList = document.getElementById('teachersList');
    const teacherSearch = document.getElementById('teacherSearch');
    const activeTeacherName = document.getElementById('activeTeacherName');
    const activeTeacherSubject = document.getElementById('activeTeacherSubject');
    const currentUserName = document.getElementById('currentUserName');
    const clearChatBtn = document.getElementById('clearChatBtn');

    // Kullanıcı bilgilerini al
    let currentUser = JSON.parse(sessionStorage.getItem('eduplatform_user') || localStorage.getItem('eduplatform_user') || '{}');
    if (!currentUser.username) {
        currentUser = { username: 'Test Öğrenci', role: 'student' };
    }

    // Aktif chat (hangi öğretmenle konuşuyor)
    let activeTeacher = null;

    // Öğretmenler listesi (AI kişilikleri ile)
    const teachers = [
        { 
            id: 1, 
            name: 'Ahmet Yılmaz', 
            subject: 'Matematik', 
            avatar: 'AY', 
            status: 'online',
            personality: 'sabırlı',
            style: 'metodical',
            specialties: ['geometri', 'cebir', 'trigonometri', 'analitik geometri'],
            greeting: 'Merhaba! Matematik öğretmeni Ahmet Yılmaz. Size nasıl yardımcı olabilirim?'
        },
        { 
            id: 2, 
            name: 'Fatma Demir', 
            subject: 'Fizik', 
            avatar: 'FD', 
            status: 'online',
            personality: 'enerjik',
            style: 'experimental',
            specialties: ['mekanik', 'elektrik', 'optik', 'modern fizik'],
            greeting: 'Selam! Fizik dünyasına hoş geldin. Hangi konuyu merak ediyorsun?'
        },
        { 
            id: 3, 
            name: 'Mehmet Kaya', 
            subject: 'Kimya', 
            avatar: 'MK', 
            status: 'offline',
            personality: 'detaycı',
            style: 'analytical',
            specialties: ['organik kimya', 'inorganik kimya', 'fizikokimya', 'biyokimya'],
            greeting: 'Merhaba! Kimyanın büyülü dünyasında size rehberlik edeyim.'
        },
        { 
            id: 4, 
            name: 'Ayşe Özkan', 
            subject: 'Biyoloji', 
            avatar: 'AÖ', 
            status: 'online',
            personality: 'sevecen',
            style: 'naturalist',
            specialties: ['genetik', 'ekoloji', 'anatomi', 'biyolojik çeşitlilik'],
            greeting: 'Merhaba sevgili öğrencim! Canlılar dünyasını birlikte keşfedelim.'
        },
        { 
            id: 5, 
            name: 'Mustafa Çelik', 
            subject: 'Türkçe', 
            avatar: 'MÇ', 
            status: 'online',
            personality: 'kültürlü',
            style: 'literary',
            specialties: ['dil bilgisi', 'edebiyat', 'kompozisyon', 'şiir analizi'],
            greeting: 'Selamlar! Dilimizin güzelliklerini birlikte keşfedelim.'
        },
        { 
            id: 6, 
            name: 'Zeynep Aktaş', 
            subject: 'Tarih', 
            avatar: 'ZA', 
            status: 'offline',
            personality: 'bilgili',
            style: 'narrative',
            specialties: ['osmanlı tarihi', 'cumhuriyet tarihi', 'dünya tarihi', 'medeniyetler'],
            greeting: 'Merhaba! Geçmişin hikayelerini birlikte canlandıralım.'
        }
    ];

    // Kişilik açıklamaları
    function getPersonalityDescription(personality) {
        const descriptions = {
            'sabırlı': 'Sabırlı ve anlayışlı',
            'enerjik': 'Enerjik ve hevesli', 
            'detaycı': 'Detaycı ve sistematik',
            'sevecen': 'Sevecen ve destekleyici',
            'kültürlü': 'Kültürlü ve erudite',
            'bilgili': 'Bilgili ve analitik'
        };
        return descriptions[personality] || personality;
    }

    // Kullanıcı adını göster
    if (currentUserName) {
        currentUserName.textContent = currentUser.username;
    }

    // Öğretmenleri listele
    function renderTeachers(filter = '') {
        teachersList.innerHTML = '';
        
        const filteredTeachers = teachers.filter(teacher => 
            teacher.name.toLowerCase().includes(filter.toLowerCase()) ||
            teacher.subject.toLowerCase().includes(filter.toLowerCase())
        );

        filteredTeachers.forEach(teacher => {
            const teacherEl = document.createElement('div');
            teacherEl.className = 'teacher-item';
            teacherEl.style.cssText = `
                padding: 0.75rem;
                margin-bottom: 0.5rem;
                border-radius: 0.75rem;
                cursor: pointer;
                transition: background-color 0.2s;
                display: flex;
                align-items: center;
                gap: 0.75rem;
                ${activeTeacher && activeTeacher.id === teacher.id ? 'background-color: var(--primary-100); border: 1px solid var(--primary-300);' : ''}
            `;

            teacherEl.innerHTML = `
                <div class="teacher-avatar" style="
                    width: 45px; 
                    height: 45px; 
                    border-radius: 50%; 
                    background: ${teacher.status === 'online' ? 'var(--success-500)' : 'var(--secondary-400)'}; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    color: white;
                    font-weight: 600;
                    font-size: 0.9rem;
                    position: relative;
                ">
                    ${teacher.avatar}
                    <div style="
                        position: absolute;
                        bottom: -2px;
                        right: -2px;
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        background: ${teacher.status === 'online' ? 'var(--success-500)' : 'var(--secondary-400)'};
                        border: 2px solid white;
                    "></div>
                </div>
                <div style="flex-grow: 1;">
                    <div style="font-weight: 500; color: var(--secondary-800);">${teacher.name}</div>
                    <div style="font-size: 0.8rem; color: var(--secondary-500);">${teacher.subject} • ${teacher.status === 'online' ? 'Çevrimiçi' : 'Çevrimdışı'}</div>
                    <div style="font-size: 0.75rem; color: var(--primary-600); font-style: italic;">${getPersonalityDescription(teacher.personality)} • ${teacher.style}</div>
                </div>
            `;

            teacherEl.addEventListener('click', () => selectTeacher(teacher));
            teacherEl.addEventListener('mouseenter', () => {
                if (!activeTeacher || activeTeacher.id !== teacher.id) {
                    teacherEl.style.backgroundColor = 'var(--secondary-100)';
                }
            });
            teacherEl.addEventListener('mouseleave', () => {
                if (!activeTeacher || activeTeacher.id !== teacher.id) {
                    teacherEl.style.backgroundColor = '';
                }
            });

            teachersList.appendChild(teacherEl);
        });
    }

    // Öğretmen seç
    function selectTeacher(teacher) {
        activeTeacher = teacher;
        activeTeacherName.textContent = teacher.name;
        activeTeacherSubject.textContent = `${teacher.subject} Öğretmeni • ${teacher.status === 'online' ? 'Çevrimiçi' : 'Çevrimdışı'}`;
        
        messageInput.disabled = false;
        sendBtn.disabled = false;
        clearChatBtn.style.display = 'inline-flex';
        
        // Konu hatırlatıcısını göster
        const topicReminder = document.getElementById('topicReminder');
        const currentSubject = document.getElementById('currentSubject');
        const suggestionsBtn = document.getElementById('suggestionsBtn');
        
        if (topicReminder && currentSubject) {
            topicReminder.style.display = 'flex';
            currentSubject.textContent = teacher.subject;
        }
        
        if (suggestionsBtn) {
            suggestionsBtn.style.display = 'inline-flex';
        }
        
        renderTeachers(); // Seçili öğretmeni vurgula
        loadMessages();
    }

    // Mesajları yükle
    function loadMessages() {
        if (!activeTeacher) return;
        
        const chatId = `chat_${currentUser.username}_${activeTeacher.id}`;
        const messages = JSON.parse(localStorage.getItem(chatId) || '[]');
        displayMessages(messages);
    }

    // Mesajları göster
    function displayMessages(messages) {
        chatMessages.innerHTML = '';

        if (messages.length === 0) {
            chatMessages.innerHTML = `
                <div class="empty-chat" style="text-align: center; padding: 3rem 1rem; color: var(--secondary-500);">
                    <i class="fas fa-comments" style="font-size: 3rem; color: var(--secondary-300); margin-bottom: 1rem;"></i>
                    <h4>Henüz mesaj yok</h4>
                    <p>${activeTeacher.name} ile ilk mesajınızı gönderin!</p>
                </div>
            `;
            return;
        }

        messages.forEach(message => {
            const messageEl = document.createElement('div');
            const isMyMessage = message.sender === currentUser.username;
            const isWarning = message.isWarning || false;
            
            messageEl.className = `message ${isMyMessage ? 'my-message' : 'their-message'}`;
            messageEl.style.cssText = `
                margin-bottom: 1rem;
                display: flex;
                ${isMyMessage ? 'justify-content: flex-end;' : 'justify-content: flex-start;'}
            `;

            // Uyarı mesajı için özel renk
            let messageStyle;
            if (isMyMessage) {
                messageStyle = 'background: var(--primary-600); color: white; border-bottom-right-radius: 0.25rem;';
            } else if (isWarning) {
                messageStyle = 'background: var(--warning-50); color: var(--warning-800); border: 1px solid var(--warning-300); border-bottom-left-radius: 0.25rem;';
            } else {
                messageStyle = 'background: white; color: var(--secondary-800); border: 1px solid var(--secondary-200); border-bottom-left-radius: 0.25rem;';
            }

            messageEl.innerHTML = `
                <div style="
                    max-width: 70%;
                    padding: 0.75rem 1rem;
                    border-radius: 1rem;
                    ${messageStyle}
                ">
                    ${isWarning ? '<i class="fas fa-exclamation-triangle" style="margin-right: 0.5rem; color: var(--warning-600);"></i>' : ''}
                    <div style="word-wrap: break-word;">${escapeHtml(message.text)}</div>
                    <div style="
                        font-size: 0.7rem; 
                        margin-top: 0.25rem;
                        ${isMyMessage ? 'color: rgba(255,255,255,0.8);' : isWarning ? 'color: var(--warning-600);' : 'color: var(--secondary-500);'}
                    ">
                        ${formatTime(message.timestamp)}
                        ${isWarning ? ' • Ders Odaklı Kalın' : ''}
                    </div>
                </div>
            `;

            chatMessages.appendChild(messageEl);
        });

        // En alta scroll
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Konu kontrolü için anahtar kelimeler
    const educationalKeywords = {
        matematik: ['matematik', 'sayı', 'işlem', 'toplama', 'çıkarma', 'çarpma', 'bölme', 'geometri', 'üçgen', 'daire', 'alan', 'çevre', 'denklem', 'fonksiyon', 'grafik', 'problem', 'çözüm', 'hesap', 'formül', 'kural'],
        fizik: ['fizik', 'kuvvet', 'hareket', 'enerji', 'elektrik', 'manyetik', 'ışık', 'ses', 'sıcaklık', 'basınç', 'yoğunluk', 'hız', 'ivme', 'momentum', 'dalga', 'atom', 'molekül', 'kütle'],
        kimya: ['kimya', 'atom', 'molekül', 'element', 'bileşik', 'reaksiyon', 'asit', 'baz', 'tuz', 'pH', 'iyonik', 'kovalent', 'orbital', 'elektron', 'proton', 'nötron', 'periyodik', 'çözelti'],
        biyoloji: ['biyoloji', 'hücre', 'DNA', 'RNA', 'protein', 'enzim', 'mitoz', 'mayoz', 'fotosentez', 'solunum', 'sindirim', 'dolaşım', 'kalıtım', 'gen', 'kromozom', 'evrim', 'ekosistem'],
        türkçe: ['türkçe', 'dil', 'gramer', 'kelime', 'cümle', 'paragraf', 'metin', 'okuma', 'yazma', 'anlatım', 'öykü', 'roman', 'şiir', 'destan', 'masal', 'hikaye', 'edebiyat', 'yazar'],
        tarih: ['tarih', 'osmanlı', 'selçuklu', 'cumhuriyet', 'atatürk', 'savaş', 'devrim', 'medeniyet', 'kültür', 'sultan', 'padişah', 'dönem', 'yıl', 'olaylar', 'kronoloji']
    };

    const offTopicKeywords = [
        'oyun', 'game', 'film', 'dizi', 'müzik', 'şarkı', 'sosyal medya', 'instagram', 'tiktok', 'youtube',
        'aşk', 'sevgili', 'arkadaş', 'parti', 'eğlence', 'tatil', 'gezi', 'moda', 'kıyafet', 'makyaj',
        'futbol', 'basketbol', 'spor', 'takım', 'maç', 'yemek', 'lokanta', 'cafe', 'alışveriş'
    ];

    // Mesajın eğitimsel olup olmadığını kontrol et
    function checkMessageTopic(text, teacherSubject) {
        const lowerText = text.toLowerCase();
        const subjectKeywords = educationalKeywords[teacherSubject.toLowerCase()] || [];
        
        // Eğitimsel anahtar kelime var mı?
        const hasEducationalContent = subjectKeywords.some(keyword => 
            lowerText.includes(keyword)
        ) || lowerText.includes('ders') || lowerText.includes('konu') || 
           lowerText.includes('anlamadım') || lowerText.includes('soru') ||
           lowerText.includes('ödev') || lowerText.includes('sınav') ||
           lowerText.includes('test') || lowerText.includes('çalış');

        // Ders dışı anahtar kelime var mı?
        const hasOffTopicContent = offTopicKeywords.some(keyword => 
            lowerText.includes(keyword)
        );

        return {
            isEducational: hasEducationalContent,
            isOffTopic: hasOffTopicContent && !hasEducationalContent,
            subject: teacherSubject
        };
    }

    // Akıllı öğretmen AI yanıt sistemi
    function generateTeacherResponse(message, teacher, isOffTopic = false) {
        const messageWords = message.toLowerCase().split(' ');
        
        // Konu dışı uyarıları (öğretmen kişiliğine göre)
        if (isOffTopic) {
            const offTopicResponses = {
                'sabırlı': [
                    `${currentUser.username}, anlıyorum bu konular da ilginç ama şu an ${teacher.subject} dersine odaklanalım. Hangi matematik konusunda yardıma ihtiyacın var?`,
                    `Sevgili öğrencim, bu güzel sohbeti ${teacher.subject} konularına çevirebilir miyiz? Size nasıl yardımcı olabilirim?`
                ],
                'enerjik': [
                    `Hey! Bu konuları da seviyorum ama şu an ${teacher.subject} zamanı! Fizik dünyasında hangi gizemi çözmek istiyorsun?`,
                    `Woah! Farklı konularda da meraklısın görüyorum. Ama gel ${teacher.subject} ile kafamızı patlatalım! Hangi konu?`
                ],
                'detaycı': [
                    `Bu konular da önemli tabii ki, ancak ben ${teacher.subject} uzmanıyım. Kimya konularında size nasıl yardımcı olabilirim?`,
                    `Dikkatinizi ${teacher.subject} dersine verebilir miyiz? Bu konuda çok şey öğreneceksiniz.`
                ],
                'sevecen': [
                    `Canım öğrencim, bu konular da güzel ama ${teacher.subject} dersimizi ihmal etmeyelim. Hangi konuda zorlanıyorsun?`,
                    `Sevgilim, çok meraklısın bu güzel ama şimdi ${teacher.subject} zamanı. Sana nasıl yardım edebilirim?`
                ],
                'kültürlü': [
                    `Değerli öğrencim, bu konular da kıymetli ancak ${teacher.subject} dersimize odaklanalım. Size nasıl hizmet edebilirim?`,
                    `Bu konular da güzel tabii, fakat şimdi ${teacher.subject} vaktimiz. Hangi konuda desteğe ihtiyacınız var?`
                ],
                'bilgili': [
                    `Bu konular da ilgi çekici elbette, ama ${teacher.subject} dersi için buradayım. Hangi dönemi merak ediyorsun?`,
                    `Farklı konularda da bilginiz var görüyorum, ancak ${teacher.subject} uzmanınızım. Size nasıl yardımcı olabilirim?`
                ]
            };
            
            const responses = offTopicResponses[teacher.personality] || offTopicResponses['sabırlı'];
            return responses[Math.floor(Math.random() * responses.length)];
        }

        // Selamlaşma ve genel yanıtlar
        if (messageWords.some(word => ['merhaba', 'selam', 'sa', 'hey', 'hi'].includes(word))) {
            return teacher.greeting;
        }

        // Uzmanlık alanlarına göre yanıt
        const relevantSpecialty = teacher.specialties.find(specialty => 
            messageWords.some(word => specialty.toLowerCase().includes(word) || word.includes(specialty.toLowerCase()))
        );

        if (relevantSpecialty) {
            return generateSpecialtyResponse(teacher, relevantSpecialty, message);
        }

        // Genel ders yanıtları (kişiliğe göre)
        return generatePersonalityResponse(teacher, message);
    }

    // Uzmanlık alanına özel yanıtlar
    function generateSpecialtyResponse(teacher, specialty, message) {
        const responses = {
            // Matematik uzmanlıkları
            'geometri': [
                "Geometri çok güzel bir alan! Şekillerin özelliklerini ve aralarındaki ilişkileri inceleyelim.",
                "Geometride görselleştirme çok önemli. Bu konuyu çizimlerle açıklayabilirim.",
                "Geometrik problemlerde önce verilen bilgileri şekil üzerinde işaretleyelim."
            ],
            'cebir': [
                "Cebir matematiğin temel taşlarından biri. Harflerle hesap yapmayı öğrenelim.",
                "Cebirde bilinmeyeni bulmak için sistematik yaklaşım gerekir.",
                "Bu denklem sistemini adım adım çözelim."
            ],

            // Fizik uzmanlıkları  
            'mekanik': [
                "Mekanik fizik evrenin temelini açıklar! Kuvvet, hareket ve enerji ilişkilerini görelim.",
                "Newton yasaları ile günlük hayatımızdaki olayları açıklayabiliriz.",
                "Bu problemi önce serbest cisim diyagramı çizerek başlayalım."
            ],
            'elektrik': [
                "Elektrik hayatımızın her yerinde! Akım, voltaj ve direnç ilişkilerini keşfedelim.",
                "Elektrik devrelerini su akışına benzeterek anlamak daha kolay.",
                "Ohm kanunu ile bu devreyi çözebiliriz."
            ],

            // Kimya uzmanlıkları
            'organik kimya': [
                "Organik kimya canlılığın kimyası! Karbon bileşiklerinin harika dünyasında gezinelim.",
                "Organik moleküllerde yapı-özellik ilişkisi çok önemli.",
                "Bu reaksiyonu mekanizma ile açıklayarak anlayalım."
            ],

            // Biyoloji uzmanlıkları
            'genetik': [
                "Genetik yaşamın şifresi! Kalıtım ve gen ifadesini birlikte inceleyelim.",
                "DNA'dan proteine giden yolu adım adım takip edelim.",
                "Mendel yasaları ile kalıtım modellerini çözelim."
            ],

            // Türkçe uzmanlıkları
            'edebiyat': [
                "Edebiyat ruhumuzun gıdası! Bu eserin derinliklerini keşfedelim.",
                "Yazarın anlatım tekniklerini ve üslubunu inceleyelim.",
                "Bu metindeki sembolik anlamları birlikte çözümleyelim."
            ],

            // Tarih uzmanlıkları
            'osmanlı tarihi': [
                "Osmanlı İmparatorluğu 600 yıllık büyük bir medeniyet! Hangi dönemi merak ediyorsun?",
                "Osmanlı'nın yükseliş, durgunluk ve gerileme dönemlerini kronolojik inceleyelim.",
                "Bu dönemin siyasi ve sosyal özelliklerini analiz edelim."
            ]
        };

        const specialtyResponses = responses[specialty.toLowerCase()] || [
            `${specialty} konusunda uzmanım. Size nasıl yardımcı olabilirim?`,
            `Bu ${specialty} sorusunu birlikte çözelim.`,
            `${specialty} ile ilgili detaylı açıklama yapabilirim.`
        ];

        return specialtyResponses[Math.floor(Math.random() * specialtyResponses.length)];
    }

    // Kişilik bazlı genel yanıtlar
    function generatePersonalityResponse(teacher, message) {
        const responses = {
            'sabırlı': [
                "Bu konuyu adım adım açıklayayım. Acele etmeye gerek yok.",
                "Anlayamadığınız kısımları tekrar açıklayabilirim. Soru sormaktan çekinmeyin.",
                "Bu problem için farklı çözüm yolları deneyebiliriz."
            ],
            'enerjik': [
                "Harika bir soru! Bu konuyu çok seviyorum, hemen açıklayayım!",
                "Wow! Bu gerçekten ilginç bir problem. Gel birlikte çözelim!",
                "Bu konuda pratik yapmaya ne dersin? Eğlenceli örnekler yapabiliriz!"
            ],
            'detaycı': [
                "Bu konuyu sistemli bir şekilde ele almalıyız. Önce teorik temeli atalım.",
                "Detayları kaçırmamak için dikkatli ilerleyelim.",
                "Bu konunun tüm yönlerini incelememiz gerekiyor."
            ],
            'sevecen': [
                "Canım öğrencim, bu konuyu birlikte hallederiz. Merak etme.",
                "Sevgili öğrencim, sorun değil. Bu konuları anlamak zaman alır.",
                "Bu konuda zorlandığını görüyorum, sana yardım etmek için buradayım."
            ],
            'kültürlü': [
                "Bu konu hakkında derinlemesine konuşabiliriz. Size nasıl yardımcı olabilirim?",
                "Bu meseleyi farklı açılardan değerlendirebiliriz.",
                "Bu konunun tarihçesi ve gelişimi hakkında da bilgi verebilirim."
            ],
            'bilgili': [
                "Bu konuda size kapsamlı bilgi sağlayabilirim.",
                "Bu meseleyi analitik bir yaklaşımla ele alalım.",
                "Kaynaklardan örnekler vererek açıklayabilirim."
            ]
        };

        const personalityResponses = responses[teacher.personality] || responses['sabırlı'];
        return personalityResponses[Math.floor(Math.random() * personalityResponses.length)];
    }

    // Mesaj gönder
    function sendMessage(text) {
        if (!activeTeacher || !text.trim()) return;

        const message = {
            id: Date.now(),
            sender: currentUser.username,
            receiver: activeTeacher.name,
            text: text.trim(),
            timestamp: new Date().toISOString()
        };

        // Mesaj konusunu analiz et
        const topicAnalysis = checkMessageTopic(text.trim(), activeTeacher.subject);

        const chatId = `chat_${currentUser.username}_${activeTeacher.id}`;
        const messages = JSON.parse(localStorage.getItem(chatId) || '[]');
        messages.push(message);
        localStorage.setItem(chatId, JSON.stringify(messages));

        // Akıllı öğretmen yanıtı
        setTimeout(() => {
            const teacherReply = {
                id: Date.now() + 1,
                sender: activeTeacher.name,
                receiver: currentUser.username,
                text: generateTeacherResponse(text.trim(), activeTeacher, topicAnalysis.isOffTopic),
                timestamp: new Date().toISOString(),
                isWarning: topicAnalysis.isOffTopic
            };

            messages.push(teacherReply);
            localStorage.setItem(chatId, JSON.stringify(messages));
            loadMessages();

            // Bazen öğretmen takip soruları sorar
            if (!topicAnalysis.isOffTopic && Math.random() < 0.3) {
                setTimeout(() => {
                    const followUpQuestion = generateFollowUpQuestion(activeTeacher, text.trim());
                    if (followUpQuestion) {
                        const followUp = {
                            id: Date.now() + 2,
                            sender: activeTeacher.name,
                            receiver: currentUser.username,
                            text: followUpQuestion,
                            timestamp: new Date().toISOString()
                        };
                        
                        const currentMessages = JSON.parse(localStorage.getItem(chatId) || '[]');
                        currentMessages.push(followUp);
                        localStorage.setItem(chatId, JSON.stringify(currentMessages));
                        loadMessages();
                    }
                }, 3000 + Math.random() * 2000);
            }
        }, 1500 + Math.random() * 2000); // 1.5-3.5 saniye arası gecikme

        loadMessages();
    }

    // Takip soruları oluştur
    function generateFollowUpQuestion(teacher, studentMessage) {
        const messageWords = studentMessage.toLowerCase();
        
        // Öğrenci "anlamadım" derse
        if (messageWords.includes('anlamadım') || messageWords.includes('anlamıyorum')) {
            const clarifyingQuestions = {
                'sabırlı': [
                    "Hangi kısmını tam olarak anlamadın? Daha detaylı açıklayayım.",
                    "Sorun yok, farklı bir yöntemle anlatalım. Hangi adımda takıldın?"
                ],
                'enerjik': [
                    "Tamam! Başka bir yöntemle deneyelim. Bu sefer daha basit mi olsun?",
                    "Hiç sorun değil! Belki görsellerle açıklarsam daha iyi anlar mısın?"
                ],
                'sevecen': [
                    "Canım, üzülme. Bu konular zor olabilir. Adım adım gidelim, olur mu?",
                    "Sevgilim, sorun değil. Başka örneklerle deneyebiliriz."
                ]
            };
            
            const questions = clarifyingQuestions[teacher.personality] || clarifyingQuestions['sabırlı'];
            return questions[Math.floor(Math.random() * questions.length)];
        }

        // Öğrenci basit soru sormuşsa
        if (messageWords.length < 5) {
            const elaborationQuestions = {
                'detaycı': [
                    "Bu konuyu daha detayına inelim. Hangi yönü seni daha çok ilgilendiriyor?",
                    "Bu konu hakkında başka merak ettiğin var mı?"
                ],
                'kültürlü': [
                    "Bu konunun farklı boyutları da var. Hangi açıdan yaklaşmak istersin?",
                    "Bu meseleyi daha geniş perspektiften ele almak ister misin?"
                ]
            };
            
            const questions = elaborationQuestions[teacher.personality];
            return questions ? questions[Math.floor(Math.random() * questions.length)] : null;
        }

        // Uzmanlık alanına göre derin sorular
        const deepQuestions = {
            'Matematik': [
                "Bu problemi çözdüğümüze göre, benzer bir problem daha yapmak ister misin?",
                "Bu konu ile ilgili günlük hayattan örnekler verebilir misin?",
                "Bu formülün nasıl türetildiğini de görmek ister misin?"
            ],
            'Fizik': [
                "Bu olayın arkasındaki fizik prensiplerini merak ediyor musun?",
                "Bunu günlük hayatta nerede gözlemleyebiliriz?",
                "Bu konuyla ilgili bir deney tasarlamak ister misin?"
            ],
            'Kimya': [
                "Bu reaksiyonun mekanizmasını da inceleyelim mi?",
                "Bu bileşiğin yapısı hakkında ne düşünüyorsun?",
                "Bu konuyla ilgili laboratuvar deneyimleriniz var mı?"
            ],
            'Biyoloji': [
                "Bu sürecin canlılardaki önemini merak ediyor musun?",
                "Bu konuyla ilgili başka canlı örnekleri de var, görmek ister misin?",
                "Bu adaptasyonun evrimsel avantajları neler olabilir?"
            ],
            'Türkçe': [
                "Bu metindeki üslup özelliklerini fark ettin mi?",
                "Bu yazarın diğer eserlerini de okumuş mudun?",
                "Bu konuda kendi yorumların neler?"
            ],
            'Tarih': [
                "Bu olayın sonuçları hakkında ne düşünüyorsun?",
                "Bu dönemin diğer medeniyetlerle ilişkileri nasıldı?",
                "Bu olayın günümüze etkileri var mı sence?"
            ]
        };

        const subjectQuestions = deepQuestions[teacher.subject];
        if (subjectQuestions && Math.random() < 0.7) {
            return subjectQuestions[Math.floor(Math.random() * subjectQuestions.length)];
        }

        return null;
    }

    // Yardımcı fonksiyonlar
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function formatTime(timestamp) {
        return new Date(timestamp).toLocaleTimeString('tr-TR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    // Event listeners
    if (teacherSearch) {
        teacherSearch.addEventListener('input', (e) => {
            renderTeachers(e.target.value);
        });
    }

    if (messageForm) {
        messageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = messageInput.value;
            if (text.trim()) {
                sendMessage(text);
                messageInput.value = '';
            }
        });
    }

    if (clearChatBtn) {
        clearChatBtn.addEventListener('click', () => {
            if (confirm('Bu sohbeti temizlemek istediğinizden emin misiniz?')) {
                const chatId = `chat_${currentUser.username}_${activeTeacher.id}`;
                localStorage.removeItem(chatId);
                loadMessages();
            }
        });
    }

    // Öneriler butonu
    const suggestionsBtn = document.getElementById('suggestionsBtn');
    if (suggestionsBtn) {
        suggestionsBtn.addEventListener('click', () => {
            if (activeTeacher) {
                toggleSuggestions();
            }
        });
    }

    // Akıllı öneriler göster
    function showSuggestions() {
        if (!activeTeacher) return;
        
        const suggestions = {
            matematik: [
                "Bu problemi nasıl çözebilirim?",
                "Bu formülü anlamadım, açıklar mısınız?",
                "Geometri konusunda yardıma ihtiyacım var",
                "Bu denklemin çözümünü gösterir misiniz?"
            ],
            fizik: [
                "Bu konunun formüllerini açıklar mısınız?",
                "Bu deney sonucunu nasıl yorumlamalı?",
                "Kuvvet ve hareket konusunda sorum var",
                "Bu fizik kuralını anlamadım"
            ],
            kimya: [
                "Bu reaksiyonu nasıl dengeleyebilirim?",
                "Periyodik tablo hakkında sorum var",
                "Bu bileşiğin özelliklerini açıklar mısınız?",
                "Asit-baz konusunda yardım istiyorum"
            ],
            biyoloji: [
                "Hücre bölünmesi konusunu anlamadım",
                "Fotosentez sürecini açıklar mısınız?",
                "Kalıtım konusunda yardıma ihtiyacım var",
                "Bu organın işlevini anlatır mısınız?"
            ],
            türkçe: [
                "Bu metni nasıl analiz etmeliyim?",
                "Gramer kuralı hakkında sorum var",
                "Bu kelimenin anlamını açıklar mısınız?",
                "Kompozisyon yazma konusunda yardım istiyorum"
            ],
            tarih: [
                "Bu dönemin özelliklerini açıklar mısınız?",
                "Bu tarihi olayın nedenlerini anlamadım",
                "Kronoloji konusunda karıştırıyorum",
                "Bu medeniyetin özelliklerini anlatır mısınız?"
            ]
        };

        return suggestions[activeTeacher.subject.toLowerCase()] || [
            "Bu konu hakkında sorum var",
            "Anlamadığım yerleri açıklayabilir misiniz?",
            "Bu konuyla ilgili örnek verebilir misiniz?",
            "Daha detaylı anlatır mısınız?"
        ];
    }

    // Önerileri göster/gizle
    function toggleSuggestions() {
        let suggestionsDiv = document.getElementById('messageSuggestions');
        
        if (suggestionsDiv) {
            suggestionsDiv.remove();
            return;
        }

        suggestionsDiv = document.createElement('div');
        suggestionsDiv.id = 'messageSuggestions';
        suggestionsDiv.style.cssText = `
            position: absolute;
            bottom: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid var(--secondary-300);
            border-radius: 0.75rem 0.75rem 0 0;
            padding: 1rem;
            box-shadow: var(--shadow-lg);
            margin-bottom: 0.5rem;
        `;

        const suggestions = showSuggestions();
        suggestionsDiv.innerHTML = `
            <div style="font-size: 0.8rem; font-weight: 500; color: var(--secondary-700); margin-bottom: 0.5rem;">
                <i class="fas fa-lightbulb" style="color: var(--warning-500); margin-right: 0.5rem;"></i>
                ${activeTeacher.subject} dersi için öneriler:
            </div>
            ${suggestions.map(suggestion => `
                <button class="suggestion-btn" style="
                    display: block;
                    width: 100%;
                    text-align: left;
                    padding: 0.5rem;
                    margin-bottom: 0.25rem;
                    background: var(--secondary-50);
                    border: 1px solid var(--secondary-200);
                    border-radius: 0.5rem;
                    cursor: pointer;
                    font-size: 0.8rem;
                    color: var(--secondary-700);
                    transition: background-color 0.2s;
                " onmouseover="this.style.backgroundColor='var(--primary-50)'" 
                   onmouseout="this.style.backgroundColor='var(--secondary-50)'"
                   onclick="selectSuggestion('${suggestion.replace(/'/g, "\\'")}')">
                    ${suggestion}
                </button>
            `).join('')}
        `;

        document.querySelector('.chat-input-area').appendChild(suggestionsDiv);
    }

    // Öneri seç
    window.selectSuggestion = function(suggestion) {
        messageInput.value = suggestion;
        document.getElementById('messageSuggestions').remove();
        messageInput.focus();
    };

    // Enter tuşu ile mesaj gönder
    if (messageInput) {
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                messageForm.dispatchEvent(new Event('submit'));
            }
        });

        // Mesaj input alanını çift tıklayınca öneriler
        messageInput.addEventListener('dblclick', () => {
            if (activeTeacher) {
                toggleSuggestions();
            }
        });
    }

    // Chat geçmişini temizleme fonksiyonu
    function clearAllChatHistory() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('chat_')) {
                localStorage.removeItem(key);
            }
        });
        alert('Tüm chat geçmişi temizlendi!');
        if (activeTeacher) {
            loadMessages();
        }
    }

    // Global fonksiyon olarak erişilebilir yap
    window.clearAllChatHistory = clearAllChatHistory;

    // Sayfa yüklendiğinde chat geçmişini temizle (bir kez)
    if (!localStorage.getItem('chat_cleared_once')) {
        clearAllChatHistory();
        localStorage.setItem('chat_cleared_once', 'true');
    }

    // Sayfa yüklendiğinde öğretmenleri listele
    renderTeachers();
});
