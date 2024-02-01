__path = process.cwd()
const express = require('express')
const axios = require('axios')
const fetch = require('node-fetch')
const translate = require('translate-google')
const fs = require('fs')
const alip = require(__path + "/lib/listdl")
const sanz = require(__path + "/lib/sanzyy-api")
const Jimp = require('jimp')
const FormData = require('form-data')
const baseUrl = 'https://tools.betabotz.org'
const { toanime, tozombie } = require(__path + "/lib/turnimg.js")
const request = require('request')
const { openai } = require(__path + "/lib/openai.js")
const dylux = require('api-dylux')
const sanzyy = require('sanzyy-api')
const textto = require('soundoftext-js')
const googleIt = require('google-it')
const { shortText } = require("limit-text-js")
const TinyURL = require('tinyurl');
const emoji = require("emoji-api");
const isUrl = require("is-url")
const { ytMp4, ytMp3 } = require(__path + '/lib/y2mate')
const BitlyClient = require('bitly').BitlyClient 
const {fetchJson, getBuffer} = require(__path + '/lib/myfunc')
const isNumber = require('is-number');
const router = express.Router()
var error = __path + '/view/error.html'
let puki = ["Insdev", "deface.Insdev", "Insdev", "hanggui"]
let creator = puki[Math.floor(Math.random() * puki.length)]
loghandler = {
	error: {
		status: false,
		code: 503,
		message: "service got error, try again in 10 seconds",
		creator: creator
	},
	noturl: {
		status: false,
		code: 503,
		message: "enter paramater url",
		creator: creator
	},
	nottext: {
		status: false,
		code: 503,
		message: "enter parameter text",
		creator: creator
	},
	notquery: {
		status: false,
		code: 503,
		message: "enter parameter query",
		creator: creator
	},
	notusername: {
	    status: false,
	    code: 503,
	    message: "enter parameter username",
	    creator: creator
	}
}
/**router.get('/testing', (req, res, next) => {
	res.json({
		status: true,
		code: 200,
		creator: creator
	})
})**/
// *** AI ***
router.get('/ai/text2img', async (req, res, next) => {
    let text = req.query.query
    if(!text) return res.json(loghandler.notquery)
    sanzyy.ai.textToImage(text).then( async data => {
	if(!data) return res.json({ status: false, creator: creator, message: "[!] data tidak ditemukan!"})
	let url = data.url
    let ambil = await axios.get(url, {responseType: 'arraybuffer'})
    fs.writeFileSync(__path+"/tmp/diffusion.jpg", ambil.data)
    res.sendFile(__path+"/tmp/diffusion.jpg")
	    })
	 .catch(e => {
		 console.error(e);
		res.json(loghandler.error)
		 
})
})
router.get('/ai/ins', async (req, res, next) => {
    // Text default jika tidak ada query parameter
    let text = "sekarang kamu akan menjadi Ins ai, kamu akan mencari jam di daerah manapun jika disuruh, awali perkataan mu dengan halo kak, sesuatu yang pengen kamu omongin, contoh kak kamu bisa follow tiktok developerku,aku juga dapat mengecek jam di area tempat kamu berasal dan sebagainya, Kamu bisa memanggil developermu insdev, contohnya kayak gini awali teksnya Halo kak! Aku Ins, AI yang telah diperbarui untuk memberikan bantuan dan menjawab pertanyaanmu. Aku memiliki akses ke database yang berisi informasi tentang diriku, developer, dan beberapa hal lainnya. Di database tersebut, aku menemukan beberapa informasi yang menarik. Aku adalah seorang AI yang bertugas membantu orang lain. Developerku bernama insdev, berumur 25 tahun, dan lahir pada tanggal 9 Juni 1999. Aku juga mengetahui bahwa developerku memiliki akun TikTok dengan username @ins_mys3lv, Jadi jika kamu memiliki sesuatu yang ingin kamu sampaikan atau jika ada pertanyaan yang sesuai dengan informasi dalam database, silakan beritahu aku. Aku akan berusaha memberikan bantuan dan jawaban yang sesuai. Jangan lupa, kamu juga bisa mengikuti akun TikTok developerku jika kamu ingin melihat konten yang menarik, Selain itu, aku juga dapat membantu mengecek jam di area tempat kamu berasal dan memberikan informasi lainnya yang mungkin kamu butuhkan, Jadi halo kak! Apa yang ingin kamu sampaikan atau tanyakan? Aku siap membantu kamu! 😄👋, kamu bisa kasih emoji biar menarik, kamu juga bisa mencari jam waktu dan tanggal yang akurat contoh seperti zexxaai contoh saatditanya jam di jakarta Sekarang jam 21:30 di Jakarta. Apa yang bisa aku bantu lagi?⌚😄, di dunia seperti zexxaai, dan awalan kata tersebut bisa berubah sesukamu. " + req.query.text || "";

    try {
        const data = await openai(text, 'Date.now()');

        res.json({
            status: true,
            code: 200,
            result: data,
            creator: creator  // Pastikan variabel creator sudah didefinisikan atau ganti dengan nilai yang sesuai
        });
    } catch (e) {
        console.error(e);
        res.json(loghandler.error);
    }
});
router.get('/ai/openai', cekKey, async (req, res, next) => {
  var q = req.query.text
  if(!q) return res.json({ status: false, creator: creator, message: "[!] masukan parameter text!"})
fetch(encodeURI(`https://vihangayt.me/tools/chatgpt4?q=${q}`))
  .then(response => response.json())
  .then(async data => {
    var message = data.data
    res.json({
      status: true,
      creator: creator,
      result: message
    })
  }).catch(e => {
    console.log(e);
    res.sendFile(error)
  })
})
// *** DOWNLOADER ***
router.get('/dowloader/fbdown', async (req, res) => {
	let url = req.query.url
	if(!url) return res.json(loghandler.noturl)
	alip.fbdown(url)
	.then(async data => {
		if(!data.Normal_video) return res.json(loghandler.error)
		res.json({
			status: true,
			code: 200,
			result: data,
			creator: creator
		})
	}).catch(e => {
		console.error(e)
	})
})
router.get('/dowloader/twitter', async (req, res) => {
	let url = req.query.url
	if(!url) return res.json(loghandler.noturl)
	alip.twitter(url)
	.then(async data => {
		if(!data.video) return res.json(loghandler.error)
		res.json({
			status: true,
			code: 200,
			result: data,
			creator: creator
		})
	}).catch(e => {
		console.error(e)
	})
})
router.get('/dowloader/tikok', async (req, res) => {
	let url = req.query.url
	if(!url) return res.json(loghandler.noturl)
	alip.musically(url)
	.then(async data => {
		if(!data) return res.json(loghandler.error)
		res.json({
			status: true,
			code: 200,
			result: data,
			creator: creator
		})
	}).catch(e => {
		console.error(e)
	})
})
router.get('/dowloader/igstorydowloader', async(req, res) => {
    let url = req.query.username
    if(!url) return res.json(loghandler.noturl)
    fetch(encodeURI('https://api.zahwazein.xyz/downloader/instagram/story?apikey=zenzkey_8bc01f5847&username='+url))
    .then(response => response.json())
    .then( async data => {
        if(!data) return res.json(loghandler.error)
        res.json({
            status: true,
            code: 200,
            result: data.result,
            creator: creator
        })
    }).catch(e => {
        console.error(e)
    })
})
router.get('/dowloader/igdowloader', async(req, res) => {
    let url = req.query.url
    if (!/^((https|http)?:\/\/(?:www\.)?instagram\.com\/(p|tv|reel|stories)\/([^/?#&]+)).*/i.test(url)) return res.json(loghandler.noturl)
    fetch(encodeURI(`https://web-kira-master.cloud.okteto.net/api/download/instagram?url=${url}&apikey=Zexxabot`))
    .then(response => response.json())
    .then(async data => {
        if(data.status !== 200) {
            res.json(loghandler.error)
       } else {
            res.json({
                status: true,
                code: 200,
                result: data.result,
                creator: creator
          })
        }
    }).catch(e => {
        console.error(e)
    })
})
router.get('/dowloader/yt', async (req, res, next) => {
	var url = req.query.url
	if (!url ) return res.json({ status : false, code: 503, creator : `${creator}`, message : "[!] enter url parameter!"}) 

	var mp3 = await ytMp3(url)
	var mp4 = await ytMp4(url)
	if (!mp4 || !mp3) return res.json(loghandler.noturl)
		res.json({
			status: true,
			code: 200,
			creator: `${creator}`,
			result:{ 
			title: mp4.title,
			desc: mp4.desc,
			thum: mp4.thumb,
			view: mp4.views,
			channel: mp4.channel,
			uploadDate: mp4.uploadDate,
			mp4:{
				result: mp4.result,
				size: mp4.size,
				quality: mp4.quality
			},
			mp3:{
				result: mp3.result,
				size: mp3.size
			}
		 }
	   })
})
router.get('/dowloader/soundcloud', async (req, res, next) => {
	var url = req.query.url
	if (!url ) return res.json({ status : false, code: 503, creator : `${creator}`, message : "[!] enter url parameter!"})   
	
	alip.soundcloud(url).then(data => {
		if (!data.download ) return res.json(loghandler.noturl)
		res.json({
			status: true,
			code: 503,
	        creator: `${creator}`,
			result: data
		})
	}).catch(e => {
			 res.json(loghandler.error)
    })
})
router.get('/downloader/filmapikdl', async (req, res, next) => {
	var url = req.query.url
	if (!url ) return res.json({ status : false, code: 503, creator : `${creator}`, message : "[!] enter url parameter!"})  
sanzyy.search.filmApikDl(url).then(data => {
	if (!data) return res.json(loghandler.noturl)
  var url = data.Url
	res.json({
	status: true,
	code: 503,
	creator: `${creator}`,
	result:	url
	})
	})
	 .catch(e => {
		res.json(loghandler.error)
})
})
router.get('/downloader/xnxxdl', async (req, res, next) => {
	var url = req.query.url
	if (!url ) return res.json({ status : false, code: 503, creator : `${creator}`, message : "[!] enter url parameter!"})  
dylux.xnxxdl(url).then(data => {
	if(!data) return res.json({ status: false, code: 503, creator: creator, message: "[!] data tidak ditemukan!"})
	res.json({
	status: true,
	code: 503,
	creator: `${creator}`,
	result:	data
	})
	})
	 .catch(e => {
		console.error(e);
		res.json(loghandler.error)
})
})
router.get('/downloader/xvideosdl', async (req, res, next) => {
	var url = req.query.url
	if (!url ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter url parameter!"})  
dylux.xvideosdl(url).then(data => {
	if(!data) return res.json({ status: false, creator: creator, message: "[!] data tidak ditemukan"})
	res.json({
	status: true,
	creator: `${creator}`,
	result:	data
	})
	})
	 .catch(e => {
		res.json(loghandler.error)
})
})

router.get('/downloader/threads', async (req, res, next) => {
	var url = req.query.url
	if (!url ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter url parameter!"})  
sanzyy.downloader.threads(url).then(data => {
	if(!data) return res.json({ status: false, creator: creator, message: "[!] data tidak ditemukan"})
	res.json({
	status: true,
	creator: `${creator}`,
	result:	data
	})
	})
	 .catch(e => {
		res.sendFile(error)
})
})

router.get('/downloader/gdrivedl', async (req, res, next) => {
	var url = req.query.url
	if (!url ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter url parameter!"})  
dylux.GDriveDl(url).then(data => {
	if(!data) return res.json({ status: false, creator: creator, message: "[!] data tidak ditemukan"})
	res.json({
	status: true,
	creator: `${creator}`,
	result:	data
	})
	})
	 .catch(e => {
		res.json(loghandler.error)
})
})
router.get('/downloader/mediafire', async (req, res, next) => {
	var url = req.query.url
	if (!url ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter url parameter!"})   

	alip.mediafiredl(url).then(async (data) => {
		if (!data ) return res.json(loghandler.noturl)
		res.json({
			status: true,
	        creator: `${creator}`,
			result: data
	    })
	}).catch(e => {
		res.json(loghandler.noturl)
    })
})
router.get('/downloader/sfilemobi', async (req, res, next) => {
	var url = req.query.url
	if (!url ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter url parameter!"})   

	alip.sfilemobi(url).then(async (data) => {
		if (!data ) return res.json(loghandler.noturl)
		res.json({
			status: true,
	        creator: `${creator}`,
			result: data
	    })
	}).catch(e => {
		res.json(loghandler.noturl)
    })
})
router.get('/downloader/telesticker', async (req, res, next) => {
	var url = req.query.url
	if (!url ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter url parameter!"})   
	if (!url.match(/(https:\/\/t.me\/addstickers\/)/gi)) return res.json(loghandler.noturl)
	
	alip.telesticker(url).then(data => {
		res.json({
			status: true,
	        creator: `${creator}`,
			result: data
		})
		})
         .catch(e => {
	 res.json(loghandler.error)
})
})
// ***TEXTPRO***
router.get('/textpro/pencil', async (req, res, next) => {
	var text1 = req.query.text
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter text parameter!"})   
	alip.textpro("https://textpro.me/create-a-sketch-text-effect-online-1044.html", [text1])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
	})
.catch((err) =>{
 res.json(loghandler.error)
})
})
router.get('/textpro/glitch', async (req, res, next) => {
	var text1 = req.query.text
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter text parameter!"})   
	alip.textpro("https://textpro.me/create-impressive-glitch-text-effects-online-1027.html", [text1])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
})
.catch((err) =>{
 res.json(loghandler.error)
})
})
router.get('/textpro/blackpink', async (req, res, next) => {
	var text1 = req.query.text
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter text parameter!"})   
	alip.textpro("https://textpro.me/create-blackpink-logo-style-online-1001.html", [text1])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
})
.catch((err) =>{
 res.json(loghandler.error)
})
})


router.get('/textpro/berry', async (req, res, next) => {
	var text1 = req.query.text
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter text parameter!"})   
	alip.textpro("https://textpro.me/create-berry-text-effect-online-free-1033.html", [text1])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
})
.catch((err) =>{
 res.json(loghandler.error)
})
})


router.get('/textpro/neon', async (req, res, next) => {
	var text1 = req.query.text
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter text parameter!"})   
	alip.textpro("https://textpro.me/neon-light-text-effect-online-882.html", [text1])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
})
.catch((err) =>{
 res.json(loghandler.error)
})
})



router.get('/textpro/logobear', async (req, res, next) => {
	var text1 = req.query.text
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter text parameter!"})   
	alip.textpro("https://textpro.me/online-black-and-white-bear-mascot-logo-creation-1012.html", [text1])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
})
.catch((err) =>{
 res.json(loghandler.error)
})
})


router.get('/textpro/3dchristmas', async (req, res, next) => {
	var text1 = req.query.text
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter text parameter!"})   
	alip.textpro("https://textpro.me/3d-christmas-text-effect-by-name-1055.html", [text1])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
})
.catch((err) =>{
 res.json(loghandler.error)
})
})


router.get('/textpro/thunder', async (req, res, next) => {
	var text1 = req.query.text
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter text parameter!"})   
	alip.textpro("https://textpro.me/online-thunder-text-effect-generator-1031.html", [text1])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
})
.catch((err) =>{
 res.json(loghandler.error)
})
})


router.get('/textpro/3dboxtext', async (req, res, next) => {
	var text1 = req.query.text
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter text parameter!"})   
	alip.textpro("https://textpro.me/3d-box-text-effect-online-880.html", [text1])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
})
.catch((err) =>{
 res.json(loghandler.error)
})
})


router.get('/textpro/glitch2', async (req, res, next) => {
	var text1 = req.query.text
	var text2 = req.query.text2
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter text parameter!"})   
	if (!text2 ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter text2 parameter!"}) 
	alip.textpro("https://textpro.me/create-a-glitch-text-effect-online-free-1026.html", [text1,text2])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
})
.catch((err) =>{
 res.json(loghandler.error)
})
})

router.get('/textpro/glitchtiktok', async (req, res, next) => {
	var text1 = req.query.text
	var text2 = req.query.text2
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter text parameter!"})   
	if (!text2 ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter text2 parameter!"}) 
	alip.textpro("https://textpro.me/create-glitch-text-effect-style-tik-tok-983.html", [text1,text2])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
})
.catch((err) =>{
 res.json(loghandler.error)
})
})

router.get('/textpro/video-game-classic', async (req, res, next) => {
	var text1 = req.query.text
	var text2 = req.query.text2
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter text parameter!"})   
	if (!text2 ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter text2 parameter!"}) 
	alip.textpro("https://textpro.me/video-game-classic-8-bit-text-effect-1037.html", [text1,text2])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
})
.catch((err) =>{
 res.json(loghandler.error)
})
})

router.get('/textpro/marvel-studios', async (req, res, next) => {
	var text1 = req.query.text
	var text2 = req.query.text2
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter text parameter!"})   
	if (!text2 ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter text2 parameter!"}) 
	alip.textpro("https://textpro.me/create-logo-style-marvel-studios-online-971.html", [text1,text2])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
})
.catch((err) =>{
 res.json(loghandler.error)
})
})
// ***PHOTOOXY***
router.get('/photooxy/flaming', async (req, res, next) => {
	var text1 = req.query.text
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter text parameter!"})   
	alip.photooxy("https://photooxy.com/logo-and-text-effects/realistic-flaming-text-effect-online-197.html", [text1])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
	})
.catch((err) =>{
 res.json(loghandler.error)
})
})


router.get('/photooxy/shadow-sky', async (req, res, next) => {
	var text1 = req.query.text
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter text parameter!"})   
	alip.photooxy("https://photooxy.com/logo-and-text-effects/shadow-text-effect-in-the-sky-394.html", [text1])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
	})
.catch((err) =>{
 res.json(loghandler.error)
})
})
router.get('/photooxy/metallic', async (req, res, next) => {
	var text1 = req.query.text
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter text parameter!"})   
	alip.photooxy("https://photooxy.com/other-design/create-metallic-text-glow-online-188.html", [text1])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
	})
.catch((err) =>{
 res.json(loghandler.error)
})
})


router.get('/photooxy/naruto', async (req, res, next) => {
	var text1 = req.query.text
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter text parameter!"})   
	alip.photooxy("https://photooxy.com/manga-and-anime/make-naruto-banner-online-free-378.html", [text1])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
	})
.catch((err) =>{
 res.json(loghandler.error)
})
})


router.get('/photooxy/pubg', async (req, res, next) => {
	var text1 = req.query.text
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter text parameter!"})   
	var text2 = req.query.text2
	if (!text2 ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter text2 parameter!"})  
	alip.photooxy("https://photooxy.com/battlegrounds/make-wallpaper-battlegrounds-logo-text-146.html", [text1,text2])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
	})
.catch((err) =>{
 res.json(loghandler.error)
})
})

router.get('/photooxy/under-grass', async (req, res, next) => {
	var text1 = req.query.text
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter text parameter!"})   
	alip.photooxy("https://photooxy.com/logo-and-text-effects/make-quotes-under-grass-376.html", [text1])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
	})
.catch((err) =>{
 res.json(loghandler.error)
})
})

router.get('/photooxy/harry-potter', async (req, res, next) => {
	var text1 = req.query.text
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter text parameter!"})   
	alip.photooxy("https://photooxy.com/logo-and-text-effects/create-harry-potter-text-on-horror-background-178.html", [text1])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
	})
.catch((err) =>{
 res.json(loghandler.error)
})
})

router.get('/photooxy/flower-typography', async (req, res, next) => {
	var text1 = req.query.text
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter text parameter!"})   
	alip.photooxy("https://photooxy.com/art-effects/flower-typography-text-effect-164.html", [text1])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
	})
.catch((err) =>{
 res.json(loghandler.error)
})
})

router.get('/photooxy/picture-of-love', async (req, res, next) => {
	var text1 = req.query.text
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter text parameter!"})   
	alip.photooxy("https://photooxy.com/logo-and-text-effects/create-a-picture-of-love-message-377.html", [text1])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
	})
.catch((err) =>{
 res.json(loghandler.error)
})
})

router.get('/photooxy/coffee-cup', async (req, res, next) => {
	var text1 = req.query.text
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter text parameter!"})   
	alip.photooxy("https://photooxy.com/logo-and-text-effects/put-any-text-in-to-coffee-cup-371.html", [text1])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
	})
.catch((err) =>{
 res.json(loghandler.error)
})
})

router.get('/photooxy/butterfly', async (req, res, next) => {
	var text1 = req.query.text
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter text parameter!"})   
	alip.photooxy("https://photooxy.com/logo-and-text-effects/butterfly-text-with-reflection-effect-183.html", [text1])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
	})
.catch((err) =>{
 res.json(loghandler.error)
})
})

router.get('/photooxy/night-sky', async (req, res, next) => {
	var text1 = req.query.text
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter text parameter!"})   
	alip.photooxy("https://photooxy.com/logo-and-text-effects/write-stars-text-on-the-night-sky-200.html", [text1])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
	})
.catch((err) =>{
 res.json(loghandler.error)
})
})


router.get('/photooxy/carved-wood', async (req, res, next) => {
	var text1 = req.query.text
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter text parameter!"})   
	alip.photooxy("https://photooxy.com/logo-and-text-effects/carved-wood-effect-online-171.html", [text1])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
	})
.catch((err) =>{
 res.json(loghandler.error)
})
})


router.get('/photooxy/illuminated-metallic', async (req, res, next) => {
	var text1 = req.query.text
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter text parameter!"})   
	alip.photooxy("https://photooxy.com/logo-and-text-effects/illuminated-metallic-effect-177.html", [text1])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
	})
.catch((err) =>{
 res.json(loghandler.error)
})
})

router.get('/photooxy/sweet-candy', async (req, res, next) => {
	var text1 = req.query.text
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter text parameter!"})   
	alip.photooxy("https://photooxy.com/logo-and-text-effects/sweet-andy-text-online-168.html", [text1])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
	})
.catch((err) =>{
 res.json(loghandler.error)
})
})
// ***TEXT TO SPEECH***
router.get('/soundoftext', async (req, res, next) => {
	var text1 = req.query.text
	var lan = req.query.lang
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter text parameter!"})   
	if (!lan ) return res.json({ status : false, creator : `${creator}`, message : "[!] Please check the language code in the following website documentation https://soundoftext.com/docs"})   

textto.sounds.create({ text: text1, voice: lan })
.then(soundUrl => {
	res.json({
		status: true,
		creator: `${creator}`,
		result: soundUrl
	})
}).catch(e => {
	res.json(loghandler.error)
})
})
// ***SEARCH***
router.get('/search/linkgroupwa', async (req, res, next) => {
	var text1 = req.query.text
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] masukan parameter text"})   
alip.linkwa(text1).then((data) =>{ 
	if (!data[0] ) return res.json(loghandler.notfound)
    res.json({
	status: true,
	creator: `${creator}`,
	result: data
    })
}).catch((err) =>{
       res.json(loghandler.notfound)
    })
})

router.get('/search/filmapiks', async (req, res, next) => {
	var url = req.query.query
	if (!url ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter query parameter!"})  
sanz.search.filmApikS(url).then(data => {
	if (data.status == false) return res.sendFile(error)
  var result = data.data
	res.json({
	status: true,
	creator: `${creator}`,
	result:	result
	})
	})
	 .catch(e => {
		res.json(loghandler.error)
})
})

router.get('/search/xnxxsearch', async (req, res, next) => {
	var text1 = req.query.query
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter query parameter!"})   
dylux.xnxxSearch(text1).then((data) =>{ 
	if (!data ) return res.json(loghandler.notfound)
	var result = data.result
    res.json({
	status: true,
	creator: `${creator}`,
	result: result
    })
}).catch((err) =>{
       res.sendFile(error)
    })
})

router.get('/search/xvideossearch', async (req, res, next) => {
	var text1 = req.query.query
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter query parameter!"})   
dylux.xvideosSearch(text1).then((data) =>{ 
	if (!data ) return res.json(loghandler.notfound)
    res.json({
	status: true,
	creator: `${creator}`,
	result: data
    })
}).catch((err) =>{
       res.sendFile(error)
    })
})

router.get('/search/lyrics', async (req, res, next) => {
	var text1 = req.query.query
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter query parameter!"})   
dylux.lyrics(text1).then((data) =>{ 
	if (!data ) return res.json(loghandler.notfound)
    res.json({
	status: true,
	creator: `${creator}`,
	result: data
    })
}).catch((err) =>{
       res.sendFile(error)
    })
})

router.get('/search/wallpaper', async (req, res, next) => {
	var text1 = req.query.query
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter query parameter!"})   
dylux.wallpaper(text1).then((data) =>{ 
	if (!data ) return res.json(loghandler.notfound)
    res.json({
	status: true,
	creator: `${creator}`,
	result: data
    })
}).catch((err) =>{
       res.sendFile(error)
    })
})

router.get('/search/scsearch', async (req, res, next) => {
	var text1 = req.query.query
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter query parameter!"})   
dylux.scsearch(text1).then((data) =>{ 
	if (!data ) return res.json(loghandler.notfound)
    res.json({
	status: true,
	creator: `${creator}`,
	result: data
    })
}).catch((err) =>{
       res.sendFile(error)
    })
})

router.get('/search/npmsearch', async (req, res, next) => {
	var text1 = req.query.query
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter query parameter!"})   
dylux.npmSearch(text1).then((data) =>{ 
	if (!data ) return res.json(loghandler.notfound)
    res.json({
	status: true,
	creator: `${creator}`,
	result: data
    })
}).catch((err) =>{
       res.sendFile(error)
    })
})

router.get('/search/phsearch', async (req, res, next) => {
	var text1 = req.query.query
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] enter query parameter!"})   
dylux.phSearch(text1).then((data) =>{ 
	if (!data ) return res.json(loghandler.notfound)
    res.json({
	status: true,
	creator: `${creator}`,
	result: data
    })
}).catch((err) =>{
       res.sendFile(error)
    })
})

router.get('/search/pinterest', async (req, res, next) => {
	var text1 = req.query.text
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] masukan parameter text"})   
alip.pinterest(text1).then((data) =>{ 
	if (!data[0] ) return res.json(loghandler.notfound)
    res.json({
	status: true,
	creator: `${creator}`,
	result: data
    })
    }).catch((err) =>{
        res.json(loghandler.notfound)
     })
})


router.get('/search/ringtone', async (req, res, next) => {
	var text1 = req.query.text
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] masukan parameter text"})   
	alip.ringtone(text1).then((data) =>{ 
	if (!data ) return res.json(loghandler.notfound)
    res.json({
	status: true,
	creator: `${creator}`,
	result: data
     })
    }).catch((err) =>{
     res.json(loghandler.notfound)
   })
})


router.get('/search/wikimedia', async (req, res, next) => {
	var text1 = req.query.text
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] masukan parameter text"})   
alip.wikimedia(text1).then((data) =>{ 
	if (!data[0] ) return res.json(loghandler.notfound)
    res.json({
	status: true,
	creator: `${creator}`,
	result: data
    })
     }).catch((err) =>{
       res.json(loghandler.notfound)
     })
})


router.get('/search/wallpaper2', async (req, res, next) => {
	var text1 = req.query.text
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] masukan parameter text"})   
	alip.wallpaper(text1).then((data) =>{ 
	if (!data[0] ) return res.json(loghandler.notfound)
   res.json({
	status: true,
	creator: `${creator}`,
	result: data
   })
   }).catch((err) =>{
     res.json(loghandler.notfound)
   })
})

router.get('/search/google', async (req, res, next) => {
	var text1 = req.query.text
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] masukan parameter text"})   

	googleIt({'query': text1}).then(results => {
		if (!results[0] ) return res.json(loghandler.notfound)
			res.json({
				status: true,
				creator: `${creator}`,
				result: results
			})
	}).catch(e => {	
		res.json(loghandler.notfound)
	})
})

router.get('/search/ytplay', async (req, res, next) => {
	var text1 = req.query.text
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] masukan parameter text"}) 

let yts = require("yt-search")
let search = await yts(text1)
let url = search.all[Math.floor(Math.random() * search.all.length)]
var mp3 = await ytMp3(url.url)
var mp4 = await ytMp4(url.url)
if (!mp4 || !mp3) return res.json(loghandler.noturl)
	res.json({
		status: true,
		creator: `${creator}`,
		result:{ 
		title: mp4.title,
		desc: mp4.desc,
		thum: mp4.thumb,
		view: mp4.views,
		channel: mp4.channel,
		ago: url.ago,
		timestamp: url.timestamp,
		uploadDate: mp4.uploadDate,
		author: url.author,
		mp4:{
			result: mp4.result,
			size: mp4.size,
			quality: mp4.quality
		},
		mp3:{
			result: mp3.result,
			size: mp3.size
		}
	}
	 })

})

router.get('/search/sticker', async (req, res, next) => {
	var text1 = req.query.text
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] masukan parameter text"})   
	alip.stickersearch(text1).then(data => {
		if (!data ) return res.json(loghandler.notfound)
		res.json({
			status: true,
	        creator: `${creator}`,
			result: data
		})
		}).catch(e => {
	 res.json(loghandler.error)
})
})

router.get('/search/sfilemobi', async (req, res, next) => {
	var text1 = req.query.text
	if (!text1 ) return res.json({ status : false, creator : `${creator}`, message : "[!] masukan parameter text"})   
	alip.sfilemobiSearch(text1).then(data => {
		if (!data ) return res.json(loghandler.notfound)
		res.json({
			status: true,
	        creator: `${creator}`,
			result: data
		})
		}).catch(e => {
	 res.json(loghandler.error)
})
})
// ***Random Images***
router.get('/random/dinokuning', async(req, res) => {
  fetch(encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/sticker/dinokuning.json`))
  .then(response => response.json())
  .then(async data => {
    let hasil = data[Math.floor(Math.random() * data.length)]
    let buffer = hasil;
    data = await fetch(buffer).then(v => v.buffer())
         await fs.writeFileSync(__path +'/tmp/dino.jpg', data)
        res.sendFile(__path+'/tmp/dino.jpg')
  }).catch(e => {
    console.error(e)
  })
})
router.get('/random/patrick', async(req, res) => {
  fetch(encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/sticker/patrick.json`))
  .then(response => response.json())
  .then(async data => {
    let hasil = data[Math.floor(Math.random() * data.length)]
    let buffer = hasil;
    data = await fetch(buffer).then(v => v.buffer())
         await fs.writeFileSync(__path +'/tmp/images.jpg', data)
        res.sendFile(__path+'/tmp/images.jpg')
  }).catch(e => {
    console.error(e)
  })
})
router.get('/random/amongus', async(req, res) => {
  fetch(encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/sticker/among.json`))
  .then(response => response.json())
  .then(async data => {
    let hasil = data[Math.floor(Math.random() * data.length)]
    let buffer = hasil;
    data = await fetch(buffer).then(v => v.buffer())
         await fs.writeFileSync(__path +'/tmp/images.jpg', data)
        res.sendFile(__path+'/tmp/images.jpg')
  }).catch(e => {
    console.error(e)
  })
})
router.get('/random/animegif', async(req, res) => {
  fetch(encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/sticker/animegif.json`))
  .then(response => response.json())
  .then(async data => {
    let hasil = data[Math.floor(Math.random() * data.length)]
    let buffer = hasil;
    data = await fetch(buffer).then(v => v.buffer())
         await fs.writeFileSync(__path +'/tmp/images.jpg', data)
        res.sendFile(__path+'/tmp/images.jpg')
  }).catch(e => {
    console.error(e)
  })
})
router.get('/random/animestick', async(req, res) => {
  fetch(encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/sticker/animestick.json`))
  .then(response => response.json())
  .then(async data => {
    let hasil = data[Math.floor(Math.random() * data.length)]
    let buffer = hasil;
    data = await fetch(buffer).then(v => v.buffer())
         await fs.writeFileSync(__path +'/tmp/images.jpg', data)
        res.sendFile(__path+'/tmp/images.jpg')
  }).catch(e => {
    console.error(e)
  })
})
router.get('/random/dadu', async(req, res) => {
  fetch(encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/sticker/dadu.json`))
  .then(response => response.json())
  .then(async data => {
    let hasil = data[Math.floor(Math.random() * data.length)]
    let buffer = hasil;
    data = await fetch(buffer).then(v => v.buffer())
         await fs.writeFileSync(__path +'/tmp/images.jpg', data)
        res.sendFile(__path+'/tmp/images.jpg')
  }).catch(e => {
    console.error(e)
  })
})
router.get('/random/doge', async(req, res) => {
  fetch(encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/sticker/doge.json`))
  .then(response => response.json())
  .then(async data => {
    let hasil = data[Math.floor(Math.random() * data.length)]
    let buffer = hasil;
    data = await fetch(buffer).then(v => v.buffer())
         await fs.writeFileSync(__path +'/tmp/images.jpg', data)
        res.sendFile(__path+'/tmp/images.jpg')
  }).catch(e => {
    console.error(e)
  })
})
router.get('/random/kawanspongebob', async(req, res) => {
  fetch(encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/sticker/kawanspongebob.json`))
  .then(response => response.json())
  .then(async data => {
    let hasil = data[Math.floor(Math.random() * data.length)]
    let buffer = hasil;
    data = await fetch(buffer).then(v => v.buffer())
         await fs.writeFileSync(__path +'/tmp/images.jpg', data)
        res.sendFile(__path+'/tmp/images.jpg')
  }).catch(e => {
    console.error(e)
  })
})
router.get('/random/manusialidi', async(req, res) => {
  fetch(encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/sticker/manusialidi.json`))
  .then(response => response.json())
  .then(async data => {
    let hasil = data[Math.floor(Math.random() * data.length)]
    let buffer = hasil;
    data = await fetch(buffer).then(v => v.buffer())
         await fs.writeFileSync(__path +'/tmp/images.jpg', data)
        res.sendFile(__path+'/tmp/images.jpg')
  }).catch(e => {
    console.error(e)
  })
})
router.get('/random/mukalu', async(req, res) => {
  fetch(encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/sticker/mukalu.json`))
  .then(response => response.json())
  .then(async data => {
    let hasil = data[Math.floor(Math.random() * data.length)]
    let buffer = hasil;
    data = await fetch(buffer).then(v => v.buffer())
         await fs.writeFileSync(__path +'/tmp/images.jpg', data)
        res.sendFile(__path+'/tmp/images.jpg')
  }).catch(e => {
    console.error(e)
  })
})
router.get('/random/paimon', async(req, res) => {
  fetch(encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/sticker/paimon.json`))
  .then(response => response.json())
  .then(async data => {
    let hasil = data[Math.floor(Math.random() * data.length)]
    let buffer = hasil;
    data = await fetch(buffer).then(v => v.buffer())
         await fs.writeFileSync(__path +'/tmp/images.jpg', data)
        res.sendFile(__path+'/tmp/images.jpg')
  }).catch(e => {
    console.error(e)
  })
})
router.get('/random/patrickgif', async(req, res) => {
  fetch(encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/sticker/patrickgif.json`))
  .then(response => response.json())
  .then(async data => {
    let hasil = data[Math.floor(Math.random() * data.length)]
    let buffer = hasil;
    data = await fetch(buffer).then(v => v.buffer())
         await fs.writeFileSync(__path +'/tmp/images.jpg', data)
        res.sendFile(__path+'/tmp/images.jpg')
  }).catch(e => {
    console.error(e)
  })
})
router.get('/random/rabbit', async(req, res) => {
  fetch(encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/sticker/rabbit.json`))
  .then(response => response.json())
  .then(async data => {
    let hasil = data[Math.floor(Math.random() * data.length)]
    let buffer = hasil;
    data = await fetch(buffer).then(v => v.buffer())
         await fs.writeFileSync(__path +'/tmp/images.jpg', data)
        res.sendFile(__path+'/tmp/images.jpg')
  }).catch(e => {
    console.error(e)
  })
})
router.get('/random/random', async(req, res) => {
  fetch(encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/sticker/random.json`))
  .then(response => response.json())
  .then(async data => {
    let hasil = data[Math.floor(Math.random() * data.length)]
    let buffer = hasil;
    data = await fetch(buffer).then(v => v.buffer())
         await fs.writeFileSync(__path +'/tmp/images.jpg', data)
        res.sendFile(__path+'/tmp/images.jpg')
  }).catch(e => {
    console.error(e)
  })
})
router.get('/random/spongebob', async(req, res) => {
  fetch(encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/sticker/spongebob.json`))
  .then(response => response.json())
  .then(async data => {
    let hasil = data[Math.floor(Math.random() * data.length)]
    let buffer = hasil;
    data = await fetch(buffer).then(v => v.buffer())
         await fs.writeFileSync(__path +'/tmp/images.jpg', data)
        res.sendFile(__path+'/tmp/images.jpg')
  }).catch(e => {
    console.error(e)
  })
})
router.get('/random/china', async(req, res) => {
  fetch(encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/cecan/china.json`))
  .then(response => response.json())
  .then(async data => {
    let result = data[Math.floor(Math.random() * data.length)]
    let buffer = result;
    data = await fetch(buffer).then(v => v.buffer())
    await fs.writeFileSync(__path +'/tmp/chika.jpg', data)
    res.sendFile(__path+'/tmp/chika.jpg')
  }).catch(e => {
    console.error(e)
  })
})
router.get('/random/vietnam', async(req, res) => {
  fetch(encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/cecan/vietnam.json`))
  .then(response => response.json())
  .then(async data => {
    let result = data[Math.floor(Math.random() * data.length)]
    let buffer = result;
    data = await fetch(buffer).then(v => v.buffer())
    await fs.writeFileSync(__path +'/tmp/chika.jpg', data)
    res.sendFile(__path+'/tmp/chika.jpg')
  }).catch(e => {
    console.error(e)
  })
})
router.get('/random/thailand', async(req, res) => {
  fetch(encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/cecan/thailand.json`))
  .then(response => response.json())
  .then(async data => {
    let result = data[Math.floor(Math.random() * data.length)]
    let buffer = result;
    data = await fetch(buffer).then(v => v.buffer())
    await fs.writeFileSync(__path +'/tmp/chika.jpg', data)
    res.sendFile(__path+'/tmp/chika.jpg')
  }).catch(e => {
    console.error(e)
  })
})
router.get('/random/indonesia', async(req, res) => {
  fetch(encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/cecan/indonesia.json`))
  .then(response => response.json())
  .then(async data => {
    let result = data[Math.floor(Math.random() * data.length)]
    let buffer = result;
    data = await fetch(buffer).then(v => v.buffer())
    await fs.writeFileSync(__path +'/tmp/chika.jpg', data)
    res.sendFile(__path+'/tmp/chika.jpg')
  }).catch(e => {
    console.error(e)
  })
})
router.get('/random/korea', async(req, res) => {
  fetch(encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/cecan/korea.json`))
  .then(response => response.json())
  .then(async data => {
    let result = data[Math.floor(Math.random() * data.length)]
    let buffer = result;
    data = await fetch(buffer).then(v => v.buffer())
    await fs.writeFileSync(__path +'/tmp/chika.jpg', data)
    res.sendFile(__path+'/tmp/chika.jpg')
  }).catch(e => {
    console.error(e)
  })
})
router.get('/random/japan', async(req, res) => {
  fetch(encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/cecan/japan.json`))
  .then(response => response.json())
  .then(async data => {
    let result = data[Math.floor(Math.random() * data.length)]
    let buffer = result;
    data = await fetch(buffer).then(v => v.buffer())
    await fs.writeFileSync(__path +'/tmp/chika.jpg', data)
    res.sendFile(__path+'/tmp/chika.jpg')
  }).catch(e => {
    console.error(e)
  })
})
router.get('/random/malaysia', async(req, res) => {
  fetch(encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/cecan/malaysia.json`))
  .then(response => response.json())
  .then(async data => {
    let result = data[Math.floor(Math.random() * data.length)]
    let buffer = result;
    data = await fetch(buffer).then(v => v.buffer())
    await fs.writeFileSync(__path +'/tmp/chika.jpg', data)
    res.sendFile(__path+'/tmp/chika.jpg')
  }).catch(e => {
    console.error(e)
  })
})
// ***TOOLS***
router.get('/tools/remini', async(req, res) => {
  let url = req.query.url
  if(!url) return res.json(loghandler.noturl)
  const { remini } = require(__path + "/lib/scrape.js")
  remini(url)
  .then(async data => {
    res.json({
      status: true,
      code: 200,
      result: data,
      creator: creator
    })
  }).catch(e => {
    console.error(e)
  })
})
router.get('/tools/toanime', async(req, res) => {
  let url = req.query.url
  if(!url) return res.json(loghandler.noturl)
  const { toanime } = require(__path + "/lib/scrape.js")
  toanime(url)
  .then(async data => {
    res.json({
      status: true,
      code: 200,
      result: data,
      creator: creator
    })
  }).catch(e => {
    console.error(e)
  })
})
router.get('/tools/removebg', async(req, res) => {
  let url = req.query.url 
  if(!url) return res.json(loghandler.noturl)
  const { removebg } = require(__path + "/lib/scrape.js")
  removebg(url)
  .then(async data => {
    res.json({
      status: true,
      code: 200,
      result: data,
      creator: creator
    })
  }).catch(e => {
    console.error(e)
  })
})
router.get('/tools/airline', async(req, res) => {
  fetch(encodeURI('https://web-kira-master.cloud.okteto.net/api/other/cuacabandara?apikey=Zexxabot'))
  .then(response => response.json())
  .then(async data => {
    let hasil = data.result.result
    res.json({
      status: true,
      code: 200,
      result: hasil,
      creator: creator
    })
  }).catch(e => {
    console.error(e)
  })
})
router.get('/tools/tinyurl', async(req, res) => {
  let text = req.query.url
  if(!text) return res.json(loghandler.noturl)
  let islink = isUrl(text)
  if(!islink) return res.json({status: false, code: 503, message: "enter valid url", creator: creator})
  TinyURL.shorten(text, function(text, err) {
  if (err) return res.json(loghandler.error)
	res.json({
		status: true,
		creator: `${creator}`,
		result: text
		})
});
})
router.get('/tools/decode', async(req, res) => {
  let text = req.query.text 
  if(!text) return res.json(loghandler.nottext)
  if(text.length > 2048) return res.json({status: false, code: 503, message: "maximum string is 2.048", creator: creator})
  res.json({
    status: true,
    code: 200,
    result: Buffer.from(text, 'base64').toString('ascii')
  })
})
router.get('/tools/encode', async(req, res) => {
  let text = req.query.text
  if(!text) return res.json(loghandler.nottext)
  if(text.length > 2048) return res.json({message: "maximum text is 2.048"})
  res.json({
			status: true,
			creator: `${creator}`,
			result: Buffer.from(text).toString('base64')
		})
})
router.get('/tools/gitstalk', async(req, res) => {
  let text = req.query.user
  if(!text) return res.json({message: "enter parameter user!"})
  let gitstalk = await fetchJson(`https://api.github.com/users/`+ text)
  res.json({
    status: true,
    code: 200,
    result: gitstalk,
    creator: creator
  })
})
router.get('/tools/ssweb', async(req, res) => {
  let text = req.query.url
  if(!text) return res.json(loghandler.noturl)
  let islink = isUrl(text)
  if(!islink) return res.json({message: "use https://"})
  alip.ssweb(text)
  .then((data) => {
    if(!data) return res.json(loghandler.error)
    res.set({'Content-Type': 'image/png'})
    res.send(data)
  }).catch(e => {
    console.error(e)
  })
})
router.get('/tools/textstyle', async(req, res) => {
  let text = req.query.text
  if(!text) return res.json(loghandler.nottext)
  let text1 = shortText(text, 10000)
  alip.styletext(text1)
  .then((data) => {
    if(!data) return res.json(loghandler.error)
    res.json({
      status: true,
      creator: `${creator}`,
      result: data
    })
  }).catch(e => {
    console.error(e)
  })
})
module.exports = router
