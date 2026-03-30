// index.js — reúne comportamento da página index.html

// -------- Tema (dark / light) --------
(function(){
	const storageKey = 'site-theme';
	const toggle = document.getElementById('theme-toggle');
	if(!toggle) return;

	// Decide tema inicial: preferência do usuário salva ou preferência do sistema
	const saved = localStorage.getItem(storageKey);
	const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
	const initial = saved || (prefersDark ? 'dark' : 'light');

	function applyTheme(name){
		document.body.setAttribute('data-theme', name);
		// ícone/label simples para indicar estado
		toggle.textContent = name === 'dark' ? '☀️' : '🌙';
		toggle.setAttribute('aria-pressed', String(name === 'dark'));
	}

	applyTheme(initial);

	toggle.addEventListener('click', function(){
		const current = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
		applyTheme(current);
		localStorage.setItem(storageKey, current);
	});
})();

// -------- Salvar perfil ativo no localStorage --------
(function(){
	const profileLinks = document.querySelectorAll('.profile');
	if(!profileLinks || profileLinks.length === 0) return;

	profileLinks.forEach(link => {
		link.addEventListener('click', function(e){
			try{
				const img = this.querySelector('img');
				const caption = this.querySelector('figcaption');
				const name = caption ? caption.textContent.trim() : '';
				const src = img ? img.src : '';
				// chaves esperadas por catalogo/js/main.js
				localStorage.setItem('perfilAtivoNome', name);
				localStorage.setItem('perfilAtivoImagem', src);
			}catch(err){
				// se algo falhar, não bloquear a navegação
				console.error('Erro ao salvar perfil:', err);
			}
			// deixa a navegação prosseguir (o link aponta para catalogo/catalogo.html)
		});
	});
})();