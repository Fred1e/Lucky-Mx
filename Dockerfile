FROM node:lts-buster

RUN git clone https://github.com/Fred1e/Lucky-Mx /root/lucky_bot

WORKDIR /root/lucky_bot

COPY package.json .
RUN npm i
COPY . .

EXPOSE 8000

CMD ["npm","run","lucky"]
