window.onload = function() {

    const field = document.getElementById('field')
    field.value = '昔我往矣,杨柳依依'
    const sendButton = document.getElementById('send')
    const content = document.getElementById('content')
    const pushButton = document.getElementById('push_button')
    const body = document.body
    const queue = []
    let spaceDown = false

    const dot = 100
    const dash = 300
    const betweenDotAndDash = 100
    const betweenWord = 300

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
    waveHigh.header.sampleRate = 22100
    waveHigh.header.numChannels = 2
    i = 0
    while (i<1000000)
    {
        data[i++] = 128+Math.round(127*Math.sin(i/10))
    }
    waveHigh.Make(data)
    const audio2 = new Audio()
    audio2.src = waveHigh.dataURI

    const playText = function(text)
    {
        const encoded = xmorse.encode(text)
        console.log(`${text}: ${encoded}`)
        content.innerHTML = encoded

        // play the message
        const arr = encoded.split('')
        for (let i = 0; i < arr.length; i++)
        {
            let char = arr[i]
            switch (char)
            {
                case '.':
                    queue.push({len: dot, type: 'dot'})
                    queue.push({len: betweenDotAndDash, type: 'space'})
                    break
                case '-':
                    queue.push({len: dash, type: 'dash'})
                    queue.push({len: betweenDotAndDash, type: 'space'})
                    break
                case '/':
                    queue.push({len: betweenWord, type: 'space'})
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
                checkQueue(item.len)
            }
        }, time)
    }

    sendButton.onclick = function()
    {
        const text = field.value.replace(' ', '')
        field.value = ''
        if (!!text)
        {
            location.hash = text
            playText(text)
        }
    }

    const mousedown = function()
    {
        audio.play()
        pushButton.className = 'key key-down'
    }

    const mouseup = function()
    {
        audio.pause()
        pushButton.className = 'key key-up'
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

    playText(decodeURI(location.hash.substring(1)))
}
