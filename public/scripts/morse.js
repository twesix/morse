const morse = {}

morse._map =
    {
        'A': '.-',
        'B': '-...',
        'C': '-.-.',
        'D': '-..',
        'E': '.',
        'F': '..-.',
        'G': '--.',
        'H': '....',
        'I': '..',
        'J': '.---',
        'K': '-.-',
        'L': '.-..',
        'M': '--',
        'N': '-.',
        'O': '---',
        'P': '.--.',
        'Q': '--.-',
        'R': '.-.',
        'S': '...',
        'T': '-',
        'U': '..-',
        'V': '...-',
        'W': '.--',
        'X': '-..-',
        'Y': '-.--',
        'Z': '--..',
        'Á': '.--.-', // A with acute accent
        'Ä': '.-.-',  // A with diaeresis
        'É': '..-..', // E with acute accent
        'Ñ': '--.--', // N with tilde
        'Ö': '---.',  // O with diaeresis
        'Ü': '..--',  // U with diaeresis
        '1': '.----',
        '2': '..---',
        '3': '...--',
        '4': '....-',
        '5': '.....',
        '6': '-....',
        '7': '--...',
        '8': '---..',
        '9': '----.',
        '0': '-----',
        ',': '--..--',  // comma
        '.': '.-.-.-',  // period
        '?': '..--..',  // question mark
        ';': '-.-.-',   // semicolon
        ':': '---...',  // colon
        '/': '-..-.',   // slash
        '-': '-....-',  // dash
        "'": '.----.',  // apostrophe
        '()': '-.--.-', // parenthesis
        '_': '..--.-',  // underline
        '@': '.--.-.',  // at symbol from http://www.learnmorsecode.com/
        ' ': '.......'
    }
morse._separate = '/'

morse._maybeRecurse = function(obj, func)
{
    if (! obj.pop)
    {
        return func(obj)
    }

    const clone = []
    for (let i = 0; i < obj.length; i++)
    {
        clone[i] = func(obj[i])
    }
    return clone
}

morse._decodeCharacterByMap = function(char)
{
    for (let index in morse._map)
    {
        if (morse._map[index] === char)
        {
            return index
        }
    }
    return ' '
}

morse.encode = function(obj)
{
    return morse._maybeRecurse(obj, encodeMorseString) // 如果是数组, 则会依次处理每一个数组成员

    function encodeMorseString (str)
    {
        const ret = str.split('')
        for (const j in ret)
        {
            ret[j] = morse._map[ret[j].toUpperCase()] || '?' // 对照字符->morse码映射表直接转换, 不存在的用?代替
        }
        return ret.join(morse._separate)
    }
}

morse.decode = function(obj)
{
    return morse._maybeRecurse(obj, decodeMorseString) // 如果是数组, 则会依次处理每一个数组成员

    function decodeMorseString (str)
    {
        const ret = str.split(morse._separate)
        for (const i in ret)
        {
            ret[i] = morse._decodeCharacterByMap(ret[i])
        }
        return ret.join('')
    }
}
