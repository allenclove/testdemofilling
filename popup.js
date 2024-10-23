// 假设配置保存在一个名为 config.json 的文件中
fetch('config.json')
    .then(response => response.json())
    .then(data => {
        const checkboxesDiv = document.getElementById('checkboxes');

        // 动态创建复选框
        for (const [key, value] of Object.entries(data)) {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = key;
            checkbox.value = value; // 复选框的值为语言代码
            const label = document.createElement('label');
            label.htmlFor = key;
            label.innerText = key;

            checkboxesDiv.appendChild(checkbox);
            checkboxesDiv.appendChild(label);
            checkboxesDiv.appendChild(document.createElement('br'));
        }
    });

// 处理“开启”按钮点击事件
document.getElementById('openUrls').addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const urlsToOpen = [];
    const inputText = document.getElementById('inputText').value; // 获取文本框内容

    // 基本的谷歌翻译URL
    const baseUrl = "https://translate.google.com/?sl=auto&tl=";

    checkboxes.forEach(checkbox => {
        const languageCode = checkbox.value; // 语言代码
        const fullUrl = baseUrl + languageCode + "&text=" + encodeURIComponent(inputText); // 拼接完整URL
        urlsToOpen.push(fullUrl);
    });

    // 打开选中的URL
    urlsToOpen.forEach(url => {
        chrome.tabs.create({ url: url });
    });
});
