window.onload = function() {

    const messages = []
    const field = document.getElementById('field')
    field.value = 'bynbyn'
    const sendButton = document.getElementById('send')
    const content = document.getElementById('content')
    const pushButton = document.getElementById('push_button')
    const pageUrl = document.getElementById('page_url')
    const body = document.body
    let start, end
    const queue = []
    const soundQueue = []
    let spaceDown = false

    let dot = 100,
        dash = 300

    // create the sending audio beep tone
    const waveLow = new RIFFWAVE()
    let data = []
    waveLow.header.sampleRate = 22100
    waveLow.header.numChannels = 2
    let i = 0
    while (i<1000000)
    {
        data[i++] = 128+Math.round(127*Math.sin(i/10))
    }
    waveLow.Make(data)
    const audio = new Audio()
    audio.src = waveLow.dataURI

    // create the receiving audio beep tone
    const waveHigh = new RIFFWAVE()
    data = []
    waveHigh.header.sampleRate = 32100
    waveHigh.header.numChannels = 2
    i = 0
    while (i<1000000)
    {
        data[i++] = 128+Math.round(127*Math.sin(i/10))
    }
    waveHigh.Make(data)
    const audio2 = new Audio()
    audio2.src = waveHigh.dataURI

    pageUrl.innerHTML = window.location.href

    const playEncoded = function(encoded)
    {
        content.innerHTML = encoded
        console.log(encoded)

        // play the message
        const arr = encoded.split('')
        console.log(arr)
        for (let i = 0; i < arr.length; i++)
        {
            let char = arr[i]
            switch (char)
            {
                case '.':
                    queue.push({len: dot})
                    queue.push({len: dot, type: 'space'})
                    break
                case '-':
                    queue.push({len: dash})
                    queue.push({len: dot, type: 'space'})
                    break
                case '/':
                    queue.push({len: 300, type: 'space'})
                    break
            }
        }
        checkQueue(100)
    }

    const playAudio = function(audio, len)
    {
        audio.play()
        pushButton.className = 'key key-down'
        setTimeout(function()
        {
            audio.pause()
            pushButton.className = 'key key-up'
        }, len)
    }

    const checkQueue = function(time)
    {
        setTimeout(function()
        {
            if (queue.length > 0)
            {
                const item = queue.shift()
                if (item.type !== 'space')
                {
                    playAudio(audio2, item.len)
                }
                checkQueue(time)
            }
        }, time)
    }

    sendButton.onclick = function()
    {
        const text = field.value
        field.value = ''
        if (!!text)
        {
            const encoded = morse.encode(text)
            playEncoded(encoded)
        }
    }

    const mousedown = function()
    {
        audio.play()
        pushButton.className = 'key key-down'
        start = +new Date()
    }

    const mouseup = function()
    {
        audio.pause()
        pushButton.className = 'key key-up'
        end = +new Date()
        const diff = end - start
        soundQueue.push({ len: diff })
    }

    pushButton.onmousedown = mousedown
    pushButton.ontouchstart = mousedown
    pushButton.onmouseup = mouseup
    pushButton.ontouchend = mouseup

    body.onkeydown = function(evt)
    {
        evt = evt || window.event
        if (evt.keyCode === 32 && evt.target.tagName.toLowerCase() !== 'input' && !spaceDown)
        {
            mousedown()
            spaceDown = true
        }
    }

    body.onkeyup = function(evt)
    {
        evt = evt || window.event
        if (evt.keyCode === 32 && evt.target.tagName.toLowerCase() !== 'input')
        {
            spaceDown = false
            mouseup()
        }
    }
}
