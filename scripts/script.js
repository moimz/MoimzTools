/**
 * 이 파일은 모임즈툴즈의 일부입니다. (https://www.moimz.com)
 *
 * 모임즈툴즈 홈페이지 UI 이벤트를 처리한다.
 *
 * @file /scripts/script.ts
 * @author Arzz
 * @license MIT License
 * @version 2.0.0
 * @modified 2024. 1. 28.
 */
class MoimzTools {
    static preview;
    static open(icon) {
        MoimzTools.close();
        icon.classList.add('loading');
        const preview = document.querySelector('#PreviewWindow');
        const previewIcon = preview.querySelector('header > i');
        const previewTitle = preview.querySelector('header > h3');
        previewIcon.style.backgroundImage = 'url(../images/' + icon.getAttribute('data-tool') + '.png)';
        previewTitle.innerText = icon.getAttribute('data-title');
        const iframe = document.createElement('iframe');
        iframe.setAttribute('src', icon.getAttribute('data-url'));
        iframe.addEventListener('load', () => {
            preview.classList.add('show');
            icon.classList.remove('loading');
        });
        preview.querySelector('main').append(iframe);
    }
    static close() {
        const preview = document.querySelector('#PreviewWindow');
        if (preview.classList.contains('show') == false) {
            return;
        }
        preview.classList.remove('show');
    }
    static init() {
        /**
         * 모임즈툴즈 아이콘 설정
         */
        document.querySelectorAll('i[data-role=icon]').forEach((icon) => {
            //
            icon.style.backgroundImage = 'url(../images/' + icon.getAttribute('data-tool') + '.png)';
            icon.addEventListener('click', (e) => {
                const target = e.currentTarget;
                MoimzTools.open(target);
            });
        });
        /**
         * 패밀리사이트
         */
        document.querySelector('button[data-role=sites]').addEventListener('click', (e) => {
            const button = e.currentTarget;
            button.classList.toggle('on');
            e.stopImmediatePropagation();
        });
        document.addEventListener('click', () => {
            document.querySelector('button[data-role=sites]').classList.remove('on');
        });
        document.querySelector('#PreviewWindow > header > button').addEventListener('click', () => {
            MoimzTools.close();
        });
        MoimzTools.preview = document.querySelector('#PreviewWindow');
        MoimzTools.preview.addEventListener('transitionend', (e) => {
            if (e.propertyName == 'width') {
                if (MoimzTools.preview.classList.contains('show') == true) {
                }
                else {
                    MoimzTools.preview.querySelector('iframe').remove();
                }
            }
        });
    }
}
document.addEventListener('DOMContentLoaded', () => {
    MoimzTools.init();
});
