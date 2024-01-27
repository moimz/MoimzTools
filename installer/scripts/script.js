/**
 * 이 파일은 모임즈툴즈의 일부입니다. (https://www.moimz.tools)
 *
 * 모임즈툴즈 인스톨러 스타일시트
 *
 * @file /installer/script.ts
 * @author Arzz (arzz@arzz.com)
 * @license MIT License
 * @modified 2024. 1. 28.
 */
class MoimzToolsInstaller {
    text = null;
    package = null;
    /**
     * 모임즈툴즈 설치화면을 초기화한다.
     */
    async init() {
        const languages = await this.getLanguages();
        if (languages[this.getLanguage()] === undefined) {
            location.replace('./install/?language=en');
            return;
        }
        else {
            const search = new URLSearchParams(location.search);
            if (search.get('language') === null) {
                history.replaceState(null, document.title, location.pathname + '?language=' + this.getLanguage());
            }
        }
        const html = await this.getHtml((await this.getPackage()).title, (await this.getPackage()).version);
        if (html === null) {
            return;
        }
        document.querySelector('body').innerHTML = await this.replaceText(html);
        const language = document.querySelector('input[name=language]');
        language.value = this.getLanguage();
        this.initSteps();
        this.initEvent();
        this.goStep(this.getStep());
    }
    /**
     * 각 설치단계를 초기화한다.
     */
    initSteps() {
        document.querySelectorAll('div[data-step]').forEach(async (dom) => {
            const step = dom.getAttribute('data-step');
            if (step == 'requirements') {
                const ul = dom.querySelector('ul');
                ul.innerHTML = '';
                ul.append(await this.getCheckerTag('requirements', 'latest'));
                ul.append(await this.getCheckerTag('requirements', 'configs'));
                for (const key in (await this.getPackage()).requirements ?? {}) {
                    ul.append(await this.getCheckerTag('requirements', key));
                }
            }
            if (step == 'install') {
                const ul = dom.querySelector('ul[data-role=dependencies]');
                ul.innerHTML = '';
                for (const key in (await this.getPackage()).dependencies ?? {}) {
                    ul.append(await this.getCheckerTag('dependencies', key));
                }
            }
        });
    }
    /**
     * 모임즈툴즈 설치화면 UI 이벤트를 초기화한다.
     */
    initEvent() {
        document.querySelectorAll('div[data-role=select]').forEach((dom) => {
            dom.querySelector('button').addEventListener('click', (e) => {
                const target = e.currentTarget;
                target.parentNode.classList.add('extend');
                e.stopImmediatePropagation();
            });
            dom.querySelectorAll('li[data-value]').forEach((dom) => {
                dom.addEventListener('click', (e) => {
                    const target = e.currentTarget;
                    const parent = target.closest('div[data-role=select]');
                    parent.querySelector('button > span').innerHTML = target.innerHTML;
                    const input = document.querySelector('input[name=' + parent.getAttribute('data-name') + ']');
                    input.value = target.getAttribute('data-value');
                    input.dispatchEvent(new Event('input'));
                    parent.classList.remove('extend');
                    e.stopImmediatePropagation();
                });
            });
        });
        document.querySelectorAll('input').forEach((input) => {
            const name = input.getAttribute('name');
            const type = input.getAttribute('type');
            if (this.getValue(name) !== null) {
                if (type == 'checkbox') {
                    input.checked = this.getValue(name);
                }
                else {
                    input.value = this.getValue(name);
                }
            }
            input.addEventListener('input', (e) => {
                const target = e.currentTarget;
                const name = target.getAttribute('name');
                if (name == 'language') {
                    location.replace(location.pathname + '?language=' + target.value);
                }
                else {
                    this.setValue(name);
                    this.checkStep();
                }
            });
        });
        document.querySelectorAll('div[data-step] button').forEach((dom) => {
            dom.addEventListener('click', (e) => {
                const target = e.currentTarget;
                if (target.getAttribute('data-action') == 'requirements_refresh') {
                    this.checkRequirements(true);
                }
            });
        });
        document.querySelectorAll('nav > button').forEach((dom) => {
            dom.addEventListener('click', (e) => {
                const target = e.currentTarget;
                if (target.getAttribute('type') == 'submit') {
                    this.nextStep();
                }
                else {
                    this.prevStep();
                }
            });
        });
        document.querySelector('body').addEventListener('click', () => {
            document.querySelectorAll('div[data-role=select].extend').forEach((dom) => {
                dom.classList.remove('extend');
            });
        });
        new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.intersectionRatio < 1) {
                    document.querySelector('header').classList.add('fixed');
                }
                else {
                    document.querySelector('header').classList.remove('fixed');
                }
            });
        }).observe(document.querySelector('#observer'));
    }
    /**
     * 모임즈툴즈 패키지정보를 가져온다.
     *
     * @return {Promise<Package>} package
     */
    async getPackage() {
        if (this.package !== null) {
            return this.package;
        }
        else {
            this.package = (await this.getApi('../package.json'));
            return this.package;
        }
    }
    /**
     * 현재 언어코드를 가져온다.
     *
     * @return {string} language
     */
    getLanguage() {
        return document.querySelector('html').getAttribute('lang');
    }
    /**
     * API 데이터를 호출한다.
     *
     * @param {string} url - 요청주소
     * @param {Object} params - GET 데이터
     * @param {boolean|number} is_retry - 재시도여부
     * @return {Promise<Results>} results - 요청결과
     */
    async getApi(url, params = {}, is_retry = true) {
        const requestUrl = new URL(url, location.origin + location.pathname);
        for (const name in params) {
            if (params[name] === null) {
                requestUrl.searchParams.delete(name);
            }
            else {
                requestUrl.searchParams.append(name, params[name]);
            }
        }
        url = requestUrl.toString();
        let retry = (is_retry === false ? 10 : is_retry);
        try {
            const response = (await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept-Language': this.getLanguage(),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                },
                cache: 'no-store',
                redirect: 'follow',
            }).catch((error) => {
                if (retry <= 3) {
                    return this.getApi(url, params, ++retry);
                }
                else {
                    // @todo 에러메시지
                    console.error(error);
                    return { success: false };
                }
            }));
            const results = (await response.json());
            if (results.success == false && results.message !== undefined) {
                // @todo 에러메시지
            }
            return results;
        }
        catch (e) {
            if (retry <= 3) {
                return this.getApi(url, params, ++retry);
            }
            else {
                // @todo 에러메시지
                console.error(e);
                return { success: false };
            }
        }
    }
    /**
     * 언어목록을 가져온다.
     *
     * @return {Promise<Object>} languages
     */
    async getLanguages() {
        return (await this.getApi('//www.moimz.tools/installer/languages.json')) ?? { ko: '한국어' };
    }
    /**
     * 설치화면 HTML 을 가져온다.
     *
     * @param {string} name - 패키지명
     * @param {string} version - 버전
     * @param {boolean|number} is_retry - 재시도여부
     * @return {Promise<string>} html
     */
    async getHtml(name, version, is_retry = true) {
        let retry = (is_retry === false ? 10 : is_retry);
        try {
            const response = (await fetch('//www.moimz.tools/installer/index.php?name=' + name + '&version=' + version, {
                method: 'GET',
                headers: {
                    'Accept-Language': this.getLanguage(),
                    'Accept': 'text/html',
                },
                cache: 'no-store',
                redirect: 'follow',
            }).catch((error) => {
                if (retry <= 3) {
                    return this.getHtml(name, version, ++retry);
                }
                else {
                    // @todo 에러메시지
                    console.error(error);
                    return null;
                }
            }));
            return await response.text();
        }
        catch (e) {
            if (retry <= 3) {
                return this.getHtml(name, version, ++retry);
            }
            else {
                // @todo 에러메시지
                console.error(e);
                return null;
            }
        }
    }
    /**
     * 모임즈툴즈 설치페이지 언어팩을 가져온다.
     *
     * @param {string} code - 언어팩코드
     * @return {Promise<string>} text
     */
    async getText(code) {
        if (this.text === null) {
            this.text = (await this.getApi('//www.moimz.tools/installer/languages/' + this.getLanguage() + '.json'));
        }
        const keys = code.split('.');
        let text = this.text;
        for (const key of keys) {
            if (text[key] === undefined) {
                return null;
            }
            text = text[key];
        }
        if (typeof text == 'object') {
            return null;
        }
        else {
            return text;
        }
    }
    /**
     * 언어코드가 존재할 경우 언어코드를 언어팩 내용으로 변환한다.
     *
     * @param {string} origin - 원본 텍스트
     * @param {Object} replacements - 대치 텍스트 (NULL 인 경우 언어팩 사용)
     * @param {Object} is_bold - 굵은 텍스트로 대치할지 여부
     * @return {Promise<string>} text - 변환된 텍스트
     */
    async replaceText(origin, replacements = null, is_bold = false) {
        if (origin === null)
            return '';
        const texts = [...origin.matchAll(/\$\{(.*?)\}/g)];
        for (const text of texts) {
            if (replacements !== null && replacements[text[1]] !== undefined) {
                origin = origin.replace(text[0], is_bold == true ? '<b>' + replacements[text[1]] + '</b>' : replacements[text[1]]);
            }
            else {
                origin = origin.replace(text[0], is_bold == true ? '<b>' + (await this.getText(text[1])) + '</b>' : await this.getText(text[1]));
            }
        }
        return origin;
    }
    /**
     * 설치화면의 INPUT 태그의 이전 입력값을 가져온다.
     *
     * @param {string} name - 이전 입력값을 가져올 INPUT 태그명
     * @return {(boolean|string)} value
     */
    getValue(name) {
        const values = JSON.parse(window.sessionStorage?.getItem('values') ?? '{}') ?? {};
        return values[name] ?? null;
    }
    /**
     * 설치화면의 INPUT 태그의 입력값을 저장한다.
     *
     * @param {string} name - 입력값을 저장할 INPUT 태그명
     */
    setValue(name) {
        if (name.indexOf('password') > -1 || name == 'key')
            return;
        const values = JSON.parse(window.sessionStorage?.getItem('values') ?? '{}') ?? {};
        const input = document.querySelector('input[name=' + name + ']');
        if (input.getAttribute('type') == 'checkbox') {
            values[name] = input.checked;
        }
        else {
            values[name] = input.value;
        }
        window.sessionStorage?.setItem('values', JSON.stringify(values));
    }
    /**
     * 전체 설치단계를 가져온다.
     *
     * @return {string[]} steps
     */
    getSteps() {
        const steps = [];
        document.querySelectorAll('ul[data-role=steps] > li').forEach((dom) => {
            steps.push(dom.getAttribute('data-step'));
        });
        return steps;
    }
    /**
     * 현재 설치단계를 가져온다.
     *
     * @return {string} step
     */
    getStep() {
        const current = document.querySelector('main').getAttribute('data-step') ?? null;
        if (current !== null) {
            return current;
        }
        const search = new URLSearchParams(location.search);
        const step = search.get('step');
        if (step === null) {
            return this.getSteps()[0];
        }
        return step;
    }
    /**
     * 특정 설치단계를 활성화한다.
     *
     * @param {string} step - 활성화할 설치단계
     * @param {boolean} is_visible - 설치단계 화면을 보일지 여부
     */
    activeStep(step, is_visible = true) {
        const steps = this.getSteps();
        document.querySelector('main').setAttribute('data-step', step);
        document.querySelectorAll('div[data-step]').forEach((dom) => {
            dom.style.display = 'none';
        });
        if (is_visible == true) {
            document.querySelector('div[data-step=' + step + ']').style.display = 'block';
            history.replaceState(null, document.title, location.pathname + '?language=' + this.getLanguage() + '&step=' + step);
        }
        if (step == 'requirements' && is_visible == true) {
            this.checkRequirements(true);
        }
        if (step == 'configs' && is_visible == true) {
            this.checkConfigs();
        }
        if (step == 'install' && is_visible == true) {
            this.install();
        }
        if (steps.indexOf(step) === 0) {
            document.querySelector('nav > button[type=button]').setAttribute('disabled', 'disabled');
        }
        else {
            document.querySelector('nav > button[type=button]').removeAttribute('disabled');
        }
        document.querySelectorAll('ul[data-role=steps] > li').forEach((dom) => {
            dom.classList.remove('on');
        });
        document.querySelector('ul[data-role=steps] > li[data-step=' + step + ']').classList.add('on');
        this.checkStep();
    }
    /**
     * 현재 설치단계의 요구사항을 모두 만족하였는지 확인한다.
     *
     * @return {boolean} checked
     */
    checkStep() {
        const step = this.getStep();
        const current = document.querySelector('div[data-step=' + step + ']');
        let checked = true;
        switch (step) {
            case 'configs':
                const token = current.querySelector('input[name=token]');
                if (current.style.display == 'block' || token.value.length == 0) {
                    for (const input of current.querySelectorAll('input')) {
                        if (input.getAttribute('disabled') == 'disabled')
                            continue;
                        if (input.getAttribute('name') == 'token')
                            continue;
                        if (input.value.length == 0) {
                            checked = false;
                            break;
                        }
                    }
                }
                break;
            default:
                for (const input of current.querySelectorAll('input')) {
                    if (input.getAttribute('data-required') === 'true') {
                        if (input.getAttribute('disabled') == 'disabled')
                            continue;
                        if (input.getAttribute('type') == 'checkbox') {
                            if (input.checked == false) {
                                checked = false;
                                break;
                            }
                        }
                        else {
                            if (input.value.length == 0) {
                                checked = false;
                                break;
                            }
                        }
                    }
                }
        }
        if (checked == true) {
            document.querySelector('nav > button[type=submit]').removeAttribute('disabled');
        }
        else {
            document.querySelector('nav > button[type=submit]').setAttribute('disabled', 'disabled');
        }
        return checked;
    }
    /**
     * 이전 설치단계 이동이 가능한지 확인하고, 이동가능한 경우 이전 설치단계로 이동한다.
     *
     * @return {boolean} is_move - 이동여부
     */
    prevStep() {
        const step = this.getStep();
        const prev = this.getSteps()[Math.max(0, this.getSteps().indexOf(step) - 1)] ?? null;
        if (prev === null) {
            return false;
        }
        this.activeStep(prev, true);
        return true;
    }
    /**
     * 다음 설치단계 이동이 가능한지 확인하고, 이동가능한 경우 다음 설치단계로 이동한다.
     *
     * @param {boolean} is_visible - 설치단계 화면을 보일지 여부
     * @return {boolean} is_move - 이동여부
     */
    nextStep(is_visible = true) {
        const step = this.getStep();
        const next = this.getSteps()[this.getSteps().indexOf(step) + 1] ?? null;
        if (step == 'configs') {
            if (is_visible == true) {
                this.submitConfigs().then((success) => {
                    if (success == true) {
                        this.activeStep(next, is_visible);
                    }
                });
                return false;
            }
            else {
                const token = document.querySelector('div[data-step=configs] input[name=token]');
                if (token.value.length == 0) {
                    return false;
                }
            }
        }
        if (next === null || this.checkStep() === false) {
            return false;
        }
        this.activeStep(next, is_visible);
        return true;
    }
    /**
     * 특정 설치단계로 이동한다.
     *
     * @param {string} step - 이동할 설치단계
     */
    goStep(step) {
        const steps = this.getSteps();
        this.activeStep(steps[0]);
        if (steps.indexOf(step) === -1 || step == steps[0]) {
            return;
        }
        while (true) {
            if (step == this.getStep()) {
                this.activeStep(step);
                break;
            }
            if (this.nextStep(false) == false) {
                this.activeStep(this.getStep());
                break;
            }
        }
    }
    /**
     * 요구사항 및 종속성 상태확인 HTML 을 반환한다.
     *
     * @param {string} type - 종류
     * @param {string} key - 고유값
     * @return {HTMLElement} checker
     */
    async getCheckerTag(type, key, results = null) {
        const list = document.createElement('li');
        list.setAttribute('data-type', type);
        list.setAttribute('data-key', key);
        if (type == 'dependencies') {
            const keys = key.split('/');
            key = keys.shift();
            results ??= {};
            results.package = keys.join('/');
        }
        const status = results?.status ?? 'init';
        const icon = '<i class="' + (status == 'init' ? 'mi mi-loading' : status) + '"></i>';
        const message = await this.replaceText(await this.getText(type + '.' + key + '.' + status), results, true);
        list.innerHTML = icon + '<span>' + message + '</span>';
        return list;
    }
    /**
     * 요구사항을 확인한다.
     *
     * @param {boolean} is_refresh - 요구사항 재확인 여부
     * @return {Promise<void>} promise
     */
    async checkRequirements(is_refresh = false) {
        const success = document.querySelector('input[name=requirements_success]');
        const checked = document.querySelector('input[name=requirements_checked]');
        document.querySelectorAll('div[data-step=requirements] li[data-type]').forEach(async (dom) => {
            dom.replaceWith(await this.getCheckerTag(dom.getAttribute('data-type'), dom.getAttribute('data-key')));
        });
        let requirements = null;
        if (is_refresh == true || checked.value.length == 0) {
            success.value = '';
            success.dispatchEvent(new Event('input'));
            requirements = await this.getApi('./process/index.php?action=requirements');
        }
        else {
            requirements = JSON.parse(checked.value);
        }
        document.querySelectorAll('div[data-step=requirements] li[data-type]').forEach(async (dom) => {
            dom.replaceWith(await this.getCheckerTag(dom.getAttribute('data-type'), dom.getAttribute('data-key'), requirements[dom.getAttribute('data-key')] ?? null));
        });
        success.value = requirements.success == true ? 'true' : '';
        success.dispatchEvent(new Event('input'));
        checked.value = JSON.stringify(requirements);
        checked.dispatchEvent(new Event('input'));
    }
    /**
     * 환경설정을 확인한다.
     *
     * @return {Promise<void>} promise
     */
    async checkConfigs() {
        const loading = document.querySelector('div[data-step=configs] div[data-role=loading]');
        loading.style.display = 'flex';
        const configs = await this.getApi('./process/index.php?action=configs');
        loading.style.display = 'none';
        if (configs?.has_configs === true) {
            document.querySelector('div[data-step=configs] div[data-role=help][data-name=key]').innerHTML =
                await this.getText('step.configs.key.help.exists');
            document.querySelectorAll('div[data-step=configs] input').forEach((input) => {
                if (input.getAttribute('name') == 'token' ||
                    input.getAttribute('name') == 'key' ||
                    input.getAttribute('name').indexOf('admin') === 0) {
                    return;
                }
                input.value = '';
                input.setAttribute('disabled', 'disabled');
            });
        }
        else {
            document.querySelectorAll('div[data-step=configs] input').forEach((input) => {
                if (input.value.length == 0) {
                    if (configs !== null && configs[input.getAttribute('name')] !== undefined) {
                        input.value = configs[input.getAttribute('name')];
                    }
                }
            });
        }
    }
    /**
     * 설정파일 구성정보를 저장한다.
     *
     * @return {Promise<boolean>} success
     */
    async submitConfigs() {
        let configs = {};
        document.querySelectorAll('div[data-step=configs] input').forEach((input) => {
            configs[input.getAttribute('name')] = input.value.length > 0 ? input.value : null;
        });
        document.querySelectorAll('div[data-step=configs] div[data-role=input]').forEach(async (dom) => {
            dom.classList.remove('error');
            if (dom.querySelector('div[data-role=help]') != null) {
                const help = dom.querySelector('div[data-role=help]');
                help.innerHTML = (await this.getText('step.configs.' + help.getAttribute('data-name') + '.init')) ?? '';
            }
        });
        const response = await fetch('./process/index.php?action=configs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
            redirect: 'follow',
            body: JSON.stringify(configs),
        });
        const results = await response.json();
        const success = results.success;
        if (success == true) {
            const token = document.querySelector('div[data-step=configs] input[name=token]');
            token.value = results.token;
            token.dispatchEvent(new Event('input'));
        }
        else {
            if (results.code) {
                const code = document.querySelector('div[data-step=configs] div[data-role=code]');
                code.style.display = 'flex';
                const box = code.querySelector(':scope > div');
                box.innerHTML = '';
                const message = document.createElement('div');
                message.innerHTML = await this.replaceText(await this.getText('step.configs.code'), results);
                box.append(message);
                const button = document.createElement('button');
                button.innerHTML = '<span>' + (await this.getText('step.configs.retry')) + '</span>';
                button.addEventListener('click', (e) => {
                    button.setAttribute('disabled', 'disabled');
                    code.style.display = 'none';
                    e.stopImmediatePropagation();
                    this.submitConfigs();
                });
                box.append(button);
            }
            else if (results.errors) {
                for (const name in results.errors) {
                    const input = document.querySelector('div[data-step=configs] input[name=' + name + ']');
                    const help = document.querySelector('div[data-step=configs] div[data-role=help][data-name=' + name + ']');
                    if (input !== null) {
                        const value = results.errors[name];
                        const parent = input.closest('div[data-role=input]');
                        input.removeAttribute('disabled');
                        input.value = value ?? input.value;
                        parent.classList.add('error');
                    }
                    if (help !== null) {
                        if (input === null) {
                            const value = results.errors[name];
                            help.innerHTML = await this.replaceText(await this.getText(value.text), value.replacements);
                        }
                        else {
                            help.innerHTML = await this.getText('step.configs.' + name + '.help.error');
                        }
                    }
                }
            }
        }
        return success;
    }
    /**
     * 모임즈툴즈를 설치한다.
     *
     * @return {Promise<boolean>} installed
     */
    async install() {
        const step = document.querySelector('div[data-step=install]');
        const token = document.querySelector('input[name=token]').value;
        const installed = step.querySelector('input[name=installed]');
        installed.value = '';
        installed.dispatchEvent(new Event('input'));
        step.querySelectorAll('ul[data-role=core] > li[data-type]').forEach(async (checker) => {
            const type = checker.getAttribute('data-type');
            let icon = checker.querySelector('i');
            icon.classList.remove(...icon.classList);
            icon.classList.add('mi', 'mi-loading');
            checker.querySelector('span').innerHTML = await this.getText('step.install.' + type + '.init');
        });
        step.querySelectorAll('ul[data-role=dependencies] > li[data-type]').forEach(async (checker) => {
            const key = checker.getAttribute('data-key');
            checker.replaceWith(await this.getCheckerTag('dependencies', key));
        });
        let success = true;
        const configs = await (await fetch('./process/index.php?action=install&step=configs&token=' + token, {
            method: 'POST',
            cache: 'no-store',
            redirect: 'follow',
        })).json();
        success = success && configs?.success;
        if (configs !== null) {
            let checker = step.querySelector('li[data-type=configs]');
            let icon = checker.querySelector('i');
            icon.classList.remove(...icon.classList);
            icon.classList.add(configs.status);
            checker.querySelector('span').innerHTML = await this.getText('step.install.configs.' + configs.status);
        }
        const databases = await (await fetch('./process/index.php?action=install&step=databases&token=' + token, {
            method: 'POST',
            cache: 'no-store',
            redirect: 'follow',
        })).json();
        success = success && configs?.success;
        if (databases !== null) {
            let checker = step.querySelector('li[data-type=databases]');
            let icon = checker.querySelector('i');
            icon.classList.remove(...icon.classList);
            icon.classList.add(databases.status);
            checker.querySelector('span').innerHTML = await this.getText('step.install.databases.' + databases.status);
        }
        if (success == true) {
            step.querySelectorAll('ul[data-role=dependencies] > li[data-type]').forEach(async (checker) => {
                const key = checker.getAttribute('data-key');
                const dependencies = await (await fetch('./process/index.php?action=install&step=dependencies&key=' + key + '&token=' + token, {
                    method: 'POST',
                    cache: 'no-store',
                    redirect: 'follow',
                })).json();
                success = success && dependencies?.success;
                console.log(dependencies);
                if (dependencies?.success == true) {
                    checker.replaceWith(await this.getCheckerTag('dependencies', key, {
                        status: 'success',
                        current: dependencies.current,
                    }));
                }
                else {
                    checker.replaceWith(await this.getCheckerTag('dependencies', key, {
                        status: dependencies?.status ?? 'upload',
                        requirement: dependencies?.requirement,
                        current: dependencies?.current,
                        message: dependencies?.message,
                    }));
                }
            });
        }
        else {
            step.querySelectorAll('ul[data-role=dependencies] > li[data-type]').forEach(async (checker) => {
                const key = checker.getAttribute('data-key');
                checker.replaceWith(await this.getCheckerTag('dependencies', key, { status: 'notice' }));
            });
        }
        if (success == true) {
            installed.value = 'true';
            installed.dispatchEvent(new Event('input'));
        }
        return success;
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const installer = new MoimzToolsInstaller();
    installer.init();
});
