// 加载复选框配置并初始化界面
function loadCheckboxes() {
    fetch('config.json')
        .then(response => response.json())
        .then(data => {
            const checkboxesDiv = document.getElementById('checkboxes');
            checkboxesDiv.innerHTML = ''; // 清空之前内容

            for (const [key, value] of Object.entries(data)) {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = key;
                checkbox.value = value;

                const label = document.createElement('label');
                label.htmlFor = key;
                label.innerText = key;

                checkboxesDiv.appendChild(checkbox);
                checkboxesDiv.appendChild(label);
                checkboxesDiv.appendChild(document.createElement('br'));
            }

            loadPreviousSettings(); // 加载上一次的设置
        });
}

// 加载之前存储的设置
function loadPreviousSettings() {
    chrome.storage.local.get(['inputText', 'selectedCheckboxes'], data => {
        if (data.inputText) document.getElementById('inputText').value = data.inputText;
        if (data.selectedCheckboxes) {
            data.selectedCheckboxes.forEach(id => {
                const checkbox = document.getElementById(id);
                if (checkbox) checkbox.checked = true;
            });
        }
    });
}

// 保存当前设置到本地存储
function saveSettings(inputText, selectedCheckboxes) {
    chrome.storage.local.set({ inputText, selectedCheckboxes });
}

// 全选或取消全选复选框
document.getElementById('selectAll').addEventListener('change', function() {
    const checkboxes = document.querySelectorAll('#checkboxes input[type="checkbox"]');
    checkboxes.forEach(checkbox => checkbox.checked = this.checked);
});

// 处理“开启”按钮点击事件
document.getElementById('openUrls').addEventListener('click', () => {
    const inputText = document.getElementById('inputText').value;
    const errorElement = document.getElementById('error');

    // 检查文本框是否为空
    if (!inputText) {
        errorElement.style.display = 'block';
        return;
    } else {
        errorElement.style.display = 'none';
    }

    const checkboxes = document.querySelectorAll('#checkboxes input[type="checkbox"]:checked');
    const selectedCheckboxes = Array.from(checkboxes).map(cb => cb.id);
    const urlsToOpen = [];
    const baseUrl = "https://translate.google.com/?sl=auto&tl=";

    checkboxes.forEach(checkbox => {
        const fullUrl = baseUrl + checkbox.value + "&text=" + encodeURIComponent(inputText);
        urlsToOpen.push(fullUrl);
    });

    // 保存设置
    saveSettings(inputText, selectedCheckboxes);

    // 打开所有选择的URL
    urlsToOpen.forEach(url => {
        chrome.tabs.create({ url: url });
    });
});

// 初始化界面
document.addEventListener('DOMContentLoaded', loadCheckboxes);
