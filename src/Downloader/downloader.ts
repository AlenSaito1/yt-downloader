import os from 'os'

import { createWriteStream } from 'fs-extra'
import ytdl from 'ytdl-core'

export const download = async (url: string): Promise<{ data: string, sucess: boolean, title?: string }> => {
    if (!ytdl.validateURL(url)) return { data: `Invalid URL`, sucess: false }
    try {
    const info = await ytdl.getInfo(url)
    if (Number(info.videoDetails.lengthSeconds) > 1800) return { data: `Cannot fetch videos longer than 30 Minutes`, sucess: false }
    const filename = `${os.tmpdir()}/${Math.random().toString(36)}.mp4`
    const stream = createWriteStream(filename)
    ytdl(url, { quality: 'highest'}).pipe(stream)
        await new Promise((resolve, reject) => {
            stream.on('finish', resolve)
            stream.on('error', reject)
        })
        return { data: filename, sucess: true, title: info.videoDetails.title }
    } catch(err) {
        console.log(err)
        return { data: `An Error occured while fetching`, sucess: false }
    }
}