//00.10 Admin login (client-side only: this hides the settings UI, it does not protect the data files)
(function () {
    var AUTH_KEY = 'auth';
    var AUTH_HASH = 'fa96405a9a0cc6e7257a013326e5271905044fdb825a043ebc947c201854d2b8';
    var pendingCallback = null;

    // Compact SHA-256 (public domain, ASCII input) so the password is not stored in plain text in the source
    function rightRotate(value, amount) { return (value >>> amount) | (value << (32 - amount)); }
    function sha256(ascii) {
        var maxWord = Math.pow(2, 32), i, j, result = '';
        var words = [], bitLength = ascii.length * 8;
        var hash = [], k = [], primeCounter = 0, isComposite = {};
        for (var candidate = 2; primeCounter < 64; candidate++) {
            if (!isComposite[candidate]) {
                for (i = 0; i < 313; i += candidate) { isComposite[i] = candidate; }
                hash[primeCounter] = (Math.pow(candidate, 0.5) * maxWord) | 0;
                k[primeCounter++] = (Math.pow(candidate, 1 / 3) * maxWord) | 0;
            }
        }
        ascii += '\x80';
        while (ascii.length % 64 - 56) { ascii += '\x00'; }
        for (i = 0; i < ascii.length; i++) {
            j = ascii.charCodeAt(i);
            if (j >> 8) { return ''; }
            words[i >> 2] |= j << ((3 - i) % 4) * 8;
        }
        words[words.length] = ((bitLength / maxWord) | 0);
        words[words.length] = bitLength;
        for (j = 0; j < words.length;) {
            var w = words.slice(j, j += 16);
            var oldHash = hash;
            hash = hash.slice(0, 8);
            for (i = 0; i < 64; i++) {
                var w15 = w[i - 15], w2 = w[i - 2];
                var a = hash[0], e = hash[4];
                var temp1 = hash[7] + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
                    ((e & hash[5]) ^ ((~e) & hash[6])) + k[i] +
                    (w[i] = (i < 16) ? w[i] : (w[i - 16] + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                        w[i - 7] + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) | 0);
                var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
                    ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
                hash = [(temp1 + temp2) | 0].concat(hash);
                hash[4] = (hash[4] + temp1) | 0;
            }
            for (i = 0; i < 8; i++) { hash[i] = (hash[i] + oldHash[i]) | 0; }
        }
        for (i = 0; i < 8; i++) {
            for (j = 3; j + 1; j--) {
                var b = (hash[i] >> (j * 8)) & 255;
                result += ((b < 16) ? 0 : '') + b.toString(16);
            }
        }
        return result;
    }

    function storedHash() {
        try { return localStorage.getItem(AUTH_KEY); } catch (e) { return null; }
    }

    window.isAdmin = function () { return storedHash() === AUTH_HASH; };

    // Show or hide everything that only the admin may see (settings gear, footer settings link, login/logout icon)
    window.applyAuthUI = function () {
        var admin = window.isAdmin();
        var els = document.querySelectorAll('.auth-only');
        for (var i = 0; i < els.length; i++) { els[i].style.display = admin ? '' : 'none'; }
        var a = document.querySelector('#navLogin a');
        if (a) {
            a.textContent = admin ? '🚪' : '🔑';
            var label = admin ? t('logout') : t('login');
            a.setAttribute('title', label);
            a.setAttribute('aria-label', label);
        }
    };

    function closeModal() {
        var m = document.getElementById('loginModal');
        if (m) { m.style.display = 'none'; }
        pendingCallback = null;
    }

    function submitLogin(ev) {
        if (ev) { ev.preventDefault(); }
        var user = document.getElementById('loginUser').value;
        var pass = document.getElementById('loginPass').value;
        var err = document.getElementById('loginError');
        if (sha256('quetzal-trv|' + user + '|' + pass) === AUTH_HASH) {
            try { localStorage.setItem(AUTH_KEY, AUTH_HASH); } catch (e) {}
            var cb = pendingCallback;
            closeModal();
            window.applyAuthUI();
            if (cb) { cb(); }
        } else {
            err.textContent = t('loginError');
            err.style.display = 'block';
            document.getElementById('loginPass').value = '';
            document.getElementById('loginPass').focus();
        }
    }

    function buildModal() {
        var m = document.createElement('div');
        m.id = 'loginModal';
        m.className = 'stats-modal';
        m.setAttribute('role', 'dialog');
        m.setAttribute('aria-modal', 'true');
        m.setAttribute('aria-labelledby', 'loginTitle');
        m.innerHTML =
            '<form class="stats-modal-box auth-box" id="loginForm" autocomplete="on">' +
                '<div class="stats-modal-head"><h3 id="loginTitle"></h3>' +
                    '<button type="button" class="stats-modal-close" id="loginClose" aria-label="Close">&times;</button></div>' +
                '<div class="auth-body">' +
                    '<label for="loginUser" id="loginUserLabel"></label>' +
                    '<input type="text" id="loginUser" class="auth-input" autocomplete="username" autocapitalize="none" spellcheck="false">' +
                    '<label for="loginPass" id="loginPassLabel"></label>' +
                    '<input type="password" id="loginPass" class="auth-input" autocomplete="current-password">' +
                    '<div id="loginError" class="set-alert is-err" style="display:none" role="alert"></div>' +
                    '<button type="submit" class="auth-submit" id="loginSubmit"></button>' +
                '</div>' +
            '</form>';
        document.body.appendChild(m);
        m.addEventListener('click', function (e) { if (e.target === m) { closeModal(); } });
        document.getElementById('loginClose').addEventListener('click', closeModal);
        document.getElementById('loginForm').addEventListener('submit', submitLogin);
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && m.style.display !== 'none') { closeModal(); }
        });
    }

    // Open the login dialog. callback (optional) runs after a successful login.
    window.openLogin = function (callback) {
        if (!document.getElementById('loginModal')) { buildModal(); }
        pendingCallback = callback || null;
        document.getElementById('loginTitle').textContent = t('loginTitle');
        document.getElementById('loginUserLabel').textContent = t('username');
        document.getElementById('loginPassLabel').textContent = t('password');
        document.getElementById('loginSubmit').textContent = t('loginSubmit');
        document.getElementById('loginError').style.display = 'none';
        document.getElementById('loginUser').value = '';
        document.getElementById('loginPass').value = '';
        document.getElementById('loginModal').style.display = 'flex';
        document.getElementById('loginUser').focus();
    };

    // Run callback now when logged in, otherwise ask for the login first
    window.requireAdmin = function (callback) {
        if (window.isAdmin()) { callback(); return true; }
        window.openLogin(callback);
        return false;
    };

    window.logout = function () {
        try { localStorage.removeItem(AUTH_KEY); } catch (e) {}
        window.applyAuthUI();
        if (document.getElementById('settingsPage') || document.querySelector('.plans-page') ||
            /page=(settings|plans)/.test(window.location.search)) {
            window.skipPushState = false;
            createWorldPage_HTML();
            getNumberOfLocation();
        }
    };

    window.toggleLogin = function () {
        if (window.isAdmin()) { window.logout(); } else { window.openLogin(); }
    };

    document.addEventListener('DOMContentLoaded', window.applyAuthUI);
})();
