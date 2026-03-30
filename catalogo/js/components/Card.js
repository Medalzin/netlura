// Importa funções utilitárias usadas para extrair id do YouTube e gerar valores aleatórios
import { getYouTubeId, getRandomMatchScore, getRandomDuration, getRandomAgeBadge } from '../utils.js';

// Função que cria um elemento DOM representando um cartão de filme/série
export function createCard(item) {
    // cria o container principal do cartão
    const card = document.createElement('div');
    card.className = 'movie-card';
    // adiciona uma classe se o usuário já progrediu (barra de progresso)
    if (item.progress) {
        card.classList.add('has-progress');
    }

    // cria o elemento de imagem (capa do filme)
    const img = document.createElement('img');
    img.src = item.img; // fonte da imagem
    img.alt = `Movie cover`; // texto alternativo para acessibilidade

    // cria um iframe vazio que será usado para pré-visualização em autoplay
    const iframe = document.createElement('iframe');
    iframe.frameBorder = "0"; // remove borda padrão do iframe
    iframe.allow = "autoplay; encrypted-media"; // permite autoplay quando atribuído src

    // obtém o id do vídeo do YouTube (usado para montar a URL do embed)
    const videoId = getYouTubeId(item.youtube);

    // insere iframe e imagem no cartão (iframe antes da imagem facilita camadas visuais)
    card.appendChild(iframe);
    card.appendChild(img);

    // gera um selo de idade aleatório (ex: '16' ou 'A16')
    const ageBadge = getRandomAgeBadge();

    // cria a área de detalhes que contém botões e informações (conteúdo em HTML para simplicidade)
    const details = document.createElement('div');
    details.className = 'card-details';
    details.innerHTML = `
        <div class="details-buttons">
            <div class="left-buttons">
                <button class="btn-icon btn-play-icon"><i class="fas fa-play" style="margin-left:2px;"></i></button>
                ${item.progress ? '<button class="btn-icon"><i class="fas fa-check"></i></button>' : '<button class="btn-icon"><i class="fas fa-plus"></i></button>'}
                <button class="btn-icon"><i class="fas fa-thumbs-up"></i></button>
            </div>
            <div class="right-buttons">
                <button class="btn-icon"><i class="fas fa-chevron-down"></i></button>
            </div>
        </div>
        <div class="details-info">
            <span class="match-score">${getRandomMatchScore()}% relevante</span>
            <span class="age-badge ${ageBadge.class}">${ageBadge.text}</span>
            <span class="duration">${getRandomDuration(item.progress)}</span>
            <span class="resolution">HD</span>
        </div>
        <div class="details-tags">
            <span>Empolgante</span>
            <span>Animação</span>
            <span>Ficção</span>
        </div>
    `;
    // adiciona a seção de detalhes ao cartão
    card.appendChild(details);

    // se houver progresso do usuário, adiciona uma barra que mostra visualmente essa porcentagem
    if (item.progress) {
        const pbContainer = document.createElement('div');
        pbContainer.className = 'progress-bar-container';
        const pbValue = document.createElement('div');
        pbValue.className = 'progress-value';
        pbValue.style.width = `${item.progress}%`; // largura proporcional ao progresso
        pbContainer.appendChild(pbValue);
        card.appendChild(pbContainer);
    }

    // variável para controlar o timeout antes de iniciar o preview (evita tocar imediatamente ao passar o mouse)
    let playTimeout;

    // quando o mouse entra no cartão, prepara a pré-visualização do vídeo
    card.addEventListener('mouseenter', () => {
        // calcula posição do cartão na tela para decidir a origem da animação
        const rect = card.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        
        // adiciona classes para ajustar origem da expansão (evitar overflow na borda da tela)
        if (rect.left < 100) {
            card.classList.add('origin-left');
        } else if (rect.right > windowWidth - 100) {
            card.classList.add('origin-right');
        }

        // espera um pequeno delay antes de iniciar o preview (melhora usabilidade)
        playTimeout = setTimeout(() => {
            // configura o src do iframe para o embed do YouTube com autoplay mudo
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&loop=1&playlist=${videoId}`;
            // adiciona classes que podem ser usadas pelo CSS para mostrar/animar o player
            iframe.classList.add('playing');
            img.classList.add('playing-video');
        }, 600); // 600ms de atraso
    });

    // quando o mouse sai do cartão, limpa o preview e remove estados visuais
    card.addEventListener('mouseleave', () => {
        clearTimeout(playTimeout); // cancela o timeout caso o usuário não tenha permanecido
        iframe.classList.remove('playing');
        img.classList.remove('playing-video');
        iframe.src = ""; // remove o src para parar o vídeo e liberar recursos
        card.classList.remove('origin-left');
        card.classList.remove('origin-right');
    });

    // retorna o elemento DOM pronto para ser inserido na página
    return card;
}
