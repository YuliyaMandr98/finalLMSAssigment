# Dockerfile

# Базовый образ: Playwright + Node.js
# Используем конкретный тег, который вы нашли и который стабилен
FROM mcr.microsoft.com/playwright/node:v1.53.0-noble

USER root # Временно переключаемся на root для установки системных пакетов

# Устанавливаем Java Runtime Environment (JRE) - необходим для Allure CLI
RUN apt-get update && \
    apt-get install -y openjdk-17-jre-headless && \
    rm -rf /var/lib/apt/lists/*

# Устанавливаем Allure Commandline (сам исполняемый файл)
# Замените '2.27.0' на актуальную версию Allure CLI, если она изменилась
ENV ALLURE_VERSION 2.27.0
RUN curl -o /tmp/allure.zip -L https://github.com/allure-framework/allure-commandline/releases/download/${ALLURE_VERSION}/allure-commandline-${ALLURE_VERSION}.zip && \
    unzip /tmp/allure.zip -d /opt && \
    rm /tmp/allure.zip && \
    ln -s /opt/allure-${ALLURE_VERSION}/bin/allure /usr/local/bin/allure

# Возвращаемся к пользователю Playwright для выполнения npm install и тестов
# Пользователь 'playwright' уже существует в базовом образе
USER playwright 

# Устанавливаем рабочую директорию внутри контейнера
# Именно в эту директорию будут скопированы ваши файлы проекта
WORKDIR /app

# Копируем package.json и package-lock.json для установки npm-зависимостей
# Это позволяет Docker кэшировать npm install
COPY package*.json ./

# Устанавливаем npm-зависимости
RUN npm install

# Копируем весь остальной код проекта в рабочую директорию /app
# '.' - это папка, где находится Dockerfile на хосте (т.е. ваш Playwright проект)
# '.' - это /app внутри контейнера
COPY . .

# Команда, которая будет выполняться по умолчанию (необязательно, Jenkins переопределит)
CMD ["npx", "playwright", "test"]