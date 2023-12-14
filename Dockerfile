FROM mcr.microsoft.com/playwright:v1.39.0-jammy

COPY . /Playwright
WORKDIR /Playwright

RUN npm ci

CMD ["npm", "test"]