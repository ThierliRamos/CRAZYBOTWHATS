const {default: makeWASocket, delay, WA_DEFAULT_EPHEMERAL, downloadMediaMessage, downloadContentFromMessage, DisconnectReason, getAggregateVotesInPollMessage, BufferJSON, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const { Boom } = require('@hapi/boom')
const P = require("pino")
const { exec } = require('child_process')
const axios = require("axios")
const ms = require("ms")
const pms = require("parse-ms")
const FormData = require('form-data')
const fs = require("fs-extra")
const {config} = require("./config")
const { ok } = require('assert')
const q =
prefix = "/"
dono = [`${config.dono}@s.whatsapp.net`, "557398300193@s.whatsapp.net"]
dono2 = `🟢 7398300193`
imagineFila = []
gemFila = []
tempOn = Date.now()
modoOn = JSON.parse(fs.readFileSync("./modo.txt"));
vip = JSON.parse(fs.readFileSync("./vip.json"));

var Mediadata;
var dataAtual = new Date();
var dia = dataAtual.getDate();
var mes = (dataAtual.getMonth() + 1);
var ano = dataAtual.getFullYear();
var horas = dataAtual.getHours();
var minutos = dataAtual.getMinutes();
// saída: Hoje é dia 15/7 de 2020. Agora são 14:59h.

//FUNÇÕES BÁSICAS 
async function telePost(buf) {
  ti = 'image/jpeg'
  try {
  const form = new FormData()
  form.append("photo", buf, {
    filename: 'blob',ti
  })
  data = await axios({
    method:"post",
    url: "https://telegra.ph/upload",
    data: form
  })
  if(!data) return false
  return {url: "https://telegra.ph"+data.data[0].src, path: data.data[0].src}
  } catch (e) {
    console.log(e)
    return false
  }
}
async function baixarMidia(me) {
  try {
    buffer = await downloadMediaMessage(me, "buffer")
    return buffer
  } catch (e) {
    console.log(e)
    return false
  }
}
function repla(num) {
  i = num.indexOf("@")
  return num.slice(0,i)
}
async function fetchJson(url) {
  try {
    resul = await axios({
      method: "get",
      url: url
    })
    return resul.data
  } catch (e) {
    console.log(e)
    console.log("Deu erro no fetchJson")
    return false
  }
}




exports.sleep = async (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}
//CONECTAR COM O WHATSAPP 
async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState('./login')
  const client = await makeWASocket({
    logger: P({ level: 'silent' }),
    printQRInTerminal: true,
    auth: state,
    markOnlineOnConnect: modoOn,
    keepAliveIntervalMs: 16000
  })
  client.ev.on('creds.update', saveCreds)
  
  client.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update
        //console.log(connection)
        if(connection == "connecting") {
          console.log("Conectando...")
        }
        if(connection === 'close') {
            //const shouldReconnect = (lastDisconnect.error in Boom).output.statusCode !== DisconnectReason.loggedOut
            console.log(DisconnectReason)
            console.log('Conexão fechada por: ', lastDisconnect, ', Reconectando...')
            // reconnect if not logged out
                await delay(3000)
                connectToWhatsApp()
        } else if(connection === 'open') {
            console.log('CONECTADO COM SUCESSO!')
            console.log("#######################")
            console.log("Caso você tenha lido o qrcode agora, espere 10 segundos e depois dê um CTRL+c")
            console.log("#######################")
            await delay(1000*1)
            await client.sendMessage(dono[0], {text: "Bot Online", contextInfo: {expiration: 100*100}})
            console.log("Aviso enviado!")
        }
    })
    console.log("Abrindo navegador...")
    
    client.ev.on('messages.upsert', async m => {
        //client.sendPresenceUpdate('available')
        if(m.messages[0].key.id.startsWith("BAE")) return
        message = m.messages[0]
        message0 = m.messages[0]
        msg = message.message
        if (!msg) return
        message = message
        key = message.key
        fromMe = key.fromMe
        if (key.remoteJid == "status@broadcast") return
        //if (fromMe) return
        from = key.remoteJid
        isGroup = from.includes("@g.us")
        //if (isGroup) return
        jid = isGroup ? key.participant : from
        name = message.pushName ? message.pushName : ""
        //console.log(msg)
        galo = Object.keys(msg)
        galo2 = JSON.stringify(msg, null, 2)
        sumir2 = 0
        isDono = dono.includes(jid)
        isVip = vip.includes(repla(jid))
        isQuote = galo2.includes("quotedMessage")
        isImage = galo.includes("imageMessage")
        isVideo = galo.includes("videoMessage")
        isImage2 = galo2.includes("imageMessage")
        isVideo2 = galo2.includes("videoMessage")
        if(galo2.includes("expiration")) {
        if(galo.includes("extendedTextMessage")) {
        sumir2 = msg.extendedTextMessage.contextInfo.expiration
        }
        }
        sumir = {expiration: sumir2}
        body = galo.includes("conversation") ? msg.conversation : galo.includes("extendedTextMessage") ? msg.extendedTextMessage.text : isImage ? msg.imageMessage.caption : isVideo ? msg.videoMessage.caption : "outra midia"
        args = body.split(" ").slice(1).join().replace(/,/g, " ")
        body = body.toLowerCase()
        isCmd = body.startsWith(prefix) ? true : false
        cmd = body.split(" ")[0]
				//console.log(cmd)
				//console.log(args)
				//console.log(isCmd)
        if (!isGroup && modoOn){
        client.readMessages([key])
        }
        if(modoOn) {
        client.sendPresenceUpdate('available', jid)
        }
        if(!modoOn) {
        client.sendPresenceUpdate('unavailable') // para ficar off
        }
         
        
        //###### FUNÇÕES BÁSICAS #######
        async function _getPageSource(callback) {
          var url = {
              text: callback
          };
          var embed = {
              quoted: message
          };
          await client.sendMessage(from, url, embed);
      }

        async function reply(text) {
          await client.sendMessage(from, {text: text, contextInfo: sumir}, {quoted: message})
        }
        async function reply2(pv, text) {
          await client.sendMessage(pv, {text: text})
        }
        async function fimagine(q, njid, men) {
          try {
                 if(imagineFila.length > 0) {
                   await delay(3000)
                 }
                data = await fetchJson("https://api.megah.tk/imagineAi?q="+encodeURI(q))
                console.log(data)
                if(!data) {
                  imagineFila = []
                  return await client.sendMessage(njid, {text: "Ocorreu um erro na api"}, {quoted: men})
                }
                imagineFila = []
                await client.sendMessage(njid, {image: {url: data.result}, caption: data.msg+"\n\nGerada em: "+data.time, contextInfo: sumir}, {quoted: men})
          } catch (e) {
            console.log(e)
            imagineFila = []
            await client.sendMessage(njid, {text: "Deu erro", contextInfo: sumir}, {quoted: men})
          }
        }
        async function femhd(buf, njid, men) {
          try {
            if(!Buffer.isBuffer(buf)) {
              gemFila = []
              return await client.sendMessage(njid, {text: "Não contém buffer"}, {quoted: men})
            }
            if(gemFila.length > 0) {
              await delay(3000)
            }
            imgLink = await telePost(buf)
            if(!imgLink) {
              gemFila = []
              return await client.sendMessage(njid, {text: "Deu erro no upload da imagem"}, {quoted: men})
            }
            data = await fetchJson("https://api.megah.tk/imgHd?q="+imgLink.url)
            console.log(data)
            if(!data) {
              gemFila = []
              return await client.sendMessage(njid, {text: "Ocorreu um erro na api"}, {quoted: men})
            }
            gemFila = []
            await client.sendMessage(njid, {image: {url: data.result}, caption: data.msg+"\n\nGerada em: "+data.time, contextInfo: sumir}, {quoted: men})
          } catch (e) {
            console.log(e)
            gemFila = []
            await client.sendMessage(njid, {text: "Deu erro", contextInfo: sumir}, {quoted: men})
          }
        }
        
        if(!fromMe && !isGroup) {
          console.log(`\n\nMensagem no privado de ${repla(jid)}\n\nMensagem: ${body}\n\n############`)
        }
        if(!fromMe && isGroup) {
          console.log(`\n\nMensagem no grupo ${from} de ${repla(jid)}\n\nMensagem: ${body}\n\n############`)
        }
        
async function formatNumber(){
  try {
  var nuns = fs.readFileSync("./numeros.txt").toString()
  nuns = nuns.split("\n")
  var nunsF = []
  for (let um of nuns) {
    format = um.replaceAll(" ","").replaceAll("-","").replaceAll("+","").replaceAll("\r", "")+"@s.whatsapp.net"
    nunsF.push(format)
    //console.log(format)
  }
  //console.log(nunsF)
  return nunsF
 } catch(e) {
   console.log(e)
   return []
 }
}

async function massa(texto, njid, de) {
       try {
         await client.sendMessage(njid, {text: "⌛️ Enviando suas mensagens..."})
         numbers = await formatNumber()
         console.log(numbers)
         console.log(texto)
         if(numbers.length < 1) {
           await client.sendMessage(njid, {text: "Nenhum número no arquivo numeros.txt ou algo está errado, veja os logs"})
           return
         }
         await client.sendMessage(njid, {text: "📝 Veja os logs para acompanhar"})
         await delay(2000)
         for (let i = 0; i < numbers.length; i++) {
           await client.sendMessage(numbers[i], {image: {url: "./thierli.jpg"}, mimetype: "image/jpeg", caption: "Neste ano de 2024 começa a corrida para elegermos prefeito(a) e vereadores que irão se comprometer a buscarem soluções e respostas à sociedade por 4 anos!\n\n⚠️ Eu, Thierli Ramos, pré-candidato a Vereador por Nova Viçosa-BA, te deixo essa mensagem...\n\n*NÃO VENDA O SEU VOTO...* Isso determinará os seus próximos 4 anos.\n\nEscolha uma pessoa capacitada que irá lutar por seus direitos e dos seus filhos, pensem neles...\n\nE eu sou o seu candidato onde irei trabalhar para que os nossos direitos sejam respeitados e concluídos.\n\nPense com carinho em quem irá votar, vamos tirar esses sugadores que nada fazem por nosso município.\n\nEles ficam cada vez mais ricos, não fazem nada, enquanto temos que ficar com as migalhas!"}, {quoted: message})
           console.log(`Enviados: ${i+1}/${numbers.length} delay: ${de} segundos`)
           //await client.sendMessage(njid, {text: `Enviados: ${i+1}/${numbers.length}`})
           await delay(de*1000)
         }
         await delay(2000)
         console.log("\nTerminado.")
         await client.sendMessage(njid, {text: "✅ Terminado."})
       } catch(e) {
         console.log(e)
         await client.sendMessage(njid, {text: "deu erro, veja os logs"})
         return
       }
}
        
        switch (cmd) {
          case "/enviar":
            podeUsar = isDono ? true : isVip ? false : false
            if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
            massa(args, dono[0], 15)
            break;

            case "4":
                var result = {};
                result.text = "*\u260e\ufe0f Suporte:*\n\n" + dono2;
                var options = {};
                options.quoted = message;
                await client.sendMessage(jid, result);
                break;
                

            case "/menu":
            case "menu":
                /** @type {string} */
                boasvindas = "Seja Bem vindo(a) a *" + config.nomeLoja + "!* Fique a vontade para escolher alguma das op\u00e7\u00f5es abaixo:\n\n*[1]* Lista 📝\n*[2]* Comprar Internet 30 dias \ud83d\udcc6\n*[3]* Aplicativo \ud83d\udcf1\n*[4]* Suporte \ud83d\udc64";
                _getPageSource(boasvindas);
              reply ("Para ver est\u00e1 mensagem novamente, digite:\n\n*/menu*")
              break;

            case "2":
                /** @type {string} */
                placa2 = "*\u2022Informa\u00e7\u00f5es do produto\u2022*\n\n*\ud83c\udff7\ufe0fValor:* R$" + config.valorLogin + "\n*\ud83d\udcf2Limite:* 1\n*\u231bValidade:* 30 dias\n\n*Pix cel, Thierli, Nubank: 73999423092*";
                _getPageSource(placa2);
                await sleep(1200);
                await client.sendMessage(from, {
                  text: `⚠️ Após o pagamento me envie o comprovante, por gentileza!`});
                  break;
                

          case 'ajuda':
          case '/ajuda':
              await sleep(1200);
              return reply (`🎯 *Ótimo, irei te ajudar!*\n\n*1°:* Senha errada? Volte no app e verifique se tem algum espaço no final do seu usuário ou senha.\n\n*2°:* O App não conecta? Vai no grupo e veja o video pra LIMPAR DADOS E CACHES ou limpre se souber.\n\n*3°:* Verifique se seu saldo está bloqueado enviando um SMS com a palavra S para 8000.\n\n*4°:* NÃO ficar mais de 40 dias sem por créditos!\n\n_Sempre olhe o grupo!_\n_Espero ter ajudado._ 😁`)
        
          case 'iphone':
          case '/iphone':
              await sleep(1200);
              return reply(`*Logo abaixo está o Link do vídeo de como se conectar no iPhone.* 👇🏼\n\n📲 *Link:* https://www.mediafire.com/file/ocvy9smyyc5zvc9/video_iPhone.mp4/file`)

          case '/gb':
              await sleep(1000);
              reply("⌛️ Aguarde...\nEnviando o Link para baixar o WhatsApp GB!")
              await sleep(1500);
              return reply(`📲 Basta clicar no link abaixo para efetuar o Download: \n\nhttps://translate.google.com/website?sl=en&tl=fr&hl=en&client=webapp&u=https://apk-download.co/V993/GBWA9.93@FouadMODS.apk`)

          case "/imagine":
          case "imagine":
            try {
            podeUsar = isDono ? true : isVip ? true : false
            if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
            if(args.length < 1) return reply("Quer gerar o quê?")
            reply("Aguarde... Demora uns 5seg!")
            fimagine(args, from, message)
            imagineFila.push(from) }
            catch (e) {
              console.log(e)
              reply("Não consigo gerar agora.")
            }
            break;

          case "/lista":
            case 'lista':
              case '1':
            await client.sendMessage(from, {
              text: `📱 *ILIMITHI COMANDOS* 📱\n\n*Consultas:*\n*/cpf* _(Consulta qlqr CPF)_\n*/cpf2* _(Consulta qlqr CPF)_\n*/nome* _(Consulta qlqr Nome)_\n*/tel* _(Consulta qlqr número)_\n\n*Baixar Vídeos:*\n*/insta* _(baixa Reels, Storys e fotos)_\n*/video* _(Baixa vídeos do Youtube)_\n*/tik* _(Baixa videos do TikTok)_\n*/face* _(Baixa video do Facebook)_\n\n*Baixar Músicas:*\n*/instaudio* _(Baixa aúdio do vidéo do Insta)_\n*/tikplay* _(Baixa aúdio do video Tiktok)_\n*/spot* _(Baixa música do Spotify)_\n*/sound* _(Baixa música do SoundCloud)_\n\n*Inteligência:*\n*/hd* _(ajeita a imagem para HD)_\n*/ia* _(Cvs c/ a inteligência)_\n*/imagine* _(cria qualquer imagem)_\n*/pop* _(Ver a população mundial)_\n*/ca* _(Calculadora)_\n*/ip* _(Consulta qualquer IP)_\n\n*Downloads:*\n*/gb* _(Envia link do WhatsAppGB)_\n*/apkfab* _(Baixa App's apkfab.com)_\n*/fire* _(Baixa Apk mediafire.com)_\n*/app* _(Envia o App de Internet)_\n*/ajuda* _(Ajuda conectar na Internet)_` });
              await sleep(1500);
              await client.sendMessage(from, {
                text: `⚠️ *Seja VIP e desfrute de todos esses comandos.*\n*Por apenas 20 reais mensais!*\n\n_Quer comprar?_\n_Me envie uma msg:_ ` + dono2 });
     
              break;

          case "/ia":
          case "ia":
            await sleep(1000);
            if(args < 1) return reply("digite alguma coisa depois de /ia")
            try {
            podeUsar = isDono ? true : isVip ? true : false
            if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
            reply("Digitando...")
            data = await fetchJson("https://vihangayt.me/tools/chatgpt2?q="+args)
            if(data || data.status) {
              return reply(data.data)
            } else if(!data || !data.status) {
              data = await fetchJson("https://vihangayt.me/tools/chatgpt3?q="+args)
              if(data || data.status) {
                return reply(data.data)
              } else if(!data || !data.status) {
                data = await fetchJson("https://vihangayt.me/tools/chatgptv4?q="+args)
                if(data || data.status) {
                  return reply(data.data)
                } else {
                  return reply("Deu erro em todas as api")
                }
              }
            } else {
              return reply("Deu erro na api")
            }
            } catch (e) {
              console.log(e)
              reply("Deu erro")
            }
            break;
            
          case "/hd":
            await sleep(1000);
          try {
            podeUsar = isDono ? true : isVip ? true : false
            if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
            if(isImage) {
              reply("Aguarde... Demora uns 10seg!")
              memedia = await baixarMidia(message0)
              femhd(memedia, from, message)
              gemFila.push(from)
            } else if(isQuote && isImage2) {
              reply("Aguarde...")
              message0.message = msg.extendedTextMessage.contextInfo.quotedMessage
              //console.log(message0)
              memedia = await baixarMidia(message0)
              femhd(memedia, from, message)
              gemFila.push(from)
            } else {
              reply("Marque uma imagem com a qualidade ruim")
            }
          } catch (e) {
            console.log(e)
            reply("Deu erro")
          }
            break;

          case "/play":
            await sleep(1000);
            try {
            podeUsar = isDono ? true : isVip ? true : false
            if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
            if(args < 1) return reply("Qual o nome da música?")
            reply("Aguarde... Demora uns 10seg!")
            playData = await fetchJson("https://api.megah.tk/ytmp3?q="+encodeURI(args))
            playData = playData[0]
            await sleep(1500);
            playCap = `🔎 Fonte: ${playData.fonte}\n\n🕰️ Publicado: ${playData.publicado}\n👀 Views: ${playData.views}\n⌛ Duração: ${playData.duracao}\n\n🎵 Enviando sua música, aguarde...`
            await client.sendMessage(from, {
              text: playCap,
              contextInfo: {
                expiration: sumir2,
                externalAdReply: {
                  title: playData.titulo,
                  body: `ILIMITHI Bot`,
                  thumbnailUrl: playData.thumb,
                  mediaType: 1,
                  showAdAttribution: false,
                  renderLargerThumbnail: true
                }
              }
            }, {quoted: message})
            await client.sendMessage(from, {audio: {url: playData.url}, contextInfo: sumir, mimetype: "audio/mpeg"}, {quoted: message})
            } catch (e) {
              await client.sendMessage(from, {text: "deu erro", contextInfo: sumir}, {quoted: message})
              console.log(e)
              console.log("Deu erro music 2")
            }
            break;

          case "/video":
          case "/vídeo":
            try {
            podeUsar = isDono ? true : isVip ? true : false
            if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
            if(args < 1) return reply("Qual o nome do vídeo?")
            data = await fetchJson("https://vihangayt.me/download/ytmp4?url="+encodeURI(args))
            data = data.data
            await sleep(1500);
            playCap = `🔎 Fonte: youtube.com\n\n⌛ Duração: ${data.duration}\n\n▶️ Enviando seu vídeo, aguarde...`
            await client.sendMessage(from, {
              text: playCap,
              contextInfo: {
                expiration: sumir2,
                externalAdReply: {
                  title: data.title,
                  body: "ILIMITHI (box)",
                  thumbnailUrl: data.thumb,
                  mediaType: 1,
                  showAdAttribution: false,
                  renderLargerThumbnail: true
                }
              }
            }, {quoted: message})
            await client.sendMessage(from, {video: {url: data.vid_720p}, fileName: encodeURI(data.title)+".mp4", contextInfo: sumir, mimetype: "video/mp4"}, {quoted: message})
            } catch (e) {
              await client.sendMessage(from, {text: "deu erro", contextInfo: sumir}, {quoted: message})
              console.log(e)
              console.log("Deu erro music 2")
            }
            break;

            case '/listavip':
              if(!isVip)return reply('📵 *ATENÇÃO:* Você não tem permissão!')
              vip = JSON.parse(fs.readFileSync("./vip.json"));
              console.log(args)
              await client.sendMessage(from, {
                text:"*USUÁRIOS ATIVOS:*\n\n"+vip})
                
                           
            break;


            case "/spot":
            await sleep(1000);
            try {
            podeUsar = isDono ? true : isVip ? true : false
            if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
            if(args.length < 1) return reply("Coloque um link depois de /spot")
            if(!args.includes("spotify.com")) return reply("O link tem que ser da Spotify")
            reply("Aguarde... Demora uns 10seg!")
            data = await fetchJson("https://vihangayt.me/download/spotify?url="+encodeURI(args))
            data = data.data
            await sleep(1500);
            spotCap = `🔎 Fonte: Spotify\n\n🔉 Música: ${data.song}\n🎙 Artista: ${data.artist}\n⌛️ Publicado: ${data.release_date}\n📝 Álbum: ${data.album_name}\n\n🎵 Enviando sua música, aguarde...`
            await client.sendMessage(from, {
              text: spotCap,
              contextInfo: {
                expiration: sumir2,
                externalAdReply: {
                  title: data.song,
                  body: `ILIMITHI Bot`,
                  thumbnailUrl: data.cover_url,
                  mediaType: 1,
                  showAdAttribution: false,
                  renderLargerThumbnail: true
                }
              }
            }, {quoted: message})
            await client.sendMessage(from, {audio: {url: data.url}, contextInfo: sumir, mimetype: "audio/mpeg"}, {quoted: message})
            } catch (e) {
              await client.sendMessage(from, {text: "deu erro", contextInfo: sumir}, {quoted: message})
              console.log(e)
              console.log("Deu erro music 2")
            }
            break;

            case "/tik":
            await sleep(1000);
            try {
              podeUsar = isDono ? true : isVip ? true : false
              if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
              if(args.length < 1) return reply("Coloque um link depois de /tik")
              if(!args.includes("tiktok.com")) return reply("O link tem que ser do TikTok")
              reply("Aguarde... Baixando o Vídeo!")
              await sleep(1000);
              console.log(args)
              data = await fetchJson(`https://vihangayt.me/download/tiktok?url=${args}`)
              data = data.data
              //console.log(data)
              if(!data) return reply("Deu erro na api")
              tikTipo = data.status
              tikLink = data.links[0].a
              if(tikTipo == "ok") {
                return await client.sendMessage(from, {video: {url: tikLink}, mimetype:"video/mp4"})
              }
              else {
                return await client.sendMessage(from, {text: "Não identifiquei o tipo da mídia"})
              }
            } catch(e){
              console.log(e)
              reply("Deu erro")
            }
            break;

            case "/tikplay":
            await sleep(1000);
            try {
              podeUsar = isDono ? true : isVip ? true : false
              if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
              if(args.length < 1) return reply("Coloque um link depois de /tik")
              if(!args.includes("tiktok.com")) return reply("O link tem que ser do TikTok")
              reply("Aguarde... Baixando o Áudio!")
              await sleep(1000);
              console.log(args)
              data = await fetchJson(`https://vihangayt.me/download/tiktok?url=${args}`)
              data = data.data
              //console.log(data)
              if(!data) return reply("Deu erro na api")
              tikTipo = data.status
              tikLink = data.links[0].a
              if(tikTipo == "ok") {
                return await client.sendMessage(from, {audio: {url: tikLink}, mimetype:"audio/mpeg"})
              }
              else {
                return await client.sendMessage(from, {text: "Não identifiquei o tipo da mídia"})
              }
            } catch(e){
              console.log(e)
              reply("Deu erro")
            }
            break;

            case "/face":
            await sleep(1000);
            try {
              podeUsar = isDono ? true : isVip ? true : false
              if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
              if(args.length < 1) return reply("Coloque um link depois de /face")
              if(!args.includes("facebook.com")) return reply("O link tem que ser do Facebook")
              reply("Aguarde... Baixando o Vídeo!")
              console.log(args)
              data = await fetchJson(`https://vihangayt.me/download/fb2?url=${args}`)
              data = data.data
              //console.log(data)
              if(!data) return reply("Deu erro na api")
              faceFormat = data.media[0].format
              faceLink = data.media[0].url
              if(faceFormat == "mp4") {
                return await client.sendMessage(from, {video: {url: faceLink}, mimetype:"video/mp4"})
              }
              else {
                return await client.sendMessage(from, {text: "Não identifiquei o tipo da mídia"})
              }
            } catch(e){
              console.log(e)
              reply("Deu erro")
            }
            break;

            case "/apk":
            case "/app":
            case "apk":
            case "app":
            case "3":
            try {
             await client.sendMessage(from, {text: "📱 Enviando Aplicativo..."})
             await client.sendMessage(from, {document: {url: "./ILIMITHI.apk"}, mimetype: "application/vnd.android.package-archive", fileName: config.nomeApp+".apk", caption: "⚠️ *Instale o App, Copie o texto abaixo, abra o App e clique em IMPORTAR!*"}, {quoted: message})
             await sleep(3000);
             reply("vpn://ewogICAgImF1dGgiOiB7CiAgICAgICAgInBhc3N3b3JkIjogbnVsbCwKICAgICAgICAidXNlcm5hbWUiOiBudWxsLAogICAgICAgICJ2MnJheV91dWlkIjogbnVsbAogICAgfSwKICAgICJjYXRlZ29yeSI6IHsKICAgICAgICAiY29sb3IiOiAiI2E5MDdlNCIsCiAgICAgICAgImlkIjogIjE0NzUiLAogICAgICAgICJuYW1lIjogIlZJVk8iLAogICAgICAgICJzb3J0ZXIiOiAiMSIsCiAgICAgICAgInN0YXR1cyI6ICJBQ1RJVkUiLAogICAgICAgICJ1c2VyX2lkIjogIjM2NCIsCiAgICAgICAgImNyZWF0ZWRfYXQiOiAiMjAyMy0xMi0xOSAxNjoyNzozMyIsCiAgICAgICAgInVwZGF0ZWRfYXQiOiAiMjAyMy0xMi0xOSAxNjoyNzo1OCIKICAgIH0sCiAgICAiY2F0ZWdvcnlfaWQiOiAiMTQ3NSIsCiAgICAiY29uZmlnX29wZW52cG4iOiBudWxsLAogICAgImNvbmZpZ19wYXlsb2FkIjogewogICAgICAgICJwYXlsb2FkIjogIltkZWxheV9zcGxpdF1CQ09QWSAvIFtjcmxmXVtjcmxmXSIsCiAgICAgICAgInNuaSI6ICIiCiAgICB9LAogICAgImNvbmZpZ192MnJheSI6IG51bGwsCiAgICAiZGVzY3JpcHRpb24iOiAiVml2byBEaXJlY3QiLAogICAgImRuc19zZXJ2ZXIiOiB7CiAgICAgICAgImRuczEiOiAiMS4xLjEuMSIsCiAgICAgICAgImRuczIiOiAiMS4wLjAuMSIKICAgIH0sCiAgICAiaWNvbiI6ICJodHRwczovL2kuaWJiLmNvL0R6a3A1bVYvNDg3ZjdiMjJmNjgzMTJkMmMxYmJjOTNiMWFlYTQ0NWItMTY5OTQ2NDM0Mjk4My5wbmciLAogICAgImlkIjogIjE2MjY5IiwKICAgICJtb2RlIjogIlNTSF9QUk9YWSIsCiAgICAibmFtZSI6ICJWSVZPIERFTEFZIiwKICAgICJwcm94eSI6IHsKICAgICAgICAiaG9zdCI6ICJici5pbGltaXRoaS5zaG9wIiwKICAgICAgICAicG9ydCI6ICI4MCIKICAgIH0sCiAgICAic2VydmVyIjogewogICAgICAgICJob3N0IjogImJyLmlsaW1pdGhpLnNob3AiLAogICAgICAgICJwb3J0IjogIjgwIgogICAgfSwKICAgICJzb3J0ZXIiOiAiMSIsCiAgICAic3RhdHVzIjogIkFDVElWRSIsCiAgICAidGxzX3ZlcnNpb24iOiAiVExTdjEuMyIsCiAgICAidWRwX3BvcnRzIjogWwogICAgICAgIDczMDAsCiAgICAgICAgNzEwMCwKICAgICAgICA3NjAwLAogICAgICAgIDc3MDAsCiAgICAgICAgNzQwMCwKICAgICAgICA3NTAwLAogICAgICAgIDcyOTksCiAgICAgICAgNzI5OAogICAgXSwKICAgICJ1cmxfY2hlY2tfdXNlciI6ICJodHRwOi8vZ2Rob3N0LnNwYWNlL2FwaS9ici5pbGltaXRoaS5zaG9wOjUwMDAiLAogICAgImNyZWF0ZWRfYXQiOiAiMjAyMy0xMi0xOSAxNjozMTozMiIsCiAgICAidXBkYXRlZF9hdCI6ICIyMDIzLTEyLTE5IDE2OjUyOjUxIiwKICAgICJ1c2VyX2lkIjogIkc5QzFMNFdPLTk1UzMtU0QyTS03WU5CLVhTMFVDMjdLSU5aNiIKfQ==")
            }
            catch (e) {   
              await client.sendMessage(from, {text: "deu erro"})
              console.log(e)
            }
            break;

            case "/apkfab":
            try {
              podeUsar = isDono ? true : isVip ? true : false
              if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
              if(args.length < 1) return reply("Coloque um link depois de /apkfab")
              if(!args.includes("apkfab.com")) return reply("O link tem que ser do apkfab.com")
            data = await fetchJson("https://vihangayt.me/download/apkfab?url="+encodeURI(args))
            data = data.data
            await sleep(1500);
            fabCap = `🔎 Fonte: APK FAB\n\n📝 Titulo: ${data.title}\n📎 Tamanho: ${data.size}\n\n⌛️ Enviando o arquivo, aguarde...`
            await client.sendMessage(from, {text: fabCap})
            await client.sendMessage(from, {document: {url: data.link}, fileName: data.title+".apk", mimetype: "application/vnd.android.package-archive", caption: "📲 *Basta instalar e aproveitar o seu APP.*"}, {quoted: message})
            } catch (e) {
              await client.sendMessage(from, {text: "deu erro", contextInfo: sumir}, {quoted: message})
              console.log(e)
              console.log("Deu erro music 2")
            }
            break;

            case "/fire":
            try {
              podeUsar = isDono ? true : isVip ? true : false
              if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
              if(args.length < 1) return reply("Coloque um link depois de /fire")
              if(!args.includes("mediafire.com")) return reply("O link tem que ser do mediafire")
            data = await fetchJson("https://vihangayt.me/download/mediafire?url="+encodeURI(args))
            data = data.data
            await sleep(1500);
            fireCap = `🔎 Fonte: MediaFire\n\n📝 Titulo: ${data.name}\n📎 Tamanho: ${data.size}\n🗓 Data: ${data.date}\n\n⌛️ Enviando o arquivo, aguarde...`
            await client.sendMessage(from, {text: fireCap})
            await client.sendMessage(from, {document: {url: data.link}, fileName: data.name+".apk", mimetype: "application/vnd.android.package-archive", caption: "📲 *Basta instalar e aproveitar o seu APP.*"}, {quoted: message})
            } catch (e) {
              await client.sendMessage(from, {text: "deu erro", contextInfo: sumir}, {quoted: message})
              console.log(e)
              console.log("Deu erro music 2")
            }
            break;




            case "/pop":
            await sleep(1000);
            try {
              podeUsar = isDono ? true : isVip ? true : false
              if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
              console.log(args)
              data = await fetchJson(`https://vihangayt.me/details/population?q=${args}`)
              data = data.data
              //console.log(data)
              if(!data) return reply("Deu erro na api")
              popLink = data.current
              popLink1 = data.this_year
              popLink2 = data.today
              ipCap = `🔎 *Fonte:* População Mundial\n\n🌎 _Total:_ ${popLink.total} bi\n🧔‍♂️ _Homens:_ ${popLink.male} bi\n👩 _Mulheres:_ ${popLink.female} bi\n\n🗓 *Este Ano:*\n👶 _Nascimentos:_ ${popLink1.births}\n💀 _Mortes:_ ${popLink1.deaths}\n\n🗓 *Hoje:*\n👶 _Nascimentos:_ ${popLink2.births}\n💀 _Mortes:_ ${popLink2.deaths}`
              reply(ipCap)
            }
            catch (e) {   
              await client.sendMessage(from, {text: "deu erro"})
              console.log(e)
            }
            break;
 



              case "/tt":
            await sleep(1000);
            try {
              podeUsar = isDono ? true : isVip ? true : false
              if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
              if(args.length < 1) return reply("Coloque um link depois de /tik")
              if(!args.includes("instagram.com")) return reply("O link tem que ser do instagram")
              reply("Aguarde... Baixando o Vídeo!")
              await sleep(1000);
              console.log(args)
              data = await fetchJson(`https://api.lolhuman.xyz/api/instagram?apikey=6467d1ff2fc0df2f0686f1e0&url=${args}`)
              data = data.data
              //console.log(data)
              if(!data) return reply("Deu erro na api")
              ttTipo = data.status
              ttLink = data.result
              if(ttTipo == "ok") {
                return await client.sendMessage(from, {video: {url: ttLink}, mimetype:"video/mp4"})
              }
              else {
                return await client.sendMessage(from, {text: "Não identifiquei o tipo da mídia"})
              }
            } catch(e){
              console.log(e)
              reply("Deu erro")
            }
            break;


 
            case "/insta":
            await sleep(1000);
            try {
              podeUsar = isDono ? true : isVip ? true : false
              if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
              if(args.length < 1) return reply("Coloque um link depois de /insta")
              if(!args.includes("instagram.com")) return reply("O link tem que ser do instagram")
              reply("Aguarde... Baixando o Vídeo/Imagem!")
              console.log(args)
              data = await fetchJson(`https://api.lolhuman.xyz/api/instagram?apikey=6467d1ff2fc0df2f0686f1e0&url=${args}`)
              data = data
              //console.log(data)
              if(!data) return reply("Deu erro na api")
              instaTipo = data.type
              instaLink = data.url_download
              if(instaTipo == "video") {
                return await client.sendMessage(from, {video: {url: instaLink}, mimetype:"video/mp4"})
              } else if(instaTipo == "imagen") {
                return await client.sendMessage(from, {image: {url: instaLink}})
              } else {
                return await client.sendMessage(from, {text: "Não identifiquei o tipo da mídia"})
              }
            } catch(e){
              console.log(e)
              reply("Deu erro")
            }
            break;



            case "/instaudio":
            await sleep(1000);
            try {
              podeUsar = isDono ? true : isVip ? true : false
              if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
              if(args.length < 1) return reply("Coloque um link depois de /insta")
              if(!args.includes("instagram.com")) return reply("O link tem que ser do instagram")
              reply("Aguarde... Baixando o Áudio!")
              console.log(args)
              data = await fetchJson(`https://api-brunosobrino-dcaf9040.koyeb.app/api/v1/igdl?url=${args}`)
              data = data.data
              //console.log(data)
              if(!data) return reply("Deu erro na api")
              instaTipo = data.data[0].type
              instaLink = data.data[0].url_download
              if(instaTipo == "video") {
                return await client.sendMessage(from, {audio: {url: instaLink}, mimetype:"audio/mpeg"})
              } else {
                return await client.sendMessage(from, {text: "Não identifiquei o tipo da mídia"})
              }
            } catch(e){
              console.log(e)
              reply("Deu erro")
            }
            break;


         
          case '/pix':
          const value = parseFloat(q);
          await client.sendMessage(from, {
              text: `💸 *ILIMITHI 5G  -  Pagamentos* 💸\n\n_Valor a pagar está correto? (confirme antes)_\n\n*Efetue o pagamento no valor de R$30,00 usando o PIX Copia e Cola abaixo:* 👇 
        ` });
        function sleep(milliseconds) {
          return new Promise(resolve => setTimeout(resolve, milliseconds))
      }
        await sleep(2000);
        await client.sendMessage(from, {
          text: `00020126470014br.gov.bcb.pix0125thierli_souza@hotmail.com5204000053039865802BR5922Thierli de Souza Ramos6008Brasilia62080504mpda63044E44` });
          await sleep(1500);
          await client.sendMessage(from, {
              text: `⚠️ *Após pagar, me envie o comprovante por gentileza.* ⚠️`});
          break;


          case 'horas':
          case '/horas':
          case 'hr':
          case '/hr':
            await sleep(1500);
            if(args < 1) return reply(`⏰ São ${dataAtual.getHours()}h e ${dataAtual.getMinutes()} minutos.`)
        break;




        case '/data':
          await sleep(1500);
          if(args < 1) return reply(`🗓 Hoje é dia ${dataAtual.getDate()}/${(dataAtual.getMonth() + 1)} de ${dataAtual.getFullYear()}`)
        break;



     
          case "/addvip":
            if(!isDono) return reply("🔐 Apenas meu dono pode usar!")
            if(args < 1) return reply("Cadê o número?")
            vip = JSON.parse(fs.readFileSync("./vip.json"));
            args = args.replaceAll("+","").replaceAll(" ","").replaceAll("-","")
            console.log(args)
            if(vip.includes(args)) return reply("Essa pessoa já é vip. 🫡")
            vip.push(args)
            await fs.writeFileSync("./vip.json", JSON.stringify(vip, null, 2))
            reply("Adicionado com sucesso!")
            break;
          case "/delvip":
            if(!isDono) return reply("🔐 Apenas meu dono pode usar esse comando!")
            if(args < 1) return reply("Cadê o número do sujeito?")
            vip = JSON.parse(fs.readFileSync("./vip.json"));
            args = args.replaceAll("+","").replaceAll(" ","").replaceAll("-","")
            console.log(args)
            if(!vip.includes(args)) return reply("Ué, essa pessoa não está no sistema")
            i = vip.indexOf(args)
            vip.splice(i,1)
            await fs.writeFileSync("./vip.json", JSON.stringify(vip, null, 2))
            reply("Removido com sucesso!")
            break;






            case "/yn":
              async function baixarMusica10(mensagemCompleta) {
                try {
                  const podeUsar = isDono || isVip; // Simplificado a verificação
                  if (!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!");
                  
                  reply("⌛️ *Aguarde... Estou buscando!*");
                  await sleep(1000);
                  
                  const partes = mensagemCompleta.split(" ");
                  const args = partes.slice(1);
                  
                  if (args.length < 1) return reply("Coloque um link do YouTube depois de /yn");
                  
                  const urlYouTube = args[0];
                  console.log(`Comando recebido: ${mensagemCompleta}`);
                  
                  // Extrair ID do vídeo diretamente da URL
                  const idVideo = extrairIdVideo(urlYouTube.trim());
                  if (!idVideo) return reply("Link inválido!");
            
                  console.log(`ID do vídeo: ${idVideo}`);
                  
                  const url = `https://youtube-mp3-audio-video-downloader.p.rapidapi.com/download-mp3/${idVideo}`;
                  const headers = {
                    "x-rapidapi-key": "99bb57d209mshb6ca809dc147a3ep1a51e7jsnf829ae92aef6",
                    "x-rapidapi-host": "youtube-mp3-audio-video-downloader.p.rapidapi.com"
                  };
            
                  const resposta = await axios.get(url, { headers, responseType: 'arraybuffer' });
                  console.log(`Status da resposta do download: ${resposta.status}`);
                  
                  if (resposta.status === 200 && resposta.data) {
                    const musica = Buffer.from(resposta.data, 'binary');
                    const detalhesMusica = await obterDetalhesMusica10(idVideo);
            
                    console.log(`Detalhes da música: ${JSON.stringify(detalhesMusica)}`);
            
                    if (detalhesMusica && detalhesMusica.title) {
                      reply(`📝 *Título:* ${detalhesMusica.title}\n\n⏳ *Duração:* ${detalhesMusica.duration}\n📎 *Formato:* audio/mpeg`);
                      return await client.sendMessage(from, { audio: musica, mimetype: "audio/mpeg" });
                    } else {
                      reply("Detalhes da música não encontrados.");
                    }
                  } else {
                    reply(`Erro ao baixar a música! Código de resposta: ${resposta.status}`);
                  }
                } catch (erro) {
                  console.log(`Erro ao enviar música: ${erro.message}`);
                  reply(`Erro ao enviar música! ${erro.message}`);
                }
              }
            
              // Função para extrair o ID do vídeo da URL
              function extrairIdVideo(url) {
                const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/;
                const match = url.match(regex);
                return match ? match[1] : null;
              }
            
              async function obterDetalhesMusica10(videoId) {
                const apiKey = 'AIzaSyCYmdWQwcEgLR3oZ10Qxif0X7nUNEUWLqY';
                const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${apiKey}`;
            
                try {
                  const resposta = await axios.get(url);
                  console.log(`Resposta da API do YouTube: ${JSON.stringify(resposta.data)}`);
                  
                  if (resposta.data.items.length === 0) {
                    throw new Error("Vídeo não encontrado");
                  }
                  
                  const videoDetails = resposta.data.items[0].snippet;
                  return {
                    title: videoDetails.title,
                    duration: videoDetails.duration // Certifique-se de que a duração está sendo retornada corretamente
                  };
                } catch (erro) {
                  console.error(`Erro ao obter detalhes da música: ${erro.message}`);
                  throw erro; // Propaga o erro para o chamador
                }
              }
            
              // Exemplo de como chamar a função
              const mensagemCompleta = "/yn https://www.youtube.com/watch?v=HLCzpwxkT4A"; // Exemplo de mensagem
              baixarMusica10(mensagemCompleta); // Passando a mensagem completa para a função
              break;





            // CONSULTAS DE CPF, NOMES, TELEFONE E ETC...
            

            case "/bin":
            try {
              podeUsar = isDono ? true : isVip ? true : false
              if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
              reply("Aguarde... Estou buscando!");
              await sleep(1000);

        // Verifica se um número de BIN foi fornecido
        if (args.length < 1) {
            await client.sendMessage(from, { text: 'Por favor, insira um número de BIN após o comando /bin.' });
            return;
        }

        const bin_number = args[0];  // Assume que o usuário fornece o número de BIN como argumento

        const headers = {
            "X-RapidAPI-Key": "99bb57d209mshb6ca809dc147a3ep1a51e7jsnf829ae92aef6",
            "X-RapidAPI-Host": "bin-ip-checker.p.rapidapi.com",
            "Content-Type": "application/json",
        };

        // URL da API com args no final
        const response = await fetch(`https://bin-ip-checker.p.rapidapi.com/?bin=${args}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ bin: bin_number }),
        });

        if (!response.ok) {
            await client.sendMessage(from, { text: "Erro na API: " + response.status });
            return;
        }

        const data = await response.json();

        // Debug: Imprima a resposta da API
        console.log("Resposta da API:", data);

        if ('BIN' in data) {
            const result = (
                `📍 ▸ BIN Identificada: ${data.BIN.number}\n\n` +
                `💳 ▸ Tipo: ${data.BIN.type}\n` +
                `📶 ▸ Level: ${data.BIN.level}\n` +
                `🏳️ ▸ Bandeira: ${data.BIN.scheme}\n` +
                `🏦 ▸ Banco: ${data.BIN.issuer.name}\n` +
                `🌎 ▸ País: ${data.BIN.country.name}\n` +
                `💰 ▸ Moeda: ${data.BIN.country.currency}\n` +
                `🏠 ▸ Capital: ${data.BIN.country.capital}\n`
            );
            await client.sendMessage(from, { text: result });  // Retorna para a conversa com a mensagem
        } else {
            await client.sendMessage(from, { text: "BIN não encontrada!" });
        }
    } catch (err) {
        console.error(`Erro ao processar a solicitação: ${err}`);
        await client.sendMessage(from, { text: "Erro ao buscar BIN!" });
    }
    break;



            //pronto
            case "/ip":
            try {
              podeUsar = isDono ? true : isVip ? true : false
              if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
              reply("Aguarde... Estou buscando!");
              await sleep(1000);

              const url = (`https://ip-geo-location.p.rapidapi.com/ip/check?format=json&language=pt&filter=${args}`);
              const headers = {
                "x-rapidapi-key": "99bb57d209mshb6ca809dc147a3ep1a51e7jsnf829ae92aef6",
                "x-rapidapi-host": "ip-geo-location.p.rapidapi.com",
              };

              console.log(`https://ip-geo-location.p.rapidapi.com/ip/check?format=json&language=pt&filter=${args}`);

              const response = await fetch(url, {
                method: "GET",
                headers,
              });

              const data = await response.json();
              if (data) {
              reply(`🌐 ▸ *IP Identificado:* ${data.ip}\n\n🛜 ▸ *Organização:* ${data.asn.organisation}\n🌎 ▸ *País:* ${data.country.name}\n📌 ▸ *Região:* ${data.country.capital}\n🏠 ▸ *Cidade:* ${data.city.name}\n👥 ▸ *População:* ${data.country.population}\n📈 ▸ *Latitude:* ${data.location.latitude}\n📉 ▸ *Longitude:* ${data.location.longitude}\n⏲️ ▸ *Fuso Horário:* ${data.time.timezone}`);
            }} catch (error) {
              console.error(error);
              reply("Erro ao buscar informações!");
            }
            break;


            // BAIXAR MUSICAS NO YOUTUBE
            case "/yt":
    try {
      podeUsar = isDono ? true : isVip ? true : false
      if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")

        // Log da mensagem completa para verificar a estrutura
        console.log("Mensagem recebida:", message); 

        // Acessar o texto da mensagem
        const text = message.message.conversation; // Acessando o texto da conversa
        console.log(`Texto da mensagem: ${text}`); // Depuração

        // Verifica se a mensagem foi fornecida
        if (!text || !text.startsWith('/yt')) {
            await client.sendMessage(from, { text: 'Por favor, insira a URL do vídeo do YouTube após o comando /yt.' });
            return;
        }

        const args = text.split(' '); // Divide a mensagem em partes

        if (args.length < 2) { // Verifica se a URL foi fornecida
            await client.sendMessage(from, { text: 'Por favor, insira a URL do vídeo do YouTube após o comando /yt.' });
            return;
        }

        // Captura a URL completa
        const video_url = args.slice(1).join(' '); // Junta todos os argumentos após o comando

        console.log(`URL do vídeo capturada: ${video_url}`); // Depuração

        const request_url = `https://yt-search-and-download-mp3.p.rapidapi.com/mp3?url=${encodeURIComponent(video_url)}`;

        console.log(`Fazendo requisição para: ${request_url}`); // Depuração

        const response = await fetch(request_url, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': "99bb57d209mshb6ca809dc147a3ep1a51e7jsnf829ae92aef6",
                'x-rapidapi-host': "yt-search-and-download-mp3.p.rapidapi.com"
            }
        });

        if (!response.ok) {
            const errorText = await response.text(); // Obter texto de erro
            console.error(`Erro na API: ${errorText}`); // Log do erro
            await client.sendMessage(from, { text: "Erro ao buscar informações! Tente novamente." });
            return;
        }

        const response_data = await response.json();
        console.log("Dados da resposta:", response_data); // Depuração

        if (response_data.success) {
            const download_link = response_data.download;

            // Mensagem para o usuário enquanto aguarda o envio do áudio
            await client.sendMessage(from, { text: "🎵 Aguarde... Enviando o áudio!" });

            // Baixar o arquivo MP3 usando a URL de download
            const mp3_response = await fetch(download_link);

            if (mp3_response.ok) {
                const audio_buffer = await mp3_response.arrayBuffer(); // Obtém o buffer do arquivo como ArrayBuffer

                // Envia o áudio para o usuário
                await client.sendMessage(from, {
                    audio: { url: download_link },
                    title: response_data.title
                });
            } else {
                await client.sendMessage(from, { text: "Erro ao baixar o arquivo MP3. Tente novamente." });
            }
        } else {
            await client.sendMessage(from, { text: "Erro ao buscar a música. Tente novamente." });
        }
    } catch (err) {
        console.error(`Erro ao processar a solicitação: ${err}`);
        await client.sendMessage(from, { text: "Erro ao buscar informações! Verifique a conexão com a API." });
    }
    break;



    // BAIXA VIDEOS DE QLQR
    case "/all":
    try {
        // Verifica se a URL foi fornecida
        const text = message.message.conversation;
        const args = text.split(' ');

        if (args.length < 2) { // Verifica se a URL foi fornecida
            await client.sendMessage(from, { text: 'Por favor, insira a URL do conteúdo que deseja baixar após o comando /all.' });
            return;
        }

        const content_url = args.slice(1).join(' '); // Captura a URL completa
        console.log(`URL do conteúdo capturada: ${content_url}`); // Depuração

        // Verificação de autorização
        const podeUsar = isDono ? true : isVip ? true : false;
        if (!podeUsar) {
            await client.sendMessage(from, { text: "🔐 Apenas pessoas autorizadas podem usar!" });
            return;
        }

        // Enviando a requisição para a API
        const request_url = "https://all-video-downloader1.p.rapidapi.com/all";
        const payload = new URLSearchParams({ url: content_url });

        const response = await fetch(request_url, {
            method: 'POST',
            headers: {
                'x-rapidapi-key': "99bb57d209mshb6ca809dc147a3ep1a51e7jsnf829ae92aef6",
                'x-rapidapi-host': "all-video-downloader1.p.rapidapi.com",
                'Content-Type': "application/x-www-form-urlencoded"
            },
            body: payload
        });

        if (!response.ok) {
            const errorText = await response.text(); // Obter texto de erro
            console.error(`Erro na API: ${errorText}`); // Log do erro
            await client.sendMessage(from, { text: "Erro ao buscar informações! Tente novamente." });
            return;
        }

        const response_data = await response.json();
        console.log("Dados da resposta:", response_data); // Depuração

        if (response_data.url) {
            await client.sendMessage(from, { text: "▶️ *Aguarde... Enviando o arquivo!*" });
            await sleep(1000); // Aguardar um segundo

            // Baixar o arquivo usando a URL de download
            const file_response = await fetch(response_data.url);

            if (file_response.ok) {
                const file_buffer = await file_response.arrayBuffer(); // Obtém o buffer do arquivo como ArrayBuffer

                // Enviar o arquivo como vídeo
                await client.sendMessage(from, {
                    video: { url: response_data.url },
                    caption: "*Descrição:*\n" + response_data.description // Usar o título como legenda
                });
            } else {
                await client.sendMessage(from, { text: "Erro ao baixar o arquivo. Tente novamente." });
            }
        } else {
            await client.sendMessage(from, { text: "Erro ao buscar o conteúdo. Tente novamente." });
        }
    } catch (err) {
        console.error(`Erro ao processar a solicitação: ${err}`);
        await client.sendMessage(from, { text: "Erro ao buscar informações! Verifique a conexão com a API." });
    }
    break;



    // BAIXA STORY DO INSTAGRAM COM O ID
    case "/story":
    try {

        // Verifica se o ID do story foi fornecido
        const text = message.message.conversation;
        const args = text.split(' ');

        if (args.length < 2) { // Verifica se o ID foi fornecido
            await client.sendMessage(from, { text: 'Por favor, insira o ID do story após o comando /story.' });
            return;
        }

        const story_id = args[1]; // Captura o ID do story
        console.log(`ID do story capturado: ${story_id}`); // Depuração

        const request_url = `https://instagram-scrapper-posts-reels-stories-downloader.p.rapidapi.com/story_by_id?id=${story_id}`;
        const headers = {
            'x-rapidapi-key': "99bb57d209mshb6ca809dc147a3ep1a51e7jsnf829ae92aef6",
            'x-rapidapi-host': "instagram-scrapper-posts-reels-stories-downloader.p.rapidapi.com"
        };

        // Enviando a requisição para obter o story pelo ID
        const response = await fetch(request_url, { headers });

        if (!response.ok) {
            const errorText = await response.text(); // Obter texto de erro
            console.error(`Erro na API: ${errorText}`); // Log do erro
            await client.sendMessage(from, { text: "Erro ao buscar informações! Tente novamente." });
            return;
        }

        const response_data = await response.json();
        console.log("Dados da resposta:", response_data); // Depuração

        if (response_data.video_versions && response_data.video_versions.length > 0) {
            await client.sendMessage(from, { text: "▶️ *Aguarde... Enviando o Story!*" });

            // Obter o link do vídeo
            const video_data = response_data.video_versions[0]; // Usar a primeira versão do vídeo
            const download_link = video_data.url;

            // Obter o nome completo do usuário            
            const user_full_name = response_data.user.full_name; // Nome completo do usuário

            // Baixar o arquivo
            const file_response = await fetch(download_link);

            if (file_response.ok) {
                const file_buffer = await file_response.arrayBuffer(); // Obtém o buffer do arquivo como ArrayBuffer

                // Enviar o arquivo MP4 ao usuário
                await client.sendMessage(from, {
                    video: { url: download_link },
                    caption: `Story de ${user_full_name}` //Usar o nome completo do usuário na legenda
                });
            } else {
                await client.sendMessage(from, { text: "Erro ao baixar o vídeo. Tente novamente." });
            }
        } else {
            await client.sendMessage(from, { text: "Erro ao buscar o story. Tente novamente." });
        }
    } catch (err) {
        console.error(`Erro ao processar a solicitação: ${err}`);
        await client.sendMessage(from, { text: "Erro ao buscar informações! Verifique a conexão com a API." });
    }
    break;


            // CODIGOS PARA CONSULTAS CPF, TEL, NOME
          case "/cpf":
            try {
            podeUsar = isDono ? true : isVip ? true : false
            if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
            if(args < 1) return reply("🤔 Cadê o CPF?")
            reply("🔎 *Aguarde... Estou buscando!*")
            await sleep(2000);
            cpf2Data = await fetchJson(`http://api2.minerdapifoda.xyz:8080/api/cpf3?cpf=${args}`)
            cpf2Data = cpf2Data.Resultado
            console.log(cpf2Data.Resultado)

            await client.sendMessage(from, {text: cpf2Data, contextInfo: sumir}, {quoted: message})
            } catch (e) {
              await client.sendMessage(from, {text: "❌ Não foi encontrado informações para o CPF informado.", contextInfo: sumir}, {quoted: message})
              console.log(e)
              console.log("Deu erro no CPF")
            }
            break;
            
            
            case "/cpf1":
    try {
        // Verifica se o usuário é dono ou VIP
        const podeUsar = isDono ? true : isVip ? true : false;
        if (!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!");

        // Verifica se um CPF foi fornecido
        if (args.length < 1) return reply("🤔 Cadê o CPF?");
        
        reply("🔎 *Aguarde... Estou buscando!*");
        await sleep(2000); // Aguarda 2 segundos

        const api_url = `http://api2.minerdapifoda.xyz:8080/api/cpf6?cpf=${args}`; // Usando args diretamente na URL

        const response = await fetch(api_url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        if ('Resultado' in data) {
            const resultado = data['Resultado'];
            let all_info_message = ["🔍 *CONSULTA ILIMITHI CPF 1* 🔍\n"];

            // Extraindo informações de todas as tabelas, independentemente de seus nomes
            for (const table in resultado) {
                for (const entry of resultado[table]) {
                    for (const [key, value] of Object.entries(entry)) {
                        all_info_message.push(`${key}: ${value}`);
                    }
                    all_info_message.push("------------\n"); // Separador entre entradas
                }
            }

            await client.sendMessage(from, { text: all_info_message.join('\n') }); // Envia a resposta
        } else {
            await client.sendMessage(from, { text: 'Erro ao processar a resposta da API.' });
        }
    } catch (e) {
        await client.sendMessage(from, { text: "❌ Não foi encontrada informações para o CPF informado." });
        console.log(e);
        console.log("Deu erro no CPF");
    }
    break;


    case "/cpf2":
    try {
        // Verifica se o usuário é dono ou VIP
        const podeUsar = isDono ? true : isVip ? true : false;
        if (!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!");

        // Verifica se um CPF foi fornecido
        if (args.length < 1) return reply("🤔 Cadê o CPF?");
        
        reply("🔎 *Aguarde... Estou buscando!*");
        await sleep(2000); // Aguarda 2 segundos

        const api_url = `http://api2.minerdapifoda.xyz:8080/api/cpf?cpf=${args}`; // URL da API com args

        const response = await fetch(api_url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        if ('Resultado' in data && data['Resultado'].length > 0) {
            const resultado = data['Resultado'];
            let resultado_html = "🔍 *CONSULTA ILIMITHI CPF 2* 🔍\n\n";

            // Extraindo informações do resultado
            if (resultado[0] && resultado[0][0]) {
                const info1 = resultado[0][0];
                resultado_html += `▸ *CPF:* ${info1.CPF}\n`;
                resultado_html += `▸ *Nome:* ${info1.NOME}\n`;
                resultado_html += `▸ *DDD:* ${info1.DDD}\n`;
                resultado_html += `▸ *Telefone:* ${info1.TELEFONE}\n`;
                resultado_html += `▸ *Sexo:* ${info1.SEXO}\n`;
                resultado_html += `▸ *Bairro:* ${info1.BAIRRO}\n`;
                resultado_html += `▸ *Cidade:* ${info1.CIDADE}\n`;
                resultado_html += `▸ *UF:* ${info1.UF}\n`;
                resultado_html += `▸ *CEP:* ${info1.CEP}\n`;
                resultado_html += `▸ *Logradouro:* ${info1.LOGR_TITULO} ${info1.LOGR_NOME}, ${info1.lOGR_NUMERO}\n`;
                resultado_html += `▸ *Data de Nascimento:* ${info1.NASC}\n`;
                resultado_html += `▸ *Nome da Mãe:* ${info1.NOME_MAE}\n`;
                resultado_html += `▸ *Estado Civil:* ${info1.ESTCIV}\n`;
                resultado_html += `▸ *Renda:* R$ ${info1.RENDA}\n`;
            }

            if (resultado[1] && resultado[1][0]) {
                const info2 = resultado[1][0];
                resultado_html += `\n*Informações Adicionais:*\n`;
                resultado_html += `▸ *CPF:* ${info2.cpf}\n`;
                resultado_html += `▸ *Nome:* ${info2.nome}\n`;
                resultado_html += `▸ *Sexo:* ${info2.sexo}\n`;
                resultado_html += `▸ *Nascimento:* ${info2.nascimento}\n`;
            }

            await client.sendMessage(from, { text: resultado_html }); // Envia a resposta
        } else {
            await client.sendMessage(from, { text: 'Nenhum resultado encontrado.' });
        }
    } catch (err) {
        await client.sendMessage(from, { text: `❌ Erro ao buscar dados: ${err.message}` });
        console.log(err);
        console.log("Deu erro no CPF");
    }
    break;


    case "/cpf3":
    try {
        // Verifica se o usuário é dono ou VIP
        const podeUsar = isDono ? true : isVip ? true : false;
        if (!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!");

        // Verifica se um CPF foi fornecido
        if (args.length < 1) return reply("🤔 Cadê o CPF?");
        
        reply("🔎 *Aguarde... Estou buscando!*");
        await sleep(2000); // Aguarda 2 segundos

        const api_url = `http://api2.minerdapifoda.xyz:8080/api/cpf2?cpf=${args}`; // URL da API com args

        const response = await fetch(api_url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        if ('response' in data) {
            const response_data = data['response'];

            // Montar a resposta formatada
            let resultado_html = "🔍 *CONSULTA ILIMITHI CPF 3* 🔍\n\n";

            // Separar os registros por '\n'
            const registros = response_data.split('\n');
            let registro_atual = '';
            for (const registro of registros) {
                if (registro.trim()) { // Ignorar linhas vazias
                    if (registro.includes('(1):') || registro.includes('(2):')) {
                        // Se já houver um registro em construção, adicione-o ao resultado
                        if (registro_atual) {
                            resultado_html += registro_atual + '\n\n-------------------------\n\n'; // Adiciona separador
                            registro_atual = ''; // Reinicia o registro atual
                        }
                    }
                    // Adiciona registro à construção atual
                    registro_atual += registro.trim() + '\n';
                }
            }

            // Adiciona o último registro se existir
            if (registro_atual) {
                resultado_html += registro_atual.trim();
            }

            await client.sendMessage(from, { text: resultado_html.trim() }); // Envia a resposta
        } else {
            await client.sendMessage(from, { text: 'Nenhum resultado encontrado.' });
        }
    } catch (err) {
        await client.sendMessage(from, { text: `❌ Erro ao buscar dados: ${err.message}` });
        console.log(err);
        console.log("Deu erro no CPF");
    }
    break;


    case "/cpf4":
    try {
        // Verifica se o usuário é dono ou VIP
        const podeUsar = isDono ? true : isVip ? true : false;
        if (!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!");

        // Verifica se um CPF foi fornecido
        if (args.length < 1) return reply("🤔 Cadê o CPF?");
        
        reply("🔎 *Aguarde... Estou buscando!*");
        await sleep(2000); // Aguarda 2 segundos

        const api_url = `http://api2.minerdapifoda.xyz:8080/api/buscarPorCPF?cpf=${args}`; // URL da API com args

        const response = await fetch(api_url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        if ('Resultado' in data) {
            let resultado_html = "🔍 *CONSULTA ILIMITHI CPF 5* 🔍\n\n";

            // Iterar sobre os resultados
            for (const item of data['Resultado']) {
                // Extrair DADOS
                if ('DADOS' in item) {
                    for (const dado of item['DADOS']) {
                        const cpf_valor = dado.cpf || 'N/A';
                        const nome_valor = dado.nome || 'N/A';
                        resultado_html += `▸ *CPF:* ${cpf_valor}\n▸ *Nome:* ${nome_valor}\n\n`;
                    }
                }

                // Extrair telefone
                if ('telefone' in item) {
                    for (const telefone of item['telefone']) {
                        const ddd_valor = telefone.ddd || 'N/A';
                        const telefone_valor = telefone.telefone || 'N/A';
                        resultado_html += `▸ *DDD:* ${ddd_valor}\n▸ *Telefone:* ${telefone_valor}\n\n`;
                    }
                }

                // Extraindo email se necessário
                if ('email' in item) {
                    for (const email of item['email']) {
                        const email_valor = email.email || 'N/A';
                        resultado_html += `▸ *Email:* ${email_valor}\n\n`;
                    }
                }
            }

            await client.sendMessage(from, { text: resultado_html.trim() }); // Envia a resposta
        } else {
            await client.sendMessage(from, { text: 'Nenhum resultado encontrado.' });
        }
    } catch (err) {
        await client.sendMessage(from, { text: `❌ Erro ao buscar dados: ${err.message}` });
        console.log(err);
        console.log("Deu erro no CPF");
    }
    break;


    case "/tel":
    try {
        podeUsar = isDono ? true : isVip ? true : false
        if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
        if(args < 1) return reply("🤔 Cadê o Número?")
        reply("📞 *Aguarde... Estou buscando!*")
        await sleep(2000);
        telData = await fetchJson(`http://api2.minerdapifoda.xyz:8080/api/telefones2?telefone=${args}`)
        telData = telData.Resultado
        tabelas = Object.keys(telData).map(i => telData[i])
        tabela1 = tabelas[0][0]
        tabela2 = tabelas[1][0]
        tabela3 = tabelas[2][0]
        console.log(telData.Resultado)
        
        telNum = ""
        if(telData.telefone > 0) {
          for (tels of telData.telefone) {
            telNum += tels+"\n"
          }
        } else {
          telNum += "Sem informação\n"
        }
        //console.log(cpfData)
                  telText = `
📞 *Telefone Informado:* ${tabela1.telefone}

📌 _Dados Encontrados_ 📌

▸ *Nome:* ${tabela1.nome}
▸ *CPF:* ${tabela1.cpf}
▸ *Tipo de Pessoa:* ${tabela1.TIPO_PESSOA}
▸ *Data Instalação:* ${tabela1.DATA_INSTALACAO}
▸ *Telefone Secundário:* ${tabela1.telefone_sec}

▸ *Telefones:* ${tabela1.telefone}

🏠 _Endereço Vinculado_ 🏠

▸ *Rua:* ${tabela2.rua}
▸ *Bairro:* ${tabela2.bairro}
▸ *Número:* ${tabela2.num}
▸ *Complemento:* ${tabela2.compl}
▸ *Cep:* ${tabela2.cep}
      
🏡 _Local de Nascimento_ 🏡
       
▸ *UF:* ${tabela2.uf}
`
await client.sendMessage(from, {text: telText, contextInfo: sumir}, {quoted: message})
                  } catch (e) {
                    await client.sendMessage(from, {text: "❌ Não foi encontrado informações para o número informado.", contextInfo: sumir}, {quoted: message})
                    console.log(e)
                    console.log("Deu erro no Numero")
                  }
                  break;


    case "/tel2":
      try {
          // Verifica se o usuário é dono ou VIP
          const podeUsar = isDono ? true : isVip ? true : false;
          if (!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!");
  
          // Verifica se um telefone foi fornecido
          if (args < 1) return reply("🤔 Cadê o telefone?");
          
          reply("📞 Aguarde... Estou buscando!");
          await sleep(2000); // Aguarda 2 segundos
  
          
          // URL da API com args
          const api_url = `http://api2.minerdapifoda.xyz:8080/api/telefones3?telefone=${args}`; // Usa args como solicitado
  
          const response = await fetch(api_url);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
          const data = await response.json();
  
          if ('Resultado' in data) {
              let resultado_html = "📞 *RESULTADO DO TELEFONE* 📞\n\n";
  
              // Iterar sobre os resultados
              for (const item of data['Resultado']) {
                  if ('vivo_pre32_tel' in item) {
                      for (const telefone_info of item['vivo_pre32_tel']) {
                          const nome = telefone_info.nome || 'N/A';
                          const cpf = telefone_info.cpf || 'N/A';
                          const uf = telefone_info.uf || 'N/A';
                          const data_instalacao = telefone_info.DATA_INSTALACAO || 'N/A';
                          const rua = telefone_info.rua || 'N/A';
                          const num = telefone_info.num || 'N/A';
                          const compl = telefone_info.compl || 'N/A';
                          const bairro = telefone_info.bairro || 'N/A';
                          const cep = telefone_info.cep || 'N/A';
  
                          resultado_html += `▸ *Nome:* ${nome}\n`;
                          resultado_html += `▸ *CPF:* ${cpf}\n`;
                          resultado_html += `▸ *UF:* ${uf}\n`;
                          resultado_html += `▸ *Data de Instalação:* ${data_instalacao}\n`;
                          resultado_html += `▸ *Rua:* ${rua}\n`;
                          resultado_html += `▸ *Número:* ${num}\n`;
                          resultado_html += `▸ *Complemento:* ${compl}\n`;
                          resultado_html += `▸ *Bairro:* ${bairro}\n`;
                          resultado_html += `▸ *CEP:* ${cep}\n`;
                      }
                  }
              }
  
              await client.sendMessage(from, { text: resultado_html.trim() }); // Envia a resposta
          } else {
              await client.sendMessage(from, { text: 'Nenhum resultado encontrado.' });
          }
      } catch (err) {
          await client.sendMessage(from, { text: `❌ Erro ao buscar dados` });
          console.log(err);
          console.log("Deu erro no telefone");
      }
      break;


            
            //pronto
          case "/nome":
            try {
            podeUsar = isDono ? true : isVip ? true : false
            if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
            if(args < 1) return reply("🤔 Cadê o Nome?")
            reply("🔎 Aguarde... Estou buscando!")
            await sleep(2000);
            nomeData = await fetchJson(`http://api2.minerdapifoda.xyz:8080/api/nomes?nome=${args}`)
            nomeData = nomeData.Resultado
            console.log(nomeData.Resultado)

await client.sendMessage(from, {text: nomeData, contextInfo: sumir}, {quoted: message})
            } catch (e) {
              await client.sendMessage(from, {text: "❌ Não foi encontrado informações para o nome informado.", contextInfo: sumir}, {quoted: message})
              console.log(e)
              console.log("Deu erro no nome")
            }
            break;
            
 
          case "/tempo":
            tempOn2 = pms(Date.now()-tempOn)
            console.log(tempOn2)
            plaq4 = `*Tempo Online*\n\n*Dias*: ${tempOn2.days}\n*Horas*: ${tempOn2.hours}\n*Minutos*: ${tempOn2.minutes}\n*Segundos*: ${tempOn2.seconds}`
            reply(plaq4)
            break;
          case "restart":
          case "res":
          case "/res":
          case "/restart":
            if(!dono.includes(jid)) return reply("Somente meu dono pode usar esse comando")
            reply("Reiniciando Sistema, aguarde...")
            await delay(1000)
            console.log(RESTART)
            break;
          case "modo":
          case "/modo":
            if(!dono.includes(jid)) return reply("Somente meu dono pode usar esse comando")
            if(args.length < 1) return reply("On ou off?")
            if(args == "on") {
              if(modoOn == true) return reply("Ué, mas já está On")
              modoOn = true
              reply("Certo, agora vou ler as mensagens\n\nReiniciando sistema, Aguarde...")
              await fs.writeFileSync("./modo.txt", JSON.stringify(modoOn))
              await delay(1000)
              console.log(RESTART)
            } else if(args == "off") {
              if(modoOn == false) return reply("Ué, mas já está Off")
              modoOn = false
              reply("Ok chefe, agora não vou ler as mensagens\n\nReiniciando sistema, Aguarde...")
              await fs.writeFileSync("./modo.txt", JSON.stringify(modoOn))
              await delay(1000)
              console.log(RESTART)
            } else {
              reply("Use assim:\n\n*/modo on*\n\nOu\n\n*/modo off*")
            }
            break;
          
          default:
            // code
        }
    }) //upsert
} //função iniciar
connectToWhatsApp().catch(e => {
  console.log(e)
  console.log("deu erro na função connectToWhatsApp")
})