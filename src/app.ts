import express from 'express'
import { unlinkSync } from 'fs-extra'
import { download } from './Downloader'

const app = express()

app.use('/', express.urlencoded({ extended: false }))
app.set('view-engine', 'ejs')

app.get('/', (req, res) => {
    res.render('main.ejs')
})
app.post('/get', async (req, res) => {
    const video = await download(req.body.link)
    if (!video.sucess) return res.render('main.ejs', { error: video.data })
    res.setHeader('Content-disposition', `attachment; filename=video.mp4`)
    res.sendFile(video.data, () => unlinkSync(video.data))
}) 

app.listen(process.env.PORT || 4000)